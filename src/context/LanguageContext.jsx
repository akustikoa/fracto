import { useEffect, useMemo, useState } from 'react';
import { translations } from '../i18n/translations';
import { LanguageContext } from './languageContext';

const DEFAULT_LANGUAGE = 'en';
const STORAGE_KEY = 'lang';

function getInitialLanguage() {
  const savedLanguage = localStorage.getItem(STORAGE_KEY);

  return translations[savedLanguage] ? savedLanguage : DEFAULT_LANGUAGE;
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(getInitialLanguage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t(key) {
        return translations[language]?.[key] ?? translations.en[key] ?? key;
      },
    }),
    [language],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
