import { Download, Upload, Wand2 } from "lucide-react";

const steps = [
  {
    icon: Download,
    title: "Export your LinkedIn profile",
    description: 'In LinkedIn, open your profile and choose "Save to PDF" from the More menu.',
    cue: "Source",
  },
  {
    icon: Upload,
    title: "Drop the PDF in this app",
    description: "We parse profile sections and build a structured portfolio data model instantly.",
    cue: "Ingest",
  },
  {
    icon: Wand2,
    title: "Choose style and polish",
    description: "Switch themes, edit text inline, and launch your portfolio-ready preview.",
    cue: "Output",
  },
] as const;

const StepsSection = () => {
  return (
    <section className="mx-auto max-w-6xl px-6 py-14">
      <div className="mb-9 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="kicker text-foreground/55">Process</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl">
            Three steps from profile data to polished page
          </h2>
        </div>
        <p className="max-w-md text-sm leading-relaxed text-foreground/70">
          The workflow is intentionally short so you spend time refining your story, not wiring
          layouts from scratch.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {steps.map((step, index) => (
          <article
            key={step.title}
            className="page-panel spring-hover rounded-[1rem] border px-5 py-6"
          >
            <div className="mb-5 flex items-center justify-between">
              <span className="mono rounded-lg border border-foreground/15 px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.16em] text-foreground/60">
                {step.cue}
              </span>
              <span className="mono text-xs text-primary">{`0${index + 1}`}</span>
            </div>

            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <step.icon className="h-5 w-5" />
            </div>

            <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-foreground/70">{step.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default StepsSection;
