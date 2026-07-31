#!/usr/bin/env bash
#
# Replaces the production database with a byte-for-byte copy of the local one.
#
#   CONFIRM=WIPE_PROD ./scripts/clone-db-to-prod.sh
#
# Source:  DATABASE_URL from .env.local
# Target:  DATABASE_URL / POSTGRES_URL / DATABASE_URI from .env.production.local
#
# The dump carries the payload_migrations table, so `payload migrate` becomes a
# no-op on the next deploy and future migrations apply on top of this baseline.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

SOURCE_ENV=".env.local"
TARGET_ENV=".env.production.local"

# Values like `Thryve Co. <onboarding@resend.dev>` break `source`, so parse by hand.
read_env() {
  local file="$1" key="$2" line
  [ -f "$file" ] || return 1
  line="$(grep -E "^[[:space:]]*${key}=" "$file" | tail -n1 || true)"
  [ -z "$line" ] && return 1
  line="${line#*=}"
  line="${line%\"}"; line="${line#\"}"
  line="${line%\'}"; line="${line#\'}"
  printf '%s' "$line"
}

read_db_url() {
  local file="$1" key url
  for key in DATABASE_URL POSTGRES_URL DATABASE_URI; do
    url="$(read_env "$file" "$key" || true)"
    if [ -n "$url" ]; then
      printf '%s' "$url"
      return 0
    fi
  done
  return 1
}

# Hides credentials so the script can echo which database it is about to touch.
describe_url() {
  printf '%s' "$1" | sed -E 's#//[^@]*@#//***@#; s#\?.*$##'
}

for f in "$SOURCE_ENV" "$TARGET_ENV"; do
  if [ ! -f "$f" ]; then
    echo "error: $f not found." >&2
    [ "$f" = "$TARGET_ENV" ] && echo "       Create it with the production values (see README)." >&2
    exit 1
  fi
done

SOURCE_DB="$(read_db_url "$SOURCE_ENV" || true)"
TARGET_DB="$(read_db_url "$TARGET_ENV" || true)"

if [ -z "$SOURCE_DB" ]; then
  echo "error: no DATABASE_URL in $SOURCE_ENV" >&2
  exit 1
fi
if [ -z "$TARGET_DB" ]; then
  echo "error: no DATABASE_URL/POSTGRES_URL/DATABASE_URI in $TARGET_ENV" >&2
  exit 1
fi

if [ "$SOURCE_DB" = "$TARGET_DB" ]; then
  echo "error: source and target are the same database. Refusing to run." >&2
  exit 1
fi

case "$TARGET_DB" in
  *localhost*|*127.0.0.1*)
    echo "error: target looks local. $TARGET_ENV should hold the production URL." >&2
    exit 1
    ;;
esac

echo "Source: $(describe_url "$SOURCE_DB")"
echo "Target: $(describe_url "$TARGET_DB")"
echo

if [ "${CONFIRM:-}" != "WIPE_PROD" ]; then
  cat >&2 <<'MSG'
This DROPS the entire public schema on the target and replaces it.

Re-run with:
  CONFIRM=WIPE_PROD ./scripts/clone-db-to-prod.sh
MSG
  exit 1
fi

echo "Checking connectivity..."
SOURCE_VERSION="$(psql "$SOURCE_DB" -At -c 'show server_version')"
TARGET_VERSION="$(psql "$TARGET_DB" -At -c 'show server_version')"
echo "  local Postgres  : $SOURCE_VERSION"
echo "  target Postgres : $TARGET_VERSION"
echo

mkdir -p .tmp
STAMP="$(date +%Y%m%d-%H%M%S)"
DUMP=".tmp/thryveco-$STAMP.sql"

echo "Dumping local database..."
pg_dump "$SOURCE_DB" \
  --schema=public \
  --no-owner \
  --no-privileges \
  --quote-all-identifiers \
  -f "$DUMP"
echo "  wrote $DUMP ($(du -h "$DUMP" | cut -f1))"

# pg_dump 18 emits GUCs that older servers reject. Both default to 0/off, so
# dropping the SET lines does not change restore semantics.
# Also drop CREATE SCHEMA / COMMENT ON SCHEMA — we recreate public ourselves so
# Neon/managed hosts that already have public don't fail on restore.
CLEAN="$DUMP.clean"
grep -vE '^SET (transaction_timeout|idle_session_timeout)' "$DUMP" \
  | grep -vE '^CREATE SCHEMA "public";$' \
  | grep -vE '^COMMENT ON SCHEMA "public" IS' \
  > "$CLEAN"
STRIPPED=$(( $(wc -l < "$DUMP") - $(wc -l < "$CLEAN") ))
[ "$STRIPPED" -gt 0 ] && echo "  stripped $STRIPPED dump line(s) for older/managed Postgres"
echo

echo "Wiping target public schema..."
psql "$TARGET_DB" -v ON_ERROR_STOP=1 -q \
  -c 'DROP SCHEMA IF EXISTS public CASCADE;' \
  -c 'CREATE SCHEMA public;' \
  -c 'GRANT ALL ON SCHEMA public TO public;'
echo "  done"
echo

echo "Restoring into target..."
psql "$TARGET_DB" -v ON_ERROR_STOP=1 -q -f "$CLEAN"
echo "  done"
echo

echo "Fixing search_path (Neon often clears it after DROP SCHEMA)..."
DB_NAME="$(psql "$TARGET_DB" -At -c 'select current_database()')"
psql "$TARGET_DB" -v ON_ERROR_STOP=1 -q \
  -c "ALTER DATABASE \"$DB_NAME\" SET search_path TO public;" \
  -c "ALTER ROLE CURRENT_USER SET search_path TO public;" \
  -c "SET search_path TO public;"
echo "  search_path=public"
echo

echo "Verifying..."
for pair in "media:media rows" "payload_migrations:migrations recorded" "users:users"; do
  table="${pair%%:*}"
  label="${pair##*:}"
  src="$(psql "$SOURCE_DB" -At -c "SET search_path TO public; select count(*) from \"$table\"" 2>/dev/null || echo '?')"
  tgt="$(psql "$TARGET_DB" -At -c "SET search_path TO public; select count(*) from \"$table\"" 2>/dev/null || echo '?')"
  status="OK"
  [ "$src" != "$tgt" ] && status="MISMATCH"
  printf '  %-22s local=%-6s prod=%-6s %s\n' "$label" "$src" "$tgt" "$status"
done

SRC_TABLES="$(psql "$SOURCE_DB" -At -c "select count(*) from information_schema.tables where table_schema='public' and table_type='BASE TABLE'")"
TGT_TABLES="$(psql "$TARGET_DB" -At -c "select count(*) from information_schema.tables where table_schema='public' and table_type='BASE TABLE'")"
printf '  %-22s local=%-6s prod=%-6s %s\n' "tables" "$SRC_TABLES" "$TGT_TABLES" \
  "$([ "$SRC_TABLES" = "$TGT_TABLES" ] && echo OK || echo MISMATCH)"

echo
echo "Database cloned. Next: npm run media:upload"
