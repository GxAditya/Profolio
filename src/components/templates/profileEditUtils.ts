import type { EducationEntry, ExperienceEntry, LinkedInProfile } from "@/types/linkedin";

type OnProfileChange = (updater: (prev: LinkedInProfile) => LinkedInProfile) => void;

interface ProfileEditor {
  canEdit: boolean;
  updateField: <K extends keyof LinkedInProfile>(key: K, value: LinkedInProfile[K]) => void;
  updateExperienceField: (
    index: number,
    key: keyof ExperienceEntry,
    value: string
  ) => void;
  updateSkill: (index: number, value: string) => void;
  updateCertification: (index: number, value: string) => void;
  updateEducationField: (
    index: number,
    key: keyof EducationEntry,
    value: string
  ) => void;
}

export const createProfileEditor = (
  editable: boolean,
  onProfileChange?: OnProfileChange
): ProfileEditor => {
  const canEdit = editable && Boolean(onProfileChange);

  const applyChange = (updater: (prev: LinkedInProfile) => LinkedInProfile) => {
    if (!canEdit || !onProfileChange) return;
    onProfileChange(updater);
  };

  return {
    canEdit,
    updateField: (key, value) => {
      applyChange((prev) => {
        const next = { ...prev };
        next[key] = value;
        return next;
      });
    },
    updateExperienceField: (index, key, value) => {
      applyChange((prev) => ({
        ...prev,
        experience: prev.experience.map((entry, entryIndex) =>
          entryIndex === index ? ({ ...entry, [key]: value } as ExperienceEntry) : entry
        ),
      }));
    },
    updateSkill: (index, value) => {
      applyChange((prev) => ({
        ...prev,
        skills: prev.skills.map((skill, skillIndex) => (skillIndex === index ? value : skill)),
      }));
    },
    updateCertification: (index, value) => {
      applyChange((prev) => {
        const certifications = prev.certifications ?? [];
        return {
          ...prev,
          certifications: certifications.map((certification, certIndex) =>
            certIndex === index ? value : certification
          ),
        };
      });
    },
    updateEducationField: (index, key, value) => {
      applyChange((prev) => {
        const education = prev.education ?? [];
        return {
          ...prev,
          education: education.map((entry, entryIndex) =>
            entryIndex === index ? ({ ...entry, [key]: value } as EducationEntry) : entry
          ),
        };
      });
    },
  };
};
