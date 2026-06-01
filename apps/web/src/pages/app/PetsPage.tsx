import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../../components/ui/Icon";
import { StatePanel } from "../../components/ui/StatePanel";
import { useI18n } from "../../features/i18n/i18n-context";
import { getApiErrorMessage } from "../../lib/api/errors";
import { getPetAvatar } from "../../lib/pet-visuals";
import { fetchPets } from "../../lib/api/user";
import type { Pet } from "../../types";

function PetCard({ pet, index }: { pet: Pet; index: number }) {
  const { t } = useI18n();
  const visual = {
    image: getPetAvatar(pet),
    tone: index % 2 === 0 ? ("active" as const) : ("standby" as const),
    sync: index % 2 === 0 ? "99.8%" : "100%",
    gender: index % 2 === 0 ? "Female" : "Male",
    genderIcon: index % 2 === 0 ? "female" : "male",
  };
  const voiceName = pet.voice?.name ?? "Unassigned";
  const statusPill =
    visual.tone === "active"
      ? "border-primary/20 bg-primary/10 text-primary"
      : "border-outline-variant/30 bg-surface-container-high text-on-surface-variant";

  return (
    <div className="group flex min-h-[360px] flex-col rounded-[32px] border border-white/8 bg-white/[0.03] p-8 shadow-[0_18px_50px_rgba(0,0,0,0.18)] backdrop-blur-[40px] transition-all duration-300 hover:-translate-y-1 hover:border-primary/20">
      <div className="mb-6 flex items-start justify-between">
        <div className="relative h-24 w-24 overflow-hidden rounded-2xl border border-outline-variant/30">
          <img alt={`${pet.name} avatar`} className="h-full w-full object-cover" src={visual.image} />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/80 to-transparent" />
        </div>
        <div className="flex flex-col items-end">
          <div className={`mb-2 flex items-center gap-2 rounded-full border px-3 py-1 ${statusPill}`}>
            <div className={visual.tone === "active" ? "h-1.5 w-1.5 animate-pulse rounded-full bg-primary" : "h-1.5 w-1.5 rounded-full bg-on-surface-variant"} />
            <span className="mono-label text-[10px] uppercase">{visual.tone === "active" ? t("Active") : t("Standby")}</span>
          </div>
          <span className="mono-label text-[10px] text-on-surface-variant">SYNCED: {visual.sync}</span>
        </div>
      </div>

      <div className="mb-8">
        <h4 className="mb-1 text-[54px] font-bold leading-none tracking-tight text-on-surface sm:text-[42px]">{pet.name}</h4>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Icon className={`text-base ${visual.tone === "active" ? "text-secondary" : "text-primary"}`} name={visual.genderIcon} />
            <span className="text-sm text-on-surface-variant">{visual.gender}</span>
          </div>
          <div className="h-3 w-px bg-outline-variant/40" />
          <div className="flex items-center gap-1.5">
            <Icon className={`text-base ${visual.tone === "active" ? "text-primary" : "text-secondary"}`} name="record_voice_over" />
            <span className="text-sm text-on-surface-variant">{t("Voice")}: {voiceName}</span>
          </div>
        </div>
      </div>

      <div className="mt-auto">
        <Link
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-on-surface py-4 text-lg font-bold text-surface transition-all hover:shadow-[0_0_20px_rgba(165,231,255,0.4)] active:scale-[0.98]"
          to={`/app/pets/${pet.id}`}
        >
          {t("Manage Pet")}
          <Icon className="text-lg text-surface" name="settings" />
        </Link>
      </div>
    </div>
  );
}

function EmptyClaimCard() {
  const { t } = useI18n();
  return (
    <Link
      className="group flex min-h-[360px] flex-col items-center justify-center rounded-[32px] border-2 border-dashed border-outline-variant/30 p-8 text-center transition-all hover:border-primary/50 hover:bg-primary/5"
      to="/app/claim-device"
    >
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-surface-container transition-transform group-hover:scale-110">
        <Icon className="text-4xl text-on-surface-variant transition-colors group-hover:text-primary" name="add" />
      </div>
      <h4 className="mb-2 text-2xl font-bold text-on-surface">{t("Claim New Device")}</h4>
      <p className="max-w-[220px] text-sm text-on-surface-variant">
        Scan the QR code on your PetAI hardware to begin the synchronization process.
      </p>
    </Link>
  );
}

