import { useEffect, useState } from "react";
import { GlassCard } from "../../components/ui/GlassCard";
import { Icon } from "../../components/ui/Icon";
import { PageHeader } from "../../components/ui/PageHeader";
import { StatePanel } from "../../components/ui/StatePanel";
import { StatCard } from "../../components/ui/StatCard";
import { useI18n } from "../../features/i18n/i18n-context";
import { getApiErrorMessage } from "../../lib/api/errors";
import { fetchAdminDashboard } from "../../lib/api/admin";
import type { Stat } from "../../types";

export function AdminDashboardPage() {
  const { t } = useI18n();
  const [stats, setStats] = useState<Stat[]>([]);
  const [activity, setActivity] = useState<Array<{ name: string; detail: string; time: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminDashboard()
      .then((data) => {
        setStats(data.stats);
        setActivity(data.activity);
      })
      .catch((nextError) => setError(getApiErrorMessage(nextError, t("Unable to load admin dashboard."))))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHeader
        actions={
          <>
            <div className="glass-panel rounded-xl px-4 py-2 mono-label">
              <span className="mr-2 inline-block h-2 w-2 rounded-full bg-primary animate-pulse-soft" />
              {t("SYSTEM: ONLINE")}
            </div>
            <div className="glass-panel rounded-xl px-4 py-2 mono-label">UPTIME: 99.98%</div>
          </>
        }
        description="Monitor your sentient pet ecosystem. Real-time telemetry from active devices and neural voice engines."
        title={t("Dashboard Overview")}
      />

      <div className="mb-8 grid gap-6 md:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>
      {loading ? <div className="mb-8"><StatePanel message={t("Loading platform metrics and activity.")} title={t("Loading dashboard")} /></div> : null}
      {error ? <div className="mb-8"><StatePanel message={error} title={t("Could not load admin dashboard")} tone="error" /></div> : null}

      <div className="grid gap-8 lg:grid-cols-3">
        <GlassCard className="p-8 lg:col-span-2">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">{t("System Health")}</h3>
              <p className="text-sm text-on-surface-variant">Device connectivity and neural engine response times.</p>
            </div>
            <select className="rounded-xl border border-outline-variant/30 bg-surface-container px-3 py-2 text-sm">
              <option>{t("Last 7 Days")}</option>
              <option>{t("Last 30 Days")}</option>
            </select>
          </div>
          <div className="h-72 rounded-[1.5rem] border border-white/6 bg-black/20 p-6">
            <svg className="h-full w-full" viewBox="0 0 1000 200">
              {[0, 50, 100, 150, 200].map((y) => (
                <line key={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" x1="0" x2="1000" y1={y} y2={y} />
              ))}
              <defs>
                <linearGradient id="chartGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(71,214,255,0.2)" />
                  <stop offset="100%" stopColor="rgba(71,214,255,0)" />
                </linearGradient>
              </defs>
              <path d="M0,150 Q100,140 200,100 T400,120 T600,60 T800,80 T1000,40" fill="none" stroke="#47d6ff" strokeLinecap="round" strokeWidth="3" />
              <path d="M0,150 Q100,140 200,100 T400,120 T600,60 T800,80 T1000,40 L1000,200 L0,200 Z" fill="url(#chartGradient)" />
            </svg>
          </div>
        </GlassCard>

        <GlassCard className="p-8">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-xl font-bold">{t("Recent Activity")}</h3>
            <Icon className="text-on-surface-variant" name="more_vert" />
          </div>
          <div className="space-y-6">
            {activity.map((item) => (
              <div className="flex items-center gap-4" key={item.name + item.time}>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-primary">
                  <Icon name="bolt" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-on-surface-variant">{item.detail}</p>
                </div>
                <span className="mono-label text-primary">{item.time}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
