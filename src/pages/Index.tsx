import { useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import StepsSection from "@/components/StepsSection";

const upsertMeta = (attr: "name" | "property", key: string, content: string) => {
  let tag = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.content = content;
};

const upsertLink = (rel: string, href: string) => {
  let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.rel = rel;
    document.head.appendChild(link);
  }
  link.href = href;
};

const upsertJsonLd = (id: string, data: Record<string, unknown>) => {
  let script = document.querySelector(`script#${id}`) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = id;
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
};

const Index = () => {
  useEffect(() => {
    const title = "Profolio | Developer Portfolio Builder from LinkedIn PDF";
    const description =
      "Create and export a developer portfolio from your LinkedIn PDF in minutes. Compare 9 templates, edit inline, and download clean self-contained HTML ready to host anywhere.";
    const canonicalUrl = `${window.location.origin}/`;

    document.title = title;
    upsertMeta("name", "description", description);
    upsertMeta(
      "name",
      "keywords",
      "developer portfolio builder, LinkedIn PDF portfolio, portfolio website generator, online portfolio creator"
    );
    upsertMeta("name", "robots", "index, follow");
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:url", canonicalUrl);
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    upsertLink("canonical", canonicalUrl);

    upsertJsonLd("profolio-software-jsonld", {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Profolio",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      featureList: [
        "LinkedIn PDF import",
        "Inline portfolio editing",
        "Template switching",
        "One-click HTML code export",
      ],
      url: canonicalUrl,
    });

    upsertJsonLd("profolio-faq-jsonld", {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What can I build today in Profolio?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "You can upload your LinkedIn PDF, edit your content, preview templates, and export your portfolio as a clean standalone HTML file ready to host anywhere.",
          },
        },
        {
          "@type": "Question",
          name: "Is GitHub import already available?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "GitHub import is planned as the next release and is currently marked as coming soon.",
          },
        },
      ],
    });
  }, []);

  return (
    <main className="landing-dark landing-noise relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="relative pb-20">
        <HeroSection />
        <StepsSection />
      </div>
    </main>
  );
};

export default Index;
