"use client";

import { useState, type FormEvent } from "react";

type FormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const inputClassName =
  "w-full rounded-[var(--radius-input)] border border-[#e2d9c9] bg-[var(--color-bg-surface)] px-4 py-3 text-[var(--color-text)] outline-none transition-colors focus:border-[var(--color-primary)]";

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, website }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setErrorMessage(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
      setWebsite("");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        className="max-w-[560px] rounded-[var(--radius-card)] border border-[#e2d9c9] bg-[var(--color-bg-surface)] px-6 py-12 text-center"
        role="status"
      >
        <p className="font-heading mb-3 text-2xl">Message sent!</p>
        <p className="text-[var(--color-text-muted)]">
          Thanks for reaching out. We&apos;ll get back to you shortly.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-semibold text-[var(--color-primary)]"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex max-w-[560px] flex-col gap-6"
    >
      {status === "error" && errorMessage && (
        <p
          className="rounded-[var(--radius-input)] border border-[var(--color-primary)]/30 bg-[var(--color-primary)]/5 px-4 py-3 text-sm text-[var(--color-primary)]"
          role="alert"
        >
          {errorMessage}
        </p>
      )}

      <div className="absolute left-[-9999px] h-0 w-0 overflow-hidden" aria-hidden>
        <label htmlFor="website">Website</label>
        <input
          id="website"
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
        />
      </div>

      {(["name", "email", "subject"] as const).map((field) => (
        <div key={field} className="flex flex-col gap-2">
          <label htmlFor={field} className="text-sm font-semibold capitalize">
            {field}
            {field !== "subject" && <span className="text-[var(--color-primary)]"> *</span>}
          </label>
          <input
            id={field}
            name={field}
            type={field === "email" ? "email" : "text"}
            required={field !== "subject"}
            value={formData[field]}
            onChange={(event) =>
              setFormData((prev) => ({ ...prev, [field]: event.target.value }))
            }
            className={inputClassName}
          />
        </div>
      ))}

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-sm font-semibold">
          Message <span className="text-[var(--color-primary)]">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          value={formData.message}
          onChange={(event) =>
            setFormData((prev) => ({ ...prev, message: event.target.value }))
          }
          className={`${inputClassName} resize-y`}
        />
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex h-[50px] items-center justify-center self-start rounded-[var(--radius-pill)] bg-[var(--color-primary)] px-10 text-sm font-semibold uppercase tracking-[var(--tracking-caps)] text-[var(--color-text-on-dark)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "submitting" ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
