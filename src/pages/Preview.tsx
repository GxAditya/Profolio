import { useMemo, useState } from "react";
import { ArrowLeft, PenLine, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import TemplateSelector, { type TemplateName } from "@/components/TemplateSelector";
import MinimalTemplate from "@/components/templates/MinimalTemplate";
import ProfessionalTemplate from "@/components/templates/ProfessionalTemplate";
import CreativeTemplate from "@/components/templates/CreativeTemplate";
import { useResume } from "@/context/ResumeContext";

const templateMap = {
  minimal: MinimalTemplate,
  professional: ProfessionalTemplate,
  creative: CreativeTemplate,
} as const;

const Preview = () => {
  const { profile, updateProfile } = useResume();
  const [activeTemplate, setActiveTemplate] = useState<TemplateName>("minimal");

  const ActiveComponent = templateMap[activeTemplate];

  const stats = useMemo(() => {
    if (!profile) return [];
    return [
      { label: "Roles", value: String(profile.experience.length) },
      { label: "Skills", value: String(profile.skills.length) },
      { label: "Education", value: String(profile.education?.length ?? 0) },
      { label: "Credentials", value: String(profile.certifications?.length ?? 0) },
    ];
  }, [profile]);

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
          <Link
            to="/"
            className="spring-hover inline-flex items-center gap-2 rounded-full border border-foreground/20 bg-card/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-foreground/75 hover:border-primary/55"
          >
            <ArrowLeft className="h-4 w-4" />
            Back To Upload
          </Link>
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

            <div className="mt-6 rounded-2xl border border-foreground/12 bg-card/70 p-4">
              <p className="kicker mb-3 text-foreground/55">Profile Snapshot</p>
              <div className="grid grid-cols-2 gap-2">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-xl border border-foreground/10 bg-card px-3 py-2">
                    <p className="mono text-[0.65rem] uppercase tracking-[0.14em] text-foreground/55">
                      {stat.label}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-foreground">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>

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

          <main className="page-panel-strong rounded-[2rem] p-4 sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/15 bg-white/5 px-4 py-3">
              <div>
                <p className="kicker text-white/60">Active Canvas</p>
                <p className="mt-1 text-sm text-white/80">Template: {activeTemplate}</p>
              </div>
              <p className="mono inline-flex items-center gap-2 text-[0.67rem] uppercase tracking-[0.16em] text-white/60">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Tap text blocks to edit
              </p>
            </div>

            <ActiveComponent profile={profile} editable onProfileChange={updateProfile} />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Preview;
