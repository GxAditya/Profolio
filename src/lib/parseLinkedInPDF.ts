import * as pdfjsLib from "pdfjs-dist";
import pdfWorkerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import type {
  LinkedInProfile,
  ExperienceEntry,
  EducationEntry,
} from "@/types/linkedin";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerSrc;

const DEFAULT_PROFILE: LinkedInProfile = {
  fullName: "Your Name",
  headline: "Add your headline here",
  email: "email@example.com",
  location: "",
  linkedinUrl: "",
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
  certifications: [],
  education: [],
  customSections: [],
  sectionOrder: ["hero", "skills", "experience", "education", "certifications"],
};

const MONTH_PATTERN =
  "(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)";
const DATE_RANGE_REGEX = new RegExp(
  `(?:${MONTH_PATTERN}\\s+\\d{4}|\\d{4})\\s*[\\u2013\\-]\\s*(?:Present|${MONTH_PATTERN}\\s+\\d{4}|\\d{4})`,
  "i"
);
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/i;
const LINKEDIN_REGEX = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-z0-9-]+/i;
const ROLE_KEYWORDS =
  /\b(developer|engineer|intern|trainee|contributor|manager|lead|architect|analyst|consultant|designer|scientist|specialist|founder|co-?founder)\b/i;
const INSTITUTION_KEYWORDS =
  /\b(university|college|campus|school|institute|academy|polytechnic)\b/i;
const DEGREE_KEYWORDS =
  /\b(bachelor|master|btech|mtech|bsc|msc|phd|diploma|degree|computer science|engineering)\b/i;

const LINKEDIN_PARSE_ERROR =
  "Couldn't parse this as a LinkedIn profile PDF. Please export again from LinkedIn using More > Save to PDF.";
const PDF_READ_ERROR =
  "Couldn't read text from this PDF. Please upload a text-based LinkedIn profile PDF.";

const normalizeWhitespace = (value: string): string =>
  value.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();

const normalizeLine = (value: string): string =>
  normalizeWhitespace(value.replace(/[•●▪]/g, " "));

const normalizeHeading = (value: string): string =>
  value.toLowerCase().replace(/[^a-z]+/g, " ").trim();

const dedupeCaseInsensitive = (values: string[]): string[] => {
  const seen = new Set<string>();
  const deduped: string[] = [];

  for (const value of values) {
    const key = value.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(value);
  }

  return deduped;
};

const minPositive = (values: number[], fallback: number): number => {
  const positives = values.filter((value) => value >= 0);
  return positives.length > 0 ? Math.min(...positives) : fallback;
};

const firstIndexAfter = (
  values: number[],
  start: number,
  fallback: number
): number => {
  const matches = values.filter((value) => value > start);
  return matches.length > 0 ? Math.min(...matches) : fallback;
};

const isEmailLine = (line: string): boolean => EMAIL_REGEX.test(line);

const isPhoneLine = (line: string): boolean =>
  /\+?\d[\d\s().-]{6,}\d/.test(line);

const isLinkedInLine = (line: string): boolean =>
  /(https?:\/\/|www\.)?linkedin\.com\/in\//i.test(line) ||
  /\(\s*linkedin\s*\)/i.test(line) ||
  /\blinkedin\b/i.test(line);

const isContactLine = (line: string): boolean =>
  isEmailLine(line) || isPhoneLine(line) || isLinkedInLine(line);

const isDateRangeLine = (line: string): boolean => DATE_RANGE_REGEX.test(line);

const isSummaryHeading = (line: string): boolean => {
  const heading = normalizeHeading(line);
  return (
    heading === "summary" ||
    heading === "about" ||
    heading.startsWith("summary ") ||
    heading.endsWith(" summary") ||
    heading.startsWith("about ") ||
    heading.endsWith(" about")
  );
};

const isTopSkillsHeading = (line: string): boolean => {
  const heading = normalizeHeading(line);
  return (
    heading === "top skills" ||
    heading.startsWith("top skills ") ||
    heading.includes(" top skills ")
  );
};

const isCertificationsHeading = (line: string): boolean => {
  const heading = normalizeHeading(line);
  return (
    heading === "certifications" ||
    heading === "licenses certifications" ||
    heading.startsWith("certifications ")
  );
};

