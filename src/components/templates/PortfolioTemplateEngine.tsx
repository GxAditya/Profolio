import { useMemo, useState, type DragEvent, type FormEvent, type ReactNode } from "react";
import { ExternalLink, GripVertical, Plus, Trash2 } from "lucide-react";
import EditableText from "@/components/EditableText";
import { createProfileEditor } from "@/components/templates/profileEditUtils";
import { cn } from "@/lib/utils";
import type {
  CustomSection,
  CustomSectionCard,
  CustomSectionLayout,
  LinkedInProfile,
  PortfolioSectionTitles,
  ProjectLink,
} from "@/types/linkedin";

export type PortfolioTheme = "neumorphism" | "neobrutalism" | "glassmorphism" | "claymorphism" | "minimalism";
export type PortfolioSectionStyle = "framed" | "plain";

interface Props {
  profile: LinkedInProfile;
  editable?: boolean;
  showAddSectionControls?: boolean;
  onProfileChange?: (updater: (prev: LinkedInProfile) => LinkedInProfile) => void;
  sectionStyle?: PortfolioSectionStyle;
  theme: PortfolioTheme;
}

type SectionBuilderType = "custom" | "projects";

interface SectionFormState {
  type: SectionBuilderType;
  title: string;
  description: string;
  layout: CustomSectionLayout;
  cardTitle: string;
  cardSubtitle: string;
  cardDescription: string;
  cardImageUrl: string;
  cardLinkLabel: string;
  cardLinkUrl: string;
}

interface CardDraft {
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  linkLabel: string;
  linkUrl: string;
}

