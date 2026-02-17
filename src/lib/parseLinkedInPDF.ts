import * as pdfjsLib from "pdfjs-dist";
import type { LinkedInProfile, ExperienceEntry } from "@/types/linkedin";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

async function extractText(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pages: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items
      .filter((item) => "str" in item)
      .map((item) => (item as { str: string }).str);
    pages.push(strings.join(" "));
  }

  return pages.join("\n");
}

function extractName(text: string): string {
  // LinkedIn PDFs usually have the name on the very first line
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length > 0) {
    // Take first meaningful line, trim excess whitespace
    const firstLine = lines[0].trim();
    // If the first line is short enough to be a name (< 60 chars), use it
    if (firstLine.length < 60) return firstLine;
  }
  return "Your Name";
}

function extractHeadline(text: string): string {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  // Headline is typically the second line
  if (lines.length > 1) {
    const second = lines[1].trim();
    if (second.length < 200) return second;
  }
  return "Add your headline here";
}

function extractEmail(text: string): string {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const match = text.match(emailRegex);
  return match ? match[0] : "email@example.com";
}

function extractSummary(text: string): string {
  // Look for a "Summary" or "About" section
  const summaryRegex = /(?:Summary|About)\s*\n([\s\S]*?)(?:\n(?:Experience|Education|Skills|Top Skills|Certifications|Licenses))/i;
  const match = text.match(summaryRegex);
  if (match && match[1]) {
    const summary = match[1].trim();
    if (summary.length > 10) return summary;
  }
  return "Add your professional summary here.";
}

function extractExperience(text: string): ExperienceEntry[] {
  // Try to find text between "Experience" and "Education" (or other sections)
  const expRegex = /Experience\s*\n([\s\S]*?)(?:\n(?:Education|Skills|Top Skills|Certifications|Licenses|Languages|Honors|Projects|Publications|Volunteer))/i;
  const match = text.match(expRegex);

  if (!match || !match[1]) {
    return [
      {
        title: "Add your role here",
        company: "Company Name",
        duration: "Start - End",
        description: "Describe your responsibilities and achievements.",
      },
    ];
  }

  const block = match[1].trim();
  // Split experience entries — LinkedIn PDF typically has title, company, dates on separate lines
  const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);

  const entries: ExperienceEntry[] = [];
  // Simple heuristic: group every ~3-4 lines as one entry
  for (let i = 0; i < lines.length; i += 1) {
    // Look for date patterns to detect entry boundaries
    const datePattern = /(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}\s*-\s*(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|Present)\s*\d{0,4}/i;
    const durationMatch = lines[i].match(datePattern);

    if (durationMatch && entries.length > 0) {
      // Assign duration to the last entry
      entries[entries.length - 1].duration = durationMatch[0];
      // Remaining text on this line could be description
      const remaining = lines[i].replace(datePattern, "").trim();
      if (remaining) {
        entries[entries.length - 1].description = remaining;
      }
    } else if (lines[i].length < 80 && !datePattern.test(lines[i]) && entries.length < 10) {
      // Treat short lines as new entry titles
      entries.push({
        title: lines[i],
        company: i + 1 < lines.length ? lines[i + 1] : "Company",
        duration: "",
        description: "",
      });
      i++; // Skip company line
    }
  }

  if (entries.length === 0) {
    return [
      {
        title: "Add your role here",
        company: "Company Name",
        duration: "Start - End",
        description: block.substring(0, 200),
      },
    ];
  }

  // Fill in placeholders for empty fields
  return entries.map((e) => ({
    title: e.title || "Add your role here",
    company: e.company || "Company Name",
    duration: e.duration || "Start - End",
    description: e.description || "Describe your responsibilities.",
  }));
}

function extractSkills(text: string): string[] {
  const skillsRegex = /(?:Top Skills|Skills)\s*\n([\s\S]*?)(?:\n(?:Languages|Certifications|Honors|Publications|Education|Experience|$))/i;
  const match = text.match(skillsRegex);

  if (match && match[1]) {
    const skillLines = match[1]
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && s.length < 80);
    if (skillLines.length > 0) return skillLines.slice(0, 20);
  }

  return ["Add your skills here"];
}

export async function parseLinkedInPDF(file: File): Promise<LinkedInProfile> {
  try {
    const text = await extractText(file);
    console.log("Extracted PDF text:", text);

    return {
      fullName: extractName(text),
      headline: extractHeadline(text),
      email: extractEmail(text),
      summary: extractSummary(text),
      experience: extractExperience(text),
      skills: extractSkills(text),
    };
  } catch (error) {
    console.error("PDF parsing error:", error);
    return {
      fullName: "Your Name",
      headline: "Add your headline here",
      email: "email@example.com",
      summary: "Add your professional summary here.",
      experience: [
        {
          title: "Add your role here",
          company: "Company Name",
          duration: "Start - End",
          description: "Describe your responsibilities and achievements.",
        },
      ],
      skills: ["Add your skills here"],
    };
  }
}
