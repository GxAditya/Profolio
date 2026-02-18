import { useEffect, useState } from "react";
import { ArrowLeft, Check, Copy, Expand, Loader2, Minimize } from "lucide-react";
import { Link } from "react-router-dom";
import { type TemplateName } from "@/components/TemplateSelector";
import NeumorphismTemplate from "@/components/templates/NeumorphismTemplate";
import NeobrutalismTemplate from "@/components/templates/NeobrutalismTemplate";
import GlassmorphismTemplate from "@/components/templates/GlassmorphismTemplate";
import { useResume } from "@/context/ResumeContext";
import { publishPortfolio } from "@/lib/portfolioPublishing";

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

  if (!profile) {
    return (
      <div className="paper-grain relative min-h-screen overflow-hidden bg-background text-foreground">
        <div className="pointer-events-none absolute inset-0 dot-field opacity-[0.2]" aria-hidden="true" />
        <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6">
          <div className="page-panel w-full rounded-[1.15rem] p-8 text-center sm:p-10">
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
              className="lift-ring spring-hover mt-7 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground"
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
      <div className="relative min-h-screen">
        <ActiveComponent
          profile={profile}
          editable
          showAddSectionControls={!hideAddSectionControlsInFullscreen}
          onProfileChange={updateProfile}
          sectionStyle="plain"
        />

        <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] flex justify-center p-4">
          <div className="pointer-events-auto flex flex-wrap items-center gap-2 rounded-xl border border-black/20 bg-black/55 px-3 py-2 text-[#e9eff7] shadow-[0_12px_24px_rgba(0,0,0,0.28)] backdrop-blur-md">
            {templateOptions.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => setActiveTemplate(option.key)}
                className={`rounded-lg px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] transition-colors ${
                  option.key === activeTemplate
                    ? "bg-primary text-primary-foreground"
                    : "border border-white/25 bg-white/10 text-white/85 hover:border-primary/50"
                }`}
              >
                {option.label}
              </button>
            ))}

            <button
              type="button"
              onClick={handlePublish}
              disabled={publishing}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-primary-foreground disabled:cursor-not-allowed disabled:opacity-70"
            >
              {publishing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
              {publishing ? "Publishing..." : publishedUrl ? "Republish" : "Publish"}
            </button>

            <button
              type="button"
              onClick={() => setFullscreen(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/10 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-white/85 hover:border-primary/60"
            >
              <Expand className="h-3.5 w-3.5" />
              Full Screen
            </button>

            <button
              type="button"
              onClick={() =>
                setHideAddSectionControlsInFullscreen((prev) => !prev)
              }
              className="inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/10 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-white/85 hover:border-primary/60"
            >
              {hideAddSectionControlsInFullscreen
                ? "Show Add Section"
                : "Hide Add Section"}
            </button>

            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/10 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-white/85 hover:border-primary/60"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </Link>
          </div>
        </div>

        {(publishedUrl || publishError) && (
          <div className="pointer-events-none fixed inset-x-0 top-[4.7rem] z-[60] flex justify-center px-4">
            <div className="pointer-events-auto w-full max-w-5xl rounded-xl border border-black/20 bg-black/55 p-3 text-[#e9eff7] shadow-[0_12px_24px_rgba(0,0,0,0.28)] backdrop-blur-md">
              {publishedUrl && (
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <a
                    href={publishedUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="break-all text-sm text-[#b9edff] underline decoration-[#b9edff]/40 underline-offset-4"
                  >
                    {publishedUrl}
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyPublishedUrl}
                    className="inline-flex items-center gap-1 rounded-lg border border-white/25 bg-white/10 px-3 py-1.5 text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-white/90"
                  >
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? "Copied" : "Copy Link"}
                  </button>
                </div>
              )}
              {publishError && (
                <p className="mt-2 text-xs text-[#ffb7b7]">{publishError}</p>
              )}
            </div>
          </div>
        )}
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

          <div className="pointer-events-none fixed inset-x-0 top-0 z-[71] flex justify-center p-4">
            <div className="pointer-events-auto flex flex-wrap items-center gap-2 rounded-xl border border-black/20 bg-black/55 px-3 py-2 text-[#e9eff7] shadow-[0_12px_24px_rgba(0,0,0,0.28)] backdrop-blur-md">
              {templateOptions.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setActiveTemplate(option.key)}
                  className={`rounded-lg px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] transition-colors ${
                    option.key === activeTemplate
                      ? "bg-primary text-primary-foreground"
                      : "border border-white/25 bg-white/10 text-white/85 hover:border-primary/50"
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
                className="inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/10 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-white/85 hover:border-primary/60"
              >
                {hideAddSectionControlsInFullscreen
                  ? "Show Add Section"
                  : "Hide Add Section"}
              </button>

              <button
                type="button"
                onClick={() => setFullscreen(false)}
                className="inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/10 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-white/85 hover:border-primary/60"
              >
                <Minimize className="h-3.5 w-3.5" />
                Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Preview;
