import { WaveBars } from "../ui/WaveBars";

export function AuthSplitLayout({
  title,
  subtitle,
  imageUrl,
  children,
}: {
  title: string;
  subtitle: string;
  imageUrl: string;
  children: React.ReactNode;
}) {
  return (
    <main className="relative min-h-screen overflow-hidden md:flex">
      <div className="noise-overlay" />
      <section className="relative flex min-h-[40vh] w-full items-center justify-center overflow-hidden p-gutter md:min-h-screen md:w-1/2">
        <div className="absolute inset-0 bg-cover bg-center opacity-70" style={{ backgroundImage: `url(${imageUrl})` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background" />
        <div className="absolute -left-16 top-1/4 h-80 w-80 rounded-full bg-primary/15 blur-[100px]" />
        <div className="absolute -right-16 bottom-1/4 h-80 w-80 rounded-full bg-secondary/10 blur-[100px]" />
        <div className="relative z-10 max-w-lg text-center">
          <img
            alt="PetAI companion"
            className="mx-auto mb-8 h-auto w-[78%] max-w-[480px] animate-float object-contain"
            src="https://lh3.googleusercontent.com/aida/ADBb0uglhcWTNaTW1G654_rUvQyiJMpv34YiJP59gPSDws8D_swAfLrKR0OqYtapma8s0_7z0K_iR7_hIPrjhDaOs_fBk-S0t_hl8Gy2-0IgUguKzMe6QlmZyR3iEAhsK7p5XynrC4w4cFrWE01i8-Em_TgmjhhlAytC9GHvIHkjg-UsYZUceHKNVdSWd21NkL12U4zeRRNqh-UGO9lhWKXa8DlC35aMmNbRh4Qn2tIOxGbR9lEnivU9DcEaq77l"
          />
          <WaveBars className="mx-auto mb-4 h-10" />
          <p className="text-3xl font-semibold leading-tight text-on-surface md:text-5xl">{subtitle}</p>
        </div>
      </section>
      <section className="flex w-full items-center justify-center bg-surface-container-lowest p-6 md:w-1/2 md:p-12">
        <div className="glass-panel relative w-full max-w-md rounded-[2rem] p-8 md:p-12">
          <div className="mb-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-background">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>
                  pets
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-primary">PetAI</h1>
                <p className="mono-label text-on-surface-variant">Sentient Connection</p>
              </div>
            </div>
            <h2 className="text-4xl font-semibold text-on-surface">{title}</h2>
          </div>
          {children}
        </div>
      </section>
    </main>
  );
}
