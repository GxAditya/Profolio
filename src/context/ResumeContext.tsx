import { createContext, useContext, useState, type ReactNode } from "react";
import type { LinkedInProfile } from "@/types/linkedin";
import { DEFAULT_TEMPLATE, type TemplateName } from "@/types/template";

interface ResumeContextType {
  profile: LinkedInProfile | null;
  setProfile: (profile: LinkedInProfile) => void;
  updateProfile: (updater: (prev: LinkedInProfile) => LinkedInProfile) => void;
  activeTemplate: TemplateName;
  setActiveTemplate: (template: TemplateName) => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<LinkedInProfile | null>(null);
  const [activeTemplate, setActiveTemplate] = useState<TemplateName>(DEFAULT_TEMPLATE);

  const updateProfile = (updater: (prev: LinkedInProfile) => LinkedInProfile) => {
    setProfile((prev) => {
      if (!prev) return prev;
      return updater(prev);
    });
  };

  return (
    <ResumeContext.Provider
      value={{ profile, setProfile, updateProfile, activeTemplate, setActiveTemplate }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = (): ResumeContextType => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error("useResume must be used within a ResumeProvider");
  }
  return context;
};
