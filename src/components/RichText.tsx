import { RichText as PayloadRichText } from "@payloadcms/richtext-lexical/react";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";

type RichTextProps = Readonly<{
  content: SerializedEditorState | null | undefined;
  className?: string;
}>;

export default function RichText({ content, className = "" }: RichTextProps) {
  if (!content) {
    return null;
  }

  return (
    <div
      className={`prose-thryve max-w-none text-[var(--color-text)] ${className}`}
    >
      <PayloadRichText data={content} />
    </div>
  );
}
