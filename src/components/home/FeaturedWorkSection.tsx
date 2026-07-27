import Container from "@/components/Container";
import Section from "@/components/Section";
import Typography from "@/components/Typography";
import FeaturedWorkBand, {
  type FeaturedWorkItem,
} from "@/components/home/FeaturedWorkBand";

type FeaturedWorkSectionProps = {
  headline: string;
  body: string;
  works: FeaturedWorkItem[];
};

export default function FeaturedWorkSection({
  headline,
  body,
  works,
}: FeaturedWorkSectionProps) {
  return (
    <Section tone="cream" padded={false} className="overflow-hidden pt-20 md:pt-[130px]">
      <Container className="pb-[72px] text-center">
        <div className="mx-auto flex max-w-[879px] flex-col items-center gap-6">
          <Typography variant="section">{headline}</Typography>
          <Typography variant="body" className="max-w-[675px] text-[var(--color-text-muted)]">
            {body}
          </Typography>
        </div>
      </Container>
      {works.map((work) => (
        <FeaturedWorkBand key={work.slug} {...work} />
      ))}
    </Section>
  );
}
