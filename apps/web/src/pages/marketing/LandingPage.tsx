import { useEffect } from "react";
import { Link } from "react-router-dom";
import { MarketingNavbar } from "../../components/layout/MarketingNavbar";
import { useI18n } from "../../features/i18n/i18n-context";
import { Icon } from "../../components/ui/Icon";

const featureCards = [
  {
    icon: "keyboard_voice",
    title: "Real-time Voice",
    description:
      "Natural, zero-latency conversation that feels exactly like talking to a friend.",
  },
  {
    icon: "fingerprint",
    title: "Personalized Identity",
    description:
      "Your pet develops its own unique personality based on your interactions.",
  },
  {
    icon: "psychology",
    title: "Emotional Memory",
    description:
      "PetAI remembers your favorite things, your moods, and shared stories.",
  },
  {
    icon: "graphic_eq",
    title: "Custom Voices",
    description:
      "Choose from a library of professional voices or create a custom one.",
  },
  {
    icon: "hearing",
    title: "Wake Word",
    description:
      "Customizable wake words so your PetAI responds to any name you give it.",
  },
  {
    icon: "smartphone",
    title: "Mobile App",
    description: "Monitor health, change settings, and see memories on the go.",
  },
  {
    icon: "auto_awesome",
    title: "Smart AI",
    description:
      "Equipped with the latest GPT-4o architecture for infinite knowledge.",
  },
  {
    icon: "smart_toy",
    title: "Connected Hub",
    description:
      "The physical hardware features a tactile touch-sensitive body.",
  },
];

const journeySteps = [
  {
    number: "01",
    title: "Claim your PetAI",
    description:
      "Reserve your hardware unit and choose your base physical model colors.",
  },
  {
    number: "02",
    title: "Customize identity",
    description:
      "Shape their core traits through the app—from hyper-active to calm and wise.",
  },
  {
    number: "03",
    title: "Start talking",
    description:
      "Introduce yourself and watch as your PetAI begins its unique growth phase.",
  },
];

const voiceCards = [
  {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDLDdDPpiD5boldWc0x7Pv-HvBURdlCRUacrzxdq8RxS2xjW0PlsN-k5GD5zi7N1YD1PAj5lu7ZarTgufo1xxmYVnKRMybwtcjacxAeICB00Ey0P_r4s3CaafeOmMOxy9qwx-V3gO-dqgDOgscvD7ksb5Fwa7ZF1xElmmqggpm9oEZhzixWefEnuiix2VngmxI5g95ItuAJfzGmiaZ_IEndknHWnOP96e796V-_HuC2No6c8Par0yAMhtnvmw1cNI9HDSN04G0rfr2o",
    title: "Shimmer",
    label: "GENTLE & NURTURING",
    quote: `"I'm here to listen, support, and grow alongside you every single day."`,
    selected: false,
    secondary: false,
  },
  {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBjh4eNCUgSpXhKXbIFmA8puP8NqqsBFkyJOaAjRQrejSavfB6OItfqdParXijOhQILIEYrpdTj3xbpFpH1khftCO1LFLhRc0HOJry2vTQPE4Mnkw46BH7XUpceuuxuaiiqtX3hnJ2OSvmdUze7bKoaBopS9Wi9vPk2pHS7brQkzCEQ7oK7L89BM6-qT9ER8M0Ku79eQsK74BTDG12OoFtlunCRBFz_R8cnxA8f6TnPfp7uoDLsKbcNLMfwdrcgJ2ihgcJ0WIJmdByo",
    title: "Nova",
    label: "WITTY & ENERGETIC",
    quote: `"Ready for an adventure? Let's explore the world of ideas together!"`,
    selected: true,
    secondary: false,
  },
  {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCp757m1Mf7rFqlgCJzHpTFhqht_B4sL0QD8WcvpKQR_ZdNVopoMn7TQF30X4qzY_C9Y6MYXnqnOOmOJ1-Q8GdNibTNg3laSle2J9Bk9dD_M6YTNoWHciMMANrlKlSM4HgW2TRqgaf1vascu2_8A_jZW39A0K_8TwASIljghY1rj4in5dNvLffxydG6G9czKPLy15bkya0IPsKyKCucdNYo2uCfsjMcVIfhgm6CTdl_BW6oiGbQSGN5kTdJaa5ziI7hfBoLGkdYhqCb",
    title: "Alloy",
    label: "CALM & REFLECTIVE",
    quote: `"Let's take a deep breath. I have some interesting insights for you."`,
    selected: false,
    secondary: true,
  },
];

