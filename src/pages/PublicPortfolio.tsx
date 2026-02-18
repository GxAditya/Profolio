import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import type { TemplateName } from "@/components/TemplateSelector";
import GlassmorphismTemplate from "@/components/templates/GlassmorphismTemplate";
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
} as const;

const isTemplateName = (value: string): value is TemplateName =>
  value === "neumorphism" || value === "neobrutalism" || value === "glassmorphism";

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

  if (loading) {
    return (
      <div className="paper-grain relative min-h-screen overflow-hidden bg-background text-foreground">
        <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6">
          <p className="text-sm text-foreground/70">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="paper-grain relative min-h-screen overflow-hidden bg-background text-foreground">
        <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
          <p className="kicker text-foreground/55">Public Portfolio</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl">
            {error ?? "Portfolio unavailable"}
          </h1>
          <Link
            to="/"
            className="mt-7 inline-flex items-center gap-2 rounded-lg border border-foreground/20 bg-card/80 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-foreground/80"
          >
            <ArrowLeft className="h-4 w-4" />
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
    <div className="paper-grain relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 dot-field opacity-[0.2]" aria-hidden="true" />
      <div className="relative mx-auto max-w-[1320px] px-4 py-8 sm:px-6 sm:py-10">
        <ActiveTemplate
          profile={portfolio.data}
          editable={false}
          showAddSectionControls={false}
          sectionStyle="plain"
        />
      </div>
    </div>
  );
};

export default PublicPortfolio;
