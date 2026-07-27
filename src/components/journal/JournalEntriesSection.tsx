import JournalEntryCard, {
  type JournalEntryCardData,
} from "@/components/journal/JournalEntryCard";

type JournalEntriesSectionProps = Readonly<{
  title: string;
  entries: JournalEntryCardData[];
}>;

export default function JournalEntriesSection({
  title,
  entries,
}: JournalEntriesSectionProps) {
  if (entries.length === 0) return null;

  return (
    <section className="journal-entries" aria-labelledby="journal-entries-heading">
      <div className="journal-entries__inner">
        <h2 id="journal-entries-heading" className="journal-entries__title">
          {title}
        </h2>

        <div className="journal-entries__grid">
          {entries.map((entry) => (
            <JournalEntryCard key={entry.slug} entry={entry} />
          ))}
        </div>
      </div>
    </section>
  );
}
