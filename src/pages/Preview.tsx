import { useState } from "react";
import TemplateSelector, { type TemplateName } from "@/components/TemplateSelector";
import MinimalTemplate from "@/components/templates/MinimalTemplate";
import ProfessionalTemplate from "@/components/templates/ProfessionalTemplate";
import CreativeTemplate from "@/components/templates/CreativeTemplate";
import { useResume } from "@/context/ResumeContext";
import { Link } from "react-router-dom";

const templateMap = {
  minimal: MinimalTemplate,
  professional: ProfessionalTemplate,
  creative: CreativeTemplate,
} as const;

const Preview = () => {
  const { profile, updateProfile } = useResume();
  const [activeTemplate, setActiveTemplate] = useState<TemplateName>("minimal");

  const ActiveComponent = templateMap[activeTemplate];

  if (!profile) {
    return (
      <div className="min-h-screen bg-background text-foreground grain scanlines">
        <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
          <p className="label mb-3 text-zinc-500">Preview</p>
          <h1 className="mb-4 text-2xl font-semibold tracking-tight text-zinc-100">
            No profile loaded yet
          </h1>
          <p className="mb-6 max-w-md text-sm text-zinc-400">
            Upload your LinkedIn PDF on the main page to generate a profile, then come back
            here to fine-tune your live portfolio preview.
          </p>
          <Link
            to="/"
            className="spring-hover inline-flex items-center rounded-full bg-primary px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground"
          >
            Go to upload
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground grain scanlines">
      <div className="mx-auto flex min-h-screen max-w-6xl gap-6 px-6 py-10">
        <aside className="w-full max-w-xs rounded-3xl border border-zinc-800 bg-sidebar px-5 py-6">
          <div className="mb-6">
            <p className="label mb-2 text-zinc-500">Controls</p>
            <p className="text-sm text-zinc-300">
              Switch portfolio templates. Edits in the preview update your parsed profile
              directly.
            </p>
          </div>

          <div className="mb-8">
            <TemplateSelector
              active={activeTemplate}
              onChange={setActiveTemplate}
              label="Portfolio template"
            />
          </div>

          <p className="rounded-2xl border border-zinc-800 bg-zinc-950/70 px-4 py-3 text-xs text-zinc-500">
            Each template uses its own palette and typography to mirror real portfolio site
            aesthetics.
          </p>
        </aside>

        <main className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="label mb-1 text-zinc-500">Live preview</p>
              <p className="text-xs text-zinc-500">
                Click your name or headline to edit directly.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-black/70 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.9)]">
            <ActiveComponent
              profile={profile}
              editable
              onProfileChange={updateProfile}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Preview;
