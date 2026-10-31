import { useEffect, useState } from "react";
import { Play, Pause, RotateCcw, Flower2 } from "lucide-react";
import ProgressRing from "../common/ProgressRing";
import { cx, formatTimer } from "../../lib/utils";

const MODES = [
  { id: "focus", label: "Foco", minutes: 25 },
  { id: "short", label: "Pausa curta", minutes: 5 },
  { id: "long", label: "Pausa longa", minutes: 15 },
];

export default function PomodoroTimer() {
  const [mode, setMode] = useState("focus");
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [cycles, setCycles] = useState(0);

  const activeMode = MODES.find((m) => m.id === mode) || MODES[0];
  const totalSeconds = activeMode.minutes * 60;

  useEffect(() => {
    if (!running) return undefined;
    const timer = window.setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => window.clearInterval(timer);
  }, [running]);

  useEffect(() => {
    if (secondsLeft > 0) return undefined;
    setRunning(false);
    if (mode === "focus") setCycles((c) => c + 1);
    setSecondsLeft(totalSeconds);
  }, [secondsLeft, mode, totalSeconds]);

  function switchMode(id) {
    const next = MODES.find((m) => m.id === id) || MODES[0];
    setMode(next.id);
    setSecondsLeft(next.minutes * 60);
    setRunning(false);
  }

  function reset() {
    setRunning(false);
    setSecondsLeft(totalSeconds);
  }

  const progress = (secondsLeft / totalSeconds) * 100;

  return (
    <div className="flex h-full flex-col items-center">
      <div className="flex gap-1 rounded-full bg-sakura p-1">
        {MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => switchMode(m.id)}
            className={cx(
              "rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-300",
              m.id === mode ? "bg-petal text-white shadow-rose" : "text-petal hover:bg-rose/30"
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-6">
        <ProgressRing value={progress} size={140} stroke={12} color="#C58FA3" track="#F4DDE5" />
        <div className="text-center">
          <p className="font-display text-4xl font-semibold text-ink">{formatTimer(secondsLeft)}</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-muted">{activeMode.label}</p>
          <p className="mt-2 text-xs text-muted">Ciclos de foco concluídos: {cycles}</p>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={() => setRunning((r) => !r)}
          aria-label={running ? "Pausar" : "Iniciar"}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-petal text-white shadow-rose transition-transform hover:scale-105 active:scale-95"
        >
          {running ? <Pause size={22} /> : <Play size={22} className="ml-0.5" />}
        </button>
        <button onClick={reset} aria-label="Reiniciar" className="flex h-12 w-12 items-center justify-center rounded-full bg-white border border-rose/40 text-petal transition hover:bg-sakura">
          <RotateCcw size={18} />
        </button>
      </div>

      <p className="mt-5 flex items-center gap-2 text-xs text-muted">
        <Flower2 size={14} className="text-petal" /> Uma flor de cada vez, foco com carinho.
      </p>
    </div>
  );
}