const isExperienceHeading = (line: string): boolean => {
  const heading = normalizeHeading(line);
  return heading === "experience" || heading.startsWith("experience ");
};

const isEducationHeading = (line: string): boolean => {
  const heading = normalizeHeading(line);
  return heading === "education" || heading.startsWith("education ");
};

const isOtherHeading = (line: string): boolean => {
  const heading = normalizeHeading(line);
  return [
    "languages",
    "projects",
    "publications",
    "volunteer experience",
    "recommendations",
    "interests",
    "contact",
  ].includes(heading);
};

const isSectionHeading = (line: string): boolean =>
  isSummaryHeading(line) ||
  isTopSkillsHeading(line) ||
  isCertificationsHeading(line) ||
  isExperienceHeading(line) ||
  isEducationHeading(line) ||
  isOtherHeading(line);

const isLikelyLocationLine = (line: string): boolean => {
  if (
    isContactLine(line) ||
    isDateRangeLine(line) ||
    isSectionHeading(line) ||
    line.startsWith("-")
  ) {
    return false;
  }

  const words = line.split(" ").filter(Boolean);
  if (words.length < 2 || words.length > 10) return false;

  const hasLocationHints =
    /\b(remote|hybrid|on[- ]site|india|united states|usa|uk|canada|australia)\b/i.test(
      line
    );
  return hasLocationHints || line.includes(",");
};

const lineLooksLikeNoise = (line: string): boolean =>
  /^page\s+\d+\s+of\s+\d+$/i.test(line) ||
  /^linkedin$/i.test(line) ||
  /^www\.linkedin\.com\//i.test(line);

const looksLikeSkillLine = (line: string): boolean => {
  if (
    line.length < 2 ||
    line.length > 40 ||
    isSectionHeading(line) ||
    isContactLine(line) ||
    isDateRangeLine(line) ||
    isLikelyLocationLine(line) ||
    line.startsWith("-")
  ) {
    return false;
  }

  const words = line.split(" ").filter(Boolean);
  if (words.length === 0 || words.length > 4) return false;
  if (/[!?]$/.test(line)) return false;
  if (/[.]/.test(line) && words.length > 2) return false;

  return true;
};

const isLikelyCertificationLine = (line: string): boolean => {
  if (
    line.length < 2 ||
    line.length > 90 ||
    isSectionHeading(line) ||
    isContactLine(line) ||
    isDateRangeLine(line) ||
    isLikelyLocationLine(line) ||
    line.startsWith("-")
  ) {
    return false;
  }

  const words = line.split(" ").filter(Boolean);
  if (words.length === 0 || words.length > 10) return false;
  if (/[.!?]$/.test(line)) return false;

  const normalizedWords = words
    .map((word) => word.replace(/[^A-Za-z0-9]/g, ""))
    .filter(Boolean);
  if (normalizedWords.length === 0) return false;

  const titleCaseStarts = normalizedWords.filter((word) => /^[A-Z0-9]/.test(word)).length;
  if (titleCaseStarts / normalizedWords.length < 0.6) return false;

  return true;
};

