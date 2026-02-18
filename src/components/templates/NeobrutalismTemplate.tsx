import PortfolioTemplateEngine from "@/components/templates/PortfolioTemplateEngine";
import type { LinkedInProfile } from "@/types/linkedin";

interface Props {
  profile: LinkedInProfile;
  editable?: boolean;
  showAddSectionControls?: boolean;
  onProfileChange?: (updater: (prev: LinkedInProfile) => LinkedInProfile) => void;
}

const NeobrutalismTemplate = ({
  profile,
  editable = false,
  showAddSectionControls = true,
  onProfileChange,
}: Props) => (
  <PortfolioTemplateEngine
    profile={profile}
    editable={editable}
    showAddSectionControls={showAddSectionControls}
    onProfileChange={onProfileChange}
    theme="neobrutalism"
  />
);

export default NeobrutalismTemplate;
