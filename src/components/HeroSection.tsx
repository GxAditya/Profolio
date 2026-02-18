import { ArrowRight, ArrowUpRight, Globe2, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  { value: "<10 min", label: "to first publish" },
  { value: "3", label: "templates included" },
  { value: "1-click", label: "publish & share" },
];

const HeroSection = () => {
  return (
    <section className="relative flex min-h-screen flex-col">
      {/* ── Ambient background ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="landing-orb absolute -left-[18%] -top-[8%] h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,hsl(72_100%_50%_/_0.1),transparent_60%)] blur-[100px]" />
        <div className="landing-orb-alt absolute -right-[12%] top-[15%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,hsl(245_60%_60%_/_0.07),transparent_60%)] blur-[100px]" />
        <div className="landing-orb absolute bottom-[5%] left-[30%] h-[400px] w-[700px] rounded-full bg-[radial-gradient(circle,hsl(72_100%_50%_/_0.05),transparent_60%)] blur-[120px]" />
        {/* Subtle grid */}
        <div className="absolute inset-0 bg-[linear-gradient(hsl(0_0%_100%_/_0.025)_1px,transparent_1px),linear-gradient(90deg,hsl(0_0%_100%_/_0.025)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black,transparent)]" />
      </div>

      {/* ── Navigation ── */}
      <nav className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 sm:px-10">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-[-0.02em]">profolio</span>
        </div>
        <div className="flex items-center gap-6">
          <a
            href="#features"
            className="hidden text-[0.84rem] text-foreground/40 transition-colors duration-200 hover:text-foreground sm:block"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="hidden text-[0.84rem] text-foreground/40 transition-colors duration-200 hover:text-foreground sm:block"
          >
            How it Works
          </a>
          <a
            href="#faq"
            className="hidden text-[0.84rem] text-foreground/40 transition-colors duration-200 hover:text-foreground md:block"
          >
            FAQ
          </a>
          <Link
            to="/build"
            className="inline-flex items-center gap-1.5 rounded-full border border-foreground/[0.1] bg-foreground/[0.05] px-4 py-2 text-[0.84rem] font-medium backdrop-blur-sm transition-all duration-200 hover:border-foreground/20 hover:bg-foreground/[0.09]"
          >
            Get Started
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </nav>

      {/* ── Hero content ── */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-8">
        {/* Live badge */}
        <div
          className="landing-reveal mb-8 inline-flex items-center gap-2.5 rounded-full border border-primary/20 bg-primary/[0.06] px-4 py-1.5"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
          </span>
          <span className="text-xs font-medium tracking-wide text-primary/80">
            LinkedIn PDF import is live
          </span>
        </div>

        {/* Headline */}
        <h1
          className="landing-reveal max-w-4xl text-center"
          style={{ animationDelay: "0.08s" }}
        >
          <span className="block text-[clamp(3rem,8vw,7.5rem)] font-extrabold leading-[0.88] tracking-[-0.045em]">
            PDF in.
          </span>
          <span className="block text-[clamp(3rem,8vw,7.5rem)] leading-[0.88] tracking-[-0.045em]">
            <span className="font-display italic text-primary">Portfolio</span>
            <span className="font-extrabold"> out.</span>
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="landing-reveal mt-7 max-w-lg text-center text-[1.05rem] leading-relaxed text-foreground/40"
          style={{ animationDelay: "0.16s" }}
        >
          Upload your LinkedIn export, pick a template, edit inline, and publish
          a portfolio URL — all in under ten minutes.
        </p>

        {/* CTAs */}
        <div
          className="landing-reveal mt-9 flex flex-wrap items-center justify-center gap-3"
          style={{ animationDelay: "0.24s" }}
        >
          <Link
            to="/build"
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-bold tracking-[-0.01em] text-primary-foreground transition-all duration-300 hover:shadow-[0_0_32px_hsl(72_100%_50%_/_0.3)]"
          >
            Build My Portfolio
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
          <a
            href="#how-it-works"
            className="inline-flex items-center gap-2 rounded-full border border-foreground/[0.1] px-6 py-3.5 text-sm font-medium text-foreground/55 transition-all duration-200 hover:border-foreground/20 hover:text-foreground/75"
          >
            See How It Works
          </a>
        </div>

        {/* ── Product demo mockup ── */}
        <div
          className="landing-reveal mt-20 w-full max-w-4xl"
          style={{ animationDelay: "0.4s" }}
        >
          <div className="overflow-hidden rounded-2xl border border-foreground/[0.08] bg-card/60 shadow-[0_30px_80px_-20px_hsl(72_100%_50%_/_0.06),0_0_0_1px_hsl(0_0%_100%_/_0.03)] backdrop-blur-sm">
            {/* Browser chrome */}
            <div className="flex items-center gap-3 border-b border-foreground/[0.06] px-5 py-3.5">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-foreground/[0.12]" />
                <div className="h-2.5 w-2.5 rounded-full bg-foreground/[0.12]" />
                <div className="h-2.5 w-2.5 rounded-full bg-foreground/[0.12]" />
              </div>
              <div className="flex-1 text-center">
                <div className="mx-auto inline-flex items-center gap-2 rounded-lg bg-foreground/[0.04] px-4 py-1 text-xs text-foreground/25">
                  <Globe2 className="h-3 w-3" />
                  profolio.dev/p/yourname
                </div>
              </div>
            </div>

            {/* Template previews */}
            <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-3 sm:p-6">
              {/* Neumorphism */}
              <div className="group overflow-hidden rounded-xl border border-foreground/[0.06] bg-gradient-to-br from-foreground/[0.04] to-foreground/[0.02] p-4 transition-all duration-300 hover:border-primary/20">
                <div className="mb-3 h-2 w-12 rounded bg-foreground/10" />
                <div className="space-y-2">
                  <div className="h-1.5 w-full rounded bg-foreground/[0.07]" />
                  <div className="h-1.5 w-4/5 rounded bg-foreground/[0.06]" />
                  <div className="h-1.5 w-3/5 rounded bg-foreground/[0.05]" />
                </div>
                <div className="mt-4 flex gap-2">
                  <div className="h-5 w-14 rounded-full bg-primary/20" />
                  <div className="h-5 w-14 rounded-full bg-foreground/[0.06]" />
                </div>
                <p className="mt-3 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-foreground/20">
                  Neumorphism
                </p>
              </div>

              {/* Neobrutalism */}
              <div className="group overflow-hidden rounded-xl border-2 border-foreground/[0.1] bg-primary/[0.03] p-4 transition-all duration-300 hover:border-primary/25">
                <div className="mb-3 h-2 w-16 rounded bg-primary/25" />
                <div className="space-y-2">
                  <div className="h-1.5 w-full rounded bg-foreground/[0.08]" />
                  <div className="h-1.5 w-3/4 rounded bg-foreground/[0.07]" />
                  <div className="h-1.5 w-2/3 rounded bg-foreground/[0.06]" />
                </div>
                <div className="mt-4 flex gap-2">
                  <div className="h-5 w-14 rounded bg-primary/20" />
                  <div className="h-5 w-14 rounded bg-foreground/[0.06]" />
                </div>
                <p className="mt-3 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-foreground/20">
                  Neobrutalism
                </p>
              </div>

              {/* Glassmorphism */}
              <div className="group overflow-hidden rounded-xl border border-foreground/[0.06] bg-gradient-to-br from-foreground/[0.05] to-transparent p-4 backdrop-blur-sm transition-all duration-300 hover:border-primary/15">
                <div className="mb-3 h-2 w-10 rounded bg-foreground/[0.1]" />
                <div className="space-y-2">
                  <div className="h-1.5 w-full rounded bg-foreground/[0.06]" />
                  <div className="h-1.5 w-5/6 rounded bg-foreground/[0.05]" />
                  <div className="h-1.5 w-2/3 rounded bg-foreground/[0.04]" />
                </div>
                <div className="mt-4 flex gap-2">
                  <div className="h-5 w-14 rounded-full bg-foreground/[0.07]" />
                  <div className="h-5 w-14 rounded-full bg-foreground/[0.05]" />
                </div>
                <p className="mt-3 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-foreground/20">
                  Glassmorphism
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div
          className="landing-reveal mt-16 flex flex-wrap items-center justify-center gap-10 sm:gap-16"
          style={{ animationDelay: "0.55s" }}
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-bold tracking-tight sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-foreground/30">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="relative z-10 flex justify-center pb-10">
        <div className="flex flex-col items-center gap-2 text-foreground/20">
          <span className="text-[0.6rem] uppercase tracking-[0.25em]">
            Scroll
          </span>
          <div className="h-8 w-px animate-pulse bg-gradient-to-b from-foreground/20 to-transparent" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
