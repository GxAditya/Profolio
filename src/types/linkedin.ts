export type CustomSectionLayout = "vertical" | "horizontal";

export interface CustomSectionCard {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
}

export interface CustomSection {
  id: string;
  title: string;
  description?: string;
  layout: CustomSectionLayout;
  cards: CustomSectionCard[];
}

export interface LinkedInProfile {
  fullName: string;
  headline: string;
  email: string;
  location?: string;
  linkedinUrl?: string;
  summary: string;
  experience: ExperienceEntry[];
  skills: string[];
  certifications?: string[];
  education?: EducationEntry[];
  customSections?: CustomSection[];
  sectionOrder?: string[];
}

export interface ExperienceEntry {
  title: string;
  company: string;
  duration: string;
  location?: string;
  description: string;
}

export interface EducationEntry {
  institution: string;
  degree: string;
  duration?: string;
}
