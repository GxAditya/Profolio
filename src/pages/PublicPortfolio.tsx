import { useEffect, useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import type { TemplateName } from "@/components/TemplateSelector";
import ClaymorphismTemplate from "@/components/templates/ClaymorphismTemplate";
import GlassmorphismTemplate from "@/components/templates/GlassmorphismTemplate";
import MinimalismTemplate from "@/components/templates/MinimalismTemplate";
import MaterialTemplate from "@/components/templates/MaterialTemplate";
import NeobrutalismTemplate from "@/components/templates/NeobrutalismTemplate";
import NeumorphismTemplate from "@/components/templates/NeumorphismTemplate";
import {
  fetchPublishedPortfolio,
  type PublishedPortfolioRecord,
} from "@/lib/portfolioPublishing";

const templateMap = {
  neumorphism: NeumorphismTemplate,
  neobrutalism: NeobrutalismTemplate,
  glassmorphism: GlassmorphismTemplate,
  claymorphism: ClaymorphismTemplate,
  minimalism: MinimalismTemplate,
  material: MaterialTemplate,
} as const;

const isTemplateName = (value: string): value is TemplateName =>
  value === "neumorphism" || value === "neobrutalism" || value === "glassmorphism" || value === "claymorphism" || value === "minimalism" || value === "material";

const PublicPortfolio = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [portfolio, setPortfolio] = useState<PublishedPortfolioRecord | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("Invalid portfolio URL.");
      return;
    }

    let ignore = false;
    setLoading(true);
    setError(null);
    setPortfolio(null);

    void fetchPublishedPortfolio(id)
      .then((record) => {
        if (ignore) return;
        if (!record) {
          setError("Portfolio not found.");
        } else {
          setPortfolio(record);
        }
      })
      .catch((err) => {
        if (ignore) return;
        setError(err instanceof Error ? err.message : "Unable to load this portfolio.");
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  useEffect(() => {
    if (!portfolio) return;
    const fullName = portfolio.data?.fullName?.trim() || "Portfolio";
    const nextTitle = `${fullName} | Portfolio`;
    const previousTitle = document.title;
    document.title = nextTitle;

    const selector = 'meta[property="og:title"]';
    let tag = document.querySelector(selector) as HTMLMetaElement | null;
    const existed = Boolean(tag);
    const previousContent = tag?.content ?? "";

    if (!tag) {
      tag = document.createElement("meta");
      tag.setAttribute("property", "og:title");
      document.head.appendChild(tag);
    }
    tag.content = nextTitle;

    return () => {
      document.title = previousTitle;
      if (!tag) return;
      if (existed) {
        tag.content = previousContent;
      } else {
        tag.remove();
      }
    };
  }, [portfolio]);

  /* ── Loading state ── */
  if (loading) {
    return (
      <div className="app-dark relative flex min-h-screen items-center justify-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,hsl(72_100%_50%_/_0.04),transparent_60%)] blur-[90px]" />
        </div>
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-primary/60" />
          <p className="text-sm text-foreground/40">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  /* ── Error / not-found state ── */
  if (error || !portfolio) {
    return (
      <div className="app-dark relative flex min-h-screen items-center justify-center overflow-hidden px-6">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute left-1/2 top-1/3 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,hsl(72_100%_50%_/_0.04),transparent_60%)] blur-[100px]" />
          <div className="absolute inset-0 bg-[linear-gradient(hsl(0_0%_100%_/_0.02)_1px,transparent_1px),linear-gradient(90deg,hsl(0_0%_100%_/_0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black,transparent)]" />
        </div>

        <div className="relative z-10 w-full max-w-md text-center">
          <Link to="/" className="mb-8 inline-flex items-center gap-2">
            <img src="/profolio-logo.png" alt="Profolio" className="h-8 w-8 rounded-lg" />
            <span className="text-lg font-bold tracking-[-0.02em]">profolio</span>
          </Link>
          <p className="app-kicker text-primary/60">Public Portfolio</p>
          <h1 className="mt-3 text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
            {error ?? "Portfolio unavailable"}
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-foreground/35">
            The portfolio you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/"
            className="group mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-all duration-300 hover:shadow-[0_0_28px_hsl(72_100%_50%_/_0.25)]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const rawTemplateId = String(portfolio.template_id);
  const templateName: TemplateName = isTemplateName(rawTemplateId)
    ? rawTemplateId
    : "neumorphism";
  const ActiveTemplate = templateMap[templateName];

  return (
    <ActiveTemplate
      profile={portfolio.data}
      editable={false}
      showAddSectionControls={false}
      sectionStyle="plain"
    />
  );
};

export default PublicPortfolio;
