import { useState } from "react";
import { Flower2 } from "lucide-react";
import Card from "../common/Card";
import SectionHeader from "../common/SectionHeader";
import { randomPhrase } from "../../lib/utils";

export default function ReminderCard() {
  const [phrase] = useState(() => randomPhrase());
  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-sakura to-white">
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-rose/20 blur-2xl" />
      <div className="relative flex items-center gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-petal shadow-soft">
          <Flower2 size={22} />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-petal">Um lembrete para você</p>
          <p className="font-display text-lg font-semibold text-ink">{phrase}</p>
        </div>
      </div>
    </Card>
  );
}
