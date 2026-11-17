"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import { EMPTY_DOC, type TipTapDoc } from "@/lib/richtext/types";
import { sanitizeTipTapDoc } from "@/lib/richtext/sanitize";
import { cn } from "@/lib/cn";

type Props = {
  name: string;
  initialDoc?: unknown;
  label?: string;
};

export function RichTextEditor({ name, initialDoc, label }: Props) {
  const start = sanitizeTipTapDoc(initialDoc ?? EMPTY_DOC);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        codeBlock: false,
        code: false,
      }),
    ],
    content: start,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "min-h-40 rounded-b-xl bg-surface-container-lowest px-space-md py-space-sm text-body-md focus:outline-none",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    const input = document.querySelector<HTMLInputElement>(
      `input[name="${name}"]`,
    );
    const sync = () => {
      if (!input) return;
      const json = sanitizeTipTapDoc(editor.getJSON() as TipTapDoc);
      input.value = JSON.stringify(json);
    };
    sync();
    editor.on("update", sync);
    return () => {
      editor.off("update", sync);
    };
  }, [editor, name]);

  return (
    <div className="flex flex-col gap-1">
      {label ? (
        <span className="text-label-sm text-on-surface">{label}</span>
      ) : null}
      <input type="hidden" name={name} defaultValue={JSON.stringify(start)} />
      <div className="overflow-hidden rounded-xl border border-outline-variant/40 bg-surface-container-low">
        <div className="flex flex-wrap gap-1 border-b border-outline-variant/30 p-space-xs">
          {(
            [
              ["Kalın", () => editor?.chain().focus().toggleBold().run()],
              ["İtalik", () => editor?.chain().focus().toggleItalic().run()],
              [
                "H2",
                () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
              ],
              [
                "H3",
                () => editor?.chain().focus().toggleHeading({ level: 3 }).run(),
              ],
              [
                "Madde",
                () => editor?.chain().focus().toggleBulletList().run(),
              ],
              [
                "Numara",
                () => editor?.chain().focus().toggleOrderedList().run(),
              ],
            ] as const
          ).map(([labelBtn, onClick]) => (
            <button
              key={labelBtn}
              type="button"
              onClick={onClick}
              className={cn(
                "rounded-lg px-space-sm py-1 text-label-sm text-on-surface hover:bg-surface-container",
              )}
            >
              {labelBtn}
            </button>
          ))}
        </div>
        <EditorContent editor={editor} />
      </div>
      {name === "descriptionJson" ? (
        <p className="text-body-sm text-on-surface-variant">
          Aynı görünüm için sırayla: <strong>H2</strong> başlık +{" "}
          <strong>Madde</strong> listesi. Önerilen bölümler: “Bu hizmette neler
          var?”, “Kimler için uygun?”, “Süreç nasıl ilerler?” (Numara listesi),
          “Önemli not”. İlk madde listesi kart özetinde de görünür.
        </p>
      ) : null}
    </div>
  );
}
