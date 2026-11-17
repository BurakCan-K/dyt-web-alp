import { sanitizeTipTapDoc } from "@/lib/richtext/sanitize";
import {
  isTipTapDoc,
  paragraphsToDoc,
  type TipTapDoc,
  type TipTapMark,
  type TipTapNode,
} from "@/lib/richtext/types";

export { paragraphsToDoc };

function renderMarks(text: string, marks?: TipTapMark[]): React.ReactNode {
  let node: React.ReactNode = text;
  for (const mark of marks ?? []) {
    if (mark.type === "bold") node = <strong>{node}</strong>;
    if (mark.type === "italic") node = <em>{node}</em>;
    if (mark.type === "link" && typeof mark.attrs?.href === "string") {
      node = (
        <a
          href={mark.attrs.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline"
        >
          {node}
        </a>
      );
    }
  }
  return node;
}

function renderNode(node: TipTapNode, key: string): React.ReactNode {
  switch (node.type) {
    case "paragraph":
      return (
        <p key={key} className="text-body-md text-on-surface-variant">
          {node.content?.map((c, i) => renderNode(c, `${key}-${i}`)) ?? null}
        </p>
      );
    case "heading": {
      const level = Number(node.attrs?.level ?? 2);
      const className = "text-headline-sm text-on-surface";
      const children = node.content?.map((c, i) =>
        renderNode(c, `${key}-${i}`),
      );
      if (level === 3) {
        return (
          <h3 key={key} className={className}>
            {children}
          </h3>
        );
      }
      return (
        <h2 key={key} className={className}>
          {children}
        </h2>
      );
    }
    case "bulletList":
      return (
        <ul
          key={key}
          className="list-disc space-y-1 pl-5 text-body-md text-on-surface-variant"
        >
          {node.content?.map((c, i) => renderNode(c, `${key}-${i}`))}
        </ul>
      );
    case "orderedList":
      return (
        <ol
          key={key}
          className="list-decimal space-y-1 pl-5 text-body-md text-on-surface-variant"
        >
          {node.content?.map((c, i) => renderNode(c, `${key}-${i}`))}
        </ol>
      );
    case "listItem":
      return (
        <li key={key}>
          {node.content?.map((c, i) => renderNode(c, `${key}-${i}`))}
        </li>
      );
    case "blockquote":
      return (
        <blockquote
          key={key}
          className="border-l-4 border-primary/30 pl-space-md text-body-md italic text-on-surface-variant"
        >
          {node.content?.map((c, i) => renderNode(c, `${key}-${i}`))}
        </blockquote>
      );
    case "hardBreak":
      return <br key={key} />;
    case "text":
      return (
        <span key={key}>{renderMarks(node.text ?? "", node.marks)}</span>
      );
    default:
      return null;
  }
}

type Props = {
  doc: unknown;
  className?: string;
};

export function RichTextView({ doc, className }: Props) {
  const clean = sanitizeTipTapDoc(doc);
  return (
    <div className={className ?? "space-y-space-md"}>
      {clean.content?.map((node, i) => renderNode(node, String(i)))}
    </div>
  );
}

export function ensureDoc(
  value: unknown,
  fallbackParagraphs?: string[],
): TipTapDoc {
  if (isTipTapDoc(value)) return sanitizeTipTapDoc(value);
  if (fallbackParagraphs?.length) return paragraphsToDoc(fallbackParagraphs);
  return sanitizeTipTapDoc(null);
}
