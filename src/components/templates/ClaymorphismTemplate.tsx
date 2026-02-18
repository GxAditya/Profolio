import PortfolioTemplateEngine from "@/components/templates/PortfolioTemplateEngine";
import type { LinkedInProfile } from "@/types/linkedin";

interface Props {
  profile: LinkedInProfile;
  editable?: boolean;
  showAddSectionControls?: boolean;
  onProfileChange?: (updater: (prev: LinkedInProfile) => LinkedInProfile) => void;
  sectionStyle?: "framed" | "plain";
}

const ClaymorphismTemplate = ({
  profile,
  editable = false,
  showAddSectionControls = true,
  onProfileChange,
  sectionStyle = "framed",
}: Props) => (
  <PortfolioTemplateEngine
    profile={profile}
    editable={editable}
    showAddSectionControls={showAddSectionControls}
    onProfileChange={onProfileChange}
    sectionStyle={sectionStyle}
    theme="claymorphism"
  />
);

export default ClaymorphismTemplate;
