import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="paper-grain relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 text-foreground">
      <div className="pointer-events-none absolute inset-0 dot-field opacity-[0.2]" aria-hidden="true" />
      <div className="page-panel relative w-full max-w-xl rounded-[1.15rem] p-10 text-center">
        <p className="kicker text-foreground/55">404</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-foreground sm:text-5xl">
          This route does not exist
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-foreground/70">
          The page at <span className="mono text-foreground/80">{location.pathname}</span> could
          not be found.
        </p>
        <Link
          to="/"
          className="lift-ring spring-hover mt-7 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
