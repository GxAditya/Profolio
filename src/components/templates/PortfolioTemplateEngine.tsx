import { useMemo, useState, type DragEvent, type FormEvent, type ReactNode } from "react";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import EditableText from "@/components/EditableText";
import { createProfileEditor } from "@/components/templates/profileEditUtils";
import { cn } from "@/lib/utils";
import type {
  CustomSection,
  CustomSectionCard,
  CustomSectionLayout,
  LinkedInProfile,
} from "@/types/linkedin";

export type PortfolioTheme = "neumorphism" | "neobrutalism" | "glassmorphism";

interface Props {
  profile: LinkedInProfile;
  editable?: boolean;
  showAddSectionControls?: boolean;
  onProfileChange?: (updater: (prev: LinkedInProfile) => LinkedInProfile) => void;
  theme: PortfolioTheme;
}

interface SectionFormState {
  title: string;
  description: string;
  layout: CustomSectionLayout;
  cardTitle: string;
  cardSubtitle: string;
  cardDescription: string;
}

interface CardDraft {
  title: string;
  subtitle: string;
  description: string;
}

interface ThemePalette {
  page: string;
  ambience: string;
  contentWrap: string;
  header: string;
  headingKicker: string;
  headingName: string;
  headingMeta: string;
  section: string;
  sectionDropTarget: string;
  sectionHandle: string;
  sectionLabel: string;
  sectionTitle: string;
  sectionSubtitle: string;
  bodyText: string;
  mutedText: string;
  link: string;
  input: string;
  controlPanel: string;
  controlPanelTitle: string;
  controlPanelLabel: string;
  heroSummary: string;
  contactCard: string;
  skillChip: string;
  chipAction: string;
  addChipButton: string;
  projectCard: string;
  educationCard: string;
  certificationCard: string;
  customCard: string;
  customTag: string;
  emptyState: string;
  primaryButton: string;
  secondaryButton: string;
  iconButton: string;
}

const BASE_SECTION_ORDER = [
  "hero",
  "skills",
  "experience",
  "education",
  "certifications",
] as const;

