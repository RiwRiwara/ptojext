import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { resources } from "./translations";

// Default language (used on server and as fallback)
const DEFAULT_LANGUAGE = "th";

// Function to get language, but only on client
const getClientLanguage = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return localStorage.getItem("i18nextLng") || DEFAULT_LANGUAGE;
  }
  return DEFAULT_LANGUAGE;
};

// Initialize i18next with a default language on the server
i18next
  .use(initReactI18next)
  .init({
    debug: false,
    lng: DEFAULT_LANGUAGE, // Use default language on server
    compatibilityJSON: 'v4',
    fallbackLng: 'en',
    resources,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18next;

// Client-side only: Sync language with localStorage after initialization
if (typeof window !== 'undefined') {
  // Set initial language from localStorage (if any)
  const savedLanguage = getClientLanguage();
  if (savedLanguage !== i18next.language) {
    i18next.changeLanguage(savedLanguage);
  }

  // Listen for language changes and update localStorage
  i18next.on('languageChanged', (lng) => {
    localStorage.setItem("i18nextLng", lng);
  });
}