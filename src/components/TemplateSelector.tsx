import { Columns2, LayoutTemplate, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

export type TemplateName = "neumorphism" | "neobrutalism" | "glassmorphism";

interface Props {
  active: TemplateName;
  onChange: (name: TemplateName) => void;
  className?: string;
  label?: string;
}

const templates: {
  name: TemplateName;
  label: string;
  icon: typeof LayoutTemplate;
  desc: string;
  mood: string;
}[] = [
  {
    name: "neumorphism",
    label: "Neumorphism",
    icon: LayoutTemplate,
    desc: "Soft depth, tactile cards, and futuristic pastel surfaces",
    mood: "Soft 3D",
  },
  {
    name: "neobrutalism",
    label: "Neobrutalism",
    icon: Columns2,
    desc: "Bold hard edges, punchy color blocks, and poster energy",
    mood: "Raw",
  },
  {
    name: "glassmorphism",
    label: "Glassmorphism",
    icon: Palette,
    desc: "Layered translucent panels with cinematic depth and blur",
    mood: "Luminous",
  },
];

const TemplateSelector = ({
  active,
  onChange,
  className = "",
  label = "Template style",
}: Props) => {
  return (
    <div className={cn("w-full", className)}>
      <p className="kicker mb-3 text-foreground/55">{label}</p>
      <div className="grid gap-3">
        {templates.map((template) => {
          const Icon = template.icon;
          const selected = template.name === active;

          return (
            <button
              key={template.name}
              type="button"
              onClick={() => onChange(template.name)}
              className={cn(
                "spring-hover rounded-xl border bg-card px-4 py-3 text-left transition-colors",
                selected
                  ? "border-primary/70 bg-primary/10 shadow-[0_10px_24px_rgba(153,64,35,0.16)]"
                  : "border-foreground/12 hover:border-primary/45"
              )}
            >
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border",
                    selected
                      ? "border-primary/30 bg-primary text-primary-foreground"
                      : "border-foreground/15 bg-card text-foreground/70"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>

                <span className="block">
                  <span className="block text-sm font-semibold text-foreground">{template.label}</span>
                  <span className="mt-1 block text-xs text-foreground/70">{template.desc}</span>
                  <span className="mono mt-2 inline-block text-[0.64rem] uppercase tracking-[0.16em] text-primary">
                    {template.mood}
                  </span>
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TemplateSelector;