interface ConnectLinkDraft {
  label: string;
  url: string;
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
    page: "relative min-h-screen w-full overflow-hidden bg-[#e8edf4] text-[#273447]",
    ambience:
      "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_8%,rgba(255,255,255,0.9),transparent_38%),radial-gradient(circle_at_86%_0%,rgba(206,217,235,0.62),transparent_36%),linear-gradient(180deg,rgba(237,242,249,0.88),rgba(228,236,246,0.88))]",
    contentWrap: "relative px-6 pb-9 pt-6 sm:px-9 sm:pt-7",
    header:
      "flex flex-wrap items-end justify-between gap-4 rounded-[1rem] border border-[#dde5f2] bg-[#e8edf4] px-5 py-5 shadow-[-10px_-10px_22px_#f8fbff,12px_12px_24px_#c4cedb]",
    headingKicker: "text-[0.65rem] uppercase tracking-[0.18em] text-[#6d7d96]",
    headingName: "mt-2 text-3xl font-semibold tracking-[-0.03em] text-[#223144] [font-family:var(--heading-font)] sm:text-4xl",
    headingMeta: "rounded-lg border border-[#d7deea] bg-[#ebf0f6] px-4 py-2 text-xs text-[#4e5e77] shadow-[inset_4px_4px_10px_#cbd5e4,inset_-4px_-4px_10px_#f7fbff]",
    section:
      "rounded-[0.95rem] border border-[#dae2ee] bg-[#e8edf4] p-5 shadow-[-8px_-8px_18px_#f9fcff,10px_10px_20px_#c4cedb]",
    sectionDropTarget:
      "border-[#8d9fc0] shadow-[-8px_-8px_18px_#f9fcff,0_0_0_3px_rgba(141,159,192,0.24),10px_10px_20px_#c4cedb]",
    sectionHandle:
      "mb-5 inline-flex cursor-grab items-center gap-2 rounded-lg border border-[#d4dce8] bg-[#ecf1f7] px-3 py-1.5 text-[0.63rem] font-semibold uppercase tracking-[0.14em] text-[#586a84] shadow-[inset_4px_4px_8px_#cfd8e6,inset_-4px_-4px_8px_#f8fbff]",
    sectionLabel: "text-[0.62rem] uppercase tracking-[0.16em] text-[#6e7d95]",
    sectionTitle: "mt-1 text-2xl font-semibold tracking-[-0.03em] text-[#213043] [font-family:var(--heading-font)]",
    sectionSubtitle: "mt-2 text-sm leading-relaxed text-[#4f5f79]",
    bodyText: "text-sm leading-relaxed text-[#3f5069]",
    mutedText: "text-xs text-[#63748f]",
    link: "text-[#2f5f9e] underline decoration-[#2f5f9e]/35 underline-offset-4",
    input:
      "w-full rounded-xl border border-[#cfdae8] bg-[#ebf0f6] px-3 py-2 text-sm text-[#25354a] outline-none shadow-[inset_4px_4px_10px_#ced8e7,inset_-4px_-4px_10px_#f8fbff] transition focus:border-[#8ca0bf]",
    controlPanel:
      "mt-6 rounded-[1rem] border border-[#d8e1ed] bg-[#e8edf4] p-5 shadow-[-8px_-8px_18px_#f9fcff,10px_10px_20px_#c4cedb]",
    controlPanelTitle: "mt-2 text-xl font-semibold tracking-[-0.02em] text-[#223246] [font-family:var(--heading-font)]",
    controlPanelLabel: "text-xs font-medium text-[#5f7090]",
    heroSummary:
      "mt-4 max-w-3xl rounded-xl border border-[#d6deea] bg-[#edf2f8] p-4 text-sm leading-relaxed text-[#3f5068] shadow-[inset_6px_6px_12px_#cfd8e6,inset_-6px_-6px_12px_#f8fbff]",
    contactCard:
      "rounded-xl border border-[#d6deea] bg-[#edf2f8] p-4 shadow-[inset_6px_6px_12px_#cfd8e6,inset_-6px_-6px_12px_#f8fbff]",
    skillChip:
      "inline-flex items-center gap-1 rounded-lg border border-[#cfd8e6] bg-[#edf2f8] pl-3 pr-1 text-[0.66rem] uppercase tracking-[0.11em] text-[#445873] shadow-[inset_4px_4px_8px_#cfd8e6,inset_-4px_-4px_8px_#f8fbff]",
    chipAction:
      "inline-flex h-5 w-5 items-center justify-center rounded-lg border border-[#c6d2e2] bg-[#eff4fa] text-[#5b6f8b] hover:bg-[#e7edf5]",
    addChipButton:
      "inline-flex items-center gap-1 rounded-lg border border-[#c8d4e3] bg-[#edf2f8] px-3 py-1 text-[0.64rem] font-semibold uppercase tracking-[0.13em] text-[#4b5f7d] shadow-[inset_4px_4px_8px_#cfd8e6,inset_-4px_-4px_8px_#f8fbff] hover:text-[#344964]",
    projectCard:
      "relative rounded-xl border border-[#d2dbe8] bg-[#edf2f8] p-4 shadow-[-6px_-6px_14px_#f8fbff,8px_8px_16px_#c5cfdb] transition-shadow duration-200 hover:shadow-[-4px_-4px_10px_#f8fbff,5px_5px_10px_#c5cfdb]",
    educationCard:
      "rounded-xl border border-[#d2dbe8] bg-[#edf2f8] p-4 shadow-[-6px_-6px_14px_#f8fbff,8px_8px_16px_#c5cfdb] transition-shadow duration-200 hover:shadow-[-4px_-4px_10px_#f8fbff,5px_5px_10px_#c5cfdb]",
    certificationCard:
      "flex items-start justify-between gap-2 rounded-xl border border-[#d2dbe8] bg-[#edf2f8] px-3 py-2.5 text-sm text-[#33455f] shadow-[-5px_-5px_10px_#f8fbff,6px_6px_12px_#c5cfdb] transition-shadow duration-200",
    customCard:
      "rounded-xl border border-[#d2dbe8] bg-[#edf2f8] p-4 shadow-[-6px_-6px_14px_#f8fbff,8px_8px_16px_#c5cfdb] transition-shadow duration-200 hover:shadow-[-4px_-4px_10px_#f8fbff,5px_5px_10px_#c5cfdb]",
    customTag:
      "rounded-lg border border-[#ccd7e6] bg-[#edf2f8] px-3 py-1 text-[0.62rem] uppercase tracking-[0.14em] text-[#5f7190] shadow-[inset_4px_4px_8px_#cfd8e6,inset_-4px_-4px_8px_#f8fbff]",
    emptyState:
      "mt-4 rounded-xl border border-[#d3dcea] bg-[#edf2f8] px-4 py-3 text-sm text-[#50617b] shadow-[inset_5px_5px_10px_#cfd8e6,inset_-5px_-5px_10px_#f8fbff]",
    primaryButton:
      "inline-flex items-center justify-center gap-2 rounded-xl border border-[#bac9de] bg-[#dbe5f3] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#30445f] shadow-[-5px_-5px_10px_#f7fbff,6px_6px_12px_#bfcbdb] transition-shadow duration-200 hover:shadow-[-3px_-3px_8px_#f7fbff,4px_4px_8px_#bfcbdb] active:shadow-[inset_4px_4px_10px_#cdd7e5,inset_-4px_-4px_10px_#f8fbff]",
    secondaryButton:
      "inline-flex items-center gap-1 rounded-lg border border-[#ccd7e6] bg-[#edf2f8] px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.13em] text-[#445b78] shadow-[inset_4px_4px_8px_#cfd8e6,inset_-4px_-4px_8px_#f8fbff] transition-shadow duration-200 hover:text-[#30465f]",
    iconButton:
      "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[#c8d4e3] bg-[#edf2f8] text-[#4d617d] shadow-[inset_3px_3px_6px_#ced8e6,inset_-3px_-3px_6px_#f8fbff] transition-shadow duration-200 hover:text-[#32445d]",
  },
  neobrutalism: {
    page: "relative min-h-screen w-full overflow-hidden bg-[#ffe65a] text-black",
    ambience:
      "pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.3)_0%,transparent_45%),repeating-linear-gradient(45deg,rgba(0,0,0,0.04)_0,rgba(0,0,0,0.04)_8px,transparent_8px,transparent_16px)]",
    contentWrap: "relative px-6 pb-9 pt-6 sm:px-9 sm:pt-7",
    header:
      "flex flex-wrap items-end justify-between gap-4 border-4 border-black bg-[#ff7a59] px-5 py-5 shadow-[8px_8px_0_#000]",
    headingKicker: "text-[0.67rem] uppercase tracking-[0.19em] text-black/75",
    headingName:
      "mt-2 text-3xl font-black uppercase tracking-[-0.03em] text-black [font-family:var(--heading-font)] sm:text-4xl",
    headingMeta:
      "rounded-lg border-2 border-black bg-[#f8f4ec] px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-black",
    section:
      "rounded-[0.55rem] border-4 border-black bg-[#f8f4ec] p-5 shadow-[8px_8px_0_#000]",
    sectionDropTarget: "bg-[#d5fff2] shadow-[10px_10px_0_#000]",
    sectionHandle:
      "mb-5 inline-flex cursor-grab items-center gap-2 rounded-lg border-2 border-black bg-[#b4ff83] px-3 py-1.5 text-[0.64rem] font-black uppercase tracking-[0.12em] text-black",
    sectionLabel: "text-[0.64rem] uppercase tracking-[0.17em] text-black/65",
    sectionTitle: "mt-1 text-2xl font-black uppercase tracking-[-0.02em] text-black [font-family:var(--heading-font)]",
    sectionSubtitle: "mt-2 text-sm font-medium leading-relaxed text-black/80",
    bodyText: "text-sm leading-relaxed text-black/85",
    mutedText: "text-xs text-black/70",
    link: "font-semibold text-black underline decoration-black/40 underline-offset-4",
    input:
      "w-full rounded-md border-2 border-black bg-white px-3 py-2 text-sm text-black outline-none transition focus:-translate-y-[1px] focus:translate-x-[1px] focus:shadow-[3px_3px_0_#000]",
    controlPanel:
      "mt-6 rounded-[0.6rem] border-4 border-black bg-[#d9f7ff] p-5 shadow-[8px_8px_0_#000]",
    controlPanelTitle: "mt-2 text-xl font-black uppercase tracking-[-0.01em] text-black [font-family:var(--heading-font)]",
    controlPanelLabel: "text-xs font-bold uppercase tracking-[0.06em] text-black/80",
    heroSummary:
      "mt-4 rounded-[3px] border-[3px] border-black bg-[#ffffff] p-4 text-sm leading-relaxed text-black",
    contactCard: "rounded-[3px] border-[3px] border-black bg-[#ffffff] p-4",
    skillChip:
      "inline-flex items-center gap-1 rounded-lg border-2 border-black bg-[#ffc9e8] pl-3 pr-1 text-[0.66rem] font-black uppercase tracking-[0.1em] text-black",
    chipAction:
      "inline-flex h-5 w-5 items-center justify-center rounded-lg border-2 border-black bg-[#fff] text-black hover:bg-[#ffef72]",
    addChipButton:
      "inline-flex items-center gap-1 rounded-lg border-2 border-black bg-[#9ef7c4] px-3 py-1 text-[0.64rem] font-black uppercase tracking-[0.12em] text-black hover:bg-[#7af0b3]",
    projectCard:
      "relative rounded-[3px] border-[3px] border-black bg-[#fef8ed] p-4 shadow-[6px_6px_0_#000] transition-transform duration-150 hover:-translate-y-[2px] hover:translate-x-[-1px] hover:shadow-[8px_8px_0_#000]",
    educationCard:
      "rounded-[3px] border-[3px] border-black bg-[#fef8ed] p-4 shadow-[6px_6px_0_#000] transition-transform duration-150 hover:-translate-y-[2px] hover:translate-x-[-1px] hover:shadow-[8px_8px_0_#000]",
    certificationCard:
      "flex items-start justify-between gap-2 rounded-[3px] border-[3px] border-black bg-[#fef8ed] px-3 py-2.5 text-sm text-black shadow-[6px_6px_0_#000] transition-transform duration-150 hover:-translate-y-[1px] hover:shadow-[7px_7px_0_#000]",
    customCard:
      "rounded-[3px] border-[3px] border-black bg-[#fef8ed] p-4 shadow-[6px_6px_0_#000] transition-transform duration-150 hover:-translate-y-[2px] hover:translate-x-[-1px] hover:shadow-[8px_8px_0_#000]",
    customTag:
      "rounded-lg border-2 border-black bg-[#ffe39a] px-3 py-1 text-[0.62rem] font-black uppercase tracking-[0.12em] text-black",
    emptyState:
      "mt-4 rounded-[3px] border-[3px] border-black bg-[#fff] px-4 py-3 text-sm text-black",
    primaryButton:
      "inline-flex items-center justify-center gap-2 rounded-lg border-[3px] border-black bg-[#ff785a] px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-black hover:translate-x-[1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0_#000]",
    secondaryButton:
      "inline-flex items-center gap-1 rounded-lg border-2 border-black bg-[#ffe39a] px-3 py-1.5 text-[0.65rem] font-black uppercase tracking-[0.12em] text-black hover:bg-[#ffd77a]",
    iconButton:
      "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 border-black bg-white text-black hover:bg-[#ffe9a9]",
  },
  glassmorphism: {
    page: "relative min-h-screen w-full overflow-hidden bg-[linear-gradient(145deg,#0a0a12,#0e0b1a,#150f22)] text-[#f0ecf8]",
    ambience:
      "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_8%,rgba(244,114,182,0.32),transparent_36%),radial-gradient(circle_at_88%_12%,rgba(168,85,247,0.28),transparent_38%),radial-gradient(circle_at_50%_100%,rgba(251,191,36,0.16),transparent_34%)]",
    contentWrap: "relative px-6 pb-9 pt-6 sm:px-9 sm:pt-7",
    header:
      "flex flex-wrap items-end justify-between gap-4 rounded-[0.95rem] border border-white/[0.14] bg-white/[0.07] px-5 py-5 shadow-[0_14px_40px_rgba(6,3,18,0.5)] backdrop-blur-xl",
    headingKicker: "text-[0.65rem] uppercase tracking-[0.18em] text-rose-200/60",
    headingName: "mt-2 text-3xl font-semibold tracking-[-0.03em] text-white [font-family:var(--heading-font)] sm:text-4xl",
    headingMeta:
      "rounded-lg border border-white/[0.14] bg-white/[0.07] px-4 py-2 text-xs text-white/70 backdrop-blur-md",
    section:
      "rounded-[0.9rem] border border-white/[0.1] bg-white/[0.05] p-5 shadow-[0_16px_44px_rgba(6,3,18,0.5)] backdrop-blur-xl",
    sectionDropTarget: "border-rose-300/60 bg-rose-300/10 shadow-[0_18px_50px_rgba(244,114,182,0.2)]",
    sectionHandle:
      "mb-5 inline-flex cursor-grab items-center gap-2 rounded-lg border border-white/[0.16] bg-white/[0.07] px-3 py-1.5 text-[0.63rem] font-semibold uppercase tracking-[0.14em] text-white/70 backdrop-blur-md",
    sectionLabel: "text-[0.62rem] uppercase tracking-[0.16em] text-rose-200/50",
    sectionTitle: "mt-1 text-2xl font-semibold tracking-[-0.03em] text-white [font-family:var(--heading-font)]",
    sectionSubtitle: "mt-2 text-sm leading-relaxed text-white/65",
    bodyText: "text-sm leading-relaxed text-[#ddd4ec]",
    mutedText: "text-xs text-white/55",
    link: "text-rose-300 underline decoration-rose-300/35 underline-offset-4",
    input:
      "w-full rounded-xl border border-white/[0.18] bg-white/[0.1] px-3 py-2 text-sm text-white outline-none backdrop-blur-md transition placeholder:text-white/40 focus:border-rose-300/60 focus:bg-white/[0.14]",
    controlPanel:
      "mt-6 rounded-[0.95rem] border border-white/[0.14] bg-white/[0.07] p-5 shadow-[0_16px_44px_rgba(6,3,18,0.5)] backdrop-blur-xl",
    controlPanelTitle: "mt-2 text-xl font-semibold tracking-[-0.02em] text-white [font-family:var(--heading-font)]",
    controlPanelLabel: "text-xs font-medium text-white/65",
    heroSummary:
      "mt-4 rounded-xl border border-white/[0.12] bg-white/[0.08] p-4 text-sm leading-relaxed text-[#ddd4ec] backdrop-blur-lg",
    contactCard: "rounded-xl border border-white/[0.12] bg-white/[0.08] p-4 backdrop-blur-lg",
    skillChip:
      "inline-flex items-center gap-1 rounded-lg border border-white/[0.16] bg-white/[0.08] pl-3 pr-1 text-[0.66rem] uppercase tracking-[0.11em] text-rose-100/80 backdrop-blur-md",
    chipAction:
      "inline-flex h-5 w-5 items-center justify-center rounded-lg border border-white/[0.18] bg-white/[0.1] text-white/75 hover:bg-white/[0.18]",
    addChipButton:
      "inline-flex items-center gap-1 rounded-lg border border-rose-300/35 bg-rose-300/10 px-3 py-1 text-[0.64rem] font-semibold uppercase tracking-[0.13em] text-rose-200 hover:bg-rose-300/18",
    projectCard:
      "relative rounded-xl border border-white/[0.16] bg-white/[0.1] p-4 shadow-[0_10px_28px_rgba(6,3,18,0.44)] backdrop-blur-lg",
    educationCard:
      "rounded-xl border border-white/[0.16] bg-white/[0.1] p-4 shadow-[0_10px_28px_rgba(6,3,18,0.44)] backdrop-blur-lg",
    certificationCard:
      "flex items-start justify-between gap-2 rounded-xl border border-white/[0.16] bg-white/[0.1] px-3 py-2.5 text-sm text-[#ddd4ec] shadow-[0_10px_24px_rgba(6,3,18,0.4)] backdrop-blur-lg",
    customCard:
      "rounded-xl border border-white/[0.16] bg-white/[0.1] p-4 shadow-[0_10px_28px_rgba(6,3,18,0.44)] backdrop-blur-lg",
    customTag:
      "rounded-lg border border-white/[0.14] bg-white/[0.08] px-3 py-1 text-[0.62rem] uppercase tracking-[0.14em] text-white/65 backdrop-blur-md",
    emptyState:
      "mt-4 rounded-xl border border-white/[0.12] bg-white/[0.07] px-4 py-3 text-sm text-white/65 backdrop-blur-md",
    primaryButton:
      "inline-flex items-center justify-center gap-2 rounded-xl border border-rose-300/40 bg-rose-400/14 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-rose-100 hover:bg-rose-400/22",
    secondaryButton:
      "inline-flex items-center gap-1 rounded-lg border border-white/[0.16] bg-white/[0.07] px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.13em] text-white/75 hover:bg-white/[0.12]",
    iconButton:
      "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/[0.16] bg-white/[0.09] text-white/80 hover:bg-white/[0.16]",
  },
  claymorphism: {
    page: "relative min-h-screen w-full overflow-hidden bg-[#f0f7ff] text-[#1e293b]",
    ambience:
      "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(147,197,253,0.4),transparent_38%),radial-gradient(circle_at_85%_15%,rgba(167,243,208,0.32),transparent_36%),radial-gradient(circle_at_50%_96%,rgba(253,164,175,0.28),transparent_34%)]",
    contentWrap: "relative px-6 pb-12 pt-6 sm:px-9 sm:pt-7",
    header:
      "flex flex-wrap items-end justify-between gap-4 rounded-[1.6rem] border-[2.5px] border-[#bfdbfe] bg-white px-5 py-5 shadow-[0_6px_0_#93c5fd,0_14px_36px_rgba(147,197,253,0.25)]",
    headingKicker: "text-[0.65rem] uppercase tracking-[0.18em] text-[#3b82f6]/70",
    headingName:
      "mt-2 text-3xl font-extrabold tracking-[-0.02em] text-[#1e3a5f] [font-family:var(--heading-font)] sm:text-4xl",
    headingMeta:
      "rounded-[1.2rem] border-[2px] border-[#bfdbfe] bg-[#eff6ff] px-4 py-2 text-xs font-semibold text-[#3b82f6]",
    section:
      "rounded-[1.5rem] border-[2.5px] border-[#e0f2fe] bg-white p-5 shadow-[0_5px_0_#bae6fd,0_12px_28px_rgba(186,230,253,0.28)]",
    sectionDropTarget:
      "border-[#67e8f9] shadow-[0_5px_0_#22d3ee,0_12px_28px_rgba(34,211,238,0.28)]",
    sectionHandle:
      "mb-5 inline-flex cursor-grab items-center gap-2 rounded-[1.2rem] border-[2px] border-[#a7f3d0] bg-[#d1fae5] px-3 py-1.5 text-[0.63rem] font-bold uppercase tracking-[0.13em] text-[#047857]",
    sectionLabel: "text-[0.62rem] uppercase tracking-[0.16em] text-[#60a5fa]/70",
    sectionTitle:
      "mt-1 text-2xl font-extrabold tracking-[-0.02em] text-[#1e3a5f] [font-family:var(--heading-font)]",
    sectionSubtitle: "mt-2 text-sm leading-relaxed text-[#475569]",
    bodyText: "text-sm leading-relaxed text-[#475569]",
    mutedText: "text-xs text-[#94a3b8]",
    link: "font-semibold text-[#3b82f6] underline decoration-[#3b82f6]/30 underline-offset-4",
    input:
      "w-full rounded-[1.2rem] border-[2px] border-[#bfdbfe] bg-[#eff6ff] px-3 py-2 text-sm text-[#1e3a5f] outline-none transition placeholder:text-[#94a3b8] focus:border-[#60a5fa] focus:bg-white",
    controlPanel:
      "mt-6 rounded-[1.5rem] border-[2.5px] border-[#e0f2fe] bg-white p-5 shadow-[0_5px_0_#bae6fd,0_12px_28px_rgba(186,230,253,0.28)]",
    controlPanelTitle:
      "mt-2 text-xl font-extrabold tracking-[-0.02em] text-[#1e3a5f] [font-family:var(--heading-font)]",
    controlPanelLabel: "text-xs font-semibold text-[#475569]",
    heroSummary:
      "mt-4 max-w-3xl rounded-[1.3rem] border-[2px] border-[#e0f2fe] bg-[#f0f9ff] p-4 text-sm leading-relaxed text-[#475569]",
    contactCard:
      "rounded-[1.3rem] border-[2px] border-[#e0f2fe] bg-[#f0f9ff] p-4",
    skillChip:
      "inline-flex items-center gap-1 rounded-[1.2rem] border-[2px] border-[#a7f3d0] bg-[#d1fae5] pl-3 pr-1 text-[0.66rem] font-bold uppercase tracking-[0.1em] text-[#065f46]",
    chipAction:
      "inline-flex h-5 w-5 items-center justify-center rounded-[0.75rem] border-[2px] border-[#6ee7b7] bg-[#ecfdf5] text-[#047857] hover:bg-[#a7f3d0]",
    addChipButton:
      "inline-flex items-center gap-1 rounded-[1.2rem] border-[2px] border-[#fecdd3] bg-[#fff1f2] px-3 py-1 text-[0.64rem] font-bold uppercase tracking-[0.12em] text-[#e11d48] hover:bg-[#ffe4e6]",
    projectCard:
      "relative rounded-[1.3rem] border-[2px] border-[#fde68a] bg-white p-4 shadow-[0_5px_0_#fbbf24,0_10px_22px_rgba(251,191,36,0.2)] transition-transform duration-200 hover:-translate-y-1",
    educationCard:
      "rounded-[1.3rem] border-[2px] border-[#ddd6fe] bg-white p-4 shadow-[0_5px_0_#c4b5fd,0_10px_22px_rgba(196,181,253,0.2)] transition-transform duration-200 hover:-translate-y-1",
    certificationCard:
      "flex items-start justify-between gap-2 rounded-[1.3rem] border-[2px] border-[#fbcfe8] bg-white px-3 py-2.5 text-sm text-[#1e293b] shadow-[0_4px_0_#f9a8d4,0_8px_18px_rgba(249,168,212,0.2)]",
    customCard:
      "rounded-[1.3rem] border-[2px] border-[#fde68a] bg-white p-4 shadow-[0_5px_0_#fbbf24,0_10px_22px_rgba(251,191,36,0.2)] transition-transform duration-200 hover:-translate-y-1",
    customTag:
      "rounded-[1.2rem] border-[2px] border-[#fed7aa] bg-[#fff7ed] px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-[#c2410c]",
    emptyState:
      "mt-4 rounded-[1.3rem] border-[2px] border-[#e0f2fe] bg-[#f0f9ff] px-4 py-3 text-sm text-[#475569]",
    primaryButton:
      "inline-flex items-center justify-center gap-2 rounded-[1.2rem] border-[2px] border-[#93c5fd] bg-[#3b82f6] px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white shadow-[0_4px_0_#1d4ed8] transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none",
    secondaryButton:
      "inline-flex items-center gap-1 rounded-[1.2rem] border-[2px] border-[#bfdbfe] bg-[#eff6ff] px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.13em] text-[#3b82f6] hover:bg-[#dbeafe]",
    iconButton:
      "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-[0.85rem] border-[2px] border-[#bfdbfe] bg-[#eff6ff] text-[#3b82f6] hover:bg-[#dbeafe]",
  },
  minimalism: {
    page: "relative min-h-screen w-full bg-white text-[#111111]",
    ambience: "pointer-events-none absolute inset-0",
    contentWrap: "relative px-8 pb-16 pt-10 sm:px-16 sm:pt-14",
    header:
      "flex flex-wrap items-end justify-between gap-4 border-b border-[#e5e5e5] pb-10",
    headingKicker: "text-[0.6rem] uppercase tracking-[0.22em] text-[#9ca3af]",
    headingName:
      "mt-2 text-3xl font-bold tracking-[-0.04em] text-[#111111] [font-family:var(--heading-font)] sm:text-4xl",
    headingMeta:
      "border border-[#e5e5e5] px-4 py-2 text-xs text-[#6b7280]",
    section: "border-b border-[#e5e5e5] py-10",
    sectionDropTarget: "border-b-2 border-[#111111] bg-[#fafafa]",
    sectionHandle:
      "mb-6 inline-flex cursor-grab items-center gap-2 border border-[#e5e5e5] bg-white px-3 py-1.5 text-[0.6rem] font-medium uppercase tracking-[0.18em] text-[#9ca3af]",
    sectionLabel: "text-[0.58rem] uppercase tracking-[0.2em] text-[#9ca3af]",
    sectionTitle:
      "mt-1 text-xl font-semibold tracking-[-0.03em] text-[#111111] [font-family:var(--heading-font)]",
    sectionSubtitle: "mt-2 text-sm leading-relaxed text-[#6b7280]",
    bodyText: "text-sm leading-relaxed text-[#374151]",
    mutedText: "text-xs text-[#9ca3af]",
    link: "text-[#111111] underline decoration-[#d1d5db] underline-offset-4",
    input:
      "w-full border-b border-[#d1d5db] bg-transparent px-0 py-2 text-sm text-[#111111] outline-none transition focus:border-[#111111] placeholder:text-[#9ca3af]",
    controlPanel:
      "mt-8 border border-[#e5e5e5] bg-[#fafafa] p-6",
    controlPanelTitle:
      "mt-2 text-lg font-semibold tracking-[-0.02em] text-[#111111] [font-family:var(--heading-font)]",
    controlPanelLabel: "text-[0.65rem] font-medium uppercase tracking-[0.12em] text-[#6b7280]",
    heroSummary:
      "mt-5 max-w-2xl text-sm leading-[1.85] text-[#4b5563]",
    contactCard: "border border-[#e5e5e5] p-5",
    skillChip:
      "inline-flex items-center gap-1 border border-[#e5e5e5] pl-3 pr-1 text-[0.62rem] uppercase tracking-[0.1em] text-[#6b7280]",
    chipAction:
      "inline-flex h-5 w-5 items-center justify-center border border-[#e5e5e5] bg-[#f9fafb] text-[#6b7280] hover:bg-[#f3f4f6]",
    addChipButton:
      "inline-flex items-center gap-1 border border-[#e5e5e5] px-3 py-1 text-[0.61rem] font-medium uppercase tracking-[0.13em] text-[#6b7280] hover:border-[#9ca3af] hover:text-[#374151]",
    projectCard:
      "relative border border-[#e5e5e5] bg-white p-5 transition-colors duration-200 hover:border-[#9ca3af]",
    educationCard:
      "border border-[#e5e5e5] bg-white p-5 transition-colors duration-200 hover:border-[#9ca3af]",
    certificationCard:
      "flex items-start justify-between gap-2 border-b border-[#f3f4f6] px-1 py-3.5 text-sm text-[#374151] last:border-b-0",
    customCard:
      "relative border border-[#e5e5e5] bg-white p-5 transition-colors duration-200 hover:border-[#9ca3af]",
    customTag:
      "border border-[#e5e5e5] px-3 py-1 text-[0.58rem] uppercase tracking-[0.14em] text-[#9ca3af]",
    emptyState:
      "mt-4 border border-[#f3f4f6] bg-[#fafafa] px-4 py-3 text-sm text-[#9ca3af]",
    primaryButton:
      "inline-flex items-center justify-center gap-2 bg-[#111111] px-5 py-2 text-xs font-medium uppercase tracking-[0.14em] text-white transition-opacity duration-150 hover:opacity-75",
    secondaryButton:
      "inline-flex items-center gap-1 border border-[#e5e5e5] px-3 py-1.5 text-[0.62rem] font-medium uppercase tracking-[0.13em] text-[#6b7280] hover:border-[#9ca3af] hover:text-[#374151]",
    iconButton:
      "inline-flex h-7 w-7 shrink-0 items-center justify-center border border-[#e5e5e5] text-[#6b7280] hover:border-[#9ca3af] hover:text-[#374151]",
  },
};

