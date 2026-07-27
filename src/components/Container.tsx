import type { ReactNode } from "react";

export type ContainerProps = Readonly<{
  as?: "div" | "header" | "footer" | "main" | "section" | "nav";
  className?: string;
  children: ReactNode;
}>;

export default function Container({
  as: Component = "div",
  className = "",
  children,
}: ContainerProps) {
  return <Component className={`container-x ${className}`.trim()}>{children}</Component>;
}
