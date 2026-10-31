import { BarChart, Bar, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "../common/Card";
import SectionHeader from "../common/SectionHeader";

export default function WeeklyChart({ data }) {
  return (
    <Card className="h-full">
      <SectionHeader title="Produtividade semanal" subtitle="Horas de estudo por dia" />
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
            <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#987D88" }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#987D88" }} axisLine={false} tickLine={false} />
            <Tooltip
              cursor={{ fill: "rgba(244, 221, 229, 0.45)" }}
              contentStyle={{ borderRadius: 16, border: "1px solid #F4DDE5", background: "#FFFFFF" }}
            />
            <Bar dataKey="hours" name="Horas" radius={[8, 8, 0, 0]} maxBarSize={34}>
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.hours > 0 ? "#C58FA3" : "#F4DDE5"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