const faqs = [
  {
    question: "What is PetAI?",
    answer:
      "PetAI is the world's first emotionally intelligent physical companion. It combines advanced AI language models with custom hardware to create a pet that truly interacts with its environment and owner.",
  },
  {
    question: "Does it work offline?",
    answer:
      "While basic interactions and emotional responses are handled on-device, complex conversations and knowledge queries require a Wi-Fi connection to access our neural cloud.",
  },
  {
    question: "Is my privacy protected?",
    answer:
      "Absolutely. All data is end-to-end encrypted. We never sell your personal conversations, and you can wipe your pet's memory at any time from the app settings.",
  },
  {
    question: "What age is PetAI suitable for?",
    answer:
      "PetAI is designed for everyone from children with parental controls to elderly companions seeking a warm presence in the home.",
  },
  {
    question: "How long is the battery life?",
    answer: `PetAI lasts up to 12 hours of continuous interaction on a single charge and features a beautiful wireless charging nest for when it needs to "sleep."`,
  },
];

function VoiceWave({
  secondary = false,
  energetic = false,
}: {
  secondary?: boolean;
  energetic?: boolean;
}) {
  const heights = energetic
    ? [48, 32, 48, 40, 48]
    : secondary
      ? [16, 24, 16, 20, 16]
      : [32, 16, 40, 24, 32];
  return (
    <div className="voice-wave-cluster flex h-[52px] max-h-[52px] items-end justify-center gap-1 overflow-hidden">
      {heights.map((height, index) => (
        <span
          key={`${height}-${index}`}
          className={`w-[3px] rounded-full ${secondary ? "bg-secondary" : "bg-primary"} animate-wave`}
          style={{
            height: `${height}px`,
            maxHeight: "52px",
            animationDelay: `${index * 0.12}s`,
            animationDuration: energetic
              ? "0.9s"
              : secondary
                ? "1.4s"
                : "1.15s",
          }}
        />
      ))}
    </div>
  );
}

