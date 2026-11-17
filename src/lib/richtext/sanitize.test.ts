import { describe, expect, it } from "vitest";
import { sanitizeTipTapDoc } from "./sanitize";

describe("sanitizeTipTapDoc", () => {
  it("script/iframe node tiplerini atar", () => {
    const dirty = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "Merhaba" }],
        },
        {
          type: "iframe",
          attrs: { src: "javascript:alert(1)" },
        },
      ],
    };
    const clean = sanitizeTipTapDoc(dirty);
    expect(JSON.stringify(clean)).not.toContain("iframe");
    expect(JSON.stringify(clean)).toContain("Merhaba");
  });

  it("javascript: linklerini kaldırır", () => {
    const dirty = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "tıkla",
              marks: [{ type: "link", attrs: { href: "javascript:alert(1)" } }],
            },
          ],
        },
      ],
    };
    const clean = sanitizeTipTapDoc(dirty);
    expect(JSON.stringify(clean)).not.toContain("javascript:");
  });
});
