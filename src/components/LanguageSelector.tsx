import React from "react";
import { Select, theme } from "antd";
import { useLanguage } from "@/hooks/useLanguage";
import { getFlagUrl } from "@/config/navigations/IconMapper";
import { languageFlags } from "./FormBuilder/Fields/Inputs/SupportedLanguageSelector";

const { Option } = Select;

const LanguageSelector: React.FC = () => {
  const { language, setLanguage, supportedLanguages } = useLanguage();
  const { token } = theme.useToken();

  return (
    <Select
      value={language}
      onChange={setLanguage}
      variant="borderless"
      style={{
        display: "flex",
        padding: 4,
        background: "transparent",
        border: "none",
        color: token.colorText,
      }}
      dropdownStyle={{
        background: token.colorBgContainer,
        color: token.colorText,
      }}
    >
      {supportedLanguages.map((lang) => {
        const countryCode = languageFlags[lang] || "un";
        const flagUrl = getFlagUrl(countryCode, 40);

        return (  
          <Option key={lang} value={lang}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <img src={flagUrl} alt={lang} style={{ width: 24, height: 16 }} />
              <span style={{ fontSize: 12, color: token.colorText }}>
                {lang.toUpperCase()}
              </span>
            </div>
          </Option>
        );
      })}
    </Select>
  );
};

export default LanguageSelector;
