import { describe, expect, it } from "vitest";
import {
  MediaValidationError,
  validateUploadFile,
} from "./validate-upload";

describe("validateUploadFile", () => {
  it("geçerli png kabul eder", () => {
    expect(() =>
      validateUploadFile({
        filename: "logo.png",
        mimeType: "image/png",
        bytes: 1200,
      }),
    ).not.toThrow();
  });

  it("path traversal reddeder", () => {
    expect(() =>
      validateUploadFile({
        filename: "../evil.jpg",
        mimeType: "image/jpeg",
        bytes: 100,
      }),
    ).toThrow(MediaValidationError);
  });

  it("aşırı boyutu reddeder", () => {
    expect(() =>
      validateUploadFile({
        filename: "big.webp",
        mimeType: "image/webp",
        bytes: 6 * 1024 * 1024,
      }),
    ).toThrow(MediaValidationError);
  });
});
