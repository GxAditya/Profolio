export interface LinkedInProfile {
  fullName: string;
  headline: string;
  email: string;
  summary: string;
  experience: ExperienceEntry[];
  skills: string[];
}

export interface ExperienceEntry {
  title: string;
  company: string;
  duration: string;
  description: string;
}
