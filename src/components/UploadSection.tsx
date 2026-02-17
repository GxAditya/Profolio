import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  FileText,
  Loader2,
  ShieldCheck,
  Sparkles,
  Upload,
} from "lucide-react";
import { Link } from "react-router-dom";
import { parseLinkedInPDF } from "@/lib/parseLinkedInPDF";
import { useResume } from "@/context/ResumeContext";

type StopPropagationEvent = {
  stopPropagation: () => void;
};

const UploadSection = () => {
  const [parsing, setParsing] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [parsed, setParsed] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const { setProfile } = useResume();

  const stopDropzoneClick = (event: StopPropagationEvent) => {
    event.stopPropagation();
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      const file = acceptedFiles[0];
      setFileName(file.name);
      setParsing(true);
      setParsed(false);
      setParseError(null);

      try {
        const profile = await parseLinkedInPDF(file);
        setProfile(profile);
        setParsed(true);
      } catch (err) {
        setParsed(false);
        setParseError(
          err instanceof Error
            ? err.message
            : "Unable to parse this PDF. Please try exporting directly from LinkedIn again."
        );
      } finally {
        setParsing(false);
      }
    },
    [setProfile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    disabled: parsing,
  });

  const dropzoneStateClass = parsing
    ? "pointer-events-none border-foreground/15 bg-foreground/5"
    : isDragActive
      ? "border-primary/75 bg-primary/10 shadow-[0_18px_36px_rgba(161,64,37,0.18)]"
      : "border-foreground/20 bg-card/75 hover:border-primary/65 hover:bg-card";

  return (
    <section id="upload" className="mx-auto max-w-5xl px-6 pb-20 pt-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="kicker text-foreground/55">Upload</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl">
            Drop your LinkedIn PDF
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-foreground/70">
          We parse your file in-session and immediately open an editable portfolio preview.
        </p>
      </div>

      <div
        {...getRootProps()}
        className={`group page-panel spring-hover relative min-h-[300px] cursor-pointer rounded-[2rem] border-2 border-dashed p-6 sm:p-9 ${dropzoneStateClass}`}
      >
        <input {...getInputProps()} />

        <div className="pointer-events-none absolute right-4 top-4 hidden items-center gap-2 rounded-full border border-foreground/15 bg-card/80 px-3 py-1.5 text-[0.64rem] uppercase tracking-[0.16em] text-foreground/60 sm:inline-flex">
          <ShieldCheck className="h-3.5 w-3.5 text-accent" />
          Session-only parse
        </div>

        {parsing ? (
          <div className="flex min-h-[250px] flex-col items-center justify-center gap-3 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-sm font-medium text-foreground/85">
              Parsing <span className="font-semibold text-foreground">{fileName}</span>
            </p>
            <p className="text-xs text-foreground/60">Extracting sections and normalizing fields...</p>
          </div>
        ) : parsed && fileName ? (
          <div className="flex min-h-[250px] flex-col items-center justify-center gap-4 text-center">
            <CheckCircle2 className="h-11 w-11 text-accent" />
            <div>
              <p className="text-sm font-semibold text-foreground">{fileName}</p>
              <p className="mt-1 text-xs text-foreground/65">
                Parsed successfully. Drop another file anytime to replace it.
              </p>
            </div>
            <Link
              to="/preview"
              onClick={stopDropzoneClick}
              onPointerDown={stopDropzoneClick}
              onMouseDown={stopDropzoneClick}
              onKeyDown={stopDropzoneClick}
              className="lift-ring spring-hover inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground"
            >
              Open Live Preview
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : parseError && fileName ? (
          <div className="flex min-h-[250px] flex-col items-center justify-center gap-3 text-center">
            <AlertCircle className="h-10 w-10 text-destructive" />
            <p className="text-sm font-medium text-foreground">{fileName}</p>
            <p className="max-w-xl text-xs leading-relaxed text-destructive/90">{parseError}</p>
            <p className="text-xs text-foreground/65">
              Export a fresh PDF from LinkedIn and upload again.
            </p>
          </div>
        ) : fileName ? (
          <div className="flex min-h-[250px] flex-col items-center justify-center gap-3 text-center">
            <FileText className="h-10 w-10 text-primary" />
            <p className="text-sm font-semibold text-foreground">{fileName}</p>
            <p className="text-xs text-foreground/65">Drop another file to replace</p>
          </div>
        ) : (
          <div className="flex min-h-[250px] flex-col items-center justify-center gap-4 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-foreground/15 bg-card text-primary transition-transform group-hover:scale-110">
              <Upload className="h-7 w-7" />
            </span>
            <div>
              <p className="text-base font-semibold text-foreground sm:text-lg">
                Click to upload or drag and drop
              </p>
              <p className="mt-1 text-sm text-foreground/65">Accepts PDF only. 1 file per run.</p>
            </div>
            <p className="mono inline-flex items-center gap-1 text-[0.68rem] uppercase tracking-[0.16em] text-foreground/55">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Fast parse • editable output • template switching
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default UploadSection;
