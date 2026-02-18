import { ArrowLeft, ArrowRight, FileText, Github, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const BuildOptions = () => {
  return (
    <div className="app-dark relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-[15%] -top-[10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,hsl(72_100%_50%_/_0.06),transparent_60%)] blur-[100px]" />
        <div className="absolute -right-[10%] top-[20%] h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,hsl(245_60%_60%_/_0.05),transparent_60%)] blur-[100px]" />
        <div className="absolute inset-0 bg-[linear-gradient(hsl(0_0%_100%_/_0.02)_1px,transparent_1px),linear-gradient(90deg,hsl(0_0%_100%_/_0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black,transparent)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 pb-20 pt-10 sm:px-10">
        {/* Nav */}
        <nav className="mb-12 flex flex-wrap items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-[-0.02em]">profolio</span>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-foreground/[0.1] bg-foreground/[0.04] px-4 py-2 text-[0.84rem] font-medium text-foreground/50 transition-colors hover:border-foreground/20 hover:text-foreground/70"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Home
          </Link>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <p className="app-kicker text-primary/60">Build Source</p>
          <h1 className="mt-3 max-w-xl text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
            How do you want to build your portfolio?
          </h1>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-foreground/35">
            Choose your data source. LinkedIn PDF is fully available now. GitHub import is on the roadmap.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-5 md:grid-cols-2">
          {/* LinkedIn — primary */}
          <article className="app-panel-accent group relative overflow-hidden p-7 transition-all duration-300 hover:border-primary/20">
            <div className="pointer-events-none absolute -right-8 -top-8 h-[150px] w-[150px] rounded-full bg-primary/[0.06] blur-[60px] transition-all duration-500 group-hover:bg-primary/[0.1]" aria-hidden="true" />
            <div className="relative">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <FileText className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold tracking-[-0.02em]">
                Build from LinkedIn PDF
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-foreground/40">
                Upload your exported LinkedIn profile PDF, edit inline, switch templates, and publish your portfolio in minutes.
              </p>
              <Link
                to="/linkedin"
                className="group/btn mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-all duration-300 hover:shadow-[0_0_28px_hsl(72_100%_50%_/_0.25)]"
              >
                Continue
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
              </Link>
            </div>
          </article>

          {/* GitHub — coming soon */}
          <article className="app-panel group relative overflow-hidden p-7 transition-all duration-300 hover:border-foreground/[0.12]">
            <div className="relative">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-foreground/[0.1] bg-foreground/[0.04] text-foreground/40">
                <Github className="h-5 w-5" />
              </div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold tracking-[-0.02em]">
                  Build from GitHub
                </h2>
                <span className="rounded-full border border-foreground/[0.1] bg-foreground/[0.04] px-2.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.15em] text-foreground/30">
                  Soon
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-foreground/40">
                Import repositories, starred projects, and contribution data. This feature is planned as the next release.
              </p>
              <Link
                to="/github"
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-foreground/[0.1] bg-foreground/[0.04] px-6 py-3 text-sm font-medium text-foreground/40 transition-colors hover:border-foreground/20 hover:text-foreground/60"
              >
                Open Placeholder
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};

export default BuildOptions;
