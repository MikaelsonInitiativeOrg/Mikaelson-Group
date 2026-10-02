import type { ReactNode } from "react";

/*
  Renders post bodies written in the Studio. Shared by the public post page
  and the Studio preview, so it has no hooks and no server-only imports.

  Blocks (separated by a blank line):
    ## Heading  ### Subheading        > Quotation
    - item / * item                   1. item
    ---  (a rule)                     ![Caption](https://image-url)
  Inline:  **bold**  *italic*  `code`  [text](https://link)

  Output is React elements only (no HTML injection). Links and images
  are kept only for https:, http:, mailto:, site-relative and # targets.
*/

export function safeUrl(url: string) {
  const u = url.trim();
  if (/^(https?:|mailto:)/i.test(u) || (u.startsWith("/") && !u.startsWith("//")) || u.startsWith("#")) return u;
  return null;
}

const INLINE = /(\*\*[^*]+\*\*)|(`[^`]+`)|(\[[^\]]+\]\([^)\s]+\))|(\*[^*\s][^*]*\*)|(_[^_\s][^_]*_)/;

function inline(text: string, key = "i"): ReactNode[] {
  const out: ReactNode[] = [];
  let rest = text;
  let n = 0;
  while (rest) {
    const m = INLINE.exec(rest);
    if (!m) {
      out.push(rest);
      break;
    }
    if (m.index > 0) out.push(rest.slice(0, m.index));
    const tok = m[0];
    const k = `${key}-${n++}`;
    if (m[1]) out.push(<strong key={k}>{inline(tok.slice(2, -2), k)}</strong>);
    else if (m[2]) out.push(<code key={k}>{tok.slice(1, -1)}</code>);
    else if (m[3]) {
      const [, label, href] = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(tok)!;
      const safe = safeUrl(href);
      if (!safe) out.push(label);
      else {
        const external = /^https?:/i.test(safe);
        out.push(
          <a key={k} href={safe} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
            {inline(label, k)}
          </a>,
        );
      }
    } else out.push(<em key={k}>{inline(tok.slice(1, -1), k)}</em>);
    rest = rest.slice(m.index + tok.length);
  }
  return out;
}

function lines(block: string) {
  return block.split("\n").map((l) => l.trimEnd());
}

function withBreaks(text: string, key: string) {
  const parts = text.split("\n");
  return parts.flatMap((p, i) => (i === 0 ? inline(p, `${key}-${i}`) : [<br key={`${key}-br${i}`} />, ...inline(p, `${key}-${i}`)]));
}

export function ArticleBody({ body }: { body: string }) {
  const blocks = body.replace(/\r\n?/g, "\n").split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);

  return (
    <div className="article">
      {blocks.map((block, i) => {
        const key = `b${i}`;
        if (/^(-{3,}|\*{3,}|_{3,})$/.test(block)) return <hr key={key} />;

        const heading = /^(#{1,3})\s+(.+)$/.exec(block);
        if (heading && !block.includes("\n")) {
          return heading[1].length === 3 ? (
            <h3 key={key}>{inline(heading[2], key)}</h3>
          ) : (
            <h2 key={key}>{inline(heading[2], key)}</h2>
          );
        }

        const image = /^!\[([^\]]*)\]\(([^)\s]+)\)$/.exec(block);
        if (image) {
          const src = safeUrl(image[2]);
          if (!src) return null;
          return (
            <figure key={key}>
              {/* Body images have no known dimensions, so next/image does not fit. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt={image[1]} loading="lazy" />
              {image[1] && <figcaption>{image[1]}</figcaption>}
            </figure>
          );
        }

        const ls = lines(block);
        if (ls.every((l) => l.startsWith(">"))) {
          const text = ls.map((l) => l.replace(/^>\s?/, "")).join("\n");
          return <blockquote key={key}><p>{withBreaks(text, key)}</p></blockquote>;
        }
        if (ls.every((l) => /^[-*]\s+/.test(l))) {
          return <ul key={key}>{ls.map((l, j) => <li key={j}>{inline(l.replace(/^[-*]\s+/, ""), `${key}-${j}`)}</li>)}</ul>;
        }
        if (ls.every((l) => /^\d+[.)]\s+/.test(l))) {
          return <ol key={key}>{ls.map((l, j) => <li key={j}>{inline(l.replace(/^\d+[.)]\s+/, ""), `${key}-${j}`)}</li>)}</ol>;
        }
        return <p key={key}>{withBreaks(block, key)}</p>;
      })}
    </div>
  );
}

/** Minutes to read, at about 220 words a minute. */
export function readingMinutes(body: string) {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export function formatDate(isoDate: string | null) {
  if (!isoDate) return "Unpublished";
  return new Date(isoDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Lagos" });
}
