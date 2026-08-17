import type { ReactNode } from "react";

type StudioServiceDisclosureProps = Readonly<{
  label: string;
  /* Shared name makes the rows in one card behave as a radio group, so opening
     one closes the other and the composition stays inside the pinned frame.
     Browsers without `name` support fall back to independent toggling. */
  group: string;
  children: ReactNode;
}>;

export default function StudioServiceDisclosure({
  label,
  group,
  children,
}: StudioServiceDisclosureProps) {
  return (
    <details className="studio-services__disclosure" name={group}>
      <summary className="studio-services__disclosure-summary">
        <span>{label}</span>
        <svg
          className="studio-services__disclosure-icon"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </summary>
      <div className="studio-services__disclosure-content">
        <div className="studio-services__disclosure-inner">{children}</div>
      </div>
    </details>
  );
}
