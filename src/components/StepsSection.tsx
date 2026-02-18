import {
  ArrowRight,
  Code2,
  Download,
  FileStack,
  Palette,
} from "lucide-react";
import { Link } from "react-router-dom";

const outcomes = [
  {
    stat: "Zero manual entry",
    label:
      "LinkedIn PDF parsed into structured portfolio sections automatically.",
    icon: "📄",
  },
  {
    stat: "Instant comparison",
    label:
      "Switch between nine template styles and see changes reflected live.",
    icon: "⚡",
  },
  {
    stat: "Export-ready HTML",
    label:
      "Download a fully self-contained HTML file and host it anywhere you like.",
    icon: "💾",
  },
];

const features = [
  {
    title: "Structured PDF extraction",
    description:
      "Profile, experience, projects, education, skills — all organized into editable sections from your LinkedIn export.",
    cue: "Parser",
    icon: FileStack,
    accent: true,
  },
  {
    title: "Live inline editing",
    description:
      "Click any section to update content. Changes reflect instantly across template previews.",
    cue: "Editor",
    icon: Code2,
    accent: false,
  },
  {
    title: "Nine distinct templates",
    description:
      "Neumorphism, Neobrutalism, Glassmorphism, Claymorphism, Minimalism, Material, Flat Design, Retro, Cyberpunk — pick the one that fits your style.",
    cue: "Design",
    icon: Palette,
    accent: false,
  },
  {
    title: "One-click code export",
    description:
      "Download your portfolio as a clean, self-contained HTML file with all styles inlined — host it on GitHub Pages, Netlify, Vercel, or anywhere.",
    cue: "Export",
    icon: Download,
    accent: true,
  },
];

const workflowSteps = [
  {
    num: "01",
    title: "Upload your LinkedIn PDF",
    description:
      "Export your profile from LinkedIn, upload the PDF, and let Profolio build your first draft automatically.",
  },
  {
    num: "02",
    title: "Refine & choose a template",
    description:
      "Edit sections inline, remove noise, and switch between templates until the story reads right.",
  },
  {
    num: "03",
    title: "Export & deploy",
    description:
      "Download your portfolio as a standalone HTML file. Drop it on GitHub Pages, Netlify, or any host — no build step needed.",
  },
];

const faqs = [
  {
    question: "How does it work?",
    answer:
      "Export your LinkedIn profile as a PDF, upload it here, and Profolio automatically parses your experience, skills, and education. Pick a template, tweak any text inline, and download your finished portfolio.",
  },
  {
    question: "What gets imported from my LinkedIn PDF?",
    answer:
      "Your name, headline, summary, work experience, education, skills, and any projects listed in your profile. You can edit or remove any field before exporting.",
  },
  {
    question: "Can I edit the content before exporting?",
    answer:
      "Yes — everything is editable inline. Click any text to update it, reorder sections, or remove items you don't want shown.",
  },
  {
    question: "How do I publish my portfolio?",
    answer:
      "Export it as a single self-contained HTML file — no build step, no dependencies. Drop it on GitHub Pages, Netlify, Vercel, or any static host and it's live.",
  },
  {
    question: "Can I switch templates after editing?",
    answer:
      "Yes. Your content is stored separately from the design, so you can switch between any of the available templates at any point without losing your edits.",
  },
  {
    question: "Can I update my portfolio later?",
    answer:
      "Absolutely. Come back to Profolio, upload a fresh LinkedIn export or continue from where you left off, make your changes, and export a new copy anytime.",
  },
];

