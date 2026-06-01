import type { Stat } from "../../types";
import { Icon } from "./Icon";

const accentClass: Record<NonNullable<Stat["accent"]>, string> = {
  primary: "text-primary bg-primary/10",
  secondary: "text-secondary bg-secondary/10",
  neutral: "text-on-surface bg-white/5",
};

export function StatCard({ stat }: { stat: Stat }) {
  return (
    <div className="glass-panel rounded-3xl p-6 transition hover:bg-white/[0.05]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className={`rounded-xl p-2 ${accentClass[stat.accent ?? "primary"]}`}>
          <Icon name={stat.icon} />
        </div>
        {stat.helper ? <span className="mono-label text-on-surface-variant">{stat.helper}</span> : null}
      </div>
      <p className="mono-label mb-1 text-on-surface-variant">{stat.label}</p>
      <p className="text-3xl font-bold tracking-tight text-on-surface">{stat.value}</p>
    </div>
  );
}
