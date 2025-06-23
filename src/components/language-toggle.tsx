import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const toggle = () => {
    const newLang = i18n.language === "id" ? "en" : "id";
    i18n.changeLanguage(newLang);
    if (typeof window !== "undefined") {
      localStorage.setItem("lang", newLang);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="neumorphic-button-sm border-0 shadow-none bg-transparent"
      onClick={toggle}
      aria-label="Toggle language"
    >
      <Globe className="w-5 h-5 text-[#1D1D1F]" />
    </Button>
  );
}
