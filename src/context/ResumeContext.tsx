import { createContext, useContext, useState, type ReactNode } from "react";
import type { LinkedInProfile } from "@/types/linkedin";

interface ResumeContextType {
  profile: LinkedInProfile | null;
  setProfile: (profile: LinkedInProfile) => void;
  updateProfile: (updater: (prev: LinkedInProfile) => LinkedInProfile) => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<LinkedInProfile | null>(null);

  const updateProfile = (updater: (prev: LinkedInProfile) => LinkedInProfile) => {
    setProfile((prev) => {
      if (!prev) return prev;
      return updater(prev);
    });
  };

  return (
    <ResumeContext.Provider value={{ profile, setProfile, updateProfile }}>
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
