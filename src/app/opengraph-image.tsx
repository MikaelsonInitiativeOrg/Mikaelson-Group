import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/** The card shown when a page is shared (and a large-image candidate for search). */
export const alt = "Mikaelson Group: Human capability is infrastructure.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), "public/brand/mikaelson-mark.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#050a0a",
          color: "#e9e1d8",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <img src={logoSrc} width={88} height={88} style={{ borderRadius: 20 }} alt="" />
          <div style={{ fontSize: 40, letterSpacing: -0.5 }}>Mikaelson Group</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", fontSize: 72, lineHeight: 1.08, letterSpacing: -2 }}>
          <div>Human capability is infrastructure.</div>
          <div style={{ color: "#5ce1e6" }}>It can be studied, built and handed on.</div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid #26403f",
            paddingTop: 24,
            fontSize: 24,
            color: "#a3b2b3",
          }}
        >
          <div>Frameworks · Research · The Mikaelson Initiative</div>
          <div>mikaelsongroup.com</div>
        </div>
      </div>
    ),
    size,
  );
}
