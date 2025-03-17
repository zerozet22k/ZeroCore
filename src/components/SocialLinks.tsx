import SocialLink from "./SocialLink";
import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  GithubOutlined,
  YoutubeOutlined,
  RedditOutlined,
  WhatsAppOutlined,
  WechatOutlined,
  DribbbleOutlined,
  BehanceOutlined,
  MediumOutlined,
  TikTokOutlined,
} from "@ant-design/icons";
import { SettingsInterface } from "@/config/CMS/settings/settingKeys";
import { SOCIAL_MEDIA_SETTINGS_KEYS } from "@/config/CMS/settings/keys/SOCIAL_MEDIA_KEYS";

interface SocialLinksProps {
  settings: Partial<SettingsInterface>;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  [SOCIAL_MEDIA_SETTINGS_KEYS.FACEBOOK]: <FacebookOutlined />,
  [SOCIAL_MEDIA_SETTINGS_KEYS.TWITTER]: <TwitterOutlined />,
  [SOCIAL_MEDIA_SETTINGS_KEYS.INSTAGRAM]: <InstagramOutlined />,
  [SOCIAL_MEDIA_SETTINGS_KEYS.LINKEDIN]: <LinkedinOutlined />,
  [SOCIAL_MEDIA_SETTINGS_KEYS.GITHUB]: <GithubOutlined />,
  [SOCIAL_MEDIA_SETTINGS_KEYS.TIKTOK]: <TikTokOutlined />,
  [SOCIAL_MEDIA_SETTINGS_KEYS.YOUTUBE]: <YoutubeOutlined />,
  [SOCIAL_MEDIA_SETTINGS_KEYS.REDDIT]: <RedditOutlined />,
  [SOCIAL_MEDIA_SETTINGS_KEYS.WHATSAPP]: <WhatsAppOutlined />,
  [SOCIAL_MEDIA_SETTINGS_KEYS.WECHAT]: <WechatOutlined />,
  [SOCIAL_MEDIA_SETTINGS_KEYS.DRIBBBLE]: <DribbbleOutlined />,
  [SOCIAL_MEDIA_SETTINGS_KEYS.BEHANCE]: <BehanceOutlined />,
  [SOCIAL_MEDIA_SETTINGS_KEYS.MEDIUM]: <MediumOutlined />,
};

const SocialLinks: React.FC<SocialLinksProps> = ({ settings }) => {
  return (
    <>
      {Object.entries(SOCIAL_MEDIA_SETTINGS_KEYS).map(([key, platform]) => {
        const url = settings[platform]?.url;
        if (!url) return null;

        return <SocialLink key={key} url={url} icon={ICON_MAP[platform]} />;
      })}
    </>
  );
};

export default SocialLinks;
