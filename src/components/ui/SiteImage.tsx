import Image from "next/image";
import { cn } from "@/lib/cn";

type Props = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  className?: string;
  sizes?: string;
};

/**
 * Kalıcı medya (Cloudinary) için next/image.
 * Boş alt production a11y ihlalidir — çağıran boş bırakmamalı.
 */
export function SiteImage({
  src,
  alt,
  width,
  height,
  fill,
  priority = false,
  className,
  sizes = "(max-width: 768px) 100vw, 50vw",
}: Props) {
  const safeAlt = alt.trim() || "Görsel";

  if (fill) {
    return (
      <Image
        src={src}
        alt={safeAlt}
        fill
        priority={priority}
        sizes={sizes}
        className={cn("object-cover", className)}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={safeAlt}
      width={width ?? 800}
      height={height ?? 600}
      priority={priority}
      sizes={sizes}
      className={className}
    />
  );
}