const themeTypography: Record<PortfolioTheme, { body: string; heading: string }> = {
  neumorphism: {
    body: '"Manrope", "Nunito Sans", sans-serif',
    heading: '"Nunito", "Manrope", sans-serif',
  },
  neobrutalism: {
    body: '"Space Grotesk", "Archivo", sans-serif',
    heading: '"Archivo Black", "Space Grotesk", sans-serif',
  },
  glassmorphism: {
    body: '"Sora", "Plus Jakarta Sans", sans-serif',
    heading: '"Space Grotesk", "Sora", sans-serif',
  },
  claymorphism: {
    body: '"Nunito", sans-serif',
    heading: '"Nunito", sans-serif',
  },
  minimalism: {
    body: '"Inter", "DM Sans", sans-serif',
    heading: '"Inter", "DM Sans", sans-serif',
  },
};

const createSectionId = (): string =>
  `custom-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`;

const createCardId = (): string =>
  `card-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`;

const createLinkId = (): string =>
  `link-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`;

const createSectionFormState = (): SectionFormState => ({
  type: "custom",
  title: "",
  description: "",
  layout: "vertical",
  cardTitle: "",
  cardSubtitle: "",
  cardDescription: "",
  cardImageUrl: "",
  cardLinkLabel: "",
  cardLinkUrl: "",
});

