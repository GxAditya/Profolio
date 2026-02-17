import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, Loader2, CheckCircle2 } from "lucide-react";
import { parseLinkedInPDF } from "@/lib/parseLinkedInPDF";
import { useResume } from "@/context/ResumeContext";

const UploadSection = () => {
  const [parsing, setParsing] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [parsed, setParsed] = useState(false);
  const { setProfile } = useResume();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      const file = acceptedFiles[0];
      setFileName(file.name);
      setParsing(true);
      setParsed(false);

      try {
        const profile = await parseLinkedInPDF(file);
        console.log("Parsed profile:", profile);
        setProfile(profile);
        setParsed(true);
      } catch (err) {
        console.error("Parse failed:", err);
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
    <section id="upload" className="mx-auto max-w-2xl px-6 pb-32 pt-8">
      <div
        {...getRootProps()}
        className={`group relative flex min-h-[260px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-200 ${
          parsing
            ? "border-border bg-card pointer-events-none"
            : isDragActive
            ? "border-primary bg-accent"
            : "border-[hsl(var(--dropzone-border))] bg-[hsl(var(--dropzone))] hover:border-primary hover:bg-accent"
        }`}
      >
        <input {...getInputProps()} />

        {parsing ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-sm font-medium text-muted-foreground">
              Parsing <span className="text-foreground">{fileName}</span>...
            </p>
          </div>
        ) : parsed && fileName ? (
          <div className="flex flex-col items-center gap-3">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
            <p className="text-sm font-medium text-foreground">{fileName}</p>
            <p className="text-xs text-muted-foreground">
              Parsed successfully · Drop another file to replace
            </p>
          </div>
        ) : fileName ? (
          <div className="flex flex-col items-center gap-3">
            <FileText className="h-10 w-10 text-primary" />
            <p className="text-sm font-medium text-foreground">{fileName}</p>
            <p className="text-xs text-muted-foreground">
              Drop another file to replace
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-primary transition-transform group-hover:scale-110">
              <Upload className="h-6 w-6" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">
                <span className="text-primary">Click to upload</span> or drag
                and drop
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                PDF files only
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default UploadSection;
