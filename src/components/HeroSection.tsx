import { ArrowDown } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden px-6 pt-28 pb-24">
      {/* Background flourishes */}
      <div className="pointer-events-none absolute inset-0 hero-gradient opacity-60" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-0 tech-grid opacity-40 mix-blend-soft-light"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-32 top-40 h-[420px] w-[420px] rounded-full bg-primary/20 blur-3xl neon-ring"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-24 -top-10 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-10 md:flex-row md:items-start">
        {/* Copy */}
        <div className="stagger-container relative z-10 max-w-xl space-y-6 text-center md:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-4 py-1.5 text-xs text-zinc-400 glass-soft">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 glow-pulse" />
            <span className="label text-[0.65rem] text-zinc-400">
              No login · No scraping
            </span>
          </div>

          <h1 className="headline text-balance text-gradient">
            Turn your LinkedIn PDF
            <span className="block text-zinc-100">into a live portfolio</span>
          </h1>

          <p className="max-w-md text-sm leading-relaxed text-zinc-400 md:text-base">
            Drop in your exported LinkedIn profile and instantly get a cinematic,
            developer-grade portfolio — no code, no tracking scripts, just your story
            told right.
          </p>

          <div className="flex flex-col items-center gap-4 md:flex-row md:items-center">
            <a
              href="#upload"
              className="spring-hover inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground shadow-lg hover:bg-primary/90"
            >
              Generate my site
              <ArrowDown className="h-4 w-4" />
            </a>
            <p className="mono text-xs text-zinc-500">
              ⏱ Under 30 seconds · ✨ Templates included
            </p>
          </div>
        </div>

        {/* Right-side preview card */}
        <div className="relative z-10 mt-8 w-full max-w-md md:mt-0 md:w-auto">
          <div className="glass spring-hover rounded-3xl border border-white/10 bg-black/60 p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="label text-xs text-zinc-500">Preview</span>
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                Live portfolio
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="mono text-sm text-zinc-200">Your Name</div>
                  <div className="text-xs text-zinc-500">
                    Product Designer · San Francisco
                  </div>
                </div>
                <div className="h-10 w-10 rounded-full border border-white/10 bg-zinc-900/60" />
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="glass-soft rounded-xl p-3">
                  <p className="label mb-1 text-[0.6rem] text-zinc-500">Years</p>
                  <p className="mono text-lg text-zinc-100">6+</p>
                  <p className="mt-1 text-[0.7rem] text-zinc-500">in industry</p>
                </div>
                <div className="glass-soft rounded-xl p-3">
                  <p className="label mb-1 text-[0.6rem] text-zinc-500">Roles</p>
                  <p className="mono text-lg text-zinc-100">3</p>
                  <p className="mt-1 text-[0.7rem] text-zinc-500">featured</p>
                </div>
                <div className="glass-soft rounded-xl p-3">
                  <p className="label mb-1 text-[0.6rem] text-zinc-500">Skills</p>
                  <p className="mono text-lg text-zinc-100">18</p>
                  <p className="mt-1 text-[0.7rem] text-zinc-500">parsed</p>
                </div>
              </div>

              <div className="mt-3 rounded-xl border border-dashed border-zinc-700/80 bg-zinc-900/70 p-3">
                <p className="mono text-[0.7rem] text-zinc-400">
                  &gt; Upload your PDF to see your own data here in real time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
