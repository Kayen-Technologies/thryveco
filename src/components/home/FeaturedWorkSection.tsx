import Container from "@/components/Container";
import Section from "@/components/Section";
import Typography from "@/components/Typography";
import FeaturedWorkBand, {
  type FeaturedWorkItem,
} from "@/components/home/FeaturedWorkBand";
import Reveal from "@/components/motion/Reveal";

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
        <Reveal
          className="mx-auto flex max-w-[879px] flex-col items-center gap-6"
          stagger
        >
          <div data-reveal>
            <Typography variant="section">{headline}</Typography>
          </div>
          <div data-reveal>
            <Typography variant="body" className="max-w-[675px] text-[var(--color-text-muted)]">
              {body}
            </Typography>
          </div>
        </Reveal>
      </Container>
      {works.map((work) => (
        <FeaturedWorkBand key={work.slug} {...work} />
      ))}
    </Section>
  );
}
