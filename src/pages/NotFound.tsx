import { useEffect } from "react";
import { ArrowLeft, Zap } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="app-dark relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute left-1/2 top-1/3 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,hsl(0_80%_50%_/_0.06),transparent_60%)] blur-[100px]" />
        <div className="absolute inset-0 bg-[linear-gradient(hsl(0_0%_100%_/_0.02)_1px,transparent_1px),linear-gradient(90deg,hsl(0_0%_100%_/_0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black,transparent)]" />
      </div>

      <div className="relative z-10 w-full max-w-md text-center">
        <Link to="/" className="mb-8 inline-flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-[-0.02em]">profolio</span>
        </Link>

        <p className="text-[6rem] font-extrabold leading-none tracking-[-0.05em] text-foreground/[0.06]">
          404
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
          Page not found
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-foreground/35">
          The route{" "}
          <code className="rounded bg-foreground/[0.06] px-1.5 py-0.5 font-mono text-xs text-foreground/50">
            {location.pathname}
          </code>{" "}
          doesn't exist.
        </p>
        <Link
          to="/"
          className="group mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-all duration-300 hover:shadow-[0_0_28px_hsl(72_100%_50%_/_0.25)]"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
          Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
