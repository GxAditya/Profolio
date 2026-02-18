import PortfolioTemplateEngine from "@/components/templates/PortfolioTemplateEngine";
import type { LinkedInProfile } from "@/types/linkedin";

interface Props {
  profile: LinkedInProfile;
  editable?: boolean;
  showAddSectionControls?: boolean;
  onProfileChange?: (updater: (prev: LinkedInProfile) => LinkedInProfile) => void;
  sectionStyle?: "framed" | "plain";
}

const MinimalismTemplate = ({
  profile,
  editable = false,
  showAddSectionControls = true,
  onProfileChange,
  sectionStyle = "plain",
}: Props) => (
  <PortfolioTemplateEngine
    profile={profile}
    editable={editable}
    showAddSectionControls={showAddSectionControls}
    onProfileChange={onProfileChange}
    sectionStyle={sectionStyle}
    theme="minimalism"
  />
);

export default MinimalismTemplate;
