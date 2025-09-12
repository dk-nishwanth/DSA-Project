import React from 'react';
import { SUPPORTED_LANGUAGES, Language } from '../../config/languages';

interface LanguageSelectorProps {
  selectedLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onLanguageChange,
}) => {
  return (
    <div className="flex flex-wrap gap-1 p-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      {SUPPORTED_LANGUAGES.map((language) => (
        <button
          key={language.id}
          onClick={() => onLanguageChange(language)}
          className={`
            flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200
            ${
              selectedLanguage.id === language.id
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
            }
          `}
          title={`Switch to ${language.name}`}
        >
          <span className="text-base">{language.icon}</span>
          <span>{language.name}</span>
        </button>
      ))}
    </div>
  );
};