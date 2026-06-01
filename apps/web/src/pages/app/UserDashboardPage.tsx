import { useEffect, useState } from "react";
import { GlassCard } from "../../components/ui/GlassCard";
import { Icon } from "../../components/ui/Icon";
import { StatePanel } from "../../components/ui/StatePanel";
import { StatCard } from "../../components/ui/StatCard";
import { WaveBars } from "../../components/ui/WaveBars";
import { useI18n } from "../../features/i18n/i18n-context";
import { getApiErrorMessage } from "../../lib/api/errors";
import { fetchUserDashboard } from "../../lib/api/user";
import type { Stat } from "../../types";

export function UserDashboardPage() {
  const { t } = useI18n();
  const [stats, setStats] = useState<Stat[]>([]);
  const [activity, setActivity] = useState<Array<{ title: string; description: string; timestamp: string; icon: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserDashboard()
      .then((data) => {
        setStats(data.stats);
        setActivity(data.activity);
      })
      .catch((nextError) => setError(getApiErrorMessage(nextError, t("Unable to load dashboard."))))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <h1 className="text-4xl font-bold md:text-5xl">{t("System Overview")}</h1>
          <span className="rounded border border-secondary/30 px-2 py-0.5 mono-label text-secondary">BETA-09</span>
        </div>
        <p className="mt-3 max-w-2xl text-on-surface-variant">
          Manage your pet&apos;s digital consciousness and physical interactions through the unified Sentient Tech interface.
        </p>
      </div>

      <div className="mb-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>
      {loading ? <div className="mb-8"><StatePanel message={t("Loading your connected dashboard data.")} title={t("Loading dashboard")} /></div> : null}
      {error ? <div className="mb-8"><StatePanel message={error} title={t("Could not load dashboard")} tone="error" /></div> : null}

      <div className="grid gap-8 lg:grid-cols-12">
        <GlassCard className="overflow-hidden lg:col-span-8">
          <div className="grid md:grid-cols-2">
            <div className="relative h-[400px] overflow-hidden">
              <img
                alt="Luna AI Companion"
                className="h-full w-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5olBHDTPziYWikJkbAHuZQONrA4M1dTaZPiVG1Ni2_gGheQjAuYfUxBa9dwn753LMBCmkWzN3ce7MaQHMS2hm2uBMFixC1eCftnoESjrGksBP8zwdAGz_EQ9HoLgafnavQ6IHaelhYxJFycib7eSgITENIIMRRvbbhd0iRWBjpHKywIpgGtIW7Yt-e6gw1yvPcYX8XKuyQgMbmGrNLqs7QaGDFu3VX1-K990kTXz7oqpBicqkm5KkgNkjhVr4xKBYu9RjvtBi54LN"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-primary bg-black/30 text-primary">
                  <Icon name="auto_awesome" />
                </div>
                <h2 className="text-3xl font-bold">{activity[0]?.title.split(" ")[0] ?? "PetAI"}</h2>
                <p className="mono-label text-primary/80">{stats[0]?.value ? `${stats[0].value} bonded pets` : "Awaiting data"}</p>
              </div>
            </div>
            <div className="flex flex-col justify-center gap-6 p-8">
              {[
                ["CURRENT_PROFILE", stats[3]?.value ?? "Pending", "85%", "bg-primary"],
                ["REGISTERED_PETS", stats[0]?.value ?? "0", "92%", "bg-secondary"],
                ["CONNECTED_DEVICES", stats[1]?.value ?? "0", "100%", "bg-emerald-400/80"],
              ].map(([label, value, width, bar]) => (
                <div className="space-y-3" key={label}>
                  <div className="flex justify-between">
                    <span className="mono-label text-on-surface-variant">{label}</span>
                    <span className="font-semibold">{value}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                    <div className={`h-full ${bar}`} style={{ width }} />
                  </div>
                </div>
              ))}
              <div className="mt-4 flex gap-3">
                <button className="btn-primary flex-1">
                  <Icon name="play_arrow" />
                  Begin Interaction
                </button>
                <button className="btn-secondary !px-0 w-12">
                  <Icon name="settings" />
                </button>
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="flex flex-col gap-6 p-8 lg:col-span-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">{t("Recent Activity")}</h3>
            <Icon className="text-on-surface-variant" name="more_horiz" />
          </div>
          {activity.map((item) => (
            <div className="flex gap-4" key={item.title}>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
                <Icon className="text-sm" name={item.icon} />
              </div>
              <div>
                <p className="font-semibold">{item.title}</p>
                <p className="text-sm text-on-surface-variant">{item.description}</p>
                <span className="mono-label mt-2 block text-primary">{item.timestamp}</span>
              </div>
            </div>
          ))}
        </GlassCard>
      </div>

      <GlassCard className="mx-auto mt-12 flex max-w-3xl items-center gap-6 rounded-full p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-black shadow-[0_0_20px_rgba(165,231,255,0.35)]">
          <Icon filled name="mic" />
        </div>
        <WaveBars className="h-8 flex-1" />
        <div className="hidden items-center gap-2 pr-4 md:flex">
          <span className="text-sm font-semibold">{t("VOICE ACTIVE")}</span>
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse-soft" />
        </div>
      </GlassCard>
    </div>
  );
}