const palettes: Record<PortfolioTheme, ThemePalette> = {
  neumorphism: {
    page: "relative mx-auto min-h-[980px] w-full overflow-hidden rounded-[2.1rem] border border-[#d8dfeb] bg-[#e8edf4] text-[#273447] shadow-[26px_26px_56px_#c4cedb,-20px_-20px_44px_#f8fbff]",
    ambience:
      "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_8%,rgba(255,255,255,0.9),transparent_38%),radial-gradient(circle_at_86%_0%,rgba(206,217,235,0.62),transparent_36%),linear-gradient(180deg,rgba(237,242,249,0.88),rgba(228,236,246,0.88))]",
    contentWrap: "relative px-6 pb-9 pt-6 sm:px-9 sm:pt-7",
    header:
      "flex flex-wrap items-end justify-between gap-4 rounded-[1.6rem] border border-[#dde5f2] bg-[#e8edf4] px-5 py-5 shadow-[-10px_-10px_22px_#f8fbff,12px_12px_24px_#c4cedb]",
    headingKicker: "text-[0.65rem] uppercase tracking-[0.18em] text-[#6d7d96]",
    headingName: "mt-2 text-3xl font-semibold tracking-[-0.03em] text-[#223144] sm:text-4xl",
    headingMeta: "rounded-full border border-[#d7deea] bg-[#ebf0f6] px-4 py-2 text-xs text-[#4e5e77] shadow-[inset_4px_4px_10px_#cbd5e4,inset_-4px_-4px_10px_#f7fbff]",
    section:
      "rounded-[1.5rem] border border-[#dae2ee] bg-[#e8edf4] p-5 shadow-[-8px_-8px_18px_#f9fcff,10px_10px_20px_#c4cedb]",
    sectionDropTarget:
      "border-[#8d9fc0] shadow-[-8px_-8px_18px_#f9fcff,0_0_0_3px_rgba(141,159,192,0.24),10px_10px_20px_#c4cedb]",
    sectionHandle:
      "mb-5 inline-flex cursor-grab items-center gap-2 rounded-full border border-[#d4dce8] bg-[#ecf1f7] px-3 py-1.5 text-[0.63rem] font-semibold uppercase tracking-[0.14em] text-[#586a84] shadow-[inset_4px_4px_8px_#cfd8e6,inset_-4px_-4px_8px_#f8fbff]",
    sectionLabel: "text-[0.62rem] uppercase tracking-[0.16em] text-[#6e7d95]",
    sectionTitle: "mt-1 text-2xl font-semibold tracking-[-0.03em] text-[#213043]",
    sectionSubtitle: "mt-2 text-sm leading-relaxed text-[#4f5f79]",
    bodyText: "text-sm leading-relaxed text-[#3f5069]",
    mutedText: "text-xs text-[#63748f]",
    link: "text-[#2f5f9e] underline decoration-[#2f5f9e]/35 underline-offset-4",
    input:
      "w-full rounded-xl border border-[#cfdae8] bg-[#ebf0f6] px-3 py-2 text-sm text-[#25354a] outline-none shadow-[inset_4px_4px_10px_#ced8e7,inset_-4px_-4px_10px_#f8fbff] transition focus:border-[#8ca0bf]",
    controlPanel:
      "mt-6 rounded-[1.55rem] border border-[#d8e1ed] bg-[#e8edf4] p-5 shadow-[-8px_-8px_18px_#f9fcff,10px_10px_20px_#c4cedb]",
    controlPanelTitle: "mt-2 text-xl font-semibold tracking-[-0.02em] text-[#223246]",
    controlPanelLabel: "text-xs font-medium text-[#5f7090]",
    heroSummary:
      "mt-4 max-w-3xl rounded-2xl border border-[#d6deea] bg-[#edf2f8] p-4 text-sm leading-relaxed text-[#3f5068] shadow-[inset_6px_6px_12px_#cfd8e6,inset_-6px_-6px_12px_#f8fbff]",
    contactCard:
      "rounded-2xl border border-[#d6deea] bg-[#edf2f8] p-4 shadow-[inset_6px_6px_12px_#cfd8e6,inset_-6px_-6px_12px_#f8fbff]",
    skillChip:
      "inline-flex items-center gap-1 rounded-full border border-[#cfd8e6] bg-[#edf2f8] pl-3 pr-1 text-[0.66rem] uppercase tracking-[0.11em] text-[#445873] shadow-[inset_4px_4px_8px_#cfd8e6,inset_-4px_-4px_8px_#f8fbff]",
    chipAction:
      "inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#c6d2e2] bg-[#eff4fa] text-[#5b6f8b] hover:bg-[#e7edf5]",
    addChipButton:
      "inline-flex items-center gap-1 rounded-full border border-[#c8d4e3] bg-[#edf2f8] px-3 py-1 text-[0.64rem] font-semibold uppercase tracking-[0.13em] text-[#4b5f7d] shadow-[inset_4px_4px_8px_#cfd8e6,inset_-4px_-4px_8px_#f8fbff] hover:text-[#344964]",
    projectCard:
      "relative rounded-2xl border border-[#d2dbe8] bg-[#edf2f8] p-4 shadow-[-6px_-6px_14px_#f8fbff,8px_8px_16px_#c5cfdb]",
    educationCard:
      "rounded-2xl border border-[#d2dbe8] bg-[#edf2f8] p-4 shadow-[-6px_-6px_14px_#f8fbff,8px_8px_16px_#c5cfdb]",
    certificationCard:
      "flex items-start justify-between gap-2 rounded-xl border border-[#d2dbe8] bg-[#edf2f8] px-3 py-2.5 text-sm text-[#33455f] shadow-[-5px_-5px_10px_#f8fbff,6px_6px_12px_#c5cfdb]",
    customCard:
      "rounded-2xl border border-[#d2dbe8] bg-[#edf2f8] p-4 shadow-[-6px_-6px_14px_#f8fbff,8px_8px_16px_#c5cfdb]",
    customTag:
      "rounded-full border border-[#ccd7e6] bg-[#edf2f8] px-3 py-1 text-[0.62rem] uppercase tracking-[0.14em] text-[#5f7190] shadow-[inset_4px_4px_8px_#cfd8e6,inset_-4px_-4px_8px_#f8fbff]",
    emptyState:
      "mt-4 rounded-xl border border-[#d3dcea] bg-[#edf2f8] px-4 py-3 text-sm text-[#50617b] shadow-[inset_5px_5px_10px_#cfd8e6,inset_-5px_-5px_10px_#f8fbff]",
    primaryButton:
      "inline-flex items-center justify-center gap-2 rounded-xl border border-[#bac9de] bg-[#dbe5f3] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#30445f] shadow-[-5px_-5px_10px_#f7fbff,6px_6px_12px_#bfcbdb] hover:bg-[#d3deee]",
    secondaryButton:
      "inline-flex items-center gap-1 rounded-full border border-[#ccd7e6] bg-[#edf2f8] px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.13em] text-[#445b78] shadow-[inset_4px_4px_8px_#cfd8e6,inset_-4px_-4px_8px_#f8fbff] hover:text-[#30465f]",
    iconButton:
      "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#c8d4e3] bg-[#edf2f8] text-[#4d617d] shadow-[inset_3px_3px_6px_#ced8e6,inset_-3px_-3px_6px_#f8fbff] hover:text-[#32445d]",
  },
  neobrutalism: {
    page: "relative mx-auto min-h-[980px] w-full overflow-hidden rounded-[0.9rem] border-4 border-black bg-[#ffe65a] text-black shadow-[14px_14px_0_#000]",
    ambience:
      "pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.3)_0%,transparent_45%),repeating-linear-gradient(45deg,rgba(0,0,0,0.04)_0,rgba(0,0,0,0.04)_8px,transparent_8px,transparent_16px)]",
    contentWrap: "relative px-6 pb-9 pt-6 sm:px-9 sm:pt-7",
    header:
      "flex flex-wrap items-end justify-between gap-4 border-4 border-black bg-[#ff7a59] px-5 py-5 shadow-[8px_8px_0_#000]",
    headingKicker: "text-[0.67rem] uppercase tracking-[0.19em] text-black/75",
    headingName:
      "mt-2 text-3xl font-black uppercase tracking-[-0.03em] text-black sm:text-4xl",
    headingMeta:
      "rounded-full border-2 border-black bg-[#f8f4ec] px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-black",
    section:
      "rounded-[0.7rem] border-4 border-black bg-[#f8f4ec] p-5 shadow-[8px_8px_0_#000]",
    sectionDropTarget: "bg-[#d5fff2] shadow-[10px_10px_0_#000]",
    sectionHandle:
      "mb-5 inline-flex cursor-grab items-center gap-2 rounded-full border-2 border-black bg-[#b4ff83] px-3 py-1.5 text-[0.64rem] font-black uppercase tracking-[0.12em] text-black",
    sectionLabel: "text-[0.64rem] uppercase tracking-[0.17em] text-black/65",
    sectionTitle: "mt-1 text-2xl font-black uppercase tracking-[-0.02em] text-black",
    sectionSubtitle: "mt-2 text-sm font-medium leading-relaxed text-black/80",
    bodyText: "text-sm leading-relaxed text-black/85",
    mutedText: "text-xs text-black/70",
    link: "font-semibold text-black underline decoration-black/40 underline-offset-4",
    input:
      "w-full rounded-md border-2 border-black bg-white px-3 py-2 text-sm text-black outline-none transition focus:-translate-y-[1px] focus:translate-x-[1px] focus:shadow-[3px_3px_0_#000]",
    controlPanel:
      "mt-6 rounded-[0.8rem] border-4 border-black bg-[#d9f7ff] p-5 shadow-[8px_8px_0_#000]",
    controlPanelTitle: "mt-2 text-xl font-black uppercase tracking-[-0.01em] text-black",
    controlPanelLabel: "text-xs font-bold uppercase tracking-[0.06em] text-black/80",
    heroSummary:
      "mt-4 rounded-xl border-[3px] border-black bg-[#ffffff] p-4 text-sm leading-relaxed text-black",
    contactCard: "rounded-xl border-[3px] border-black bg-[#ffffff] p-4",
    skillChip:
      "inline-flex items-center gap-1 rounded-full border-2 border-black bg-[#ffc9e8] pl-3 pr-1 text-[0.66rem] font-black uppercase tracking-[0.1em] text-black",
    chipAction:
      "inline-flex h-5 w-5 items-center justify-center rounded-full border-2 border-black bg-[#fff] text-black hover:bg-[#ffef72]",
    addChipButton:
      "inline-flex items-center gap-1 rounded-full border-2 border-black bg-[#9ef7c4] px-3 py-1 text-[0.64rem] font-black uppercase tracking-[0.12em] text-black hover:bg-[#7af0b3]",
    projectCard:
      "relative rounded-xl border-[3px] border-black bg-[#fef8ed] p-4 shadow-[6px_6px_0_#000]",
    educationCard:
      "rounded-xl border-[3px] border-black bg-[#fef8ed] p-4 shadow-[6px_6px_0_#000]",
    certificationCard:
      "flex items-start justify-between gap-2 rounded-xl border-[3px] border-black bg-[#fef8ed] px-3 py-2.5 text-sm text-black shadow-[6px_6px_0_#000]",
    customCard:
      "rounded-xl border-[3px] border-black bg-[#fef8ed] p-4 shadow-[6px_6px_0_#000]",
    customTag:
      "rounded-full border-2 border-black bg-[#ffe39a] px-3 py-1 text-[0.62rem] font-black uppercase tracking-[0.12em] text-black",
    emptyState:
      "mt-4 rounded-xl border-[3px] border-black bg-[#fff] px-4 py-3 text-sm text-black",
    primaryButton:
      "inline-flex items-center justify-center gap-2 rounded-lg border-[3px] border-black bg-[#ff785a] px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-black hover:translate-x-[1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0_#000]",
    secondaryButton:
      "inline-flex items-center gap-1 rounded-full border-2 border-black bg-[#ffe39a] px-3 py-1.5 text-[0.65rem] font-black uppercase tracking-[0.12em] text-black hover:bg-[#ffd77a]",
    iconButton:
      "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-black bg-white text-black hover:bg-[#ffe9a9]",
  },
  glassmorphism: {
    page: "relative mx-auto min-h-[980px] w-full overflow-hidden rounded-[2.1rem] border border-white/20 bg-[linear-gradient(145deg,#0f172d,#111b39,#1b2b4d)] text-[#f3f8ff] shadow-[0_35px_90px_rgba(7,13,29,0.72)]",
    ambience:
      "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,rgba(163,211,255,0.42),transparent_38%),radial-gradient(circle_at_86%_14%,rgba(216,142,255,0.3),transparent_40%),radial-gradient(circle_at_52%_100%,rgba(98,238,217,0.22),transparent_36%)]",
    contentWrap: "relative px-6 pb-9 pt-6 sm:px-9 sm:pt-7",
    header:
      "flex flex-wrap items-end justify-between gap-4 rounded-[1.5rem] border border-white/25 bg-white/10 px-5 py-5 shadow-[0_14px_40px_rgba(3,8,18,0.42)] backdrop-blur-xl",
    headingKicker: "text-[0.65rem] uppercase tracking-[0.18em] text-white/65",
    headingName: "mt-2 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl",
    headingMeta:
      "rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs text-white/75 backdrop-blur-md",
    section:
      "rounded-[1.45rem] border border-white/22 bg-white/10 p-5 shadow-[0_16px_44px_rgba(3,8,18,0.44)] backdrop-blur-xl",
    sectionDropTarget: "border-cyan-300/70 bg-cyan-200/12 shadow-[0_18px_50px_rgba(66,211,255,0.24)]",
    sectionHandle:
      "mb-5 inline-flex cursor-grab items-center gap-2 rounded-full border border-white/28 bg-white/10 px-3 py-1.5 text-[0.63rem] font-semibold uppercase tracking-[0.14em] text-white/78 backdrop-blur-md",
    sectionLabel: "text-[0.62rem] uppercase tracking-[0.16em] text-white/62",
    sectionTitle: "mt-1 text-2xl font-semibold tracking-[-0.03em] text-white",
    sectionSubtitle: "mt-2 text-sm leading-relaxed text-white/72",
    bodyText: "text-sm leading-relaxed text-[#d9e6f8]",
    mutedText: "text-xs text-white/62",
    link: "text-[#99e6ff] underline decoration-[#99e6ff]/40 underline-offset-4",
    input:
      "w-full rounded-xl border border-white/30 bg-white/14 px-3 py-2 text-sm text-white outline-none backdrop-blur-md transition placeholder:text-white/50 focus:border-cyan-300/70",
    controlPanel:
      "mt-6 rounded-[1.5rem] border border-white/25 bg-white/10 p-5 shadow-[0_16px_44px_rgba(3,8,18,0.44)] backdrop-blur-xl",
    controlPanelTitle: "mt-2 text-xl font-semibold tracking-[-0.02em] text-white",
    controlPanelLabel: "text-xs font-medium text-white/72",
    heroSummary:
      "mt-4 rounded-2xl border border-white/22 bg-white/12 p-4 text-sm leading-relaxed text-[#d9e6f8] backdrop-blur-lg",
    contactCard: "rounded-2xl border border-white/22 bg-white/12 p-4 backdrop-blur-lg",
    skillChip:
      "inline-flex items-center gap-1 rounded-full border border-white/28 bg-white/12 pl-3 pr-1 text-[0.66rem] uppercase tracking-[0.11em] text-[#d6e8ff] backdrop-blur-md",
    chipAction:
      "inline-flex h-5 w-5 items-center justify-center rounded-full border border-white/30 bg-white/16 text-white/80 hover:bg-white/24",
    addChipButton:
      "inline-flex items-center gap-1 rounded-full border border-cyan-200/45 bg-cyan-200/12 px-3 py-1 text-[0.64rem] font-semibold uppercase tracking-[0.13em] text-cyan-100 hover:bg-cyan-200/20",
    projectCard:
      "relative rounded-2xl border border-white/24 bg-white/12 p-4 shadow-[0_10px_28px_rgba(4,11,25,0.38)] backdrop-blur-lg",
    educationCard:
      "rounded-2xl border border-white/24 bg-white/12 p-4 shadow-[0_10px_28px_rgba(4,11,25,0.38)] backdrop-blur-lg",
    certificationCard:
      "flex items-start justify-between gap-2 rounded-xl border border-white/24 bg-white/12 px-3 py-2.5 text-sm text-[#d9e6f8] shadow-[0_10px_24px_rgba(4,11,25,0.34)] backdrop-blur-lg",
    customCard:
      "rounded-2xl border border-white/24 bg-white/12 p-4 shadow-[0_10px_28px_rgba(4,11,25,0.38)] backdrop-blur-lg",
    customTag:
      "rounded-full border border-white/26 bg-white/12 px-3 py-1 text-[0.62rem] uppercase tracking-[0.14em] text-white/72 backdrop-blur-md",
    emptyState:
      "mt-4 rounded-xl border border-white/22 bg-white/10 px-4 py-3 text-sm text-white/72 backdrop-blur-md",
    primaryButton:
      "inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-200/50 bg-cyan-200/16 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-100 hover:bg-cyan-200/24",
    secondaryButton:
      "inline-flex items-center gap-1 rounded-full border border-white/28 bg-white/10 px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.13em] text-white/82 hover:bg-white/16",
    iconButton:
      "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/28 bg-white/14 text-white/85 hover:bg-white/20",
  },
};