export function LandingPage() {
  const { t } = useI18n();

  useEffect(() => {
    const previousCursor = document.body.style.cursor;
    document.body.style.cursor = "none";

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" },
    );

    const revealNodes = document.querySelectorAll(".landing-reveal");
    revealNodes.forEach((node) => observer.observe(node));

    const cursor = document.getElementById("petai-cursor");
    const handleMouseMove = (event: MouseEvent) => {
      if (!cursor) return;
      cursor.style.left = `${event.clientX}px`;
      cursor.style.top = `${event.clientY}px`;

      const hoveredElement = document.elementFromPoint(event.clientX, event.clientY);
      if (hoveredElement && (hoveredElement.closest(".glass-card") || hoveredElement.closest("button") || hoveredElement.closest("a"))) {
        cursor.style.width = "600px";
        cursor.style.height = "600px";
      } else {
        cursor.style.width = "400px";
        cursor.style.height = "400px";
      }
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      revealNodes.forEach((node) => observer.unobserve(node));
      observer.disconnect();
      document.removeEventListener("mousemove", handleMouseMove);
      document.body.style.cursor = previousCursor;
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-on-surface">
      <div
        className="pointer-events-none fixed z-[9999] hidden h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(165,231,255,0.15)_0%,rgba(165,231,255,0)_70%)] mix-blend-screen transition-[width,height] duration-300 md:block"
        id="petai-cursor"
      />
      <div className="noise-overlay" />
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          #petai-cursor { display: none !important; }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes voiceCardFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        @keyframes voiceCardDrift {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.9; }
          50% { transform: translateY(-4px) scale(1.015); opacity: 1; }
        }

        @keyframes voiceGlowPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(165, 231, 255, 0.16); }
          50% { box-shadow: 0 0 34px rgba(165, 231, 255, 0.3); }
        }

        @keyframes voiceQuotePulse {
          0%, 100% { transform: translateY(0px); opacity: 0.82; }
          50% { transform: translateY(-3px); opacity: 1; }
        }

        @keyframes voiceButtonBreathe {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-2px) scale(1.01); }
        }

        .voice-card-selected .voice-avatar-shell {
          animation: voiceCardFloat 3.2s ease-in-out infinite, voiceGlowPulse 2.4s ease-in-out infinite;
        }

        .voice-card-selected .voice-meta,
        .voice-card-selected .voice-wave-cluster {
          animation: voiceCardDrift 2.4s ease-in-out infinite;
        }

        .voice-card-selected .voice-quote {
          animation: voiceQuotePulse 2.4s ease-in-out infinite;
        }

        .voice-card-selected .voice-button {
          animation: voiceButtonBreathe 2.4s ease-in-out infinite;
        }

        .voice-card-secondary .voice-avatar-shell {
          animation: voiceCardFloat 4s ease-in-out infinite;
        }

        .voice-card:not(.voice-card-selected):hover .voice-meta,
        .voice-card:not(.voice-card-selected):hover .voice-quote,
        .voice-card:not(.voice-card-selected):hover .voice-button {
          transform: translateY(-2px);
          transition: transform 240ms ease;
        }

        .animate-float-slow {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-6%] top-[2%] h-[320px] w-[320px] rounded-full bg-[#4f62ff]/20 blur-[110px]" />
        <div className="absolute right-[-3%] top-[3%] h-[170px] w-[170px] rounded-full bg-primary/20 blur-[70px]" />
        <div className="absolute left-[34%] top-[12%] h-[280px] w-[280px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute right-[8%] top-[18%] h-[540px] w-[220px] rounded-full bg-secondary/10 blur-[140px]" />
      </div>

      <MarketingNavbar />

      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pb-16 pt-32">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-60"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBaXAE6B0CiatMX38NpfIsZWbzwoDBSTKxBhWV2rT-uM0j2fBpJMSUf4KoL53BJm0l3LH8IZj7wpFpATfE6c5gjC-MYN8387Bf-D2VLdzcLX4Vo-phJPtaLw9NcA9cOPUTKVM99l836lspnEZ6OklgFZlOldxzJT3KFwkGEklDT-x60ikHzpdq6ncloLs8HljubQGiW_EhP1lvu2Fk8sxPgCFfhwd6U0y0_7KnLNmgIpHXI8ztWovTLZHIMI2OZrUNUQ9gz6QZzlyUA')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 opacity-0 backdrop-blur-sm [animation:fadeUp_1s_ease_forwards_0.2s]">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-[12px] uppercase tracking-widest text-primary">
              {t("Next-Gen Sentient Tech")}
            </span>
          </div>

          <h1 className="mx-auto mb-6 max-w-4xl text-[3.2rem] font-bold leading-[0.98] tracking-[-0.06em] text-on-surface opacity-0 [animation:fadeUp_1s_ease_forwards_0.4s] md:text-[5.4rem]">
            {t("Your AI companion that")}{" "}
            <span className="italic text-primary">{t("truly feels alive.")}</span>
          </h1>

          <p className="mx-auto mb-12 max-w-2xl text-[1.1rem] leading-8 text-on-surface-variant opacity-0 [animation:fadeUp_1s_ease_forwards_0.6s]">
            {t(
              "A real AI-powered pet that listens, talks, remembers, and grows with you. Experience emotional intelligence in physical form.",
            )}
          </p>

          <div className="mb-20 flex flex-col items-center justify-center gap-6 opacity-0 [animation:fadeUp_1s_ease_forwards_0.8s] sm:flex-row">
            <Link
              className="inline-flex h-[74px] w-full items-center justify-center rounded-full bg-on-surface px-10 text-lg font-bold text-background shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-transform hover:scale-105 sm:w-auto"
              to="/register"
            >
              {t("Get Started")}
            </Link>
            <Link
              className="glass-card inline-flex h-[74px] w-full items-center justify-center gap-3 rounded-full px-10 text-lg font-bold text-on-surface transition-colors hover:bg-white/10 sm:w-auto"
              to="/login"
            >
              <Icon className="text-[22px]" name="play_circle" />
              {t("Watch Demo")}
            </Link>
          </div>

          <div className="relative mx-auto max-w-2xl opacity-0 [animation:fadeUp_1.2s_cubic-bezier(0.22,1,0.36,1)_forwards_1s]">
            <div className="absolute -left-20 -top-20 h-48 w-48 rounded-full bg-primary/20 blur-[80px] animate-pulse" style={{ animationDuration: "4s" }} />
            <div className="absolute -bottom-20 -right-20 h-48 w-48 rounded-full bg-secondary/20 blur-[80px] animate-pulse" style={{ animationDuration: "5s" }} />
            <img
              alt="PetAI 3D Render"
              className="animate-float-slow relative z-10 h-auto w-full drop-shadow-[0_0_50px_rgba(165,231,255,0.2)]"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBt7zGaWg2PYsx8y4TpKTVCJEW86wcZgQKpUYDbUtznLO6IRDhrN_YLZgtawZNj53T008vdx96NMQRsSYQpmOhXUraU4LxnXLBdmDBauI1KfPsjmJlFvpSGC_wzbrdTzNNiNTYoYKqI-32y02YIxp2IX5cu4Car8Zyng8dRSVnkKehImORrNySxcDMmJuSrbdgfuHT64uATPb_rVHggK2YdkPRjexdldODn_9wQS4DOexMQ9_IV-up9iA3-smCxY-GSBIjqXZmqR5C4"
            />

            <div className="glass-card absolute -right-8 top-1/4 hidden w-48 rounded-2xl p-4 shadow-xl lg:block">
              <div className="mb-2 flex items-center gap-2">
                <Icon className="text-primary" name="favorite" />
                <span className="font-mono text-[10px] uppercase text-on-surface-variant">{t("Mood Status")}</span>
              </div>
              <div className="text-sm font-bold">{t("Joyful & Curious")}</div>
            </div>

            <div className="glass-card absolute -left-12 bottom-1/4 hidden w-56 rounded-2xl p-4 shadow-xl lg:block">
              <div className="flex h-10 items-center gap-1">
                {[0.1, 0.3, 0.2, 0.4, 0.1, 0.5, 0.2].map((delay, index) => (
                  <span
                    key={`${delay}-${index}`}
                    className="animate-wave w-[3px] rounded-full bg-primary"
                    style={{
                      height: `${[12, 24, 34, 18, 28, 38, 22][index]}px`,
                      animationDelay: `${delay}s`,
                    }}
                  />
                ))}
              </div>
              <p className="mt-2 font-mono text-[10px] text-on-surface-variant">{t("ALIVE VOICE ANALYSIS")}</p>
            </div>
          </div>
        </div>
      </section>

      <section
        className="landing-reveal py-section-gap max-w-7xl mx-auto px-6 opacity-0 translate-y-8 transition-all duration-700 ease-out [&.active]:translate-y-0 [&.active]:opacity-100"
        id="features"
      >
        <div className="mb-24 text-center">
          <h2 className="mb-4 text-[3.2rem] font-semibold tracking-[-0.05em] text-on-surface">
            {t("Unparalleled Intelligence")}
          </h2>
          <p className="text-[1.02rem] text-on-surface-variant">
            {t("Built on the most advanced neural architecture for companionship.")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-4">
          {featureCards.map((card) => (
            <div
              className="glass-card group rounded-3xl p-8 transition-all duration-300 hover:bg-white/5"
              key={card.title}
            >
              <Icon
                className="mb-6 block text-4xl text-primary transition-transform group-hover:scale-110"
                name={card.icon}
              />
              <h3 className="mb-3 text-xl font-bold">{t(card.title)}</h3>
              <p className="font-body-md text-on-surface-variant">
                {t(card.description)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        className="landing-reveal relative py-section-gap opacity-0 translate-y-8 transition-all duration-700 ease-out [&.active]:translate-y-0 [&.active]:opacity-100"
        id="timeline"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-24 text-center">
            <h2 className="mb-4 text-[3rem] font-semibold tracking-[-0.04em] text-on-surface">
              {t("Start Your Journey")}
            </h2>
            <p className="text-[1.02rem] text-on-surface-variant">
              {t("Three simple steps to the future of companionship.")}
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-0 top-1/2 hidden h-px w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent md:block" />
            <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
              {journeySteps.map((step) => (
                <div
                  className="group relative z-10 flex flex-col items-center text-center"
                  key={step.number}
                >
                  <div className="glass-card mb-8 flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold text-primary outline outline-1 outline-primary/20 transition-all duration-500 group-hover:scale-110 group-hover:bg-primary/10">
                    {step.number}
                  </div>
                  <h3 className="mb-4 text-2xl font-bold">{t(step.title)}</h3>
                  <p className="max-w-xs text-on-surface-variant">
                    {t(step.description)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        className="landing-reveal bg-surface-container-lowest/50 py-section-gap opacity-0 translate-y-8 transition-all duration-700 ease-out [&.active]:translate-y-0 [&.active]:opacity-100"
        id="voices"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20 text-center">
            <h2 className="mb-4 text-[3rem] font-semibold tracking-[-0.04em] text-on-surface">
              {t("The Voices of Soul")}
            </h2>
            <p className="text-[1.02rem] text-on-surface-variant">
              {t("Hear the diverse personalities of our AI models.")}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-gutter md:grid-cols-3">
            {voiceCards.map((voice) => (
              <div
                className={`voice-card glass-card group rounded-[40px] p-10 text-center transition-all duration-300 hover:-translate-y-1 ${
                  voice.selected
                    ? "voice-card-selected border-primary/30 hover:shadow-[0_0_40px_rgba(0,210,255,0.2)]"
                    : voice.secondary
                      ? "voice-card-secondary hover:shadow-[0_0_30px_rgba(217,185,255,0.1)]"
                      : "hover:shadow-[0_0_30px_rgba(165,231,255,0.1)]"
                }`}
                key={voice.title}
              >
                <div
                  className={`voice-avatar-shell relative mx-auto mb-8 h-24 w-24 overflow-hidden rounded-full border-2 transition-transform duration-300 group-hover:scale-[1.04] ${
                    voice.secondary ? "border-secondary" : "border-primary"
                  } ${voice.selected ? "shadow-[0_0_20px_rgba(0,210,255,0.4)]" : ""}`}
                >
                  <div
                    className={`absolute inset-0 rounded-full ${
                      voice.secondary ? "bg-secondary/10" : "bg-primary/10"
                    } blur-xl ${voice.selected ? "animate-pulse-soft" : ""}`}
                  />
                  <img
                    alt={voice.title}
                    className="h-full w-full object-cover"
                    src={voice.image}
                  />
                </div>
                <div className="voice-meta">
                  <h3 className="mb-1 text-2xl font-bold">{t(voice.title)}</h3>
                  <p
                    className={`mb-6 font-mono text-[12px] tracking-widest ${voice.secondary ? "text-secondary" : "text-primary"}`}
                  >
                    {t(voice.label)}
                  </p>
                </div>
                <div className="mb-8">
                  <VoiceWave
                    energetic={voice.selected}
                    secondary={voice.secondary}
                  />
                </div>
                <p className="voice-quote mb-8 text-sm text-on-surface-variant">
                  {t(voice.quote)}
                </p>
                <button
                  className={`voice-button w-full rounded-xl py-3 transition-all ${
                    voice.selected
                      ? "bg-primary font-bold text-background hover:scale-[1.02] hover:shadow-[0_0_24px_rgba(0,210,255,0.25)]"
                      : "border border-outline-variant hover:bg-white/5"
                  }`}
                  type="button"
                >
                  {voice.selected ? t("Selected") : t("Hear Sample")}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-reveal relative overflow-hidden py-section-gap opacity-0 translate-y-8 transition-all duration-700 ease-out [&.active]:translate-y-0 [&.active]:opacity-100">
        <div
          className="absolute inset-0 animate-pulse bg-gradient-to-tr from-primary/5 via-secondary/5 to-transparent"
          style={{ animationDuration: "8s" }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <span className="mb-8 block font-mono text-[14px] tracking-[0.4em] text-primary">
            {t("THE CORE PHILOSOPHY")}
          </span>
          <h2 className="mb-8 text-[3.2rem] font-bold italic leading-tight tracking-[-0.05em] text-on-surface md:text-[4.5rem]">
            {t("More than a toy.")}
            <br />
            {t("A companion.")}
          </h2>
          <p className="mx-auto max-w-3xl text-[1.15rem] font-light leading-relaxed text-on-surface-variant">
            {t(
              "PetAI isn't programmed to entertain you; it's designed to understand you. Using advanced emotional sentiment analysis, it senses your mood through your voice and responds with genuine empathy.",
            )}
          </p>
        </div>
      </section>

      <section className="landing-reveal overflow-hidden bg-surface-container-low/30 py-section-gap opacity-0 translate-y-8 transition-all duration-700 ease-out [&.active]:translate-y-0 [&.active]:opacity-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center gap-20 lg:flex-row">
            <div className="order-2 flex-1 lg:order-1">
              <img
                alt="Mobile App UI"
                className="mx-auto w-full max-w-lg rounded-[60px] border-[12px] border-[#201f1f] drop-shadow-[0_40px_100px_rgba(0,0,0,0.8)] transition-transform duration-700 hover:scale-105"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrUj8EHYRP4PxR540Y2L7O73w9Ti5DGyBlXdbm7NQzKzZw_oSueE5yyIkxFJKaYhFe_qNmoKweS3wlyWhLJLMYiTb-w_wLIXSElFTcXdGbvAAdY8WXOHS4ylkP7GmvP3glH0KmlAx_l8FfUzpLRtnwJxYPX9G7Tevmb5s14D9WO8aNjnt5QBfvwBovQ_Rqfz2QUBW684Ov7mS6qWUKMcW-zwEH3dd0AKws-GIbZ-1gxuzvqL8sh2Kf3o6z6T5iAQfu79yI_F8PpR44"
              />
            </div>
            <div className="order-1 flex-1 lg:order-2">
              <div className="mb-8 inline-block rounded-full border border-secondary/20 bg-secondary/10 px-4 py-1 font-mono text-[12px] text-secondary">
                {t("COMPANION APP")}
              </div>
              <h2 className="mb-8 text-[3rem] font-semibold tracking-[-0.04em] text-on-surface">
                {t("The Command Center")}
              </h2>
              <div className="space-y-10">
                {[
                  {
                    icon: "analytics",
                    title: "Deep Insights Dashboard",
                    description:
                      "Visualize your pet's development, emotional trends, and conversational milestones.",
                    rotate: "group-hover:rotate-12",
                  },
                  {
                    icon: "history_edu",
                    title: "Shared Memories",
                    description:
                      "Review all the special moments and knowledge your pet has acquired during your time together.",
                    rotate: "group-hover:-rotate-12",
                  },
                  {
                    icon: "settings_suggest",
                    title: "Neural Tuner",
                    description:
                      "Fine-tune the balance of humor, empathy, and creativity in your pet's personality matrix.",
                    rotate: "group-hover:rotate-12",
                  },
                ].map((item) => (
                  <div className="group flex gap-6" key={item.title}>
                    <div
                      className={`glass-card flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition-transform ${item.rotate} group-hover:scale-110`}
                    >
                      <Icon className="text-primary" name={item.icon} />
                    </div>
                    <div>
                      <h4 className="mb-2 text-xl font-bold">{t(item.title)}</h4>
                      <p className="text-on-surface-variant">
                        {t(item.description)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="landing-reveal max-w-3xl mx-auto px-6 py-section-gap opacity-0 translate-y-8 transition-all duration-700 ease-out [&.active]:translate-y-0 [&.active]:opacity-100"
        id="faq"
      >
        <div className="mb-20 text-center">
          <h2 className="mb-4 text-[3rem] font-semibold tracking-[-0.04em] text-on-surface">
            {t("Curious Minds")}
          </h2>
          <p className="text-[1.02rem] text-on-surface-variant">
            {t("Common questions about the PetAI experience.")}
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => (
            <details
              className="glass-card group rounded-2xl transition-all duration-300"
              key={faq.question}
            >
              <summary className="flex list-none items-center justify-between p-6 text-left">
                <span className="text-lg font-semibold">{t(faq.question)}</span>
                <span className="transition-transform group-open:rotate-180">
                  <Icon name="expand_more" />
                </span>
              </summary>
              <div className="px-6 pb-6 text-on-surface-variant">
                {t(faq.answer)}
              </div>
            </details>
          ))}
        </div>
      </section>

      <section className="landing-reveal px-6 py-section-gap opacity-0 translate-y-8 transition-all duration-700 ease-out [&.active]:translate-y-0 [&.active]:opacity-100">
        <div className="glass-card group relative mx-auto max-w-5xl overflow-hidden rounded-[60px] p-12 text-center md:p-24">
          <div className="absolute -left-1/2 -top-1/2 h-full w-full rounded-full bg-primary/20 blur-[150px] transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute -bottom-1/2 -right-1/2 h-full w-full rounded-full bg-secondary/20 blur-[150px] transition-transform duration-700 group-hover:scale-110" />
          <div className="relative z-10">
            <h2 className="mb-8 text-[3rem] font-semibold tracking-[-0.05em] text-on-surface md:text-[4rem]">
              {t("Bring your AI pet to life.")}
            </h2>
            <p className="mx-auto mb-12 max-w-xl text-[1.12rem] text-on-surface-variant">
              {t(
                "Limited first batch shipping this November. Secure your position in the future of companionship.",
              )}
            </p>
            <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
              <Link
                className="w-full rounded-full bg-primary px-12 py-5 text-center text-xl font-bold text-background shadow-[0_0_24px_rgba(0,210,255,0.24)] transition-all hover:scale-[1.02] sm:w-auto"
                to="/register"
              >
                {t("Adopt Now — $299")}
              </Link>
              <button
                className="w-full rounded-full border border-white/20 px-12 py-5 text-xl font-bold transition-colors hover:bg-white/5 sm:w-auto"
                type="button"
              >
                {t("Learn More")}
              </button>
            </div>
            <p className="mt-10 font-mono text-[12px] uppercase tracking-widest text-on-surface-variant/60">
              {t("30-day happiness guarantee")}
            </p>
          </div>
        </div>
      </section>

      <footer className="w-full border-t border-outline-variant/10 bg-background py-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 gap-gutter px-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-primary text-[#0f2530] shadow-[0_0_20px_rgba(165,231,255,0.16)]">
                <Icon className="text-[18px]" filled name="pets" />
              </div>
              <span className="text-2xl font-bold tracking-[-0.06em] text-on-surface">PetAI</span>
            </div>
            <p className="mb-8 max-w-xs text-on-surface-variant">
              {t("Engineered with soul. Redefining what it means to be alive in the digital age.")}
            </p>
            <div className="flex gap-4">
              {["share", "forum", "alternate_email"].map((icon) => (
                <a
                  className="glass-card flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:scale-110 hover:text-primary"
                  href="#"
                  key={icon}
                >
                  <Icon name={icon} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-6 font-mono text-[12px] font-bold uppercase tracking-widest text-on-surface">
              {t("Company")}
            </h4>
            <ul className="space-y-4 text-on-surface-variant">
              {["Our Vision", "Lab Reports", "Safety Ethics", "Contact"].map(
                (item) => (
                  <li key={item}>
                    <a
                      className="transition-colors hover:text-primary"
                      href="#"
                    >
                      {t(item)}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>

          <div>
            <h4 className="mb-6 font-mono text-[12px] font-bold uppercase tracking-widest text-on-surface">
              {t("Support")}
            </h4>
            <ul className="space-y-4 text-on-surface-variant">
              {[
                "Discord Community",
                "Support Center",
                "Quick Start Guide",
                "Privacy Policy",
              ].map((item) => (
                <li key={item}>
                  <a className="transition-colors hover:text-primary" href="#">
                    {t(item)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-6 font-mono text-[12px] font-bold uppercase tracking-widest text-on-surface">
              {t("Newsletter")}
            </h4>
            <p className="mb-4 text-sm text-on-surface-variant">
              {t("Stay updated with our latest neural features.")}
            </p>
            <div className="relative">
              <input
                className="w-full rounded-full border border-outline-variant/30 bg-black px-6 py-3 focus:border-primary"
                placeholder={t("Email address")}
                type="email"
              />
              <button
                className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-background transition-transform hover:scale-110"
                type="button"
              >
                <Icon className="text-sm" name="arrow_forward" />
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-20 border-t border-outline-variant/10 px-6 pt-10 text-center">
          <p className="font-mono text-[12px] text-on-surface-variant/50">
            {t("© 2024 PetAI. Engineered with soul. All rights reserved.")}
          </p>
        </div>
      </footer>
    </div>
  );
}