const createCardDraft = (): CardDraft => ({
  title: "",
  subtitle: "",
  description: "",
  imageUrl: "",
  linkLabel: "",
  linkUrl: "",
});

const createConnectLinkDraft = (): ConnectLinkDraft => ({
  label: "",
  url: "",
});

const DEFAULT_SECTION_TITLES: Required<PortfolioSectionTitles> = {
  skills: "Skills",
  experience: "Experience",
  education: "Education",
  certifications: "Certifications",
};

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

const LEGACY_LINKEDIN_LINK_ID = "connect-legacy-linkedin";

const normalizeExternalUrl = (value: string): string => {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^[a-z][a-z\d+\-.]*:/i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("//")) return `https:${trimmed}`;
  return `https://${trimmed.replace(/^\/+/, "")}`;
};

const getNormalizedConnectLinks = (profile: LinkedInProfile): ProjectLink[] => {
  if ((profile.connectLinks?.length ?? 0) > 0) {
    return (profile.connectLinks ?? []).map((link) => ({
      ...link,
      url: normalizeExternalUrl(link.url),
    }));
  }

  const legacyLinkedInUrl = profile.linkedinUrl?.trim();
  if (!legacyLinkedInUrl) return [];

  return [
    {
      id: LEGACY_LINKEDIN_LINK_ID,
      label: "LinkedIn",
      url: normalizeExternalUrl(legacyLinkedInUrl),
    },
  ];
};

