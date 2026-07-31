"use client";

import { useId, useState, type FormEvent } from "react";

import type { ContactFormCopy } from "@/components/contact/defaults";

type FormFields = {
  name: string;
  email: string;
  service: string;
  brandName: string;
  socialLink: string;
  challenge: string;
  brandGoal: string;
  timeline: string;
  referralSource: string;
  additionalNotes: string;
};

const EMPTY_FORM: FormFields = {
  name: "",
  email: "",
  service: "",
  brandName: "",
  socialLink: "",
  challenge: "",
  brandGoal: "",
  timeline: "",
  referralSource: "",
  additionalNotes: "",
};

type ContactFormProps = Readonly<{
  copy: ContactFormCopy;
}>;

function optionLabels(
  options: { label: string }[] | null | undefined,
): string[] {
  if (!options?.length) return [];
  return options.map((option) => option.label).filter(Boolean);
}

export default function ContactForm({ copy }: ContactFormProps) {
  const formId = useId();
  const [formData, setFormData] = useState<FormFields>(EMPTY_FORM);
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const serviceOptions = optionLabels(copy.serviceOptions);
  const timelineOptions = optionLabels(copy.timelineOptions);
  const referralOptions = optionLabels(copy.referralOptions);

  function updateField<K extends keyof FormFields>(key: K, value: FormFields[K]) {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");
    setFieldErrors({});

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, website }),
      });

      const data = (await response.json()) as {
        error?: string;
        errors?: Record<string, string>;
      };

      if (!response.ok) {
        setErrorMessage(data.error ?? "Something went wrong. Please try again.");
        setFieldErrors(data.errors ?? {});
        setStatus("error");
        return;
      }

      setStatus("success");
      setWebsite("");
      setFormData(EMPTY_FORM);
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="contact-form__success" role="status">
        <p className="contact-form__success-title">{copy.successTitle}</p>
        <p className="contact-form__success-body">{copy.successBody}</p>
        <button
          type="button"
          className="contact-form__success-reset"
          onClick={() => setStatus("idle")}
        >
          Submit another enquiry
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="contact-form"
      aria-describedby={status === "error" ? `${formId}-alert` : undefined}
    >
      {status === "error" && errorMessage ? (
        <p id={`${formId}-alert`} className="contact-form__alert" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <div className="contact-form__honeypot" aria-hidden="true">
        <label htmlFor={`${formId}-website`}>Website</label>
        <input
          id={`${formId}-website`}
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
        />
      </div>

      <div className="contact-form__fields">
        <div className="contact-form__field">
          <label className="contact-form__label" htmlFor={`${formId}-name`}>
            <span className="contact-form__label-text">{copy.nameLabel}</span>
            <span className="contact-form__required" aria-hidden="true">
              {" "}
              *
            </span>
          </label>
          <input
            id={`${formId}-name`}
            name="name"
            type="text"
            autoComplete="name"
            required
            value={formData.name}
            aria-invalid={fieldErrors.name ? true : undefined}
            aria-describedby={fieldErrors.name ? `${formId}-name-error` : undefined}
            onChange={(event) => updateField("name", event.target.value)}
            className="contact-form__input"
            placeholder={`${copy.nameLabel} *`}
          />
          {fieldErrors.name ? (
            <p id={`${formId}-name-error`} className="contact-form__field-error" role="alert">
              {fieldErrors.name}
            </p>
          ) : null}
        </div>

        <div className="contact-form__field">
          <label className="contact-form__label" htmlFor={`${formId}-email`}>
            <span className="contact-form__label-text">{copy.emailLabel}</span>
            <span className="contact-form__required" aria-hidden="true">
              {" "}
              *
            </span>
          </label>
          <input
            id={`${formId}-email`}
            name="email"
            type="email"
            autoComplete="email"
            required
            value={formData.email}
            aria-invalid={fieldErrors.email ? true : undefined}
            aria-describedby={fieldErrors.email ? `${formId}-email-error` : undefined}
            onChange={(event) => updateField("email", event.target.value)}
            className="contact-form__input"
            placeholder={`${copy.emailLabel} *`}
          />
          {fieldErrors.email ? (
            <p id={`${formId}-email-error`} className="contact-form__field-error" role="alert">
              {fieldErrors.email}
            </p>
          ) : null}
        </div>

        <div className="contact-form__field">
          <label className="contact-form__label" htmlFor={`${formId}-service`}>
            <span className="contact-form__label-text">{copy.serviceLabel}</span>
            <span className="contact-form__required" aria-hidden="true">
              {" "}
              *
            </span>
          </label>
          <div className="contact-form__select-wrap">
            <select
              id={`${formId}-service`}
              name="service"
              required
              value={formData.service}
              aria-invalid={fieldErrors.service ? true : undefined}
              aria-describedby={
                fieldErrors.service ? `${formId}-service-error` : undefined
              }
              onChange={(event) => updateField("service", event.target.value)}
              className="contact-form__select"
            >
              <option value="">{`${copy.serviceLabel} *`}</option>
              {serviceOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          {fieldErrors.service ? (
            <p
              id={`${formId}-service-error`}
              className="contact-form__field-error"
              role="alert"
            >
              {fieldErrors.service}
            </p>
          ) : null}
        </div>

        <div className="contact-form__field">
          <label className="contact-form__label" htmlFor={`${formId}-brandName`}>
            <span className="contact-form__label-text">{copy.brandNameLabel}</span>
            <span className="contact-form__required" aria-hidden="true">
              {" "}
              *
            </span>
          </label>
          <input
            id={`${formId}-brandName`}
            name="brandName"
            type="text"
            autoComplete="organization"
            required
            value={formData.brandName}
            aria-invalid={fieldErrors.brandName ? true : undefined}
            aria-describedby={
              fieldErrors.brandName ? `${formId}-brandName-error` : undefined
            }
            onChange={(event) => updateField("brandName", event.target.value)}
            className="contact-form__input"
            placeholder={`${copy.brandNameLabel} *`}
          />
          {fieldErrors.brandName ? (
            <p
              id={`${formId}-brandName-error`}
              className="contact-form__field-error"
              role="alert"
            >
              {fieldErrors.brandName}
            </p>
          ) : null}
        </div>

        <div className="contact-form__field">
          <label className="contact-form__label" htmlFor={`${formId}-socialLink`}>
            <span className="contact-form__label-text">{copy.socialLinkLabel}</span>
            <span className="contact-form__required" aria-hidden="true">
              {" "}
              *
            </span>
          </label>
          <input
            id={`${formId}-socialLink`}
            name="socialLink"
            type="text"
            inputMode="url"
            autoComplete="url"
            required
            value={formData.socialLink}
            aria-invalid={fieldErrors.socialLink ? true : undefined}
            aria-describedby={
              fieldErrors.socialLink ? `${formId}-socialLink-error` : undefined
            }
            onChange={(event) => updateField("socialLink", event.target.value)}
            className="contact-form__input"
            placeholder={`${copy.socialLinkLabel} *`}
          />
          {fieldErrors.socialLink ? (
            <p
              id={`${formId}-socialLink-error`}
              className="contact-form__field-error"
              role="alert"
            >
              {fieldErrors.socialLink}
            </p>
          ) : null}
        </div>

        <div className="contact-form__field">
          <label className="contact-form__label" htmlFor={`${formId}-challenge`}>
            <span className="contact-form__label-text">{copy.challengeLabel}</span>
            <span className="contact-form__required" aria-hidden="true">
              *
            </span>
          </label>
          <textarea
            id={`${formId}-challenge`}
            name="challenge"
            required
            rows={5}
            value={formData.challenge}
            aria-invalid={fieldErrors.challenge ? true : undefined}
            aria-describedby={
              fieldErrors.challenge ? `${formId}-challenge-error` : undefined
            }
            onChange={(event) => updateField("challenge", event.target.value)}
            className="contact-form__textarea"
            placeholder={`${copy.challengeLabel}*`}
          />
          {fieldErrors.challenge ? (
            <p
              id={`${formId}-challenge-error`}
              className="contact-form__field-error"
              role="alert"
            >
              {fieldErrors.challenge}
            </p>
          ) : null}
        </div>

        <div className="contact-form__field">
          <label className="contact-form__label" htmlFor={`${formId}-brandGoal`}>
            <span className="contact-form__label-text">{copy.brandGoalLabel}</span>
            <span className="contact-form__required" aria-hidden="true">
              *
            </span>
          </label>
          <textarea
            id={`${formId}-brandGoal`}
            name="brandGoal"
            required
            rows={5}
            value={formData.brandGoal}
            aria-invalid={fieldErrors.brandGoal ? true : undefined}
            aria-describedby={
              fieldErrors.brandGoal ? `${formId}-brandGoal-error` : undefined
            }
            onChange={(event) => updateField("brandGoal", event.target.value)}
            className="contact-form__textarea"
            placeholder={`${copy.brandGoalLabel}*`}
          />
          {fieldErrors.brandGoal ? (
            <p
              id={`${formId}-brandGoal-error`}
              className="contact-form__field-error"
              role="alert"
            >
              {fieldErrors.brandGoal}
            </p>
          ) : null}
        </div>

        <div className="contact-form__field">
          <label className="contact-form__label" htmlFor={`${formId}-timeline`}>
            <span className="contact-form__label-text">{copy.timelineLabel}</span>
          </label>
          <div className="contact-form__select-wrap">
            <select
              id={`${formId}-timeline`}
              name="timeline"
              value={formData.timeline}
              onChange={(event) => updateField("timeline", event.target.value)}
              className="contact-form__select"
            >
              <option value="">{copy.timelineLabel}</option>
              {timelineOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="contact-form__field">
          <label className="contact-form__label" htmlFor={`${formId}-referral`}>
            <span className="contact-form__label-text">{copy.referralLabel}</span>
          </label>
          <div className="contact-form__select-wrap">
            <select
              id={`${formId}-referral`}
              name="referralSource"
              value={formData.referralSource}
              onChange={(event) => updateField("referralSource", event.target.value)}
              className="contact-form__select"
            >
              <option value="">{copy.referralLabel}</option>
              {referralOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="contact-form__field">
          <label
            className="contact-form__label"
            htmlFor={`${formId}-additionalNotes`}
          >
            <span className="contact-form__label-text">
              {copy.additionalNotesLabel}
            </span>
          </label>
          <textarea
            id={`${formId}-additionalNotes`}
            name="additionalNotes"
            rows={5}
            value={formData.additionalNotes}
            onChange={(event) => updateField("additionalNotes", event.target.value)}
            className="contact-form__textarea"
            placeholder={copy.additionalNotesLabel}
          />
        </div>
      </div>

      <button
        type="submit"
        className="contact-form__submit"
        disabled={status === "submitting"}
      >
        {status === "submitting" ? "Submitting..." : copy.submitLabel}
      </button>
    </form>
  );
}
