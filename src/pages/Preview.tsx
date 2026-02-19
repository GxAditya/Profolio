import { useRef, useState } from "react";
import { ArrowLeft, Download, Github, X } from "lucide-react";
import { Link } from "react-router-dom";
import ClaymorphismTemplate from "@/components/templates/ClaymorphismTemplate";
import NeumorphismTemplate from "@/components/templates/NeumorphismTemplate";
import NeobrutalismTemplate from "@/components/templates/NeobrutalismTemplate";
import GlassmorphismTemplate from "@/components/templates/GlassmorphismTemplate";
import MinimalismTemplate from "@/components/templates/MinimalismTemplate";
import MaterialTemplate from "@/components/templates/MaterialTemplate";
import FlatDesignTemplate from "@/components/templates/FlatDesignTemplate";
import RetroTemplate from "@/components/templates/RetroTemplate";
import CyberpunkTemplate from "@/components/templates/CyberpunkTemplate";
import { useResume } from "@/context/ResumeContext";
import { deploymentGuides } from "@/lib/deploymentGuides";
import { exportPortfolioAsHtml } from "@/lib/exportPortfolio";
import type { TemplateName } from "@/types/template";

const templateMap = {
  neumorphism: NeumorphismTemplate,
  neobrutalism: NeobrutalismTemplate,
  glassmorphism: GlassmorphismTemplate,
  claymorphism: ClaymorphismTemplate,
  minimalism: MinimalismTemplate,
  material: MaterialTemplate,
  flatdesign: FlatDesignTemplate,
  retro: RetroTemplate,
  cyberpunk: CyberpunkTemplate,
} as const;

const templateOptions: { key: TemplateName; label: string }[] = [
  { key: "neumorphism", label: "Neumorphism" },
  { key: "neobrutalism", label: "Neobrutalism" },
  { key: "glassmorphism", label: "Glassmorphism" },
  { key: "claymorphism", label: "Claymorphism" },
  { key: "minimalism", label: "Minimalism" },
  { key: "material", label: "Material" },
  { key: "flatdesign", label: "Flat Design" },
  { key: "retro", label: "Retro" },
  { key: "cyberpunk", label: "Cyberpunk" },
];

/* ── Floating toolbar button helpers ── */
const tbActive =
  "bg-[hsl(72_100%_50%)] text-[hsl(240_6%_6%)] font-bold";
const tbInactive =
  "border border-white/[0.15] bg-white/[0.07] text-white/80 hover:border-white/25 hover:bg-white/[0.12]";
const tbBase =
  "rounded-lg px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.12em] transition-all duration-200";
const tbSecondary =
  "inline-flex items-center gap-2 rounded-lg border border-white/[0.15] bg-white/[0.07] px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-white/80 transition-all duration-200 hover:border-white/25 hover:bg-white/[0.12]";

