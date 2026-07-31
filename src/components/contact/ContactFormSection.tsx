import type { ContactFormCopy } from "@/components/contact/defaults";
import ContactForm from "@/components/contact/ContactForm";

type ContactFormSectionProps = Readonly<{
  heading: string;
  intro: string;
  form: ContactFormCopy;
}>;

export default function ContactFormSection({
  heading,
  intro,
  form,
}: ContactFormSectionProps) {
  return (
    <section className="contact-form-section">
      <div className="contact-form-section__inner">
        <header className="contact-form-section__header">
          <h2 className="contact-form-section__heading">{heading}</h2>
          <p className="contact-form-section__intro">{intro}</p>
        </header>
        <div className="contact-form-section__frame">
          <ContactForm copy={form} />
        </div>
      </div>
    </section>
  );
}