const getLinkedInUrlFromConnectLinks = (
  links: ProjectLink[]
): string | undefined => {
  const linkedInLink = links.find(
    (link) => /linkedin\.com/i.test(link.url) || /linkedin/i.test(link.label)
  );
  const linkedInUrl = normalizeExternalUrl(linkedInLink?.url ?? "");
  return linkedInUrl ? linkedInUrl : undefined;
};

const PortfolioTemplateEngine = ({
  profile,
  editable = false,
  showAddSectionControls = true,
  onProfileChange,
  sectionStyle = "framed",
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
  const connectLinks = useMemo(
    () => getNormalizedConnectLinks(profile),
    [profile.connectLinks, profile.linkedinUrl]
  );
  const [sectionForm, setSectionForm] = useState<SectionFormState>(createSectionFormState);
  const [cardDrafts, setCardDrafts] = useState<Record<string, CardDraft>>({});
  const [connectLinkDraft, setConnectLinkDraft] = useState<ConnectLinkDraft>(
    createConnectLinkDraft
  );
  const [showConnectLinkForm, setShowConnectLinkForm] = useState(false);
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

  const setConnectLinks = (updater: (links: ProjectLink[]) => ProjectLink[]) => {
    applyProfileMutation((prev) => {
      const nextLinks = updater(getNormalizedConnectLinks(prev));
      return {
        ...prev,
        connectLinks: nextLinks,
        linkedinUrl: getLinkedInUrlFromConnectLinks(nextLinks),
      };
    });
  };

  const removeConnectLink = (linkId: string) => {
    setConnectLinks((links) => links.filter((link) => link.id !== linkId));
  };

  const addConnectLink = (label: string, url: string): boolean => {
    const nextUrl = normalizeExternalUrl(url);
    if (!nextUrl) return false;

    const nextLabel = label.trim();
    setConnectLinks((links) => [
      ...links,
      {
        id: createLinkId(),
        label: nextLabel || "Visit",
        url: nextUrl,
      },
    ]);
    return true;
  };

  const openConnectLinkForm = () => {
    setConnectLinkDraft(createConnectLinkDraft());
    setShowConnectLinkForm(true);
  };

  const cancelConnectLinkForm = () => {
    setShowConnectLinkForm(false);
    setConnectLinkDraft(createConnectLinkDraft());
  };

  const saveConnectLinkFromForm = () => {
    const saved = addConnectLink(connectLinkDraft.label, connectLinkDraft.url);
    if (saved) {
      cancelConnectLinkForm();
    }
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

  const getBaseSectionTitle = (sectionId: keyof PortfolioSectionTitles): string =>
    profile.sectionTitles?.[sectionId] ?? DEFAULT_SECTION_TITLES[sectionId];

  const updateBaseSectionTitle = (
    sectionId: keyof PortfolioSectionTitles,
    value: string
  ) => {
    applyProfileMutation((prev) => ({
      ...prev,
      sectionTitles: {
        ...(prev.sectionTitles ?? {}),
        [sectionId]: value,
      },
    }));
  };

  const updateSectionFormField = <K extends keyof SectionFormState>(
    key: K,
    value: SectionFormState[K]
  ) => {
    setSectionForm((prev) => ({ ...prev, [key]: value }));
  };

  const buildProjectLinks = (label: string, url: string): ProjectLink[] => {
    const nextLabel = label.trim();
    const nextUrl = url.trim();
    if (!nextUrl) return [];
    return [{ id: createLinkId(), label: nextLabel || "Visit", url: nextUrl }];
  };

  const isProjectSection = (section?: CustomSection): boolean =>
    (section?.type ?? "custom") === "projects";

  const handleAddCustomSection = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canEdit) return;

    const title = sectionForm.title.trim();
    const cardTitle = sectionForm.cardTitle.trim();
    const cardDescription = sectionForm.cardDescription.trim();
    if (!title || !cardTitle || !cardDescription) return;
    const projectLinks = buildProjectLinks(
      sectionForm.cardLinkLabel,
      sectionForm.cardLinkUrl
    );
    const projectsMode = sectionForm.type === "projects";

    const sectionId = createSectionId();
    const newSection: CustomSection = {
      id: sectionId,
      type: projectsMode ? "projects" : "custom",
      title,
      description: sectionForm.description.trim() || undefined,
      layout: sectionForm.layout,
      cards: [
        {
          id: createCardId(),
          title: cardTitle,
          subtitle: projectsMode ? undefined : sectionForm.cardSubtitle.trim() || undefined,
          description: cardDescription,
          imageUrl: projectsMode ? sectionForm.cardImageUrl.trim() || undefined : undefined,
          links: projectLinks.length > 0 ? projectLinks : undefined,
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
    key: "title" | "subtitle" | "description" | "imageUrl",
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
            if (key === "subtitle" || key === "imageUrl") {
              return {
                ...card,
                [key]: value.trim() ? value : undefined,
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

  const updateProjectLinkField = (
    sectionId: string,
    cardId: string,
    linkId: string,
    key: "label" | "url",
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
            return {
              ...card,
              links: (card.links ?? []).map((link) =>
                link.id === linkId ? { ...link, [key]: value } : link
              ),
            };
          }),
        };
      }),
    }));
  };

  const removeProjectLink = (sectionId: string, cardId: string, linkId: string) => {
    applyProfileMutation((prev) => ({
      ...prev,
      customSections: (prev.customSections ?? []).map((section) => {
        if (section.id !== sectionId) return section;
        return {
          ...section,
          cards: section.cards.map((card) => {
            if (card.id !== cardId) return card;
            return {
              ...card,
              links: (card.links ?? []).filter((link) => link.id !== linkId),
            };
          }),
        };
      }),
    }));
  };

  const addProjectLinkToCard = (sectionId: string, cardId: string) => {
    applyProfileMutation((prev) => ({
      ...prev,
      customSections: (prev.customSections ?? []).map((section) => {
        if (section.id !== sectionId) return section;
        return {
          ...section,
          cards: section.cards.map((card) => {
            if (card.id !== cardId) return card;
            return {
              ...card,
              links: [
                ...(card.links ?? []),
                {
                  id: createLinkId(),
                  label: "Visit",
                  url: "https://",
                },
              ],
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
    const section = customSectionsById.get(sectionId);
    const draft = cardDrafts[sectionId] ?? createCardDraft();
    const title = draft.title.trim();
    const description = draft.description.trim();
    if (!title || !description) return;

    const projectLinks = buildProjectLinks(draft.linkLabel, draft.linkUrl);
    const projectsMode = isProjectSection(section);
    const newCard: CustomSectionCard = {
      id: createCardId(),
      title,
      subtitle: projectsMode ? undefined : draft.subtitle.trim() || undefined,
      description,
      imageUrl: projectsMode ? draft.imageUrl.trim() || undefined : undefined,
      links: projectLinks.length > 0 ? projectLinks : undefined,
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
    onTitleChange: (value: string) => void,
    action?: ReactNode
  ) => (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <EditableText
        as="h2"
        className={palette.sectionTitle}
        value={title}
        editable={canEdit}
        multiline={false}
        onValueChange={onTitleChange}
      />
      {action}
    </div>
  );

  const timelineLineClass =
    theme === "glassmorphism"
      ? "bg-white/30"
      : theme === "neobrutalism"
        ? "bg-black/35"
        : "bg-[#60738f]/35";

  const timelineMarkerClass =
    theme === "glassmorphism"
      ? "border-white/45 bg-cyan-200/25 text-white"
      : theme === "neobrutalism"
        ? "border-black bg-[#ffef72] text-black"
        : "border-[#9bacbf] bg-[#e2e9f4] text-[#30445f]";
  const sectionStackClassName =
    sectionStyle === "plain" ? "mt-7 space-y-10" : "mt-7 space-y-6";

  return (
    <div
      className={palette.page}
      style={
        {
          fontFamily: themeTypography[theme].body,
          '--heading-font': themeTypography[theme].heading,
        } as React.CSSProperties
      }
    >
      <div className={palette.ambience} />

      <div className={palette.contentWrap}>
        <header className={palette.header}>
          <EditableText
            as="h1"
            className={palette.headingName}
            value={profile.fullName}
            editable={canEdit}
            multiline={false}
            onValueChange={(value) => updateField("fullName", value)}
          />

          <div className={cn("flex flex-wrap items-center gap-1", palette.headingMeta)}>
            <EditableText
              as="span"
              value={profile.location ?? ""}
              editable={canEdit}
              multiline={false}
              placeholder="Location"
              onValueChange={(value) => updateField("location", value)}
            />
            {Boolean(profile.location?.trim()) && <span aria-hidden>·</span>}
            <EditableText
              as="span"
              value={profile.email}
              editable={canEdit}
              multiline={false}
              onValueChange={(value) => updateField("email", value)}
            />
          </div>
        </header>

        {canEdit && showAddSectionControls && (
          <section className={palette.controlPanel}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className={palette.controlPanelTitle}>Add Section</h2>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setSectionForm((prev) => ({
                      ...prev,
                      type: "custom",
                    }))
                  }
                  className={cn(
                    sectionForm.type === "custom"
                      ? palette.primaryButton
                      : palette.secondaryButton
                  )}
                >
                  Custom
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setSectionForm((prev) => ({
                      ...prev,
                      type: "projects",
                      title: prev.title || "Projects",
                    }))
                  }
                  className={cn(
                    sectionForm.type === "projects"
                      ? palette.primaryButton
                      : palette.secondaryButton
                  )}
                >
                  Projects
                </button>
              </div>
            </div>

            <form className="mt-5 grid gap-3 sm:grid-cols-2" onSubmit={handleAddCustomSection}>
              <label className="block">
                <span className={cn("mb-1 block", palette.controlPanelLabel)}>Section title</span>
                <input
                  required
                  className={palette.input}
                  value={sectionForm.title}
                  onChange={(event) => updateSectionFormField("title", event.target.value)}
                  placeholder={
                    sectionForm.type === "projects"
                      ? "Projects"
                      : "Open Source Work, Talks, Awards..."
                  }
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
                  placeholder="Short section intro"
                />
              </label>

              {sectionForm.type === "projects" ? (
                <>
                  <label className="block">
                    <span className={cn("mb-1 block", palette.controlPanelLabel)}>Project name</span>
                    <input
                      required
                      className={palette.input}
                      value={sectionForm.cardTitle}
                      onChange={(event) => updateSectionFormField("cardTitle", event.target.value)}
                      placeholder="Portfolio Builder"
                    />
                  </label>

                  <label className="block">
                    <span className={cn("mb-1 block", palette.controlPanelLabel)}>
                      Project image URL (optional)
                    </span>
                    <input
                      className={palette.input}
                      value={sectionForm.cardImageUrl}
                      onChange={(event) =>
                        updateSectionFormField("cardImageUrl", event.target.value)
                      }
                      placeholder="https://..."
                    />
                  </label>

                  <label className="block sm:col-span-2">
                    <span className={cn("mb-1 block", palette.controlPanelLabel)}>
                      Project description
                    </span>
                    <textarea
                      required
                      className={cn(palette.input, "min-h-[82px] resize-y")}
                      value={sectionForm.cardDescription}
                      onChange={(event) =>
                        updateSectionFormField("cardDescription", event.target.value)
                      }
                      placeholder="What this project does and why it matters."
                    />
                  </label>

                  <label className="block">
                    <span className={cn("mb-1 block", palette.controlPanelLabel)}>Link label</span>
                    <input
                      className={palette.input}
                      value={sectionForm.cardLinkLabel}
                      onChange={(event) =>
                        updateSectionFormField("cardLinkLabel", event.target.value)
                      }
                      placeholder="GitHub"
                    />
                  </label>

                  <label className="block">
                    <span className={cn("mb-1 block", palette.controlPanelLabel)}>Link URL</span>
                    <input
                      className={palette.input}
                      value={sectionForm.cardLinkUrl}
                      onChange={(event) =>
                        updateSectionFormField("cardLinkUrl", event.target.value)
                      }
                      placeholder="https://github.com/..."
                    />
                  </label>
                </>
              ) : (
                <>
                  <label className="block">
                    <span className={cn("mb-1 block", palette.controlPanelLabel)}>
                      First card title
                    </span>
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
                </>
              )}

              <button type="submit" className={palette.primaryButton}>
                <Plus className="h-4 w-4" />
                {sectionForm.type === "projects" ? "Add Projects Section" : "Add Section"}
              </button>
            </form>
          </section>
        )}

        <div className={sectionStackClassName}>
          {visibleSectionIds.map((sectionId) => {
            const isDropTarget =
              canEdit && dropTargetId === sectionId && draggingSectionId !== sectionId;
            const wrapperClassName = cn(
              sectionStyle === "framed" ? palette.section : "px-1 py-1",
              sectionStyle === "framed" && isDropTarget && palette.sectionDropTarget
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

                  <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
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
                      <EditableText
                        className={cn("break-all", palette.bodyText)}
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
                        <div className="mt-3 space-y-2">
                          {connectLinks.map((link) => (
                            <div key={link.id} className="flex flex-wrap items-center gap-2">
                              {normalizeExternalUrl(link.url) ? (
                                <a
                                  href={normalizeExternalUrl(link.url)}
                                  target="_blank"
                                  rel="noreferrer"
                                  className={palette.secondaryButton}
                                >
                                  {link.label || "Visit"}
                                  <ExternalLink className="h-3.5 w-3.5" />
                                </a>
                              ) : (
                                <span className={palette.secondaryButton}>
                                  {link.label || "Visit"}
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={() => removeConnectLink(link.id)}
                                className={palette.iconButton}
                                title="Remove link"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          ))}

                          {showConnectLinkForm ? (
                            <form
                              className="mt-2 space-y-2"
                              onSubmit={(event) => {
                                event.preventDefault();
                                saveConnectLinkFromForm();
                              }}
                            >
                              <input
                                className={palette.input}
                                value={connectLinkDraft.label}
                                onChange={(event) =>
                                  setConnectLinkDraft((prev) => ({
                                    ...prev,
                                    label: event.target.value,
                                  }))
                                }
                                placeholder="Link label (e.g. GitHub)"
                              />
                              <input
                                required
                                className={palette.input}
                                value={connectLinkDraft.url}
                                onChange={(event) =>
                                  setConnectLinkDraft((prev) => ({
                                    ...prev,
                                    url: event.target.value,
                                  }))
                                }
                                placeholder="https://example.com"
                              />
                              <div className="flex flex-wrap items-center gap-2">
                                <button type="submit" className={palette.primaryButton}>
                                  Save Link
                                </button>
                                <button
                                  type="button"
                                  className={palette.secondaryButton}
                                  onClick={cancelConnectLinkForm}
                                >
                                  Cancel
                                </button>
                              </div>
                            </form>
                          ) : (
                            <button
                              type="button"
                              onClick={openConnectLinkForm}
                              className={palette.secondaryButton}
                            >
                              <Plus className="h-3.5 w-3.5" />
                              Add Link
                            </button>
                          )}
                        </div>
                      ) : (
                        connectLinks.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {connectLinks.map((link) =>
                              normalizeExternalUrl(link.url) ? (
                                <a
                                  key={link.id}
                                  href={normalizeExternalUrl(link.url)}
                                  target="_blank"
                                  rel="noreferrer"
                                  className={palette.secondaryButton}
                                >
                                  {link.label || "Visit"}
                                  <ExternalLink className="h-3.5 w-3.5" />
                                </a>
                              ) : (
                                <span key={link.id} className={palette.secondaryButton}>
                                  {link.label || "Visit"}
                                </span>
                              )
                            )}
                          </div>
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
                    getBaseSectionTitle("skills"),
                    (value) => updateBaseSectionTitle("skills", value),
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
                      null
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
                    getBaseSectionTitle("experience"),
                    (value) => updateBaseSectionTitle("experience", value),
                    canEdit ? (
                      <button
                        type="button"
                        onClick={() => addExperience()}
                        className={palette.secondaryButton}
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Add Entry
                      </button>
                    ) : null
                  )}

                  {profile.experience.length > 0 ? (
                    <div className="mt-5 space-y-4">
                      {profile.experience.map((entry, index) => (
                        <div key={`${entry.title}-${index}`} className="relative pl-9">
                          {index < profile.experience.length - 1 && (
                            <span
                              aria-hidden="true"
                              className={cn(
                                "absolute left-[0.72rem] top-10 bottom-[-1.1rem] w-px",
                                timelineLineClass
                              )}
                            />
                          )}
                          <span
                            aria-hidden="true"
                            className={cn(
                              "absolute left-0 top-3 flex h-6 w-6 items-center justify-center rounded-lg border text-[0.6rem] font-semibold",
                              timelineMarkerClass
                            )}
                          >
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <article className={palette.projectCard}>
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
                                  title="Remove timeline entry"
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
                        </div>
                      ))}
                    </div>
                  ) : (
                    null
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
                    getBaseSectionTitle("education"),
                    (value) => updateBaseSectionTitle("education", value)
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
                    null
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
                    getBaseSectionTitle("certifications"),
                    (value) => updateBaseSectionTitle("certifications", value),
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
                    null
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
                      placeholder="Add section intro"
                      onValueChange={(value) =>
                        updateCustomSectionField(customSection.id, "description", value)
                      }
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    {canEdit && (
                      <>
                        <select
                          className={cn(palette.input, "h-9 w-auto rounded-lg px-3 py-1 text-[0.68rem]")}
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

                        {!isProjectSection(customSection) && (
                          <EditableText
                            className={cn(
                              "mt-1 text-xs uppercase tracking-[0.13em]",
                              palette.mutedText
                            )}
                            value={card.subtitle ?? ""}
                            editable={canEdit}
                            multiline={false}
                            placeholder="Optional subtitle"
                            onValueChange={(value) =>
                              updateCustomCardField(customSection.id, card.id, "subtitle", value)
                            }
                          />
                        )}

                        {isProjectSection(customSection) && card.imageUrl && (
                          <img
                            src={card.imageUrl}
                            alt={card.title}
                            className="mt-3 h-44 w-full rounded-lg object-cover"
                          />
                        )}

                        {isProjectSection(customSection) && canEdit && (
                          <EditableText
                            className={cn("mt-2 break-all text-xs", palette.mutedText)}
                            value={card.imageUrl ?? ""}
                            editable
                            multiline={false}
                            placeholder="Project image URL"
                            onValueChange={(value) =>
                              updateCustomCardField(customSection.id, card.id, "imageUrl", value)
                            }
                          />
                        )}

                        <EditableText
                          className={cn("mt-3", palette.bodyText)}
                          value={card.description}
                          editable={canEdit}
                          onValueChange={(value) =>
                            updateCustomCardField(customSection.id, card.id, "description", value)
                          }
                        />

                        {isProjectSection(customSection) &&
                          ((card.links?.length ?? 0) > 0 ? (
                            canEdit ? (
                              <div className="mt-3 space-y-2">
                                {(card.links ?? []).map((link) => (
                                  <div
                                    key={link.id}
                                    className="flex flex-wrap items-center gap-2"
                                  >
                                    <a
                                      href={link.url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className={palette.secondaryButton}
                                    >
                                      {link.label}
                                      <ExternalLink className="h-3.5 w-3.5" />
                                    </a>
                                    <EditableText
                                      as="span"
                                      className={cn("text-xs font-medium", palette.bodyText)}
                                      value={link.label}
                                      editable
                                      multiline={false}
                                      onValueChange={(value) =>
                                        updateProjectLinkField(
                                          customSection.id,
                                          card.id,
                                          link.id,
                                          "label",
                                          value
                                        )
                                      }
                                    />
                                    <EditableText
                                      as="span"
                                      className={cn("text-xs break-all", palette.link)}
                                      value={link.url}
                                      editable
                                      multiline={false}
                                      onValueChange={(value) =>
                                        updateProjectLinkField(
                                          customSection.id,
                                          card.id,
                                          link.id,
                                          "url",
                                          value
                                        )
                                      }
                                    />
                                    <button
                                      type="button"
                                      onClick={() =>
                                        removeProjectLink(customSection.id, card.id, link.id)
                                      }
                                      className={palette.iconButton}
                                      title="Remove link"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="mt-3 flex flex-wrap gap-2">
                                {(card.links ?? []).map((link) => (
                                  <a
                                    key={link.id}
                                    href={link.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={palette.secondaryButton}
                                  >
                                    {link.label}
                                    <ExternalLink className="h-3.5 w-3.5" />
                                  </a>
                                ))}
                              </div>
                            )
                          ) : null)}

                        {isProjectSection(customSection) && canEdit && (
                          <button
                            type="button"
                            onClick={() => addProjectLinkToCard(customSection.id, card.id)}
                            className={cn("mt-3", palette.secondaryButton)}
                          >
                            <Plus className="h-3.5 w-3.5" />
                            Add Link
                          </button>
                        )}
                      </article>
                    ))}
                  </div>
                ) : (
                  null
                )}

                {canEdit && (
                  <div className={cn("mt-5 rounded-xl p-4", palette.controlPanel)}>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      <input
                        className={palette.input}
                        value={cardDraft.title}
                        onChange={(event) =>
                          updateCardDraftField(customSection.id, "title", event.target.value)
                        }
                        placeholder="Card title"
                      />
                      {!isProjectSection(customSection) ? (
                        <input
                          className={palette.input}
                          value={cardDraft.subtitle}
                          onChange={(event) =>
                            updateCardDraftField(customSection.id, "subtitle", event.target.value)
                          }
                          placeholder="Card subtitle"
                        />
                      ) : (
                        <input
                          className={palette.input}
                          value={cardDraft.imageUrl}
                          onChange={(event) =>
                            updateCardDraftField(customSection.id, "imageUrl", event.target.value)
                          }
                          placeholder="Project image URL (optional)"
                        />
                      )}
                      <textarea
                        className={cn(palette.input, "min-h-[78px] resize-y sm:col-span-2")}
                        value={cardDraft.description}
                        onChange={(event) =>
                          updateCardDraftField(customSection.id, "description", event.target.value)
                        }
                        placeholder="Card description"
                      />
                      {isProjectSection(customSection) && (
                        <>
                          <input
                            className={palette.input}
                            value={cardDraft.linkLabel}
                            onChange={(event) =>
                              updateCardDraftField(
                                customSection.id,
                                "linkLabel",
                                event.target.value
                              )
                            }
                            placeholder="Link label (e.g. GitHub)"
                          />
                          <input
                            className={palette.input}
                            value={cardDraft.linkUrl}
                            onChange={(event) =>
                              updateCardDraftField(
                                customSection.id,
                                "linkUrl",
                                event.target.value
                              )
                            }
                            placeholder="Link URL"
                          />
                        </>
                      )}
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
