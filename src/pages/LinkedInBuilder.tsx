import { useEffect, useState } from "react";
import { ArrowLeft, Expand, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import UploadSection from "@/components/UploadSection";
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

const LinkedInBuilder = () => {
  const { profile, updateProfile } = useResume();
  const [activeTemplate, setActiveTemplate] = useState<TemplateName>("neumorphism");
  const ActiveComponent = templateMap[activeTemplate];

  useEffect(() => {
    const title = "LinkedIn Portfolio Builder | Upload and Edit";
    const description =
      "Upload your LinkedIn PDF, edit your portfolio inline, switch templates, and preview full-screen.";
    document.title = title;

    let descriptionTag = document.querySelector(
      'meta[name="description"]'
    ) as HTMLMetaElement | null;
    if (!descriptionTag) {
      descriptionTag = document.createElement("meta");
      descriptionTag.setAttribute("name", "description");
      document.head.appendChild(descriptionTag);
    }
    descriptionTag.content = description;
  }, []);

  return (
    <div className="app-dark relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-[12%] -top-[8%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,hsl(72_100%_50%_/_0.05),transparent_60%)] blur-[100px]" />
        <div className="absolute -right-[10%] top-[30%] h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,hsl(245_60%_60%_/_0.04),transparent_60%)] blur-[100px]" />
        <div className="absolute inset-0 bg-[linear-gradient(hsl(0_0%_100%_/_0.015)_1px,transparent_1px),linear-gradient(90deg,hsl(0_0%_100%_/_0.015)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black,transparent)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl pb-16">
        {/* Sticky header */}
        <header className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-6 sm:px-10">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Zap className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold tracking-[-0.02em]">profolio</span>
            </Link>
            <span className="hidden h-5 w-px bg-foreground/[0.1] sm:block" />
            <span className="hidden text-sm text-foreground/30 sm:block">LinkedIn Builder</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/build"
              className="inline-flex items-center gap-2 rounded-full border border-foreground/[0.1] bg-foreground/[0.04] px-4 py-2 text-sm font-medium text-foreground/40 transition-colors hover:border-foreground/20 hover:text-foreground/60"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </Link>
            <Link
              to="/preview"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground transition-all duration-300 hover:shadow-[0_0_24px_hsl(72_100%_50%_/_0.2)]"
            >
              <Expand className="h-3.5 w-3.5" />
              Full Preview
            </Link>
          </div>
        </header>

        {/* Upload + builder */}
        <div className="mt-2">
          <div className="mx-auto max-w-5xl px-6 sm:px-10">
            <h1 className="text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
              Upload, edit, and refine
            </h1>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-foreground/35">
              Drop your LinkedIn PDF to start. Pick a template, edit content inline, then preview full-screen when ready.
            </p>
          </div>

          <UploadSection />
        </div>

        {profile && (
          <section className="pb-8">
            <div className="mx-auto max-w-5xl px-6 sm:px-10">
              <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="app-kicker text-primary/60">Template Lab</p>
                  <h2 className="mt-2 text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
                    Pick a template, edit inline
                  </h2>
                </div>
                <p className="max-w-sm text-sm leading-relaxed text-foreground/35">
                  Changes update instantly. Jump to full-screen preview at any time.
                </p>
              </div>

              <div className="app-panel p-5 sm:p-6">
                <TemplateSelector
                  active={activeTemplate}
                  onChange={setActiveTemplate}
                  label="Portfolio template"
                />
              </div>
            </div>

            <div className="mt-6 w-full">
              <ActiveComponent
                profile={profile}
                editable
                showAddSectionControls
                onProfileChange={updateProfile}
                sectionStyle="plain"
              />
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default LinkedInBuilder;
