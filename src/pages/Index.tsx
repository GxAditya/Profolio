import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import StepsSection from "@/components/StepsSection";
import UploadSection from "@/components/UploadSection";
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

const Index = () => {
  const { profile } = useResume();
  const [activeTemplate, setActiveTemplate] = useState<TemplateName>("minimal");
  const ActiveComponent = templateMap[activeTemplate];

  return (
    <div className="paper-grain relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="relative mx-auto max-w-7xl pb-20">
        <HeroSection hasProfile={Boolean(profile)} />
        <StepsSection />
        <UploadSection />

        {profile && (
          <section className="mx-auto max-w-6xl px-6 pb-10">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="kicker text-foreground/55">Template Lab</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl">
                  Choose your portfolio direction
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-foreground/70">
                This is a direct rendering of your parsed profile. Switch styles and continue in
                live preview for inline edits.
              </p>
            </div>

            <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
              <aside className="page-panel rounded-[1.8rem] p-5 sm:p-6 lg:sticky lg:top-6 lg:h-fit">
                <TemplateSelector
                  active={activeTemplate}
                  onChange={setActiveTemplate}
                  label="Portfolio template"
                />
              </aside>

              <div className="page-panel-strong rounded-[2rem] p-4 sm:p-5">
                <ActiveComponent profile={profile} />
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Index;
