import { revalidatePath } from "next/cache";
import type {
  CollectionAfterChangeHook,
  GlobalAfterChangeHook,
} from "payload";

function shouldSkipRevalidation(): boolean {
  return (
    process.env.PAYLOAD_MIGRATING === "true" ||
    process.env.SKIP_REVALIDATION === "true"
  );
}

async function revalidatePublicSite(
  logger: { warn: (message: unknown) => void },
): Promise<void> {
  if (shouldSkipRevalidation()) return;

  try {
    revalidatePath("/", "layout");
  } catch (error) {
    logger.warn({ err: error, msg: "Failed to revalidate public site cache" });
  }
}

export const revalidateSiteAfterChange: CollectionAfterChangeHook = async ({
  doc,
  req,
}) => {
  await revalidatePublicSite(req.payload.logger);
  return doc;
};

export const revalidateSiteGlobalAfterChange: GlobalAfterChangeHook = async ({
  doc,
  req,
}) => {
  await revalidatePublicSite(req.payload.logger);
  return doc;
};
