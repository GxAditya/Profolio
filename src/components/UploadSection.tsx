import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  Upload,
  FileText,
  Loader2,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
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
        console.log("Parsed profile:", profile);
        setProfile(profile);
        setParsed(true);
      } catch (err) {
        console.error("Parse failed:", err);
        setParsed(false);
        setParseError(
          err instanceof Error
            ? err.message
            : "Unable to parse this PDF. Please try exporting from LinkedIn again."
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

  return (
    <section id="upload" className="mx-auto max-w-3xl px-6 pb-28 pt-8">
      <div
        {...getRootProps()}
        className={`group relative flex min-h-[260px] cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed bg-black/40 transition-all duration-200 ${
          parsing
            ? "pointer-events-none border-zinc-800 bg-zinc-950/80"
            : isDragActive
            ? "border-primary/80 bg-primary/5 shadow-[0_0_40px_rgba(255,77,0,0.35)]"
            : "border-[hsl(var(--dropzone-border))] bg-[hsl(var(--dropzone))] hover:border-primary/80 hover:bg-zinc-950/80"
        }`}
      >
        <input {...getInputProps()} />

        {parsing ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-sm font-medium text-zinc-300">
              Parsing <span className="text-foreground">{fileName}</span>...
            </p>
          </div>
        ) : parsed && fileName ? (
          <div className="flex flex-col items-center gap-4">
            <CheckCircle2 className="h-10 w-10 text-emerald-400" />
            <p className="text-sm font-medium text-zinc-100">{fileName}</p>
            <p className="text-xs text-zinc-500">
              Parsed successfully · Drop another file to replace
            </p>
            <Link
              to="/preview"
              onClick={stopDropzoneClick}
              onPointerDown={stopDropzoneClick}
              onMouseDown={stopDropzoneClick}
              onKeyDown={stopDropzoneClick}
              className="spring-hover inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground shadow-lg hover:bg-primary/90"
            >
              Open live preview
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : parseError && fileName ? (
          <div className="flex flex-col items-center gap-3">
            <AlertCircle className="h-10 w-10 text-rose-400" />
            <p className="text-sm font-medium text-zinc-100">{fileName}</p>
            <p className="max-w-md text-center text-xs text-rose-300">{parseError}</p>
            <p className="text-xs text-zinc-500">
              Re-export your profile from LinkedIn, then drop the file again.
            </p>
          </div>
        ) : fileName ? (
          <div className="flex flex-col items-center gap-3">
            <FileText className="h-10 w-10 text-primary" />
            <p className="text-sm font-medium text-zinc-100">{fileName}</p>
            <p className="text-xs text-zinc-500">
              Drop another file to replace
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-primary transition-transform group-hover:scale-110">
              <Upload className="h-7 w-7" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-zinc-100">
                <span className="text-primary">Click to upload</span> or drag and drop
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                PDF files only · we never store your data
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default UploadSection;
