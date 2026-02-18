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
  addSkill: (value?: string) => void;
  removeSkill: (index: number) => void;
  updateCertification: (index: number, value: string) => void;
  addCertification: (value?: string) => void;
  removeCertification: (index: number) => void;
  addExperience: (entry?: Partial<ExperienceEntry>) => void;
  removeExperience: (index: number) => void;
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
    addSkill: (value) => {
      const nextValue = value?.trim() || "New Skill";
      applyChange((prev) => ({
        ...prev,
        skills: [...(prev.skills ?? []), nextValue],
      }));
    },
    removeSkill: (index) => {
      applyChange((prev) => ({
        ...prev,
        skills: (prev.skills ?? []).filter((_, skillIndex) => skillIndex !== index),
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
    addCertification: (value) => {
      const nextValue = value?.trim() || "New Certification";
      applyChange((prev) => ({
        ...prev,
        certifications: [...(prev.certifications ?? []), nextValue],
      }));
    },
    removeCertification: (index) => {
      applyChange((prev) => {
        const certifications = prev.certifications ?? [];
        return {
          ...prev,
          certifications: certifications.filter((_, certIndex) => certIndex !== index),
        };
      });
    },
    addExperience: (entry) => {
      const nextEntry: ExperienceEntry = {
        title: entry?.title?.trim() || "New Role",
        company: entry?.company?.trim() || "Company Name",
        duration: entry?.duration?.trim() || "Start - End",
        location: entry?.location?.trim() || undefined,
        description:
          entry?.description?.trim() || "Describe your responsibilities and achievements.",
      };
      applyChange((prev) => ({
        ...prev,
        experience: [...(prev.experience ?? []), nextEntry],
      }));
    },
    removeExperience: (index) => {
      applyChange((prev) => ({
        ...prev,
        experience: (prev.experience ?? []).filter((_, entryIndex) => entryIndex !== index),
      }));
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
