type CaseStudyListSectionProps = Readonly<{
  title: string;
  items: string[];
  variant?: "default" | "spacious" | "results";
}>;

export default function CaseStudyListSection({
  title,
  items,
  variant = "default",
}: CaseStudyListSectionProps) {
  if (items.length === 0) return null;

  const variantClass =
    variant === "spacious"
      ? "case-study-list--spacious"
      : variant === "results"
        ? "case-study-list--results"
        : "";

  return (
    <section className={`case-study-list ${variantClass}`.trim()}>
      <div className="case-study-list__inner">
        <h2 className="case-study-list__title">{title}</h2>
        <ul className="case-study-list__items">
          {items.map((item) => (
            <li key={item} className="case-study-list__item">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
