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
