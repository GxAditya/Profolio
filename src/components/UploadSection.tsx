import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  FileText,
  Loader2,
  ShieldCheck,
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
    ? "pointer-events-none border-foreground/[0.08] bg-foreground/[0.02]"
    : isDragActive
      ? "app-dropzone-active border-2"
      : "app-dropzone-idle border-2 hover:border-primary/40 hover:bg-primary/[0.02]";

  return (
    <section id="upload" className="mx-auto max-w-5xl px-6 pb-16 pt-8 sm:px-10">
      <div
        {...getRootProps()}
        className={`group relative min-h-[280px] cursor-pointer rounded-2xl border-dashed p-6 transition-all duration-300 sm:p-9 ${dropzoneStateClass}`}
      >
        <input {...getInputProps()} />

        <div className="pointer-events-none absolute right-4 top-4 hidden items-center gap-2 rounded-full border border-foreground/[0.08] bg-foreground/[0.04] px-3 py-1.5 text-[0.62rem] uppercase tracking-[0.16em] text-foreground/25 sm:inline-flex">
          <ShieldCheck className="h-3.5 w-3.5 text-primary/60" />
          Session-only parse
        </div>

        {parsing ? (
          <div className="flex min-h-[230px] flex-col items-center justify-center gap-3 text-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-sm font-medium text-foreground/70">
              Parsing <span className="font-semibold text-foreground">{fileName}</span>
            </p>
            <p className="text-xs text-foreground/30">Extracting sections and normalizing fields...</p>
          </div>
        ) : parsed && fileName ? (
          <div className="flex min-h-[230px] flex-col items-center justify-center gap-4 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/[0.1]">
              <CheckCircle2 className="h-7 w-7 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">{fileName}</p>
              <p className="mt-1 text-xs text-foreground/35">
                Parsed successfully. Your editable preview is ready below.
              </p>
            </div>
            <Link
              to="/preview"
              onClick={stopDropzoneClick}
              onPointerDown={stopDropzoneClick}
              onMouseDown={stopDropzoneClick}
              onKeyDown={stopDropzoneClick}
              className="group/btn inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground transition-all duration-300 hover:shadow-[0_0_24px_hsl(72_100%_50%_/_0.2)]"
            >
              Open Full Preview
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
            </Link>
          </div>
        ) : parseError && fileName ? (
          <div className="flex min-h-[230px] flex-col items-center justify-center gap-3 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/[0.1]">
              <AlertCircle className="h-7 w-7 text-destructive" />
            </div>
            <p className="text-sm font-bold text-foreground">{fileName}</p>
            <p className="max-w-xl text-xs leading-relaxed text-destructive/80">{parseError}</p>
            <p className="text-xs text-foreground/30">
              Export a fresh PDF from LinkedIn and upload again.
            </p>
          </div>
        ) : fileName ? (
          <div className="flex min-h-[230px] flex-col items-center justify-center gap-3 text-center">
            <FileText className="h-10 w-10 text-primary/60" />
            <p className="text-sm font-bold text-foreground">{fileName}</p>
            <p className="text-xs text-foreground/30">Drop another file to replace</p>
          </div>
        ) : (
          <div className="flex min-h-[230px] flex-col items-center justify-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-foreground/[0.08] bg-foreground/[0.04] text-primary transition-transform duration-300 group-hover:scale-105">
              <Upload className="h-7 w-7" />
            </div>
            <div>
              <p className="text-base font-bold sm:text-lg">
                Click to upload or drag and drop
              </p>
              <p className="mt-1 text-sm text-foreground/30">Accepts PDF only. 1 file per run.</p>
            </div>
            <p className="inline-flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-foreground/20">
              <span className="h-1 w-1 rounded-full bg-primary/60" />
              Fast parse
              <span className="h-1 w-1 rounded-full bg-primary/60" />
              Editable output
              <span className="h-1 w-1 rounded-full bg-primary/60" />
              Template switching
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default UploadSection;
