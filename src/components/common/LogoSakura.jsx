import { useState } from "react";

export default function LogoSakura({ size = 48, className = "" }) {
  const [sparkle, setSparkle] = useState(false);

  // Animação sutil de brilho nas pétalas
  const petals = [
    { cx: 24, cy: 14, r: 11, ry: 7, rot: -26, fill: "#F4DDE5" },
    { cx: 38, cy: 14, r: 11, ry: 7, rot: 26, fill: "#F4DDE5" },
    { cx: 18, cy: 30, r: 11, ry: 7, rot: 26, fill: "#F4DDE5" },
    { cx: 30, cy: 30, r: 11, ry: 7, rot: -26, fill: "#F4DDE5" },
  ];

  return (
    <div className={`flex items-center justify-center rounded-3xl p-2 bg-gradient-to-br from-cream via-white to-sakura/50 border border-sakura/30 shadow-lg shadow-sakura/20 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-all duration-500 hover:scale-105 hover:drop-shadow-[0_0_12px_rgba(197,143,163,0.6)]"
      >
        <defs>
          <radialGradient id="petalGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F9E9EE" />
            <stop offset="100%" stopColor="#F4DDE5" />
          </radialGradient>
          <radialGradient id="centerGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#D9A6B8" />
            <stop offset="100%" stopColor="#C58FA3" />
          </radialGradient>
          <filter id="softBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" />
          </filter>
        </defs>

        {/* Brilho de fundo animado */}
        <circle
          cx="24"
          cy="24"
          r="20"
          fill="url(#petalGrad)"
          filter="url(#softBlur)"
          opacity={sparkle ? 0.9 : 0.6}
          animateTransform={{
            attributeName: "transform",
            type: "rotate",
            from: "0 24 24",
            to: "360 24 24",
            dur: "10s",
            repeatCount: "indefinite",
          }}
        />

        {/* Pétalas de Sakura */}
        {petals.map((p, i) => (
          <ellipse
            key={i}
            cx={p.cx}
            cy={p.cy}
            rx={p.r}
            ry={p.ry}
            fill="url(#petalGrad)"
            transform={`rotate(${p.rot} ${p.cx} ${p.cy})`}
            stroke="url(#centerGrad)"
            strokeWidth="1"
            opacity={sparkle ? 1 : 0.9}
            className="transition-opacity duration-300 hover:opacity-100"
          />
        ))}

        {/* Centro da flor */}
        <circle cx="24" cy="24" r="4.5" fill="url(#centerGrad)" stroke="#C58FA3" strokeWidth="1.5" />

        {/* Pontos no centro */}
        {[1, 2, 3].map((i) => (
          <circle
            key={i}
            cx={24 + Math.cos((i * 2 * Math.PI) / 3) * 2}
            cy={24 + Math.sin((i * 2 * Math.PI) / 3) * 2}
            r="1"
            fill="#C58FA3"
            opacity="0.8"
          />
        ))}

        {/* Estrelinha de brilho */}
        {sparkle && (
          <g stroke="#FFF" strokeWidth="2" strokeLinecap="round" opacity="0.9">
            <line x1="18" y1="24" x2="13" y2="24" />
            <line x1="30" y1="24" x2="35" y2="24" />
            <line x1="24" y1="18" x2="24" y2="13" />
            <line x1="24" y1="30" x2="24" y2="35" />
          </g>
        )}
      </svg>

      <span className="ml-3 h-study-display text-lg font-bold text-ink tracking-tight">
        Her Study Space
      </span>
    </div>
  );
}
