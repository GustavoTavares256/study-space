import { useMemo } from "react";

const PETALS = Array.from({ length: 9 }, (_, i) => ({
  id: i,
  left: `${4 + ((i * 13) % 88)}%`,
  size: 14 + ((i * 7) % 16),
  duration: `${13 + ((i * 5) % 8)}s`,
  delay: `${-((i * 3.7) % 14)}s`,
  drift: `${20 + ((i * 11) % 30)}px`,
  opacity: 0.35 + ((i * 7) % 30) / 100,
}));

export default function SakuraBackground() {
  const petals = useMemo(
    () =>
      PETALS.map((p) => (
        <span
          key={p.id}
          className="absolute top-0 rounded-full"
          style={{
            left: p.left,
            width: p.size,
            height: p.size * 1.4,
            background: "radial-gradient(circle at 35% 35%, #ffffff 0%, #F4DDE5 55%, #E7C3D2 100%)",
            opacity: p.opacity,
            animation: `petal-fall ${p.duration} linear infinite`,
            animationDelay: `${p.delay}s`,
            "--drift": `${p.drift}px`,
          }}
        />
      )),
    []
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {petals}
      <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-rose/20 blur-3xl" />
      <div className="absolute -bottom-48 -left-40 h-[28rem] w-[28rem] rounded-full bg-sage/20 blur-3xl" />
      <div className="absolute top-1/3 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-rose/10 blur-3xl" />
    </div>
  );
}
