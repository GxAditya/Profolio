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
    <div className="min-h-screen bg-background text-foreground grain scanlines">
      <div className="mx-auto max-w-6xl">
        <HeroSection />
        <StepsSection />
        <UploadSection />

        {profile && (
          <section className="mx-auto max-w-5xl px-6 pb-24">
            <h2 className="mb-3 text-center text-sm font-medium uppercase tracking-[0.22em] text-zinc-500">
              Templates
            </h2>
            <p className="mb-8 text-center text-2xl font-semibold tracking-tight text-zinc-100">
              Choose how your story is presented
            </p>
            <div className="mx-auto max-w-lg">
              <TemplateSelector
                active={activeTemplate}
                onChange={setActiveTemplate}
                label="Portfolio template"
              />
            </div>

            <div className="mt-10 rounded-3xl border border-zinc-800 bg-black/60 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.85)]">
              <ActiveComponent profile={profile} />
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Index;
