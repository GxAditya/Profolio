import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import StepsSection from "@/components/StepsSection";
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

const Index = () => {
  const { profile } = useResume();
  const [activeTemplate, setActiveTemplate] = useState<TemplateName>("neumorphism");
  const ActiveComponent = templateMap[activeTemplate];

  return (
    <div className="paper-grain relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="relative mx-auto max-w-7xl pb-20">
        <HeroSection hasProfile={Boolean(profile)} />
        <StepsSection />
        <UploadSection />
      </div>

      {profile && (
        <section className="pb-10">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="kicker text-foreground/55">Template Lab</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl">
                  Choose your portfolio direction
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-foreground/70">
                Template selector sits above your rendered page preview.
              </p>
            </div>

            <div className="page-panel rounded-[1rem] p-5 sm:p-6">
              <TemplateSelector
                active={activeTemplate}
                onChange={setActiveTemplate}
                label="Portfolio template"
              />
            </div>
          </div>

          <div className="mt-6 w-full">
            <ActiveComponent profile={profile} sectionStyle="plain" />
          </div>
        </section>
      )}
    </div>
  );
};

export default Index;
