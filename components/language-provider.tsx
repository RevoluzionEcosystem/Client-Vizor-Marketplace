import React, { createContext, useContext, ReactNode } from 'react';
import useLanguage from '@/hooks/use-language';
import { supportedLanguages, defaultLanguage, Language } from '@/lib/language-utils';

// Define the shape of our language context
interface LanguageContextType {
    // General content data from the current language
    content: Record<string, any> | null;
    // Current language code (e.g., 'en', 'fr')
    currentLangCode: string;
    // Function to change the language
    changeLanguage: (langCode: string) => void;
    // Flag to indicate if language data is loaded
    isLanguageLoaded: boolean;
    // List of supported languages
    supportedLanguages: Language[];
    // Current language object with additional metadata
    currentLanguage: Language | undefined;
    // Whether the current language is RTL
    isRtl: boolean;
    // Function to manually refresh language content
    refreshLanguageContent: () => Promise<boolean>;
    // Counter that increments on language changes to force re-renders
    refreshCounter: number;
}

// Create the context with default values
const LanguageContext = createContext<LanguageContextType>({
    content: null,
    currentLangCode: defaultLanguage,
    changeLanguage: () => { },
    isLanguageLoaded: false,
    supportedLanguages,
    currentLanguage: undefined,
    isRtl: false,
    refreshLanguageContent: async () => false,
    refreshCounter: 0,
});

// Hook to access the language context
export const useLanguageContext = () => useContext(LanguageContext);

interface LanguageProviderProps {
    children: ReactNode;
    initialLangCode?: string;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
    children,
    initialLangCode
}) => {
    // Database is initialized in the API routes when needed    // Use our language hook to manage the language state
    const {
        content,
        currentLangCode,
        changeLanguage,
        isLanguageLoaded,
        refreshLanguageContent,
        refreshCounter
    } = useLanguage(initialLangCode);

    // Find the current language object with additional metadata
    const currentLanguage = supportedLanguages.find(lang => lang.code === currentLangCode);

    // Determine if current language is RTL
    const isRtl = currentLanguage?.rtl || false;

    // Value to provide to the context
    const contextValue: LanguageContextType = {
        content,
        currentLangCode,
        changeLanguage,
        isLanguageLoaded,
        supportedLanguages,
        currentLanguage,
        isRtl,
        refreshLanguageContent,
        refreshCounter
    };

    return (
        <LanguageContext.Provider value={contextValue}>
            {children}
        </LanguageContext.Provider>
    );
};

export default LanguageProvider;
