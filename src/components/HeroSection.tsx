import { ArrowDownRight, Eye, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

interface HeroSectionProps {
  hasProfile?: boolean;
}

const highlights = [
  {
    title: "Smart section extraction",
    body: "Experience, skills, education, and credentials are mapped automatically.",
  },
  {
    title: "Inline editing after parse",
    body: "You can refine every field directly in the live preview workspace.",
  },
  {
    title: "Three export-ready aesthetics",
    body: "Switch portfolio direction instantly without re-uploading the PDF.",
  },
];

const HeroSection = ({ hasProfile = false }: HeroSectionProps) => {
  return (
    <section className="relative overflow-hidden px-6 pb-14 pt-20 md:pb-20 md:pt-24">
      <div
        className="pointer-events-none absolute inset-x-0 -top-28 h-[560px] bg-[radial-gradient(circle_at_18%_28%,rgba(207,95,55,0.26),transparent_38%),radial-gradient(circle_at_84%_20%,rgba(21,96,91,0.2),transparent_34%),radial-gradient(circle_at_50%_92%,rgba(238,188,124,0.24),transparent_38%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
        <div className="stagger-fade space-y-6">
          <p className="kicker inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-card/80 px-3 py-1.5 text-foreground/70">
            <span className="accent-dot inline-block h-2 w-2 rounded-full bg-primary" />
            linkedin pdf {"->"} live portfolio
          </p>

          <h1 className="ink-headline max-w-3xl text-foreground">
            Ship a portfolio that looks custom, in one upload.
          </h1>

          <p className="max-w-2xl text-base leading-relaxed text-foreground/80 md:text-lg">
            Drop your LinkedIn export. This app parses your profile, turns it into a polished
            portfolio, and gives you an editable preview before you publish.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="#upload"
              className="lift-ring spring-hover inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground"
            >
              Start With PDF
              <ArrowDownRight className="h-4 w-4" />
            </a>

            {hasProfile ? (
              <Link
                to="/preview"
                className="spring-hover inline-flex items-center gap-2 rounded-full border border-foreground/20 bg-card/80 px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-foreground/85 hover:border-primary/50"
              >
                Open Live Preview
                <Eye className="h-4 w-4" />
              </Link>
            ) : (
              <p className="mono text-xs text-foreground/55">No login required. Parsing runs locally in your browser session.</p>
            )}
          </div>

          <div className="grid gap-2 pt-3 text-sm text-foreground/70 sm:grid-cols-3">
            <div className="rounded-2xl border border-foreground/10 bg-card/65 px-3 py-2">
              <p className="mono text-[0.7rem] uppercase tracking-[0.13em] text-foreground/55">Speed</p>
              <p className="mt-1 font-semibold text-foreground">~30s setup</p>
            </div>
            <div className="rounded-2xl border border-foreground/10 bg-card/65 px-3 py-2">
              <p className="mono text-[0.7rem] uppercase tracking-[0.13em] text-foreground/55">Security</p>
              <p className="mt-1 font-semibold text-foreground">No account needed</p>
            </div>
            <div className="rounded-2xl border border-foreground/10 bg-card/65 px-3 py-2">
              <p className="mono text-[0.7rem] uppercase tracking-[0.13em] text-foreground/55">Output</p>
              <p className="mt-1 font-semibold text-foreground">Portfolio-ready</p>
            </div>
          </div>
        </div>

        <aside className="page-panel spring-hover rounded-[2rem] p-5 sm:p-6 lg:sticky lg:top-8">
          <div className="flex items-center justify-between">
            <p className="kicker text-foreground/60">What You Get</p>
            <Sparkles className="h-4 w-4 text-primary" />
          </div>

          <div className="section-rail mt-6 space-y-4">
            {highlights.map((item, index) => (
              <article key={item.title} className="rounded-2xl border border-foreground/10 bg-card/75 p-4 pl-8">
                <p className="mono mb-1 text-[0.66rem] uppercase tracking-[0.16em] text-primary">{`0${index + 1}`}</p>
                <h2 className="text-sm font-semibold text-foreground">{item.title}</h2>
                <p className="mt-1 text-sm leading-relaxed text-foreground/70">{item.body}</p>
              </article>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
};

export default HeroSection;
