import { cn } from "@/lib/utils";

export type TemplateName = "neumorphism" | "neobrutalism" | "glassmorphism" | "claymorphism" | "minimalism" | "material";

interface Props {
  active: TemplateName;
  onChange: (name: TemplateName) => void;
  className?: string;
  label?: string;
}

/* Color swatches that visually represent each template's palette */
const templates: {
  name: TemplateName;
  label: string;
  mood: string;
  moodColor: string;
  swatches: string[];
}[] = [
  {
    name: "neumorphism",
    label: "Neumorphism",
    mood: "Soft 3D",
    moodColor: "#60a5fa",
    swatches: ["#e8edf4", "#7a94be", "#bac9de"],
  },
  {
    name: "neobrutalism",
    label: "Neobrutalism",
    mood: "Raw",
    moodColor: "#f97316",
    swatches: ["#ffe65a", "#ff7a59", "#b4ff83"],
  },
  {
    name: "glassmorphism",
    label: "Glassmorphism",
    mood: "Aurora",
    moodColor: "#fb7185",
    swatches: ["#0a0a12", "#f472b6", "#a855f7"],
  },
  {
    name: "claymorphism",
    label: "Claymorphism",
    mood: "Playful",
    moodColor: "#34d399",
    swatches: ["#93c5fd", "#6ee7b7", "#fda4af"],
  },
  {
    name: "minimalism",
    label: "Minimalism",
    mood: "Clean",
    moodColor: "#6b7280",
    swatches: ["#ffffff", "#e5e5e5", "#111111"],
  },
  {
    name: "material",
    label: "Material",
    mood: "Elevated",
    moodColor: "#1976D2",
    swatches: ["#1565C0", "#E3F2FD", "#F4F6F8"],
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

      {/* Horizontal scrollable strip — scales cleanly from 3 to 15+ templates */}
      <div className="-mx-1 flex gap-2.5 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {templates.map((template) => {
          const selected = template.name === active;

          return (
            <button
              key={template.name}
              type="button"
              onClick={() => onChange(template.name)}
              className={cn(
                "group flex shrink-0 flex-col gap-2.5 rounded-xl border p-3 text-left transition-all duration-200",
                "w-[148px]",
                selected
                  ? "border-primary/35 bg-primary/[0.06] shadow-[0_0_18px_hsl(72_100%_50%_/_0.08)]"
                  : "border-foreground/[0.07] bg-foreground/[0.02] hover:border-foreground/[0.12] hover:bg-foreground/[0.04]"
              )}
            >
              {/* Swatch strip */}
              <div className="flex gap-1.5">
                {template.swatches.map((color, i) => (
                  <span
                    key={i}
                    className={cn(
                      "block h-6 rounded-md transition-all duration-200",
                      selected ? "shadow-[0_2px_8px_rgba(0,0,0,0.25)]" : "",
                      i === 0 ? "w-8" : "flex-1"
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              {/* Label */}
              <span className="block text-[0.78rem] font-bold leading-tight text-foreground">
                {template.label}
              </span>

              {/* Mood badge */}
              <span
                className="font-mono text-[0.6rem] uppercase tracking-[0.15em]"
                style={{ color: template.moodColor }}
              >
                {template.mood}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TemplateSelector;
