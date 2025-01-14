import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { resources } from "./translations";

const getSavedLanguage = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem("i18nextLng") || "th";
  }
  return "th"; 
};

i18next
  .use(initReactI18next)
  .init({
    debug: false,
    lng: getSavedLanguage(),  
    compatibilityJSON: 'v4',
    fallbackLng: 'en',
    resources,
    interpolation: {
      escapeValue: false,
    },
  });

if (typeof window !== 'undefined') {
  i18next.on('languageChanged', (lng) => {
    localStorage.setItem("i18nextLng", lng);
  });
}

export default i18next;