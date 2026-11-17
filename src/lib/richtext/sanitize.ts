import { EMPTY_DOC, type TipTapDoc, type TipTapNode } from "./types";

const ALLOWED_NODES = new Set([
  "doc",
  "paragraph",
  "heading",
  "bulletList",
  "orderedList",
  "listItem",
  "hardBreak",
  "text",
  "blockquote",
]);

const ALLOWED_MARKS = new Set(["bold", "italic", "link"]);

function sanitizeHref(href: unknown): string | null {
  if (typeof href !== "string") return null;
  const trimmed = href.trim();
  if (trimmed.startsWith("https://") || trimmed.startsWith("http://")) {
    return trimmed.slice(0, 2000);
  }
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    return trimmed.slice(0, 500);
  }
  return null;
}

function sanitizeMarks(marks: TipTapNode["marks"]): TipTapNode["marks"] {
  if (!marks?.length) return undefined;
  const next = [];
  for (const mark of marks) {
    if (!ALLOWED_MARKS.has(mark.type)) continue;
    if (mark.type === "link") {
      const href = sanitizeHref(mark.attrs?.href);
      if (!href) continue;
      next.push({
        type: "link",
        attrs: { href, target: "_blank", rel: "noopener noreferrer" },
      });
      continue;
    }
    next.push({ type: mark.type });
  }
  return next.length ? next : undefined;
}

function sanitizeNode(node: TipTapNode): TipTapNode | null {
  if (!ALLOWED_NODES.has(node.type)) return null;

  if (node.type === "text") {
    return {
      type: "text",
      text: (node.text ?? "").slice(0, 20000),
      marks: sanitizeMarks(node.marks),
    };
  }

  if (node.type === "hardBreak") {
    return { type: "hardBreak" };
  }

  if (node.type === "heading") {
    const level = Number(node.attrs?.level ?? 2);
    const safeLevel = [2, 3].includes(level) ? level : 2;
    return {
      type: "heading",
      attrs: { level: safeLevel },
      content: sanitizeContent(node.content),
    };
  }

  return {
    type: node.type,
    content: sanitizeContent(node.content),
  };
}

function sanitizeContent(content?: TipTapNode[]): TipTapNode[] | undefined {
  if (!content?.length) return undefined;
  const next: TipTapNode[] = [];
  for (const child of content) {
    const clean = sanitizeNode(child);
    if (clean) next.push(clean);
  }
  return next.length ? next : undefined;
}

export function sanitizeTipTapDoc(input: unknown): TipTapDoc {
  if (
    typeof input !== "object" ||
    input === null ||
    (input as TipTapDoc).type !== "doc"
  ) {
    return EMPTY_DOC;
  }
  return {
    type: "doc",
    content: sanitizeContent((input as TipTapDoc).content) ?? [
      { type: "paragraph" },
    ],
  };
}
