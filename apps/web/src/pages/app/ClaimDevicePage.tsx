import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "../../components/ui/Icon";
import { useI18n } from "../../features/i18n/i18n-context";
import { getApiErrorMessage } from "../../lib/api/errors";
import { claimDevice } from "../../lib/api/user";

export function ClaimDevicePage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [serial, setSerial] = useState("DV-4021");
  const [code, setCode] = useState("PAIR-7781");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);
    setError(null);

    try {
      const result = await claimDevice({ serialNumber: serial, productCode: code });
      setMessage(`Device ${result.device.serialNumber} linked successfully.`);
      setSerial(result.device.serialNumber);
      navigate(`/app/pets/${result.pet.id}`, { replace: true });
    } catch (nextError) {
      setError(getApiErrorMessage(nextError, t("Unable to claim device.")));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto flex max-w-[86rem] flex-col items-center px-4 py-10 md:px-8 md:py-16">
      <div className="mb-14 space-y-4 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
          <span className="mono-label text-[10px] uppercase tracking-[0.2em] text-primary">{t("New Hardware Detected")}</span>
        </div>
        <h2 className="text-4xl font-semibold tracking-tight text-on-surface md:text-6xl">{t("Expand Your Pet Ecosystem")}</h2>
        <p className="mx-auto max-w-xl text-lg text-on-surface-variant">
          Link your new PetAI sentient collar or environment monitor to your dashboard in seconds.
        </p>
      </div>

      <form
        className="relative w-full overflow-hidden rounded-[38px] border border-white/70 bg-[linear-gradient(135deg,rgba(42,42,42,0.96)_0%,rgba(39,37,40,0.94)_62%,rgba(73,28,112,0.9)_100%)] px-8 py-10 shadow-[0_30px_90px_rgba(0,0,0,0.28)] md:px-14 md:py-16"
        onSubmit={onSubmit}
      >
        <div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:radial-gradient(circle_at_18%_24%,rgba(117,238,255,0.55)_0,transparent_28%),linear-gradient(135deg,transparent_0%,rgba(103,32,153,0.32)_100%)]" />
        <div className="relative grid items-center gap-10 xl:grid-cols-[1.08fr_0.92fr]">
          <div className="group relative flex w-full justify-center xl:justify-start">
            <div className="absolute left-[14%] top-[12%] h-72 w-72 rounded-full bg-primary/16 blur-[90px] transition-transform duration-700 group-hover:scale-90" />
            <div className="relative w-full max-w-[32rem] overflow-hidden rounded-[28px] border border-outline-variant/35 bg-[linear-gradient(180deg,rgba(32,34,39,0.95)_0%,rgba(23,25,28,0.92)_100%)] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-sm">
              <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[26px]">
                <img
                  alt="PetAI Device"
                  className="h-full w-full rounded-[22px] object-cover opacity-90 transition-opacity duration-500 group-hover:opacity-100"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhl52PufmF0xo_XR5IWJ8yY8SN7Eku2hLzQ4vc2Xu8ylMEyQoNsA7jS7els95uvE0zDkt7_2tU07TJQ6Z3r9Gt81Giwxx87M7zRey7Ylg3FN2cI9n3kCCNdjyk5vfTq6wKiOitjrXF_ugOGKxQy0MbL_aAvw0j7Q4ZvN5JeMlVNOEAja8EGb3PuNR_Hm5q5DQMmTzhovz_k5H1--DcPT3WmUmoAmykH8ESgG1mdinfEmXlTeKJEghmVT2orHndud-AMOeLmXxNDe7_"
                />
                <div className="absolute inset-x-10 bottom-9 rounded-[18px] border border-outline-variant/35 bg-black/55 px-6 py-5 backdrop-blur-md">
                  <p className="mono-label text-[11px] tracking-[0.34em] text-[#b8ebff]">SCANNING FOR SIGNAL...</p>
                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#3d3e3c]">
                    <div className="h-full w-[33%] rounded-full bg-[#a8e9ff]" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto flex w-full max-w-[34rem] flex-col gap-8 xl:max-w-none">
            <div className="space-y-4">
              <label className="mono-label block text-[16px] uppercase tracking-[0.24em] text-[#c0ccd4]" htmlFor="serial-number">
                {t("Serial Number")}
              </label>
              <input
                className="w-full rounded-[22px] border border-black/40 bg-black px-9 py-6 text-[24px] tracking-[0.12em] text-[#a9e4ff] outline-none transition-all placeholder:tracking-[0.12em] placeholder:text-[#45667b] focus:border-primary focus:ring-1 focus:ring-primary/40"
                id="serial-number"
                onChange={(event) => setSerial(event.target.value.toUpperCase().slice(0, 16))}
                placeholder="DV-4021"
                value={serial}
              />
            </div>

            <div className="space-y-4">
              <label className="mono-label block text-[16px] uppercase tracking-[0.24em] text-[#c0ccd4]" htmlFor="product-code">
                {t("Product Code")}
              </label>
              <div className="group relative">
                <input
                  className="w-full rounded-[22px] border border-black/40 bg-black px-9 py-8 text-[32px] tracking-[0.14em] text-[#a9e4ff] outline-none transition-all placeholder:tracking-[0.14em] placeholder:text-[#45667b] focus:border-primary focus:ring-1 focus:ring-primary/40"
                  id="product-code"
                  onChange={(event) => setCode(event.target.value.toUpperCase().slice(0, 12))}
                  placeholder="PAIR-7781"
                  value={code}
                />
                <div className="pointer-events-none absolute right-7 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-focus-within:opacity-100">
                  <Icon className="text-primary" name="qr_code_scanner" />
                </div>
              </div>
            </div>

            <div className="flex gap-5 rounded-[22px] border border-outline-variant/15 bg-[rgba(30,31,31,0.88)] px-6 py-7">
              <Icon className="mt-0.5 shrink-0 text-[34px] text-secondary" name="info" />
              <p className="text-[17px] leading-[1.65] text-[#c9d1d7]">
                Enter the unique <span className="font-bold text-on-surface">12-digit code</span> found on your PetAI device&apos;s base or
                packaging. Ensure your device is powered on.
              </p>
            </div>

            <button
              className="flex w-full items-center justify-center gap-4 rounded-[24px] bg-white py-7 text-[24px] font-bold text-black transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
              disabled={submitting}
              type="submit"
            >
              {submitting ? t("Claiming Device...") : t("Claim Device")}
              <Icon className="text-[34px] text-black" name="arrow_forward" />
            </button>

            {message ? (
              <div className="rounded-[22px] border border-primary/30 bg-primary/10 px-6 py-5 text-base text-primary">
                {message} Connected as <span className="font-semibold">{serial}</span>.
              </div>
            ) : null}

            {error ? <div className="rounded-[22px] border border-[#a16e75] bg-[rgba(95,63,66,0.44)] px-6 py-5 text-base leading-relaxed text-[#ffc0b8]">{error}</div> : null}

            <div className="flex items-center justify-center gap-8 pt-10">
              <div className="flex items-center gap-2">
                <Icon className="text-[16px] text-outline" name="verified" />
                <span className="mono-label text-[11px] uppercase tracking-[0.28em] text-outline">{t("Secure Protocol")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon className="text-[16px] text-outline" name="sync" />
                <span className="mono-label text-[11px] uppercase tracking-[0.28em] text-outline">{t("Instant Pairing")}</span>
              </div>
            </div>
          </div>
        </div>
      </form>

      <div className="mt-stack-lg grid w-full grid-cols-1 gap-8 md:grid-cols-3">
        {[
          {
            icon: "help_center",
            title: "Can't find your code?",
            body: "Learn where to locate the 12-digit identification number on different device models.",
          },
          {
            icon: "bluetooth_searching",
            title: "Pair via Bluetooth",
            body: "Alternatively, use the PetAI mobile app to automatically detect devices near you.",
          },
          {
            icon: "support_agent",
            title: "Contact Concierge",
            body: "Having trouble? Our sentient support agents are available 24/7 to assist with activation.",
          },
        ].map((item) => (
          <div
            className="rounded-3xl border border-white/8 bg-white/[0.03] p-8 backdrop-blur-[40px] transition-colors hover:border-primary/40"
            key={item.title}
          >
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-container-highest">
              <Icon className="text-primary" name={item.icon} />
            </div>
            <h4 className="mb-2 font-bold text-on-surface">{item.title}</h4>
            <p className="text-sm text-on-surface-variant">{item.body}</p>
          </div>
        ))}
      </div>

      <footer className="mt-section-gap px-container-padding pb-12 opacity-40">
        <div className="flex items-center justify-center gap-4">
          <div className="h-px w-12 bg-outline-variant" />
          <p className="mono-label text-[10px] uppercase tracking-[0.3em]">Powered by PetAI Neural Core v4.2</p>
          <div className="h-px w-12 bg-outline-variant" />
        </div>
      </footer>
    </section>
  );
}
