import styles from "./engine-diagram.module.css";

const R = 130;
const LEFT = 210;
const RIGHT = 350;
const CY = 200;

/** Instrument ticks around a ring, every 10°, longer every 90°. */
function ticks(cx: number) {
  return Array.from({ length: 36 }, (_, i) => {
    const a = (i * 10 * Math.PI) / 180;
    const long = i % 9 === 0;
    const r1 = R + 8;
    const r2 = R + (long ? 20 : 13);
    const f = (n: number) => Math.round(n * 100) / 100;
    return (
      <line
        key={i}
        x1={f(cx + r1 * Math.cos(a))}
        y1={f(CY + r1 * Math.sin(a))}
        x2={f(cx + r2 * Math.cos(a))}
        y2={f(CY + r2 * Math.sin(a))}
        strokeWidth={long ? 1.25 : 1}
      />
    );
  });
}

// Intersection of the two rings: x = 280, y = 200 ± √(130² − 70²).
const LENS = "M280 90.46 A130 130 0 0 1 280 309.54 A130 130 0 0 1 280 90.46 Z";

export function EngineDiagram() {
  return (
    <figure className="relative">
      <svg
        viewBox="40 40 480 320"
        className="h-auto w-full"
        role="img"
        aria-labelledby="engine-diagram-title"
      >
        <title id="engine-diagram-title">
          Two overlapping rings: Mikaelson Group and the Mikaelson Initiative. Their overlap is human capability.
        </title>
        <g className="stroke-rule-strong">{ticks(LEFT)}</g>
        <g className="stroke-rule-strong">{ticks(RIGHT)}</g>

        <path d={LENS} className={`${styles.lens} fill-turquoise/12`} />
        <path d={LENS} className={`${styles.lens} fill-none stroke-turquoise/50`} strokeWidth={1} strokeDasharray="3 4" />

        <circle
          cx={LEFT}
          cy={CY}
          r={R}
          pathLength={1}
          transform={`rotate(-90 ${LEFT} ${CY})`}
          className={`${styles.ring} fill-none stroke-parchment`}
          strokeWidth={1.5}
        />
        <circle
          cx={RIGHT}
          cy={CY}
          r={R}
          pathLength={1}
          transform={`rotate(90 ${RIGHT} ${CY})`}
          className={`${styles.ring} ${styles.ringTwo} fill-none stroke-turquoise`}
          strokeWidth={1.5}
        />

        <g className={`${styles.mark} font-serif`} textAnchor="middle">
          <text x={LEFT - 52} y={CY + 12} className="fill-parchment text-[34px] italic">
            I
          </text>
          <text x={RIGHT + 52} y={CY + 12} className="fill-turquoise text-[34px] italic">
            II
          </text>
          <circle cx={280} cy={CY} r={3} className="fill-turquoise" />
        </g>
      </svg>

      <figcaption className="mt-6 grid grid-cols-3 gap-3 border-t border-rule pt-4">
        <div className={styles.legend} style={{ "--i": 0 } as React.CSSProperties}>
          <p className="meta text-parchment">I · Mikaelson Group</p>
          <p className="meta mt-1">Articulates</p>
        </div>
        <div className={`${styles.legend} text-center`} style={{ "--i": 1 } as React.CSSProperties}>
          <p className="meta text-turquoise">Capability</p>
          <p className="meta mt-1">The overlap</p>
        </div>
        <div className={`${styles.legend} text-right`} style={{ "--i": 2 } as React.CSSProperties}>
          <p className="meta text-parchment">II · The Initiative</p>
          <p className="meta mt-1">Tests in public</p>
        </div>
      </figcaption>
    </figure>
  );
}
