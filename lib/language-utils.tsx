/**
 * Language utilities and configuration for W3W
 */

/**
 * Interface for language configuration
 */
export interface Language {
    code: string;          // ISO language code (e.g., 'en', 'fr')
    name: string;          // Display name in English
    nativeName: string;    // Display name in native language
    flagCode: string;      // Country code for flag (e.g., 'gb', 'fr')
    rtl: boolean;          // Whether language is right-to-left
    active: boolean;       // Whether language is currently available
    region?: string;       // Optional region variant (e.g., 'en-US', 'en-GB')
}

/**
 * Complete list of supported languages in the application
 */
export const supportedLanguages: Language[] = [
    {
        code: 'en',
        name: 'English',
        nativeName: 'English',
        flagCode: 'gb',
        rtl: false,
        active: true,
    }
];

// Default language code for the application
export const defaultLanguage = 'en';

/**
 * Get language details by language code
 * @param code - ISO language code
 * @returns Language object or undefined if not found
 */
export const getLanguageByCode = (code: string): Language | undefined => {
    return supportedLanguages.find((lang) => lang.code === code);
};

/**
 * Get only active languages
 * @returns Array of active languages
 */
export const getActiveLanguages = (): Language[] => {
    return supportedLanguages.filter((lang) => lang.active);
};

/**
 * Get flag image URL from language code
 * @param code - ISO language code or flagCode
 * @returns Path to flag image
 */
export const getFlagImagePath = (code: string): string => {
    // First, try to find the language
    const language = getLanguageByCode(code);
    
    // If language is found, use its flagCode
    const flagCode = language ? language.flagCode : code.toLowerCase();
    
    return `/assets/country/${flagCode}.svg`;
};

/**
 * Map a browser locale to our supported language code
 * @param locale - Browser locale string (e.g., 'en-US', 'fr-FR')
 * @returns Supported language code or default language code if no match
 */
export const mapLocaleToLanguage = (locale: string): string => {
    if (!locale) return defaultLanguage;
    
    // Try an exact match first
    const exactMatch = supportedLanguages.find(lang => 
        lang.active && (lang.code === locale || lang.region === locale)
    );
    
    if (exactMatch) return exactMatch.code;
    
    // Try matching just the language part (first part before the hyphen)
    const languagePart = locale.split('-')[0].toLowerCase();
    const baseMatch = supportedLanguages.find(lang => 
        lang.active && lang.code === languagePart
    );
    
    return baseMatch ? baseMatch.code : defaultLanguage;
};

export default {
    supportedLanguages,
    defaultLanguage,
    getLanguageByCode,
    getActiveLanguages,
    getFlagImagePath,
    mapLocaleToLanguage,
};
