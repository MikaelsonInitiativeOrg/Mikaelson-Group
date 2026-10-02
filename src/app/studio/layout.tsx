import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Studio",
  robots: { index: false, follow: false },
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-[1240px] px-4 pb-10 pt-10 md:px-8 md:pt-14">{children}</div>;
}
