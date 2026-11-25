import type { CSSProperties } from "react";
import "./SpaceBackground.css";

// Seeded random numbers: the same stars appear on every load
function createRandom(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const random = createRandom(2026);

const stars = Array.from({ length: 120 }, (_, i) => {
  const size = 1 + random() * 2.4;
  const roll = random();
  return {
    id: i,
    left: (random() * 100).toFixed(2),
    top: (random() * 100).toFixed(2),
    size: size.toFixed(1),
    rise: Math.round(14 + random() * 46), // how far it moves up and down
    drift: (6 + random() * 10).toFixed(1),
    twinkle: (2 + random() * 4).toFixed(1),
    delay: (-random() * 14).toFixed(1),
    tone: roll > 0.9 ? "warm" : roll > 0.55 ? "cool" : "",
    big: size > 2.4,
  };
});

const shooting = [
  { top: "8%", left: "12%", dur: "14s", delay: "2s" },
  { top: "22%", left: "48%", dur: "18s", delay: "9s" },
  { top: "5%", left: "70%", dur: "16s", delay: "5s" },
];

export default function SpaceBackground() {
  return (
    <div className="space-bg" aria-hidden="true">
      {stars.map((s) => (
        <span
          key={s.id}
          className={`star ${s.tone} ${s.big ? "big" : ""}`}
          style={
            {
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              "--rise": `${s.rise}px`,
              "--drift": `${s.drift}s`,
              "--twinkle": `${s.twinkle}s`,
              "--delay": `${s.delay}s`,
            } as CSSProperties
          }
        />
      ))}

      {shooting.map((s, i) => (
        <span
          key={i}
          className="shooting"
          style={
            {
              top: s.top,
              left: s.left,
              "--dur": s.dur,
              "--delay": s.delay,
            } as CSSProperties
          }
        />
      ))}

      <span className="planet planet-saturn" />
      <span className="planet planet-blue" />
      <span className="planet planet-violet" />
      <span className="planet planet-orange" />
      <span className="planet planet-moon" />
    </div>
  );
}