const StepsSection = () => {
  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 sm:px-10">
      {/* ── Outcomes ── */}
      <section className="landing-reveal">
        <div className="grid gap-4 md:grid-cols-3">
          {outcomes.map((item) => (
            <article
              key={item.stat}
              className="group rounded-2xl border border-foreground/[0.07] bg-card/40 px-6 py-6 transition-all duration-300 hover:border-foreground/[0.12] hover:bg-card/60"
            >
              <span className="text-2xl">{item.icon}</span>
              <h3 className="mt-3 text-lg font-bold tracking-tight">
                {item.stat}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/40">
                {item.label}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* ── Features — Bento grid ── */}
      <section id="features" className="landing-reveal mt-28">
        <div className="mb-10">
          <p className="kicker-landing text-primary/60">Features</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
            Everything you need to go from
            <span className="font-display italic text-primary"> export</span> to
            <span className="font-display italic text-primary"> portfolio</span>.
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className={`group relative overflow-hidden rounded-2xl border p-6 transition-all duration-300 ${
                feature.accent
                  ? "border-primary/[0.12] bg-primary/[0.03] hover:border-primary/20 md:col-span-2"
                  : "border-foreground/[0.07] bg-card/40 hover:border-foreground/[0.12] hover:bg-card/55"
              }`}
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="inline-flex items-center rounded-lg border border-foreground/[0.08] bg-foreground/[0.04] px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-foreground/35">
                  {feature.cue}
                </span>
                <feature.icon
                  className={`h-5 w-5 ${
                    feature.accent ? "text-primary/50" : "text-foreground/20"
                  }`}
                />
              </div>
              <h3 className="text-xl font-bold tracking-[-0.02em]">
                {feature.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-foreground/40">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* ── Workflow ── */}
      <section id="how-it-works" className="landing-reveal mt-28">
        <div className="mb-12 text-center">
          <p className="kicker-landing text-primary/60">How it Works</p>
          <h2 className="mx-auto mt-3 max-w-xl text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
            Three steps. One portfolio.
          </h2>
        </div>

        <div className="relative grid gap-6 md:grid-cols-3 md:gap-4">
          {/* Connecting line (desktop only) */}
          <div
            className="pointer-events-none absolute left-[16.67%] right-[16.67%] top-[3.2rem] hidden h-px bg-gradient-to-r from-transparent via-foreground/[0.1] to-transparent md:block"
            aria-hidden="true"
          />

          {workflowSteps.map((step) => (
            <article key={step.num} className="relative text-center">
              <div className="relative z-10 mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-foreground/[0.08] bg-card/60 font-mono text-2xl font-bold text-primary">
                {step.num}
              </div>
              <h3 className="text-lg font-bold tracking-tight">
                {step.title}
              </h3>
              <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-foreground/40">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="landing-reveal mt-28">
        <div className="mb-10">
          <p className="kicker-landing text-primary/60">FAQ</p>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
            Questions before you start.
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-xl border border-foreground/[0.07] bg-card/30 px-6 py-4 transition-colors duration-200 open:border-foreground/[0.12] open:bg-card/50"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[0.95rem] font-semibold [-webkit-appearance:none] [&::-webkit-details-marker]:hidden">
                <span>{faq.question}</span>
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-foreground/[0.08] text-xs text-primary transition-transform duration-300 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-foreground/40">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="landing-reveal mt-28">
        <div className="relative overflow-hidden rounded-3xl border border-primary/[0.12] bg-gradient-to-br from-primary/[0.06] via-card/60 to-card/40 px-8 py-16 text-center sm:px-14">
          {/* Background glows */}
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-[300px] w-[300px] rounded-full bg-primary/[0.07] blur-[100px]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-20 -left-20 h-[200px] w-[200px] rounded-full bg-primary/[0.04] blur-[80px]"
            aria-hidden="true"
          />

          <p className="kicker-landing text-primary/60">Ready?</p>
          <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-bold tracking-[-0.03em] sm:text-4xl md:text-5xl">
            Build your portfolio today.
            <span className="font-display italic text-primary">
              {" "}
              Export tonight.
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-foreground/40">
            Start with your LinkedIn PDF, refine your story, and download a
            polished portfolio you can host anywhere.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/linkedin"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-bold tracking-[-0.01em] text-primary-foreground transition-all duration-300 hover:shadow-[0_0_40px_hsl(72_100%_50%_/_0.25)]"
            >
              Start Building
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="mt-20 flex flex-col items-center gap-3 border-t border-foreground/[0.06] pt-8 text-center">
        <div className="flex items-center gap-2">
          <img src="/profolio-logo.png" alt="Profolio" className="h-6 w-6 rounded-md" />
          <span className="text-sm font-bold tracking-tight">profolio</span>
        </div>
        <p className="text-xs text-foreground/25">
          Developer portfolio builder. From PDF to deployed.
        </p>
      </footer>
    </div>
  );
};

export default StepsSection;
