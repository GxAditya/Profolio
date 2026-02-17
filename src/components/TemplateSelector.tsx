import { ChevronDown, Layout, Columns2, Palette } from "lucide-react";

export type TemplateName = "minimal" | "professional" | "creative";

interface Props {
  active: TemplateName;
  onChange: (name: TemplateName) => void;
  className?: string;
  label?: string;
}

const templates: { name: TemplateName; label: string; icon: typeof Layout; desc: string }[] = [
  {
    name: "minimal",
    label: "Editorial Portfolio",
    icon: Layout,
    desc: "Warm paper, narrative-first storytelling",
  },
  {
    name: "professional",
    label: "Product Portfolio",
    icon: Columns2,
    desc: "Studio-grade dark mode with structured case blocks",
  },
  {
    name: "creative",
    label: "Signal Portfolio",
    icon: Palette,
    desc: "High-contrast experimental page with bold type",
  },
];

const TemplateSelector = ({
  active,
  onChange,
  className = "",
  label = "Template style",
}: Props) => {
  const activeTemplate = templates.find((template) => template.name === active) ?? templates[0];
  const ActiveIcon = activeTemplate.icon;

  return (
    <div className={`w-full ${className}`}>
      <label className="label mb-2 block text-zinc-500">{label}</label>
      <div className="relative">
        <select
          value={active}
          onChange={(event) => onChange(event.target.value as TemplateName)}
          className="w-full appearance-none rounded-2xl border border-zinc-800/80 bg-zinc-950/85 px-4 py-3 pr-10 text-sm font-semibold text-zinc-100 outline-none transition-colors hover:border-primary/60 focus:border-primary/70"
        >
          {templates.map((template) => (
            <option key={template.name} value={template.name}>
              {template.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
      </div>
      <div className="mt-2 flex items-center gap-2 text-xs text-zinc-500">
        <ActiveIcon className="h-3.5 w-3.5 text-primary" />
        <span>{activeTemplate.desc}</span>
      </div>
    </div>
  );
};

export default TemplateSelector;
