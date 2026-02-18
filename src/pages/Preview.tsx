import { useEffect, useState } from "react";
import { ArrowLeft, Check, Copy, Expand, Loader2, Minimize } from "lucide-react";
import { Link } from "react-router-dom";
import { type TemplateName } from "@/components/TemplateSelector";
import ClaymorphismTemplate from "@/components/templates/ClaymorphismTemplate";
import NeumorphismTemplate from "@/components/templates/NeumorphismTemplate";
import NeobrutalismTemplate from "@/components/templates/NeobrutalismTemplate";
import GlassmorphismTemplate from "@/components/templates/GlassmorphismTemplate";
import MinimalismTemplate from "@/components/templates/MinimalismTemplate";
import MaterialTemplate from "@/components/templates/MaterialTemplate";
import FlatDesignTemplate from "@/components/templates/FlatDesignTemplate";
import RetroTemplate from "@/components/templates/RetroTemplate";
import { useResume } from "@/context/ResumeContext";
import { publishPortfolio } from "@/lib/portfolioPublishing";

const templateMap = {
  neumorphism: NeumorphismTemplate,
  neobrutalism: NeobrutalismTemplate,
  glassmorphism: GlassmorphismTemplate,
  claymorphism: ClaymorphismTemplate,
  minimalism: MinimalismTemplate,
  material: MaterialTemplate,
  flatdesign: FlatDesignTemplate,
  retro: RetroTemplate,
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
  const { profile, updateProfile } = useResume();
  const [activeTemplate, setActiveTemplate] = useState<TemplateName>("neumorphism");
  const [fullscreen, setFullscreen] = useState(false);
  const [hideAddSectionControlsInFullscreen, setHideAddSectionControlsInFullscreen] =
    useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const ActiveComponent = templateMap[activeTemplate];

  const handlePublish = async () => {
    if (!profile) return;
    setPublishing(true);
    setPublishError(null);

    try {
      const record = await publishPortfolio({
        data: profile,
        templateId: activeTemplate,
      });
      setPublishedUrl(`${window.location.origin}/p/${record.id}`);
      setCopied(false);
    } catch (error) {
      setPublishError(error instanceof Error ? error.message : "Unable to publish portfolio.");
    } finally {
      setPublishing(false);
    }
  };

  const handleCopyPublishedUrl = async () => {
    if (!publishedUrl) return;

    try {
      await navigator.clipboard.writeText(publishedUrl);
      setCopied(true);
    } catch {
      setPublishError("Couldn't copy the link. Please copy it manually.");
    }
  };

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

  useEffect(() => {
    if (!copied) return;
    const timeoutId = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timeoutId);
  }, [copied]);

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

  /* ── Floating toolbar (shared between normal + fullscreen) ── */
  const renderToolbar = (isFullscreenMode: boolean) => (
    <div className={`pointer-events-none fixed inset-x-0 top-0 z-[${isFullscreenMode ? 71 : 60}] flex justify-center p-4`}>
      <div className="pointer-events-auto flex flex-wrap items-center gap-1.5 rounded-2xl border border-white/[0.1] bg-black/60 px-3 py-2 shadow-[0_16px_48px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        {templateOptions.map((option) => (
          <button
            key={option.key}
            type="button"
            onClick={() => setActiveTemplate(option.key)}
            className={`${tbBase} ${option.key === activeTemplate ? tbActive : tbInactive}`}
          >
            {option.label}
          </button>
        ))}

        <span className="mx-1 h-5 w-px bg-white/[0.1]" />

        <button
          type="button"
          onClick={handlePublish}
          disabled={publishing}
          className={`inline-flex items-center gap-2 ${tbBase} ${tbActive} disabled:cursor-not-allowed disabled:opacity-60`}
        >
          {publishing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
          {publishing ? "Publishing..." : publishedUrl ? "Republish" : "Publish"}
        </button>

        {!isFullscreenMode && (
          <button
            type="button"
            onClick={() => setFullscreen(true)}
            className={tbSecondary}
          >
            <Expand className="h-3.5 w-3.5" />
            Full Screen
          </button>
        )}

        <button
          type="button"
          onClick={() =>
            setHideAddSectionControlsInFullscreen((prev) => !prev)
          }
          className={tbSecondary}
        >
          {hideAddSectionControlsInFullscreen ? "Show Sections" : "Hide Sections"}
        </button>

        {isFullscreenMode ? (
          <button
            type="button"
            onClick={() => setFullscreen(false)}
            className={tbSecondary}
          >
            <Minimize className="h-3.5 w-3.5" />
            Exit
          </button>
        ) : (
          <Link to="/linkedin" className={tbSecondary}>
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </Link>
        )}
      </div>
    </div>
  );

  /* ── Published URL bar ── */
  const renderPublishBar = () => {
    if (!publishedUrl && !publishError) return null;
    return (
      <div className="pointer-events-none fixed inset-x-0 top-[4.5rem] z-[60] flex justify-center px-4">
        <div className="pointer-events-auto w-full max-w-4xl rounded-xl border border-white/[0.1] bg-black/60 p-3 shadow-[0_12px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl">
          {publishedUrl && (
            <div className="flex flex-wrap items-center justify-between gap-2">
              <a
                href={publishedUrl}
                target="_blank"
                rel="noreferrer"
                className="break-all text-sm text-[hsl(72_100%_65%)] underline decoration-[hsl(72_100%_50%_/_0.3)] underline-offset-4"
              >
                {publishedUrl}
              </a>
              <button
                type="button"
                onClick={handleCopyPublishedUrl}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.15] bg-white/[0.07] px-3 py-1.5 text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-white/85 transition-colors hover:bg-white/[0.12]"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy Link"}
              </button>
            </div>
          )}
          {publishError && (
            <p className="mt-2 text-xs text-red-400">{publishError}</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="relative min-h-screen">
        <ActiveComponent
          profile={profile}
          editable
          showAddSectionControls={!hideAddSectionControlsInFullscreen}
          onProfileChange={updateProfile}
          sectionStyle="plain"
        />
        {renderToolbar(false)}
        {renderPublishBar()}
      </div>

      {fullscreen && (
        <div className="fixed inset-0 z-[70] overflow-auto">
          <ActiveComponent
            profile={profile}
            editable
            showAddSectionControls={!hideAddSectionControlsInFullscreen}
            onProfileChange={updateProfile}
            sectionStyle="plain"
          />
          {renderToolbar(true)}
        </div>
      )}
    </>
  );
};

export default Preview;