const themeFonts: Record<PortfolioTheme, string> = {
  neumorphism: '"Manrope", "Nunito Sans", sans-serif',
  neobrutalism: '"Space Grotesk", "Archivo", sans-serif',
  glassmorphism: '"Sora", "Plus Jakarta Sans", sans-serif',
};

const createSectionId = (): string =>
  `custom-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`;

const createCardId = (): string =>
  `card-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`;

const createSectionFormState = (): SectionFormState => ({
  title: "",
  description: "",
  layout: "vertical",
  cardTitle: "",
  cardSubtitle: "",
  cardDescription: "",
});

const createCardDraft = (): CardDraft => ({
  title: "",
  subtitle: "",
  description: "",
});

const normalizeSectionOrder = (
  sectionOrder: string[] | undefined,
  customSections: CustomSection[]
): string[] => {
  const customSectionIds = customSections.map((section) => section.id);
  const available = [...BASE_SECTION_ORDER, ...customSectionIds];
  const availableSet = new Set(available);
  const seen = new Set<string>();
  const normalized: string[] = [];

  for (const sectionId of sectionOrder ?? []) {
    if (!availableSet.has(sectionId) || seen.has(sectionId)) continue;
    seen.add(sectionId);
    normalized.push(sectionId);
  }

  for (const baseSectionId of BASE_SECTION_ORDER) {
    if (seen.has(baseSectionId)) continue;

    const nextKnownBase = BASE_SECTION_ORDER.slice(
      BASE_SECTION_ORDER.indexOf(baseSectionId) + 1
    ).find((candidate) => seen.has(candidate));

    if (!nextKnownBase) {
      normalized.push(baseSectionId);
      seen.add(baseSectionId);
      continue;
    }

    const nextKnownIndex = normalized.indexOf(nextKnownBase);
    if (nextKnownIndex === -1) {
      normalized.push(baseSectionId);
    } else {
      normalized.splice(nextKnownIndex, 0, baseSectionId);
    }
    seen.add(baseSectionId);
  }

  for (const customSectionId of customSectionIds) {
    if (seen.has(customSectionId)) continue;
    seen.add(customSectionId);
    normalized.push(customSectionId);
  }

  return normalized;
};