export function PetsPage() {
  const { t } = useI18n();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPets()
      .then(setPets)
      .catch((nextError) => setError(getApiErrorMessage(nextError, t("Unable to load pets."))))
      .finally(() => setLoading(false));
  }, []);

  const connectedPets = pets.filter((pet) => pet.device).length;
  const totalVoices = new Set(pets.map((pet) => pet.voice?.name).filter(Boolean)).size;

  return (
    <section className="mx-auto max-w-[1200px]">
      <div className="mb-12">
        <div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-widest text-on-surface-variant">
          <span className="mono-label">{t("Ecosystem")}</span>
          <Icon className="text-[10px]" name="chevron_right" />
          <span className="mono-label text-primary">{t("Companion Nodes")}</span>
        </div>
        <h3 className="text-5xl font-bold tracking-tight text-on-surface md:text-6xl">{t("My Sentient Pets")}</h3>
        <p className="mt-4 max-w-2xl text-[20px] leading-[1.6] text-on-surface-variant">
          Monitor and interact with your digital-physical hybrid companions. Each PetAI instance is encrypted and synced with your neural profile.
        </p>
      </div>

      {loading ? <div className="mb-8"><StatePanel message={t("Loading your connected pets from the API.")} title={t("Loading pets")} /></div> : null}
      {error ? <div className="mb-8"><StatePanel message={error} title={t("Could not load pets")} tone="error" /></div> : null}

      {!loading && !error ? (
        <>
          <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 xl:grid-cols-3">
            {pets.slice(0, 2).map((pet, index) => (
              <PetCard index={index} key={pet.id} pet={pet} />
            ))}
            <EmptyClaimCard />
            {pets.slice(2).map((pet, index) => (
              <PetCard index={index + 2} key={pet.id} pet={pet} />
            ))}
          </div>

          {pets.length === 0 ? (
            <div className="mt-8">
              <StatePanel message={t("Claim a device and create your first pet profile to populate this view.")} title={t("No pets yet")} />
            </div>
          ) : null}

          <div className="mt-section-gap grid grid-cols-1 gap-gutter lg:grid-cols-4">
            <div className="rounded-3xl border border-white/8 bg-white/[0.03] p-6 backdrop-blur-[40px] lg:col-span-2">
              <div className="mb-8 flex items-center justify-between">
                <h5 className="font-bold text-on-surface">Neural Harmony Status</h5>
                <Icon className="text-primary" name="insights" />
              </div>
              <div className="mb-4 flex h-32 items-end gap-1">
                {[40, 65, 50, 85, 70, 95, 80].map((height) => (
                  <div className="flex-1 rounded-t-sm bg-primary/20 transition-all hover:bg-primary/40" key={height} style={{ height: `${height}%` }} />
                ))}
              </div>
              <p className="mono-label text-[11px] uppercase text-on-surface-variant">Connection Stability: Excellent (98ms latency)</p>
            </div>

            <div className="rounded-3xl border border-white/8 bg-white/[0.03] p-6 backdrop-blur-[40px]">
              <p className="mono-label mb-1 text-[10px] uppercase text-on-surface-variant">Total Interaction</p>
              <h5 className="mb-4 text-3xl font-bold text-primary">{String(pets.length * 206 || 0)} hrs</h5>
              <div className="h-1 w-full rounded-full bg-surface-container">
                <div className="h-1 rounded-full bg-secondary" style={{ width: `${Math.min(100, 35 + pets.length * 18)}%` }} />
              </div>
              <p className="mt-4 text-[11px] text-on-surface-variant">Level {Math.max(1, pets.length * 7)} Sentience Bridge reached</p>
            </div>

            <div className="flex flex-col justify-between rounded-3xl border border-white/8 bg-white/[0.03] p-6 backdrop-blur-[40px]">
              <div>
                <p className="mono-label mb-1 text-[10px] uppercase text-on-surface-variant">Active Sensors</p>
                <h5 className="text-3xl font-bold text-on-surface">{`${Math.max(connectedPets * 4, 0)}/${Math.max(connectedPets * 4, 0) || 12}`}</h5>
              </div>
              <div className="-space-x-2 flex">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-surface bg-primary/30">
                  <Icon className="text-[14px]" name="videocam" />
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-surface bg-secondary/30">
                  <Icon className="text-[14px]" name="mic" />
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-surface bg-primary-container/30">
                  <Icon className="text-[14px]" name="thermostat" />
                </div>
              </div>
              <p className="mt-4 text-xs text-on-surface-variant">{totalVoices || 1} voice channels synchronized across your claimed devices.</p>
            </div>
          </div>
        </>
      ) : null}
    </section>
  );
}
