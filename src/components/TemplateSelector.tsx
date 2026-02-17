import { Layout, Columns2, Palette } from "lucide-react";

export type TemplateName = "minimal" | "professional" | "creative";

interface Props {
  active: TemplateName;
  onChange: (name: TemplateName) => void;
}

const templates: { name: TemplateName; label: string; icon: typeof Layout; desc: string }[] = [
  { name: "minimal", label: "Minimal", icon: Layout, desc: "Clean & centered" },
  { name: "professional", label: "Professional", icon: Columns2, desc: "Two-column corporate" },
  { name: "creative", label: "Creative", icon: Palette, desc: "Bold pastel gradients" },
];

const TemplateSelector = ({ active, onChange }: Props) => (
  <div className="mx-auto flex max-w-xl gap-3">
    {templates.map(({ name, label, icon: Icon, desc }) => (
      <button
        key={name}
        onClick={() => onChange(name)}
        className={`flex flex-1 flex-col items-center gap-2 rounded-xl border-2 px-4 py-5 text-center transition-all ${
          active === name
            ? "border-primary bg-accent shadow-sm"
            : "border-border bg-card hover:border-primary/40"
        }`}
      >
        <Icon className={`h-6 w-6 ${active === name ? "text-primary" : "text-muted-foreground"}`} />
        <span className="text-sm font-semibold text-foreground">{label}</span>
        <span className="text-xs text-muted-foreground">{desc}</span>
      </button>
    ))}
  </div>
);

export default TemplateSelector;
