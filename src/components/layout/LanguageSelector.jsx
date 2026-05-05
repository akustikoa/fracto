import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../context/useLanguage';

const languageOptions = ['ca', 'es', 'fr', 'en'];

export default function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const selectorRef = useRef(null);

  useEffect(() => {
    function handleDocumentClick(event) {
      if (!selectorRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleDocumentClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  function handleLanguageSelect(option) {
    setLanguage(option);
    setIsOpen(false);
  }

  return (
    <div ref={selectorRef} className='relative'>
      <button
        type='button'
        onClick={() => setIsOpen((currentIsOpen) => !currentIsOpen)}
        aria-label={t('language')}
        aria-expanded={isOpen}
        className='rounded-md border border-white/20 bg-white/10 px-2 py-1 text-sm font-medium shadow-sm text-white/90 outline-none transition hover:bg-white/15 focus:ring-2 focus:ring-white/35'
      >
        {language.toUpperCase()}
      </button>

      <div
        className={`absolute -right-1.5 top-full z-20 mt-2 min-w-full origin-top-right rounded-xl border border-zinc-200 bg-white py-1 text-sm shadow-sm transition duration-150 ${
          isOpen
            ? 'scale-105 opacity-100'
            : 'pointer-events-none scale-95 opacity-0'
        }`}
      >
        {languageOptions.map((option) => (
          <button
            key={option}
            type='button'
            onClick={() => handleLanguageSelect(option)}
            className={`block w-full px-3 py-2 text-left lowercase transition hover:bg-zinc-50 active:bg-zinc-100 ${
              language === option
                ? 'rounded-md border border-white bg-white text-[#DA3C20] font-bold '
                : 'text-zinc-700 font-medium'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
