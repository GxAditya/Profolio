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
  moodColor: string;
}[] = [
  {
    name: "neumorphism",
    label: "Neumorphism",
    icon: LayoutTemplate,
    desc: "Soft depth, tactile cards, and futuristic pastel surfaces",
    mood: "Soft 3D",
    moodColor: "text-blue-400",
  },
  {
    name: "neobrutalism",
    label: "Neobrutalism",
    icon: Columns2,
    desc: "Bold hard edges, punchy color blocks, and poster energy",
    mood: "Raw",
    moodColor: "text-orange-400",
  },
  {
    name: "glassmorphism",
    label: "Glassmorphism",
    icon: Palette,
    desc: "Layered translucent panels with aurora glow and depth",
    mood: "Aurora",
    moodColor: "text-rose-400",
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
      <p className="app-kicker mb-3 text-foreground/30">{label}</p>
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
                "rounded-xl border px-4 py-3.5 text-left transition-all duration-200",
                selected
                  ? "border-primary/30 bg-primary/[0.06] shadow-[0_0_20px_hsl(72_100%_50%_/_0.06)]"
                  : "border-foreground/[0.07] bg-foreground/[0.02] hover:border-foreground/[0.12] hover:bg-foreground/[0.04]"
              )}
            >
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors",
                    selected
                      ? "border-primary/25 bg-primary text-primary-foreground"
                      : "border-foreground/[0.08] bg-foreground/[0.04] text-foreground/35"
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>

                <span className="block">
                  <span className="block text-sm font-bold text-foreground">{template.label}</span>
                  <span className="mt-1 block text-xs text-foreground/35">{template.desc}</span>
                  <span className={cn("mt-2 inline-block font-mono text-[0.62rem] uppercase tracking-[0.16em]", template.moodColor)}>
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
