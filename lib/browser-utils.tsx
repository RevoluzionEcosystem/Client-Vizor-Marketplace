// Browser language and region detection utilities

/**
 * Detect user's browser language and find the closest match in supported languages
 * @returns The detected language code or null if no match
 */
export const browserLangDetect = (): string | null => {
    if (typeof window === 'undefined' || !navigator) {
        return null;
    }

    // Get browser languages
    const userLangs = navigator.languages ||
        [navigator.language ||
            (navigator as any).userLanguage ||
            (navigator as any).browserLanguage ||
            'en'];

    // Try to find an exact match first (e.g. "en-US" === "en-US")
    for (const lang of userLangs) {
        // Try to find exact match first
        if (isLanguageSupported(lang)) {
            return lang;
        }
    }

    // If no exact match, try to find a base language match (e.g. "en-US" matches "en")
    for (const lang of userLangs) {
        const baseLang = lang.split('-')[0];
        if (isLanguageSupported(baseLang)) {
            return baseLang;
        }
    }

    // No match found
    return null;
};

/**
 * Check if a language code is supported in our application
 * @param langCode Language code to check
 * @returns True if supported
 */
export const isLanguageSupported = (langCode: string): boolean => {
    try {
        // Use our language utils to check if the language code is supported
        const { supportedLanguages } = require('./language-utils');
        return supportedLanguages.some((lang: any) =>
            lang.code === langCode || 
            lang.code === langCode.split('-')[0] ||
            (lang.region && lang.region === langCode)
        );
    } catch (error) {
        return false;
    }
};

/**
 * Gets the user's region based on their browser locale
 * @returns The region code (e.g. "US", "GB", etc.)
 */
export const getUserRegion = (): string | null => {
    if (typeof window === 'undefined' || !navigator) {
        return null;
    }

    try {
        const locale = navigator.language || (navigator as any).userLanguage || 'en-US';
        const parts = locale.split('-');

        // Return the region part (if it exists), which is typically the second part
        return parts.length > 1 ? parts[1] : null;
    } catch (error) {
        return null;
    }
};
