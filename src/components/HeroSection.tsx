import { ArrowDown } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="flex flex-col items-center justify-center px-6 pt-32 pb-20 text-center">
      <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground mb-8">
        <span className="inline-block h-2 w-2 rounded-full bg-primary animate-pulse" />
        No login required
      </div>
      <h1 className="max-w-3xl text-5xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl">
        Turn your LinkedIn PDF into a{" "}
        <span className="text-primary">Website.</span>
      </h1>
      <p className="mt-6 max-w-lg text-lg text-muted-foreground">
        No scraping, no login required. Just upload your profile PDF.
      </p>
      <a
        href="#upload"
        className="mt-10 flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        Get started
        <ArrowDown className="h-4 w-4 animate-bounce" />
      </a>
    </section>
  );
};

export default HeroSection;
