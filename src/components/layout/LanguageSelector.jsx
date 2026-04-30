import { useLanguage } from '../../context/useLanguage';

const languageOptions = ['ca', 'es', 'fr', 'en'];

export default function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <select
      value={language}
      onChange={(event) => setLanguage(event.target.value)}
      aria-label={t('language')}
      className='rounded-md border border-white/20 bg-white/10 px-2 py-1 text-sm font-medium uppercase text-white/90 outline-none transition hover:bg-white/15 focus:ring-2 focus:ring-white/35'
    >
      {languageOptions.map((option) => (
        <option key={option} value={option}>
          {option.toUpperCase()}
        </option>
      ))}
    </select>
  );
}
