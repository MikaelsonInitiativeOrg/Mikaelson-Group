import Image from "next/image";

/** The Mikaelson mark (the Initiative's logo) with an optional wordmark. */
export function Logo({ size = 32, wordmark = "Mikaelson Group" }: { size?: number; wordmark?: string | null }) {
  return (
    <span className="inline-flex items-center gap-3">
      <Image
        src="/brand/mikaelson-mark.png"
        alt=""
        width={size}
        height={size}
        className="rounded-[22%]"
        priority
      />
      {wordmark && (
        <span className="font-serif text-[1.125rem] font-medium leading-none tracking-[-0.01em] text-parchment">
          {wordmark}
        </span>
      )}
    </span>
  );
}
