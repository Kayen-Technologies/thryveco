import Link from "next/link";
import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from "react";

export type ButtonVariant = "primary" | "inverse" | "icon";

type CommonButtonProps = {
  href?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  children: ReactNode;
};

type LabeledButtonProps =
  | {
      variant: "icon";
      "aria-label": string;
    }
  | {
      variant?: "primary" | "inverse";
      "aria-label"?: string;
    };

export type ButtonProps = CommonButtonProps &
  LabeledButtonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "children" | "className" | "disabled">;

const variantClassNames: Record<ButtonVariant, string> = {
  // Primary is intended for dark surfaces; use inverse on cream/light surfaces.
  primary:
    "h-[50px] rounded-[var(--radius-none)] bg-[var(--color-bg-surface)] px-8 text-[var(--color-text)]",
  inverse:
    "h-[50px] rounded-[var(--radius-none)] bg-[var(--color-primary)] px-8 text-[var(--color-text-on-dark)]",
  icon:
    "size-[54px] rounded-[var(--radius-circle)] bg-[var(--color-bg-surface)] text-[var(--color-text)]",
};

export default function Button({
  variant = "primary",
  href,
  type = "button",
  disabled = false,
  className = "",
  children,
  "aria-label": ariaLabel,
  ...props
}: ButtonProps) {
  const classes = [
    "inline-flex shrink-0 items-center justify-center font-body text-base transition-opacity",
    "hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]",
    disabled ? "pointer-events-none opacity-70" : "",
    variantClassNames[variant],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (href && !disabled) {
    const linkProps = props as Omit<ComponentProps<typeof Link>, "href" | "className" | "children">;

    return (
      <Link href={href} className={classes} aria-label={ariaLabel} {...linkProps}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      className={classes}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </button>
  );
}
