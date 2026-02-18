import { useEffect, useState } from "react";
import { ArrowLeft, Expand, Minimize, PenLine, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import TemplateSelector, { type TemplateName } from "@/components/TemplateSelector";
import NeumorphismTemplate from "@/components/templates/NeumorphismTemplate";
import NeobrutalismTemplate from "@/components/templates/NeobrutalismTemplate";
import GlassmorphismTemplate from "@/components/templates/GlassmorphismTemplate";
import { useResume } from "@/context/ResumeContext";

const templateMap = {
  neumorphism: NeumorphismTemplate,
  neobrutalism: NeobrutalismTemplate,
  glassmorphism: GlassmorphismTemplate,
} as const;

const templateOptions: { key: TemplateName; label: string }[] = [
  { key: "neumorphism", label: "Neumorphism" },
  { key: "neobrutalism", label: "Neobrutalism" },
  { key: "glassmorphism", label: "Glassmorphism" },
];

const Preview = () => {
  const { profile, updateProfile } = useResume();
  const [activeTemplate, setActiveTemplate] = useState<TemplateName>("neumorphism");
  const [fullscreen, setFullscreen] = useState(false);
  const [hideAddSectionControlsInFullscreen, setHideAddSectionControlsInFullscreen] =
    useState(false);

  const ActiveComponent = templateMap[activeTemplate];

  useEffect(() => {
    if (!fullscreen) return;
    const previous = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFullscreen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [fullscreen]);

  if (!profile) {
    return (
      <div className="paper-grain relative min-h-screen overflow-hidden bg-background text-foreground">
        <div className="pointer-events-none absolute inset-0 dot-field opacity-[0.2]" aria-hidden="true" />
        <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6">
          <div className="page-panel w-full rounded-[2rem] p-8 text-center sm:p-10">
            <p className="kicker text-foreground/55">Preview</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl">
              No parsed profile found yet
            </h1>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-foreground/70">
              Upload your LinkedIn PDF first, then return here to edit and compare templates in
              real time.
            </p>
            <Link
              to="/"
              className="lift-ring spring-hover mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Go To Upload
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="paper-grain relative min-h-screen overflow-hidden bg-background text-foreground">
        <div className="pointer-events-none absolute inset-0 dot-field opacity-[0.2]" aria-hidden="true" />

        <div className="relative mx-auto max-w-7xl px-6 pb-14 pt-8 sm:pt-10">
          <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="kicker text-foreground/55">Live Preview</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl">
                Edit, compare, and finalize your portfolio
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setFullscreen(true)}
                className="spring-hover inline-flex items-center gap-2 rounded-full border border-foreground/20 bg-card/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-foreground/75 hover:border-primary/55"
              >
                <Expand className="h-4 w-4" />
                Full Screen
              </button>
              <Link
                to="/"
                className="spring-hover inline-flex items-center gap-2 rounded-full border border-foreground/20 bg-card/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-foreground/75 hover:border-primary/55"
              >
                <ArrowLeft className="h-4 w-4" />
                Back To Upload
              </Link>
            </div>
          </header>

          <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
            <aside className="page-panel rounded-[1.8rem] p-5 sm:p-6 lg:sticky lg:top-6 lg:h-fit">
              <div className="mb-6">
                <p className="kicker text-foreground/55">Workspace Controls</p>
                <p className="mt-2 text-sm leading-relaxed text-foreground/70">
                  Select a template and click any text in the canvas to edit directly.
                </p>
              </div>

              <TemplateSelector
                active={activeTemplate}
                onChange={setActiveTemplate}
                label="Template mode"
              />

              <div className="mt-5 rounded-2xl border border-foreground/12 bg-primary/10 p-4 text-sm text-foreground/75">
                <p className="mb-1 inline-flex items-center gap-2 font-semibold text-foreground">
                  <PenLine className="h-4 w-4 text-primary" />
                  Inline Editing Enabled
                </p>
                <p className="text-xs leading-relaxed">
                  Changes are applied immediately to your parsed profile state and reflected across
                  templates.
                </p>
              </div>
            </aside>

            <main className="rounded-[2rem] border border-foreground/15 bg-card/25 p-3 sm:p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-foreground/12 bg-card/70 px-4 py-3">
                <div>
                  <p className="kicker text-foreground/55">Active Canvas</p>
                  <p className="mt-1 text-sm text-foreground/75">Template: {activeTemplate}</p>
                </div>
                <p className="mono inline-flex items-center gap-2 text-[0.67rem] uppercase tracking-[0.16em] text-foreground/55">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  Tap text blocks to edit
                </p>
              </div>

              <ActiveComponent
                profile={profile}
                editable
                showAddSectionControls={!fullscreen || !hideAddSectionControlsInFullscreen}
                onProfileChange={updateProfile}
              />
            </main>
          </div>
        </div>
      </div>

      {fullscreen && (
        <div className="fixed inset-0 z-[70] bg-[#090d12] text-[#e9eff7]">
          <div className="mx-auto flex h-full max-w-[1720px] flex-col px-4 py-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/15 bg-[#101821] px-4 py-3">
              <div>
                <p className="kicker text-white/60">Desktop Preview</p>
                <p className="mt-1 text-sm text-white/80">Standalone portfolio view</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {templateOptions.map((option) => (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => setActiveTemplate(option.key)}
                    className={`rounded-full px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] transition-colors ${
                      option.key === activeTemplate
                        ? "bg-primary text-primary-foreground"
                        : "border border-white/20 bg-white/5 text-white/75 hover:border-primary/50"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    setHideAddSectionControlsInFullscreen((prev) => !prev)
                  }
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-white/80 hover:border-primary/60"
                >
                  {hideAddSectionControlsInFullscreen
                    ? "Show Add Section"
                    : "Hide Add Section"}
                </button>

                <button
                  type="button"
                  onClick={() => setFullscreen(false)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-white/80 hover:border-primary/60"
                >
                  <Minimize className="h-3.5 w-3.5" />
                  Exit
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-auto rounded-[1.5rem] border border-white/15 bg-[#0f151d] p-4 md:p-8">
              <div className="mx-auto w-full max-w-[1440px]">
                <ActiveComponent
                  profile={profile}
                  editable
                  showAddSectionControls={!hideAddSectionControlsInFullscreen}
                  onProfileChange={updateProfile}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Preview;
