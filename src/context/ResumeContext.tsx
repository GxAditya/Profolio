import { createContext, useContext, useState, type ReactNode } from "react";
import type { LinkedInProfile } from "@/types/linkedin";

interface ResumeContextType {
  profile: LinkedInProfile | null;
  setProfile: (profile: LinkedInProfile) => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<LinkedInProfile | null>(null);

  return (
    <ResumeContext.Provider value={{ profile, setProfile }}>
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