const Preview = () => {
  const { profile, activeTemplate, setActiveTemplate } = useResume();
  const portfolioRef = useRef<HTMLDivElement>(null);
  const [showDeployGuide, setShowDeployGuide] = useState(false);

  const ActiveComponent = templateMap[activeTemplate];

  const handleExport = () => {
    if (!portfolioRef.current) return;
    const name = profile?.fullName || "my";
    exportPortfolioAsHtml(portfolioRef.current, name);
    setShowDeployGuide(true);
  };

  /* ── Empty state ── */
  if (!profile) {
    return (
      <div className="app-dark relative flex min-h-screen items-center justify-center overflow-hidden px-6">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute left-1/2 top-1/3 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,hsl(72_100%_50%_/_0.05),transparent_60%)] blur-[100px]" />
          <div className="absolute inset-0 bg-[linear-gradient(hsl(0_0%_100%_/_0.02)_1px,transparent_1px),linear-gradient(90deg,hsl(0_0%_100%_/_0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black,transparent)]" />
        </div>

        <div className="relative z-10 w-full max-w-md text-center">
          <Link to="/" className="mb-8 inline-flex items-center gap-2">
            <img src="/profolio-logo.png" alt="Profolio" className="h-8 w-8 rounded-lg" />
            <span className="text-lg font-bold tracking-[-0.02em]">profolio</span>
          </Link>
          <p className="app-kicker text-primary/60">Preview</p>
          <h1 className="mt-3 text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
            No profile found yet
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-foreground/35">
            Upload your LinkedIn PDF first, then return here to edit and compare templates.
          </p>
          <Link
            to="/linkedin"
            className="group mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-all duration-300 hover:shadow-[0_0_28px_hsl(72_100%_50%_/_0.25)]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            Go To Upload
          </Link>
        </div>
      </div>
    );
  }

  /* ── Floating toolbar ── */
  const renderToolbar = () => (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] flex justify-center p-4">
      <div className="pointer-events-auto flex min-w-0 max-w-[calc(100vw-2rem)] items-center gap-1.5 rounded-2xl border border-white/[0.1] bg-black/60 px-3 py-2 shadow-[0_16px_48px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        {/* Scrollable template list */}
        <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto [scrollbar-color:hsl(72_100%_50%_/_0.4)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[hsl(72_100%_50%_/_0.4)] [&::-webkit-scrollbar-track]:bg-transparent pb-1">
          {templateOptions.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setActiveTemplate(option.key)}
              className={`shrink-0 ${tbBase} ${option.key === activeTemplate ? tbActive : tbInactive}`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <span className="mx-1 h-5 w-px shrink-0 bg-white/[0.1]" />

        {/* Fixed action buttons */}
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={handleExport}
            className={`inline-flex items-center gap-2 ${tbBase} ${tbActive}`}
          >
            <Download className="h-3.5 w-3.5" />
            Export Code
          </button>

          <Link to="/linkedin" className={tbSecondary}>
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </Link>
        </div>
      </div>
    </div>
  );

  const renderDeployGuidePopup = () => {
    if (!showDeployGuide) return null;

    return (
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[70] flex justify-center px-4 sm:bottom-5">
        <section className="pointer-events-auto w-full max-w-5xl max-h-[78vh] overflow-y-auto rounded-2xl border border-white/[0.12] bg-[#0c0c12]/95 shadow-[0_24px_64px_rgba(0,0,0,0.55)] backdrop-blur-xl animate-in fade-in slide-in-from-bottom-6 duration-300">
          <div className="flex items-start justify-between gap-3 border-b border-white/[0.1] px-5 py-4">
            <div>
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-primary/75">
                Deployment Guide
              </p>
              <h3 className="mt-1 text-base font-bold tracking-tight text-white">
                Code exported. Publish it now.
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-white/60">
                Follow these quick steps to deploy your exported{" "}
                <code className="rounded bg-white/[0.08] px-1 py-0.5 text-white/80">index.html</code>.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowDeployGuide(false)}
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.14] bg-white/[0.05] text-white/75 transition-colors hover:bg-white/[0.12] hover:text-white"
              aria-label="Close deployment guide"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid gap-3 p-4 md:grid-cols-3">
            {deploymentGuides.map((guide) => (
              <article
                key={guide.platform}
                className="rounded-xl border border-white/[0.12] bg-white/[0.04] p-3.5"
              >
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold tracking-tight text-white">{guide.platform}</p>
                  {guide.logoSrc ? (
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-white p-[3px]">
                      <img
                        src={guide.logoSrc}
                        alt={guide.logoAlt ?? `${guide.platform} logo`}
                        className="h-full w-full object-contain"
                        loading="lazy"
                      />
                    </span>
                  ) : guide.id === "github-pages" ? (
                    <Github className="h-4 w-4 text-white/75" />
                  ) : null}
                </div>
                <ol className="space-y-1.5">
                  {guide.steps.map((step, index) => (
                    <li key={step} className="flex items-start gap-2 text-[0.76rem] leading-relaxed text-white/65">
                      <span className="mt-[2px] inline-flex h-4 w-4 shrink-0 items-center justify-center rounded border border-primary/35 bg-primary/[0.15] text-[0.6rem] font-semibold text-primary">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </article>
            ))}
          </div>
        </section>
      </div>
    );
  };

  return (
    <>
      {renderToolbar()}
      <div ref={portfolioRef} className="relative min-h-screen pt-20">
        <ActiveComponent
          profile={profile}
          editable={false}
          showAddSectionControls={false}
          sectionStyle="plain"
        />
      </div>
      {renderDeployGuidePopup()}
    </>
  );
};

export default Preview;
