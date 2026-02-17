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
    <div className="min-h-screen bg-background">
      <HeroSection />
      <StepsSection />
      <UploadSection />

      {profile && (
        <section className="mx-auto max-w-5xl px-6 pb-24">
          <h2 className="mb-6 text-center text-2xl font-bold tracking-tight text-foreground">
            Choose a Template
          </h2>
          <TemplateSelector active={activeTemplate} onChange={setActiveTemplate} />

          <div className="mt-10">
            <ActiveComponent profile={profile} />
          </div>
        </section>
      )}
    </div>
  );
};

export default Index;