const PortfolioTemplateEngine = ({
  profile,
  editable = false,
  showAddSectionControls = true,
  onProfileChange,
  theme,
}: Props) => {
  const palette = palettes[theme];
  const {
    canEdit,
    updateField,
    updateExperienceField,
    addExperience,
    removeExperience,
    updateSkill,
    addSkill,
    removeSkill,
    updateCertification,
    addCertification,
    removeCertification,
    updateEducationField,
  } = createProfileEditor(editable, onProfileChange);

  const customSections = profile.customSections ?? [];
  const [sectionForm, setSectionForm] = useState<SectionFormState>(createSectionFormState);
  const [cardDrafts, setCardDrafts] = useState<Record<string, CardDraft>>({});
  const [draggingSectionId, setDraggingSectionId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);

  const orderedSectionIds = useMemo(
    () => normalizeSectionOrder(profile.sectionOrder, customSections),
    [profile.sectionOrder, customSections]
  );

  const customSectionsById = useMemo(() => {
    const map = new Map<string, CustomSection>();
    for (const section of customSections) {
      map.set(section.id, section);
    }
    return map;
  }, [customSections]);

  const visibleSectionIds = orderedSectionIds.filter((sectionId) => {
    if (sectionId === "hero") return true;
    if (sectionId === "skills") return canEdit || profile.skills.length > 0;
    if (sectionId === "experience") return canEdit || profile.experience.length > 0;
    if (sectionId === "education") return canEdit || (profile.education?.length ?? 0) > 0;
    if (sectionId === "certifications") {
      return canEdit || (profile.certifications?.length ?? 0) > 0;
    }
    return customSectionsById.has(sectionId);
  });

  const applyProfileMutation = (updater: (prev: LinkedInProfile) => LinkedInProfile) => {
    if (!canEdit || !onProfileChange) return;
    onProfileChange(updater);
  };

  const moveSection = (sourceSectionId: string, targetSectionId: string) => {
    if (sourceSectionId === targetSectionId) return;

    applyProfileMutation((prev) => {
      const currentOrder = normalizeSectionOrder(prev.sectionOrder, prev.customSections ?? []);
      const sourceIndex = currentOrder.indexOf(sourceSectionId);
      const targetIndex = currentOrder.indexOf(targetSectionId);
      if (sourceIndex === -1 || targetIndex === -1) return prev;

      const nextOrder = [...currentOrder];
      const [movedSection] = nextOrder.splice(sourceIndex, 1);
      nextOrder.splice(targetIndex, 0, movedSection);

      return {
        ...prev,
        sectionOrder: nextOrder,
      };
    });
  };

  const clearDragState = () => {
    setDraggingSectionId(null);
    setDropTargetId(null);
  };

  const handleSectionDragStart = (
    event: DragEvent<HTMLDivElement>,
    sectionId: string
  ) => {
    if (!canEdit) return;
    setDraggingSectionId(sectionId);
    setDropTargetId(sectionId);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", sectionId);
  };

  const handleSectionDragOver = (
    event: DragEvent<HTMLElement>,
    sectionId: string
  ) => {
    if (!canEdit || !draggingSectionId || draggingSectionId === sectionId) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setDropTargetId(sectionId);
  };

  const handleSectionDrop = (event: DragEvent<HTMLElement>, targetSectionId: string) => {
    if (!canEdit) return;
    event.preventDefault();

    const sourceSectionId =
      draggingSectionId || event.dataTransfer.getData("text/plain");
    if (!sourceSectionId || sourceSectionId === targetSectionId) {
      clearDragState();
      return;
    }

    moveSection(sourceSectionId, targetSectionId);
    clearDragState();
  };

  const updateSectionFormField = <K extends keyof SectionFormState>(
    key: K,
    value: SectionFormState[K]
  ) => {
    setSectionForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddCustomSection = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canEdit) return;

    const title = sectionForm.title.trim();
    const cardTitle = sectionForm.cardTitle.trim();
    const cardDescription = sectionForm.cardDescription.trim();
    if (!title || !cardTitle || !cardDescription) return;

    const sectionId = createSectionId();
    const newSection: CustomSection = {
      id: sectionId,
      title,
      description: sectionForm.description.trim() || undefined,
      layout: sectionForm.layout,
      cards: [
        {
          id: createCardId(),
          title: cardTitle,
          subtitle: sectionForm.cardSubtitle.trim() || undefined,
          description: cardDescription,
        },
      ],
    };

    applyProfileMutation((prev) => {
      const nextCustomSections = [...(prev.customSections ?? []), newSection];
      const nextSectionOrder = normalizeSectionOrder(
        [...(prev.sectionOrder ?? []), sectionId],
        nextCustomSections
      );

      return {
        ...prev,
        customSections: nextCustomSections,
        sectionOrder: nextSectionOrder,
      };
    });

    setSectionForm(createSectionFormState());
  };

  const updateCustomSectionField = (
    sectionId: string,
    key: "title" | "description" | "layout",
    value: string
  ) => {
    applyProfileMutation((prev) => ({
      ...prev,
      customSections: (prev.customSections ?? []).map((section) => {
        if (section.id !== sectionId) return section;

        if (key === "layout") {
          return {
            ...section,
            layout: value as CustomSectionLayout,
          };
        }

        if (key === "description") {
          return {
            ...section,
            description: value.trim() ? value : undefined,
          };
        }

        return {
          ...section,
          title: value,
        };
      }),
    }));
  };

  const removeCustomSection = (sectionId: string) => {
    applyProfileMutation((prev) => {
      const nextCustomSections = (prev.customSections ?? []).filter(
        (section) => section.id !== sectionId
      );

      return {
        ...prev,
        customSections: nextCustomSections,
        sectionOrder: normalizeSectionOrder(
          (prev.sectionOrder ?? []).filter((id) => id !== sectionId),
          nextCustomSections
        ),
      };
    });

    setCardDrafts((prev) => {
      if (!(sectionId in prev)) return prev;
      const next = { ...prev };
      delete next[sectionId];
      return next;
    });
  };

  const updateCustomCardField = (
    sectionId: string,
    cardId: string,
    key: "title" | "subtitle" | "description",
    value: string
  ) => {
    applyProfileMutation((prev) => ({
      ...prev,
      customSections: (prev.customSections ?? []).map((section) => {
        if (section.id !== sectionId) return section;

        return {
          ...section,
          cards: section.cards.map((card) => {
            if (card.id !== cardId) return card;
            if (key === "subtitle") {
              return {
                ...card,
                subtitle: value.trim() ? value : undefined,
              };
            }
            return {
              ...card,
              [key]: value,
            };
          }),
        };
      }),
    }));
  };

  const removeCustomCard = (sectionId: string, cardId: string) => {
    applyProfileMutation((prev) => ({
      ...prev,
      customSections: (prev.customSections ?? []).map((section) => {
        if (section.id !== sectionId) return section;
        return {
          ...section,
          cards: section.cards.filter((card) => card.id !== cardId),
        };
      }),
    }));
  };

  const updateCardDraftField = (
    sectionId: string,
    key: keyof CardDraft,
    value: string
  ) => {
    setCardDrafts((prev) => ({
      ...prev,
      [sectionId]: {
        ...(prev[sectionId] ?? createCardDraft()),
        [key]: value,
      },
    }));
  };

  const addCardToSection = (sectionId: string) => {
    if (!canEdit) return;
    const draft = cardDrafts[sectionId] ?? createCardDraft();
    const title = draft.title.trim();
    const description = draft.description.trim();
    if (!title || !description) return;

    const newCard: CustomSectionCard = {
      id: createCardId(),
      title,
      subtitle: draft.subtitle.trim() || undefined,
      description,
    };

    applyProfileMutation((prev) => ({
      ...prev,
      customSections: (prev.customSections ?? []).map((section) => {
        if (section.id !== sectionId) return section;
        return {
          ...section,
          cards: [...section.cards, newCard],
        };
      }),
    }));

    setCardDrafts((prev) => ({
      ...prev,
      [sectionId]: createCardDraft(),
    }));
  };

  const renderSectionHandle = (sectionId: string) =>
    canEdit ? (
      <div
        draggable
        onDragStart={(event) => handleSectionDragStart(event, sectionId)}
        onDragEnd={clearDragState}
        className={palette.sectionHandle}
        title="Drag to reposition section"
      >
        <GripVertical className="h-3.5 w-3.5" />
        Drag
      </div>
    ) : null;

  const renderSectionHeader = (
    title: string,
    subtitle: string,
    action?: ReactNode
  ) => (
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className={palette.sectionLabel}>Portfolio Section</p>
        <h2 className={palette.sectionTitle}>{title}</h2>
        <p className={palette.sectionSubtitle}>{subtitle}</p>
      </div>
      {action}
    </div>
  );

  return (
    <div className={palette.page} style={{ fontFamily: themeFonts[theme] }}>
      <div className={palette.ambience} />

      <div className={palette.contentWrap}>
        <header className={palette.header}>
          <div>
            <p className={palette.headingKicker}>
              {theme.charAt(0).toUpperCase() + theme.slice(1)} Portfolio Page
            </p>
            <EditableText
              as="h1"
              className={palette.headingName}
              value={profile.fullName}
              editable={canEdit}
              multiline={false}
              onValueChange={(value) => updateField("fullName", value)}
            />
          </div>

          <div className={palette.headingMeta}>
            {profile.location || "Global"} · {profile.email}
          </div>
        </header>

        {canEdit && showAddSectionControls && (
          <section className={palette.controlPanel}>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className={palette.sectionLabel}>Content Builder</p>
                <h2 className={palette.controlPanelTitle}>Add Custom Portfolio Sections</h2>
              </div>
              <p className={palette.sectionSubtitle}>
                Build unique content blocks like showcases, awards, side projects, or talks.
              </p>
            </div>

            <form className="mt-5 grid gap-3 sm:grid-cols-2" onSubmit={handleAddCustomSection}>
              <label className="block">
                <span className={cn("mb-1 block", palette.controlPanelLabel)}>Section title</span>
                <input
                  required
                  className={palette.input}
                  value={sectionForm.title}
                  onChange={(event) => updateSectionFormField("title", event.target.value)}
                  placeholder="Open Source Work, Talks, Awards..."
                />
              </label>

              <label className="block">
                <span className={cn("mb-1 block", palette.controlPanelLabel)}>Card layout</span>
                <select
                  className={palette.input}
                  value={sectionForm.layout}
                  onChange={(event) =>
                    updateSectionFormField(
                      "layout",
                      event.target.value as CustomSectionLayout
                    )
                  }
                >
                  <option value="vertical">Vertical stack</option>
                  <option value="horizontal">Horizontal rows</option>
                </select>
              </label>

              <label className="block sm:col-span-2">
                <span className={cn("mb-1 block", palette.controlPanelLabel)}>Section intro</span>
                <input
                  className={palette.input}
                  value={sectionForm.description}
                  onChange={(event) =>
                    updateSectionFormField("description", event.target.value)
                  }
                  placeholder="Short context for this custom section"
                />
              </label>

              <label className="block">
                <span className={cn("mb-1 block", palette.controlPanelLabel)}>First card title</span>
                <input
                  required
                  className={palette.input}
                  value={sectionForm.cardTitle}
                  onChange={(event) => updateSectionFormField("cardTitle", event.target.value)}
                  placeholder="Card heading"
                />
              </label>

              <label className="block">
                <span className={cn("mb-1 block", palette.controlPanelLabel)}>
                  First card subtitle
                </span>
                <input
                  className={palette.input}
                  value={sectionForm.cardSubtitle}
                  onChange={(event) =>
                    updateSectionFormField("cardSubtitle", event.target.value)
                  }
                  placeholder="Optional metadata"
                />
              </label>

              <label className="block sm:col-span-2">
                <span className={cn("mb-1 block", palette.controlPanelLabel)}>
                  First card description
                </span>
                <textarea
                  required
                  className={cn(palette.input, "min-h-[82px] resize-y")}
                  value={sectionForm.cardDescription}
                  onChange={(event) =>
                    updateSectionFormField("cardDescription", event.target.value)
                  }
                  placeholder="Key details for the first card in this section"
                />
              </label>

              <button type="submit" className={palette.primaryButton}>
                <Plus className="h-4 w-4" />
                Add Section
              </button>
            </form>
          </section>
        )}

        <div className="mt-7 space-y-6">
          {visibleSectionIds.map((sectionId) => {
            const isDropTarget =
              canEdit && dropTargetId === sectionId && draggingSectionId !== sectionId;
            const wrapperClassName = cn(
              palette.section,
              isDropTarget && palette.sectionDropTarget
            );

            if (sectionId === "hero") {
              return (
                <section
                  key={sectionId}
                  className={wrapperClassName}
                  onDragOver={(event) => handleSectionDragOver(event, sectionId)}
                  onDrop={(event) => handleSectionDrop(event, sectionId)}
                >
                  {renderSectionHandle(sectionId)}
                  {renderSectionHeader(
                    "Hero",
                    "Your personal positioning statement and contact anchors."
                  )}

                  <div className="mt-4 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
                    <div>
                      <EditableText
                        as="h3"
                        className="text-4xl font-semibold leading-[0.92] tracking-[-0.045em] sm:text-5xl"
                        value={profile.headline}
                        editable={canEdit}
                        onValueChange={(value) => updateField("headline", value)}
                      />
                      <EditableText
                        className={palette.heroSummary}
                        value={profile.summary}
                        editable={canEdit}
                        onValueChange={(value) => updateField("summary", value)}
                      />
                    </div>

                    <aside className={palette.contactCard}>
                      <p className={palette.sectionLabel}>Connect</p>
                      <EditableText
                        className={cn("mt-2 break-all", palette.bodyText)}
                        value={profile.email}
                        editable={canEdit}
                        multiline={false}
                        onValueChange={(value) => updateField("email", value)}
                      />
                      <EditableText
                        className={cn("mt-1", palette.bodyText)}
                        value={profile.location ?? ""}
                        editable={canEdit}
                        multiline={false}
                        placeholder="Location"
                        onValueChange={(value) => updateField("location", value)}
                      />
                      {canEdit ? (
                        <EditableText
                          className={cn("mt-2 break-all", palette.link)}
                          value={profile.linkedinUrl ?? ""}
                          editable
                          multiline={false}
                          onValueChange={(value) => updateField("linkedinUrl", value)}
                        />
                      ) : (
                        profile.linkedinUrl && (
                          <a
                            href={profile.linkedinUrl}
                            target="_blank"
                            rel="noreferrer"
                            className={cn("mt-2 inline-block break-all", palette.link)}
                          >
                            {profile.linkedinUrl}
                          </a>
                        )
                      )}
                    </aside>
                  </div>
                </section>
              );
            }

            if (sectionId === "skills") {
              return (
                <section
                  key={sectionId}
                  className={wrapperClassName}
                  onDragOver={(event) => handleSectionDragOver(event, sectionId)}
                  onDrop={(event) => handleSectionDrop(event, sectionId)}
                >
                  {renderSectionHandle(sectionId)}
                  {renderSectionHeader(
                    "Skills",
                    "Stack, tooling, and capabilities presented as your portfolio toolkit.",
                    canEdit ? (
                      <button
                        type="button"
                        onClick={() => addSkill()}
                        className={palette.secondaryButton}
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Add Skill
                      </button>
                    ) : null
                  )}

                  <div className="mt-5 flex flex-wrap gap-2">
                    {profile.skills.length > 0 ? (
                      profile.skills.map((skill, index) => (
                        <div key={`${skill}-${index}`} className={palette.skillChip}>
                          <EditableText
                            as="span"
                            value={skill}
                            editable={canEdit}
                            multiline={false}
                            onValueChange={(value) => updateSkill(index, value)}
                          />
                          {canEdit && (
                            <button
                              type="button"
                              onClick={() => removeSkill(index)}
                              className={palette.chipAction}
                              title="Remove skill"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className={palette.emptyState}>
                        Add skills to show your technical and creative strengths.
                      </p>
                    )}
                  </div>
                </section>
              );
            }

            if (sectionId === "experience") {
              return (
                <section
                  key={sectionId}
                  className={wrapperClassName}
                  onDragOver={(event) => handleSectionDragOver(event, sectionId)}
                  onDrop={(event) => handleSectionDrop(event, sectionId)}
                >
                  {renderSectionHandle(sectionId)}
                  {renderSectionHeader(
                    "Experience",
                    "Portfolio projects, collaborations, and impact narratives.",
                    canEdit ? (
                      <button
                        type="button"
                        onClick={() => addExperience()}
                        className={palette.secondaryButton}
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Add Card
                      </button>
                    ) : null
                  )}

                  {profile.experience.length > 0 ? (
                    <div className="mt-5 grid gap-3 lg:grid-cols-2">
                      {profile.experience.map((entry, index) => (
                        <article key={`${entry.title}-${index}`} className={palette.projectCard}>
                          <div className="flex items-start justify-between gap-3">
                            <EditableText
                              as="h3"
                              className="text-lg font-semibold tracking-[-0.02em]"
                              value={entry.title}
                              editable={canEdit}
                              multiline={false}
                              onValueChange={(value) =>
                                updateExperienceField(index, "title", value)
                              }
                            />
                            {canEdit && (
                              <button
                                type="button"
                                onClick={() => removeExperience(index)}
                                className={palette.iconButton}
                                title="Remove experience card"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>

                          <div className={cn("mt-1 flex flex-wrap items-center gap-1", palette.mutedText)}>
                            <EditableText
                              as="span"
                              value={entry.company}
                              editable={canEdit}
                              multiline={false}
                              onValueChange={(value) =>
                                updateExperienceField(index, "company", value)
                              }
                            />
                            {(entry.location || canEdit) && (
                              <>
                                <span aria-hidden>·</span>
                                <EditableText
                                  as="span"
                                  value={entry.location ?? ""}
                                  editable={canEdit}
                                  multiline={false}
                                  onValueChange={(value) =>
                                    updateExperienceField(index, "location", value)
                                  }
                                />
                              </>
                            )}
                          </div>

                          <EditableText
                            className={cn("mt-2 text-[0.66rem] uppercase tracking-[0.16em]", palette.mutedText)}
                            value={entry.duration}
                            editable={canEdit}
                            multiline={false}
                            onValueChange={(value) =>
                              updateExperienceField(index, "duration", value)
                            }
                          />
                          <EditableText
                            className={cn("mt-3", palette.bodyText)}
                            value={entry.description}
                            editable={canEdit}
                            onValueChange={(value) =>
                              updateExperienceField(index, "description", value)
                            }
                          />
                        </article>
                      ))}
                    </div>
                  ) : (
                    <p className={palette.emptyState}>
                      Add project cards to turn your experience into a portfolio narrative.
                    </p>
                  )}
                </section>
              );
            }

            if (sectionId === "education") {
              const educationEntries = profile.education ?? [];
              return (
                <section
                  key={sectionId}
                  className={wrapperClassName}
                  onDragOver={(event) => handleSectionDragOver(event, sectionId)}
                  onDrop={(event) => handleSectionDrop(event, sectionId)}
                >
                  {renderSectionHandle(sectionId)}
                  {renderSectionHeader(
                    "Education",
                    "Academic foundations and learning milestones."
                  )}

                  {educationEntries.length > 0 ? (
                    <div className="mt-5 grid gap-3 md:grid-cols-2">
                      {educationEntries.map((entry, index) => (
                        <article key={`${entry.institution}-${index}`} className={palette.educationCard}>
                          <EditableText
                            className="text-sm font-semibold sm:text-base"
                            value={entry.institution}
                            editable={canEdit}
                            multiline={false}
                            onValueChange={(value) =>
                              updateEducationField(index, "institution", value)
                            }
                          />
                          <EditableText
                            className={cn("mt-1", palette.bodyText)}
                            value={entry.degree}
                            editable={canEdit}
                            onValueChange={(value) => updateEducationField(index, "degree", value)}
                          />
                          {(entry.duration || canEdit) && (
                            <EditableText
                              className={cn("mt-2 text-[0.66rem] uppercase tracking-[0.16em]", palette.mutedText)}
                              value={entry.duration}
                              editable={canEdit}
                              multiline={false}
                              onValueChange={(value) =>
                                updateEducationField(index, "duration", value)
                              }
                            />
                          )}
                        </article>
                      ))}
                    </div>
                  ) : (
                    <p className={palette.emptyState}>
                      Education details will appear here as a dedicated portfolio section.
                    </p>
                  )}
                </section>
              );
            }

            if (sectionId === "certifications") {
              const certifications = profile.certifications ?? [];
              return (
                <section
                  key={sectionId}
                  className={wrapperClassName}
                  onDragOver={(event) => handleSectionDragOver(event, sectionId)}
                  onDrop={(event) => handleSectionDrop(event, sectionId)}
                >
                  {renderSectionHandle(sectionId)}
                  {renderSectionHeader(
                    "Certifications",
                    "Credibility and domain proof points.",
                    canEdit ? (
                      <button
                        type="button"
                        onClick={() => addCertification()}
                        className={palette.secondaryButton}
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Add Card
                      </button>
                    ) : null
                  )}

                  {certifications.length > 0 ? (
                    <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                      {certifications.map((certification, index) => (
                        <li key={`${certification}-${index}`} className={palette.certificationCard}>
                          <EditableText
                            as="span"
                            value={certification}
                            editable={canEdit}
                            onValueChange={(value) => updateCertification(index, value)}
                          />
                          {canEdit && (
                            <button
                              type="button"
                              onClick={() => removeCertification(index)}
                              className={palette.iconButton}
                              title="Remove certification card"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className={palette.emptyState}>
                      Add certifications as cards to reinforce trust and depth.
                    </p>
                  )}
                </section>
              );
            }

            const customSection = customSectionsById.get(sectionId);
            if (!customSection) return null;
            const cardDraft = cardDrafts[customSection.id] ?? createCardDraft();

            return (
              <section
                key={customSection.id}
                className={wrapperClassName}
                onDragOver={(event) => handleSectionDragOver(event, customSection.id)}
                onDrop={(event) => handleSectionDrop(event, customSection.id)}
              >
                {renderSectionHandle(customSection.id)}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className={palette.sectionLabel}>Custom Section</p>
                    <EditableText
                      as="h2"
                      className={palette.sectionTitle}
                      value={customSection.title}
                      editable={canEdit}
                      multiline={false}
                      onValueChange={(value) =>
                        updateCustomSectionField(customSection.id, "title", value)
                      }
                    />
                    <EditableText
                      className={cn("mt-2", palette.bodyText)}
                      value={customSection.description ?? ""}
                      editable={canEdit}
                      placeholder="Add a short intro for this custom section"
                      onValueChange={(value) =>
                        updateCustomSectionField(customSection.id, "description", value)
                      }
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={palette.customTag}>
                      {customSection.layout === "horizontal" ? "Horizontal Cards" : "Vertical Cards"}
                    </span>

                    {canEdit && (
                      <>
                        <select
                          className={cn(palette.input, "h-9 w-auto rounded-full px-3 py-1 text-[0.68rem]")}
                          value={customSection.layout}
                          onChange={(event) =>
                            updateCustomSectionField(
                              customSection.id,
                              "layout",
                              event.target.value
                            )
                          }
                        >
                          <option value="vertical">Vertical</option>
                          <option value="horizontal">Horizontal</option>
                        </select>

                        <button
                          type="button"
                          onClick={() => removeCustomSection(customSection.id)}
                          className={palette.iconButton}
                          title="Remove section"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {customSection.cards.length > 0 ? (
                  <div
                    className={cn(
                      "mt-5 gap-3",
                      customSection.layout === "horizontal" ? "grid md:grid-cols-2" : "space-y-3"
                    )}
                  >
                    {customSection.cards.map((card) => (
                      <article key={card.id} className={palette.customCard}>
                        <div className="flex items-start justify-between gap-3">
                          <EditableText
                            as="h3"
                            className="text-base font-semibold"
                            value={card.title}
                            editable={canEdit}
                            multiline={false}
                            onValueChange={(value) =>
                              updateCustomCardField(customSection.id, card.id, "title", value)
                            }
                          />

                          {canEdit && (
                            <button
                              type="button"
                              onClick={() => removeCustomCard(customSection.id, card.id)}
                              className={palette.iconButton}
                              title="Remove card"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>

                        <EditableText
                          className={cn("mt-1 text-xs uppercase tracking-[0.13em]", palette.mutedText)}
                          value={card.subtitle ?? ""}
                          editable={canEdit}
                          multiline={false}
                          placeholder="Optional subtitle"
                          onValueChange={(value) =>
                            updateCustomCardField(customSection.id, card.id, "subtitle", value)
                          }
                        />
                        <EditableText
                          className={cn("mt-3", palette.bodyText)}
                          value={card.description}
                          editable={canEdit}
                          onValueChange={(value) =>
                            updateCustomCardField(customSection.id, card.id, "description", value)
                          }
                        />
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className={palette.emptyState}>Add cards to populate this custom section.</p>
                )}

                {canEdit && (
                  <div className={cn("mt-5 rounded-2xl p-4", palette.controlPanel)}>
                    <p className={palette.sectionLabel}>Add Card</p>

                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      <input
                        className={palette.input}
                        value={cardDraft.title}
                        onChange={(event) =>
                          updateCardDraftField(customSection.id, "title", event.target.value)
                        }
                        placeholder="Card title"
                      />
                      <input
                        className={palette.input}
                        value={cardDraft.subtitle}
                        onChange={(event) =>
                          updateCardDraftField(customSection.id, "subtitle", event.target.value)
                        }
                        placeholder="Card subtitle"
                      />
                      <textarea
                        className={cn(palette.input, "min-h-[78px] resize-y sm:col-span-2")}
                        value={cardDraft.description}
                        onChange={(event) =>
                          updateCardDraftField(customSection.id, "description", event.target.value)
                        }
                        placeholder="Card description"
                      />
                      <button
                        type="button"
                        onClick={() => addCardToSection(customSection.id)}
                        className={palette.primaryButton}
                      >
                        <Plus className="h-4 w-4" />
                        Add Card
                      </button>
                    </div>
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PortfolioTemplateEngine;
