import Image from "next/image";

const BLOB_HOST = /^https:\/\/[^/]+\.public\.blob\.vercel-storage\.com\//;

/**
 * A post's cover, filling a positioned parent. Covers from the Vercel Blob
 * store go through next/image; any other https URL is shown as a plain img
 * because next/image only optimises allow-listed hosts.
 */
export function CoverImage({
  src,
  alt,
  sizes,
  priority = false,
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
}) {
  if (BLOB_HOST.test(src)) {
    return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />;
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading={priority ? "eager" : "lazy"} className="absolute inset-0 h-full w-full object-cover" />;
}