const escapeRegExp = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const extractCertificationPrefixFromMixedLine = (line: string): string => {
  const hyphenMatch = line.match(/^(.{2,90}?)\s+[–—-]\s+(.+)$/);
  if (hyphenMatch) {
    const prefix = normalizeWhitespace(hyphenMatch[1]);
    return isLikelyCertificationLine(prefix) ? prefix : "";
  }

  const words = line.split(" ").filter(Boolean);
  if (words.length < 4) return "";

  let splitIndex = 0;
  for (let i = 0; i < words.length; i += 1) {
    const token = words[i].replace(/[^A-Za-z0-9.'+-]/g, "");
    if (!token) continue;
    if (/^[A-Z0-9]/.test(token)) {
      splitIndex = i + 1;
      continue;
    }
    break;
  }

  if (splitIndex < 3 || splitIndex >= words.length) return "";

  const prefix = normalizeWhitespace(words.slice(0, splitIndex).join(" "));
  return isLikelyCertificationLine(prefix) ? prefix : "";
};

const stripLeadingLabels = (line: string, labels: string[]): string => {
  let cleaned = line;

  for (const label of labels) {
    if (!label) continue;

    const escapedLabel = escapeRegExp(label);
    const delimiterPattern = new RegExp(
      `^${escapedLabel}\\s*[–—\\-:|]\\s*(.+)$`,
      "i"
    );
    const delimiterMatch = cleaned.match(delimiterPattern);
    if (delimiterMatch) {
      cleaned = normalizeWhitespace(delimiterMatch[1]);
      continue;
    }

    const spacedPattern = new RegExp(`^${escapedLabel}\\s+(.+)$`, "i");
    const spacedMatch = cleaned.match(spacedPattern);
    if (!spacedMatch) continue;

    const remainder = normalizeWhitespace(spacedMatch[1]);
    if (remainder.length >= 10) {
      cleaned = remainder;
    }
  }

  return normalizeWhitespace(cleaned);
};

const stripLinkedInFragments = (line: string): string =>
  normalizeLine(
    line
      .replace(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[A-Za-z0-9-]*/gi, " ")
      .replace(/\b[A-Za-z0-9-]{3,}\s*\(\s*linkedin\s*\)/gi, " ")
      .replace(/\(\s*linkedin\s*\)/gi, " ")
      .replace(/\blinkedin\b/gi, " ")
  );

const normalizeLinkedInUrl = (raw: string): string => {
  const cleaned = raw
    .replace(/\(\s*linkedin\s*\)/gi, "")
    .replace(/[),.;:]+/g, " ")
    .replace(/^https?:\/\//i, "");

  if (!/linkedin\.com\/in\//i.test(cleaned)) {
    return "";
  }

  const slugMatch = cleaned.match(/linkedin\.com\/in\/([a-z0-9-]+)/i);
  if (!slugMatch) return "";
  const slug = slugMatch[1].toLowerCase();
  if (slug.length < 3 || slug.endsWith("-")) {
    return "";
  }

  return `https://www.linkedin.com/in/${slug}`;
};

function toNormalizedLines(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => normalizeLine(line))
    .filter((line) => line.length > 0 && !lineLooksLikeNoise(line));
}

function extractEmail(text: string): string {
  const match = text.match(EMAIL_REGEX);
  return match ? match[0] : DEFAULT_PROFILE.email;
}

function extractLinkedinUrl(text: string, lines: string[]): string {
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (!/linkedin\.com\/in\//i.test(line)) continue;

    const next = lines[i + 1] ?? "";
    const hasDanglingSlug = /linkedin\.com\/in\/[A-Za-z0-9-]*-$/i.test(line);
    const nextSlugOnly =
      /^[A-Za-z0-9-]{3,}$/.test(next) ||
      /^[A-Za-z0-9-]{3,}\s*\(\s*LinkedIn\s*\)$/i.test(next);

    const merged = hasDanglingSlug && nextSlugOnly ? `${line}${next}` : line;
    const normalized = normalizeLinkedInUrl(merged);
    if (normalized) return normalized;
  }

  const directMatch = text.match(LINKEDIN_REGEX);
  if (directMatch) {
    const normalized = normalizeLinkedInUrl(directMatch[0]);
    if (normalized) return normalized;
  }

  return "";
}

function mergeWrappedLines(lines: string[]): string[] {
  const merged: string[] = [];

  for (const line of lines) {
    if (merged.length === 0) {
      merged.push(line);
      continue;
    }

    const previous = merged[merged.length - 1];
    const previousWords = previous.split(" ").length;
    const currentWords = line.split(" ").length;
    const shouldMerge =
      currentWords <= 2 &&
      previousWords >= 3 &&
      !isSectionHeading(line) &&
      !isDateRangeLine(line) &&
      !isContactLine(line) &&
      !line.startsWith("-");

    if (shouldMerge) {
      merged[merged.length - 1] = normalizeWhitespace(`${previous} ${line}`);
      continue;
    }

    merged.push(line);
  }

  return merged;
}

function stitchSentenceLines(lines: string[]): string[] {
  const stitched: string[] = [];

  for (const line of lines) {
    if (stitched.length === 0) {
      stitched.push(line);
      continue;
    }

    const previous = stitched[stitched.length - 1];
    const previousEndsHard = /[.!?]$/.test(previous);
    const shouldJoin =
      !line.startsWith("-") &&
      !previousEndsHard &&
      !isSectionHeading(line) &&
      !isSectionHeading(previous) &&
      !isDateRangeLine(line) &&
      !isContactLine(line);

    if (shouldJoin) {
      stitched[stitched.length - 1] = normalizeWhitespace(`${previous} ${line}`);
      continue;
    }

    stitched.push(line);
  }

  return stitched.map((line) => normalizeLine(line)).filter(Boolean);
}

function isLikelyName(line: string): boolean {
  if (line.length < 3 || line.length > 60) return false;
  if (isContactLine(line) || /\d/.test(line)) return false;

  const words = line.split(" ").filter(Boolean);
  if (words.length < 2 || words.length > 5) return false;

  const properWords = words.filter((word) => /^[A-Z][A-Za-z.'-]+$/.test(word)).length;
  return properWords >= Math.max(2, words.length - 1);
}

function extractName(headerLines: string[]): { name: string; index: number } {
  for (let i = 0; i < headerLines.length; i += 1) {
    if (isLikelyName(headerLines[i])) {
      return { name: headerLines[i], index: i };
    }
  }

  for (let i = 0; i < headerLines.length; i += 1) {
    const line = headerLines[i];
    if (!isContactLine(line) && !isSectionHeading(line) && line.length < 80) {
      return { name: line, index: i };
    }
  }

  return { name: DEFAULT_PROFILE.fullName, index: -1 };
}

function extractHeadlineAndLocation(
  headerLines: string[],
  nameIndex: number
): { headline: string; location: string } {
  const headlineParts: string[] = [];
  let location = "";

  for (let i = Math.max(0, nameIndex + 1); i < headerLines.length; i += 1) {
    const rawLine = headerLines[i];
    const line = stripLinkedInFragments(rawLine);

    if (isSectionHeading(rawLine) || isDateRangeLine(rawLine)) break;
    if (!line) continue;
    if (isEmailLine(line) || isPhoneLine(line)) continue;

    if (!location && isLikelyLocationLine(line)) {
      location = line;
      continue;
    }

    if (line.length >= 6 && line.length <= 160) {
      headlineParts.push(line);
    }

    if (headlineParts.length >= 2 && location) break;
  }

  const headline = normalizeWhitespace(headlineParts.join(" "));
  return {
    headline: headline || DEFAULT_PROFILE.headline,
    location,
  };
}

type SectionIndexes = {
  summary: number;
  topSkills: number;
  certifications: number;
  experience: number;
  education: number;
};

function locateSections(lines: string[]): SectionIndexes {
  return {
    summary: lines.findIndex((line) => isSummaryHeading(line)),
    topSkills: lines.findIndex((line) => isTopSkillsHeading(line)),
    certifications: lines.findIndex((line) => isCertificationsHeading(line)),
    experience: lines.findIndex((line) => isExperienceHeading(line)),
    education: lines.findIndex((line) => isEducationHeading(line)),
  };
}

function extractSkills(lines: string[], sections: SectionIndexes): string[] {
  if (sections.topSkills === -1) return [];

  const preExperienceEnd = minPositive(
    [sections.experience, sections.education],
    lines.length
  );
  const windowEnd = firstIndexAfter(
    [sections.certifications, sections.experience, sections.education],
    sections.topSkills,
    preExperienceEnd
  );

  const candidates = lines
    .slice(sections.topSkills + 1, windowEnd)
    .filter((line) => !isSectionHeading(line))
    .filter((line) => looksLikeSkillLine(line));

  return dedupeCaseInsensitive(candidates).slice(0, 20);
}

function extractCertifications(lines: string[], sections: SectionIndexes): string[] {
  if (sections.certifications === -1) return [];

  const windowEnd = firstIndexAfter(
    [sections.experience, sections.education],
    sections.certifications,
    lines.length
  );

  const rawLines = mergeWrappedLines(
    lines
      .slice(sections.certifications + 1, windowEnd)
      .filter((line) => !isSectionHeading(line))
  );
  const candidates = rawLines.flatMap((line) => {
    const mixedPrefix = extractCertificationPrefixFromMixedLine(line);
    if (mixedPrefix) return [mixedPrefix];
    return isLikelyCertificationLine(line) ? [line] : [];
  });

  return dedupeCaseInsensitive(candidates).slice(0, 20);
}

function extractSummary(
  lines: string[],
  sections: SectionIndexes,
  certifications: string[],
  skills: string[]
): string {
  const windowStart = sections.summary === -1 ? 0 : sections.summary + 1;
  const windowEnd =
    sections.summary === -1
      ? minPositive([sections.experience, sections.education], lines.length)
      : firstIndexAfter(
          [sections.experience, sections.education],
          sections.summary,
          lines.length
        );

  const blockedLines = new Set(
    [...certifications, ...skills].map((item) => item.toLowerCase())
  );
  const labelsToStrip = dedupeCaseInsensitive([...certifications, ...skills]).sort(
    (a, b) => b.length - a.length
  );
  const summaryWindow = lines
    .slice(windowStart, windowEnd)
    .map((line) => stripLeadingLabels(line, labelsToStrip))
    .filter((line) => line.length > 0)
    .filter((line) => !looksLikeSkillLine(line));

  const candidates = stitchSentenceLines(summaryWindow)
    .filter((line) => !isSectionHeading(line))
    .filter((line) => !isContactLine(line))
    .filter((line) => !isDateRangeLine(line))
    .filter((line) => !blockedLines.has(line.toLowerCase()))
    .filter((line) => !looksLikeSkillLine(line))
    .filter((line) => {
      const words = line.split(" ").filter(Boolean).length;
      return line.startsWith("-") || line.length > 45 || /[.!?]/.test(line) || words > 8;
    });

  const summary = normalizeWhitespace(candidates.join(" "));
  return summary.length > 10 ? summary : DEFAULT_PROFILE.summary;
}

function extractDuration(line: string): string {
  const match = line.match(DATE_RANGE_REGEX);
  if (!match) return "";
  return match[0].replace(/\s*[–-]\s*/g, " - ").trim();
}

function resolveRoleAndCompany(
  headerLines: string[]
): { title: string; company: string } {
  const candidates = headerLines.filter((line) => !isLikelyLocationLine(line));

  if (candidates.length === 0) {
    return {
      title: DEFAULT_PROFILE.experience[0].title,
      company: DEFAULT_PROFILE.experience[0].company,
    };
  }

  const roleLine = [...candidates].reverse().find((line) => ROLE_KEYWORDS.test(line));
  if (roleLine) {
    const roleIndex = candidates.lastIndexOf(roleLine);
    const companyLine =
      [...candidates.slice(0, roleIndex)].reverse().find((line) => !ROLE_KEYWORDS.test(line)) ??
      candidates[0];

    return {
      title: roleLine,
      company: companyLine,
    };
  }

  if (candidates.length === 1) {
    return {
      title: candidates[0],
      company: DEFAULT_PROFILE.experience[0].company,
    };
  }

  const [a, b] = candidates.slice(-2);
  return {
    title: b,
    company: a,
  };
}

function trimTrailingEntryHeaders(lines: string[]): string[] {
  const trimmed = [...lines];
  let removed = 0;

  while (trimmed.length > 0 && removed < 2) {
    const tail = trimmed[trimmed.length - 1];
    const looksLikeHeader =
      !tail.startsWith("-") &&
      !isDateRangeLine(tail) &&
      !isSectionHeading(tail) &&
      !isContactLine(tail) &&
      !isLikelyLocationLine(tail) &&
      !/[.!?]$/.test(tail) &&
      tail.split(" ").length <= 8;

    if (!looksLikeHeader) break;
    trimmed.pop();
    removed += 1;
  }

  return trimmed;
}

function fallbackExperienceFromLines(lines: string[]): ExperienceEntry[] {
  const fallbackTitle =
    lines.find((line) => !isContactLine(line) && !isLikelyLocationLine(line)) ??
    DEFAULT_PROFILE.experience[0].title;

  const fallbackCompany =
    lines.find(
      (line) =>
        line !== fallbackTitle && !isContactLine(line) && !isLikelyLocationLine(line)
    ) ?? DEFAULT_PROFILE.experience[0].company;

  return [
    {
      title: fallbackTitle,
      company: fallbackCompany,
      duration: DEFAULT_PROFILE.experience[0].duration,
      description:
        lines.slice(0, 3).join(" ") || DEFAULT_PROFILE.experience[0].description,
    },
  ];
}

function extractExperience(lines: string[], sections: SectionIndexes): ExperienceEntry[] {
  if (sections.experience === -1) {
    return DEFAULT_PROFILE.experience;
  }

  const windowEnd = firstIndexAfter(
    [sections.education],
    sections.experience,
    lines.length
  );
  const experienceLines = lines
    .slice(sections.experience + 1, windowEnd)
    .filter((line) => !isSectionHeading(line));

  if (experienceLines.length === 0) {
    return DEFAULT_PROFILE.experience;
  }

  const anchors = experienceLines
    .map((line, index) => ({
      index,
      duration: extractDuration(line),
    }))
    .filter((entry) => entry.duration.length > 0);

  if (anchors.length === 0) {
    return fallbackExperienceFromLines(experienceLines);
  }

  const entries: ExperienceEntry[] = [];
  const seen = new Set<string>();

  for (let i = 0; i < anchors.length; i += 1) {
    const anchor = anchors[i];
    const nextAnchorIndex = anchors[i + 1]?.index ?? experienceLines.length;
    const preludeStart = i === 0 ? 0 : anchors[i - 1].index + 1;
    const prelude = experienceLines
      .slice(preludeStart, anchor.index)
      .filter(
        (line) =>
          !isSectionHeading(line) &&
          !isDateRangeLine(line) &&
          !isContactLine(line) &&
          !line.startsWith("-") &&
          line.length <= 90
      )
      .slice(-4);

    const { title, company } = resolveRoleAndCompany(prelude);
    let descriptionLines = experienceLines.slice(anchor.index + 1, nextAnchorIndex);
    descriptionLines = trimTrailingEntryHeaders(descriptionLines);
    descriptionLines = stitchSentenceLines(
      descriptionLines.filter((line) => !isSectionHeading(line) && !isDateRangeLine(line))
    );

    let location = "";
    if (descriptionLines[0] && isLikelyLocationLine(descriptionLines[0])) {
      location = descriptionLines[0];
      descriptionLines = descriptionLines.slice(1);
    }

    const description = normalizeWhitespace(descriptionLines.join(" "));
    const entry: ExperienceEntry = {
      title,
      company,
      duration: anchor.duration || DEFAULT_PROFILE.experience[0].duration,
      location: location || undefined,
      description: description || "Describe your responsibilities.",
    };

    const key = `${entry.title}|${entry.company}|${entry.duration}`.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      entries.push(entry);
    }
  }

  return entries.length > 0
    ? entries.slice(0, 12)
    : fallbackExperienceFromLines(experienceLines);
}

function looksLikeInstitution(line: string): boolean {
  if (isSectionHeading(line) || isContactLine(line) || isDateRangeLine(line)) return false;
  if (DEGREE_KEYWORDS.test(line)) return false;
  if (INSTITUTION_KEYWORDS.test(line)) return true;
  const words = line.split(" ").filter(Boolean);
  return words.length >= 3 && words.length <= 10 && /^[A-Z]/.test(line);
}

function extractEducation(lines: string[], sections: SectionIndexes): EducationEntry[] {
  if (sections.education === -1) return [];

  const rawLines = mergeWrappedLines(
    lines.slice(sections.education + 1).filter((line) => !isSectionHeading(line))
  );
  if (rawLines.length === 0) return [];

  const entries: EducationEntry[] = [];
  let i = 0;

  while (i < rawLines.length) {
    if (!looksLikeInstitution(rawLines[i])) {
      i += 1;
      continue;
    }

    const institution = rawLines[i];
    const details: string[] = [];
    let j = i + 1;

    while (j < rawLines.length && !looksLikeInstitution(rawLines[j])) {
      details.push(rawLines[j]);
      j += 1;
    }

    const detailText = normalizeWhitespace(details.join(" "));
    const duration = extractDuration(detailText);
    const degree = normalizeWhitespace(
      detailText
        .replace(DATE_RANGE_REGEX, "")
        .replace(/[()]/g, " ")
        .replace(/\s*[·|]\s*/g, " ")
    );

    entries.push({
      institution,
      degree: degree || "Degree information unavailable",
      duration: duration || undefined,
    });

    i = j;
  }

  if (entries.length > 0) {
    return entries.slice(0, 5);
  }

  return [
    {
      institution: rawLines[0],
      degree: normalizeWhitespace(rawLines.slice(1).join(" ")) || "Degree information unavailable",
      duration: undefined,
    },
  ];
}

function extractLocation(lines: string[], sections: SectionIndexes): string {
  const headerEnd = minPositive(
    [sections.topSkills, sections.summary, sections.experience, sections.education],
    Math.min(30, lines.length)
  );
  const candidate = lines
    .slice(0, headerEnd)
    .find((line) => isLikelyLocationLine(line) && !isSectionHeading(line));

  return candidate ?? "";
}

function parseLinkedInText(text: string): LinkedInProfile {
  const lines = toNormalizedLines(text);
  if (lines.length === 0) {
    throw new Error(PDF_READ_ERROR);
  }

  const sections = locateSections(lines);
  const hasLinkedInSignals =
    sections.summary !== -1 ||
    sections.topSkills !== -1 ||
    sections.certifications !== -1 ||
    sections.experience !== -1 ||
    sections.education !== -1;

  if (!hasLinkedInSignals) {
    throw new Error(LINKEDIN_PARSE_ERROR);
  }

  const headerCutoff = minPositive(
    [sections.topSkills, sections.summary, sections.certifications, sections.experience],
    Math.min(lines.length, 25)
  );
  const headerLines = lines.slice(
    0,
    headerCutoff > 3 ? headerCutoff : Math.min(lines.length, 25)
  );

  const { name, index: nameIndex } = extractName(headerLines);
  const { headline, location: locationFromHeader } = extractHeadlineAndLocation(
    headerLines,
    nameIndex
  );
  const email = extractEmail(text);
  const linkedinUrl = extractLinkedinUrl(text, lines);
  const skills = extractSkills(lines, sections);
  const certifications = extractCertifications(lines, sections);
  const summary = extractSummary(lines, sections, certifications, skills);
  const experience = extractExperience(lines, sections);
  const education = extractEducation(lines, sections);

  return {
    fullName: name || DEFAULT_PROFILE.fullName,
    headline,
    email,
    location: locationFromHeader || extractLocation(lines, sections),
    linkedinUrl: linkedinUrl || undefined,
    summary,
    experience: experience.length > 0 ? experience : DEFAULT_PROFILE.experience,
    skills: skills.length > 0 ? skills : DEFAULT_PROFILE.skills,
    certifications,
    education,
    customSections: [],
    sectionOrder: [...(DEFAULT_PROFILE.sectionOrder ?? [])],
  };
}

type PdfTextItem = {
  str?: string;
  hasEOL?: boolean;
  transform?: number[];
};

async function extractText(file: File): Promise<string> {
  const data = new Uint8Array(await file.arrayBuffer());
  const loadingTask = pdfjsLib.getDocument({ data });
  const pdf = await loadingTask.promise;
  const lines: string[] = [];

  try {
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();

      const items = (content.items as PdfTextItem[])
        .map((item) => ({
          text: normalizeLine(item.str ?? ""),
          x: Array.isArray(item.transform) ? item.transform[4] : 0,
          y: Array.isArray(item.transform) ? item.transform[5] : 0,
          hasEOL: Boolean(item.hasEOL),
        }))
        .filter((item) => item.text.length > 0)
        .sort((a, b) => {
          const rowDelta = b.y - a.y;
          if (Math.abs(rowDelta) > 2.5) return rowDelta;
          return a.x - b.x;
        });

      let currentRow: typeof items = [];
      let currentY: number | null = null;

      const flushRow = () => {
        if (currentRow.length === 0) return;
        const rowText = normalizeLine(
          currentRow
            .sort((a, b) => a.x - b.x)
            .map((item) => item.text)
            .join(" ")
        );
        if (rowText) {
          lines.push(rowText);
        }
        currentRow = [];
        currentY = null;
      };

      for (const item of items) {
        if (currentY === null) {
          currentRow = [item];
          currentY = item.y;
        } else {
          const isNewRow = Math.abs(item.y - currentY) > 2.5;
          if (isNewRow) {
            flushRow();
            currentRow = [item];
            currentY = item.y;
          } else {
            currentRow.push(item);
          }
        }

        if (item.hasEOL) {
          flushRow();
        }
      }

      flushRow();
      lines.push("");
    }
  } finally {
    await loadingTask.destroy();
  }

  return lines.join("\n");
}

export async function parseLinkedInPDF(file: File): Promise<LinkedInProfile> {
  try {
    const text = await extractText(file);
    return parseLinkedInText(text);
  } catch (error) {
    console.error("PDF parsing error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(PDF_READ_ERROR);
  }
}
