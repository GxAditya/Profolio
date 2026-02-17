import { Download, Upload, Layout } from "lucide-react";

const steps = [
  {
    icon: Download,
    title: "Export your LinkedIn PDF",
    description:
      'Go to your LinkedIn Profile → Click "More" → "Save to PDF".',
  },
  {
    icon: Upload,
    title: "Upload the PDF here",
    description: "Drag and drop your downloaded PDF into the upload zone below.",
  },
  {
    icon: Layout,
    title: "Choose a template",
    description: "Pick a portfolio style and get your personal website instantly.",
  },
];

const StepsSection = () => {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <div className="mb-10 text-center">
        <p className="label mb-2 text-zinc-500">Pipeline</p>
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-100 md:text-3xl">
          From LinkedIn export to live site in three steps
        </h2>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {steps.map((step, i) => (
          <div
            key={i}
            className="spring-hover glass-soft flex flex-col items-center rounded-2xl border border-zinc-800/80 px-5 py-6 text-center"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <step.icon className="h-5 w-5" />
            </div>
            <span className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Step {i + 1}
            </span>
            <h3 className="mb-2 text-base font-semibold text-zinc-100">
              {step.title}
            </h3>
            <p className="text-sm leading-relaxed text-zinc-400">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StepsSection;
