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
    <section className="mx-auto max-w-4xl px-6 py-20">
      <h2 className="mb-12 text-center text-2xl font-semibold tracking-tight md:text-3xl">
        How it works
      </h2>
      <div className="grid gap-8 md:grid-cols-3">
        {steps.map((step, i) => (
          <div key={i} className="flex flex-col items-center text-center">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <step.icon className="h-5 w-5" />
            </div>
            <span className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Step {i + 1}
            </span>
            <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StepsSection;
