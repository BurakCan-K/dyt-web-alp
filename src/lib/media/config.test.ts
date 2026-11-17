import { afterEach, describe, expect, it } from "vitest";
import {
  assertMediaConfigured,
  getMediaStorageMode,
  MediaConfigError,
} from "./config";

const keys = [
  "MEDIA_PROVIDER",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "S3_BUCKET",
  "S3_ACCESS_KEY_ID",
  "S3_SECRET_ACCESS_KEY",
] as const;

afterEach(() => {
  for (const k of keys) delete process.env[k];
});

describe("media config", () => {
  it("env yoksa unset", () => {
    expect(getMediaStorageMode()).toBe("unset");
  });

  it("env eksikken sahte başarı yok — hata fırlatır", () => {
    expect(() => assertMediaConfigured()).toThrow(MediaConfigError);
  });

  it("cloudinary env ile cloudinary modu", () => {
    process.env.CLOUDINARY_CLOUD_NAME = "demo";
    process.env.CLOUDINARY_API_KEY = "key";
    process.env.CLOUDINARY_API_SECRET = "secret";
    expect(getMediaStorageMode()).toBe("cloudinary");
    expect(assertMediaConfigured().cloudName).toBe("demo");
  });
});
