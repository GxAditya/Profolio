export type CustomSectionLayout = "vertical" | "horizontal";
export type CustomSectionType = "custom" | "projects";

export interface ProjectLink {
  id: string;
  label: string;
  url: string;
}

export interface CustomSectionCard {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  imageUrl?: string;
  links?: ProjectLink[];
}

export interface CustomSection {
  id: string;
  type?: CustomSectionType;
  title: string;
  description?: string;
  layout: CustomSectionLayout;
  cards: CustomSectionCard[];
}

export interface PortfolioSectionTitles {
  skills?: string;
  experience?: string;
  education?: string;
  certifications?: string;
}

export interface LinkedInProfile {
  fullName: string;
  headline: string;
  email: string;
  location?: string;
  linkedinUrl?: string;
  connectLinks?: ProjectLink[];
  summary: string;
  experience: ExperienceEntry[];
  skills: string[];
  certifications?: string[];
  education?: EducationEntry[];
  sectionTitles?: PortfolioSectionTitles;
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
