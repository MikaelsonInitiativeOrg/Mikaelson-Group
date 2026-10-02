import Image from "next/image";

const BLOB_HOST = /^https:\/\/[^/]+\.public\.blob\.vercel-storage\.com\//;

/**
 * A post's cover, never cropped.
 * - fit="box": fills a positioned parent of fixed proportions; the whole
 *   image is fitted inside it (letterboxed on the surface colour).
 * - fit="natural": the image at its own proportions, full width, capped
 *   at 80% of the viewport height so very tall images stay readable.
 * Covers from the Vercel Blob store go through next/image; any other
 * https URL is a plain img because next/image only optimises allow-listed hosts.
 */
export function CoverImage({
  src,
  alt,
  sizes,
  priority = false,
  fit = "box",
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  fit?: "box" | "natural";
}) {
  const optimised = BLOB_HOST.test(src);

  if (fit === "natural") {
    const cls = "mx-auto block h-auto max-h-[80vh] w-auto max-w-full";
    // width/height only reserve space before load; CSS lets the real proportions win.
    return optimised ? (
      <Image src={src} alt={alt} width={1600} height={1000} sizes={sizes} priority={priority} className={cls} />
    ) : (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} loading={priority ? "eager" : "lazy"} className={cls} />
    );
  }

  return optimised ? (
    <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="bg-surface-2 object-contain" />
  ) : (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      className="absolute inset-0 h-full w-full bg-surface-2 object-contain"
    />
  );
}
