import { languageNames } from '../constants/languages.js';
import { useState } from 'react';

export default function LanguageSwitcher({ currentLang }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageSelect = (lang) => {
    if (lang === currentLang) {
      setIsOpen(false);
      return;
    }

    setIsOpen(false);

    // Strip current language prefix from pathname
    const pathname = window.location.pathname;
    const pathWithoutLang = currentLang === 'en'
      ? pathname
      : pathname.replace(new RegExp(`^/${currentLang}(/|$)`), '/');

    // Navigate to path with new language prefix
    window.location.href = lang === 'en'
      ? pathWithoutLang
      : `/${lang}${pathWithoutLang}`;
  };

  const getCurrentLanguageName = () => {
    return languageNames[currentLang] || languageNames.en;
  };

  return (
    <div className="fixed top-4 right-4 z-[9999]">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white/90 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-lg shadow-lg hover:bg-white transition-colors duration-200 flex items-center gap-2 border border-gray-200"
        >
          <span>{getCurrentLanguageName()}</span>
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-200 overflow-hidden z-[9999]">
            <div className="max-h-96 overflow-y-auto">
              {Object.entries(languageNames).map(([lang, name]) => (
                <button
                  key={lang}
                  onClick={() => handleLanguageSelect(lang)}
                  className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-150 ${
                    currentLang === lang ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Close dropdown when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[9998]"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}