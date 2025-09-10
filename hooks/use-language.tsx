import { useEffect, useState, useRef, useCallback } from 'react';
import { supportedLanguages, defaultLanguage, getLanguageByCode, mapLocaleToLanguage } from '@/lib/language-utils';
import { useWalletStore } from '@/lib/helpers';

// Handle dynamic language imports
const importLanguage = async (langCode: string, fileName: string = 'general') => {
    try {
        // Try to load the requested language
        const langModule = await import(`@/data/lang/${langCode}/${fileName}`);
        return langModule.default || langModule.general;
    } catch {
        // If language file doesn't exist, fall back to English
        console.warn(`Language file for ${langCode}/${fileName} not found, falling back to English.`);
        const langModule = await import(`@/data/lang/en/${fileName}`);
        return langModule.default || langModule.general;
    }
};

// Function to fetch user settings from the API
const fetchUserSettings = async (walletAddress: string) => {
    try {
        const response = await fetch(`/api/user-settings?wallet=${encodeURIComponent(walletAddress)}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch settings: ${response.statusText}`);
        }
        const data = await response.json();
        return data.settings;
    } catch (error) {
        console.error('Error fetching user settings:', error);
        return null;
    }
};

// Function to save user settings to the API
const saveUserSettingsToAPI = async (walletAddress: string, settings: any) => {
    try {
        const response = await fetch('/api/user-settings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                walletAddress,
                settings,
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed to save settings: ${response.statusText}`);
        }

        return true;
    } catch (error) {
        console.error('Error saving user settings:', error);
        return false;
    }
};

/**
 * Hook to use and manage the current language
 * @param initialLangCode Optional initial language code
 * @returns Language state and functions
 */
export const useLanguage = (initialLangCode?: string) => {
    const walletAddress = useWalletStore(state => state.address);
    const isWalletConnected = !!walletAddress;
    
    // Ref to track if we should update from DB 
    const hasLoadedDbSettings = useRef(false);
    
    // Ref to track language updates and prevent circular updates
    const isUpdatingLanguage = useRef(false);
    
    // Add a counter to force re-renders on language change
    const [refreshCounter, setRefreshCounter] = useState(0);
    
    // Get language preference from localStorage or browser, or use default
    const [currentLangCode, setCurrentLangCode] = useState<string>(() => {
        // Explicit initialization takes priority
        if (initialLangCode) return initialLangCode;

        if (typeof window !== "undefined") {
            try {
                // First try direct language preference as it's most explicitly set by user
                const directLang = localStorage.getItem("direct-language-preference");
                if (directLang) return directLang;
                
                // Then try settings in localStorage (using the new key first)
                let storedSettings = localStorage.getItem("vizor-settings");
                // If not found, try the old key for backward compatibility
                if (!storedSettings) {
                    storedSettings = localStorage.getItem("revoluzion-settings");
                }
                
                if (storedSettings) {
                    const settings = JSON.parse(storedSettings);
                    if (settings?.language?.interfaceLanguage) {
                        return settings.language.interfaceLanguage;
                    }
                }

                // Then try browser detection
                const browserLang = navigator.language;
                if (browserLang) {
                    return mapLocaleToLanguage(browserLang);
                }
            } catch (error) {
                console.error("Error reading language preferences:", error);
            }
        }

        return defaultLanguage;
    });

    // Load user settings from database when wallet connects - but only once
    useEffect(() => {
        const loadSettingsFromDatabase = async () => {
            // Skip if we already loaded from DB or if wallet is not connected
            if (hasLoadedDbSettings.current || !isWalletConnected || !walletAddress) {
                return;
            }
            
            try {
                console.log('[Language] Loading settings from database for wallet:', 
                    walletAddress.substring(0, 6) + '...' + walletAddress.substring(walletAddress.length - 4));
                
                // Check if user has explicit language preference that should take precedence
                const userExplicitlySavedLanguage = localStorage.getItem("user_explicitly_saved_language");
                const userSelectedLanguage = localStorage.getItem("user_selected_language");
                
                if (userExplicitlySavedLanguage || userSelectedLanguage) {
                    console.log('[Language] User has explicit language preference - not loading from DB');
                    hasLoadedDbSettings.current = true;
                    return;
                }
                
                const dbSettings = await fetchUserSettings(walletAddress);
                
                if (dbSettings && dbSettings.language?.interfaceLanguage) {
                    console.log('[Language] DB language found:', dbSettings.language.interfaceLanguage);
                    
                    // Only update if not currently in a language update
                    if (!isUpdatingLanguage.current) {
                        isUpdatingLanguage.current = true;
                        console.log('[Language] Setting language from DB');
                        setCurrentLangCode(dbSettings.language.interfaceLanguage);
                        setTimeout(() => {
                            isUpdatingLanguage.current = false;
                        }, 100);
                    }
                } else {
                    console.log('[Language] No language setting in database, keeping current:', currentLangCode);
                }
            } catch (error) {
                console.error("Error loading language settings from database:", error);
            } finally {
                // Mark as loaded to prevent repeated attempts
                hasLoadedDbSettings.current = true;
            }
        };

        loadSettingsFromDatabase();
    }, [walletAddress, isWalletConnected, currentLangCode]);

    const [isLanguageLoaded, setIsLanguageLoaded] = useState<boolean>(false);
    const [content, setContent] = useState<Record<string, any> | null>(null);

    // Function to force refresh language content
    const refreshLanguageContent = useCallback(async () => {
        if (isUpdatingLanguage.current) {
            console.log('[Language] Skipping refresh - update already in progress');
            return false;
        }
        
        isUpdatingLanguage.current = true;
        
        try {
            const validLangCode = supportedLanguages.some(l => l.code === currentLangCode)
                ? currentLangCode
                : defaultLanguage;
                
            console.log('[Language] Refreshing language content for:', validLangCode);
            
            // Clear any flags that might block updates
            if (typeof window !== "undefined") {
                window.sessionStorage.removeItem('language_change_in_progress');
                window.sessionStorage.removeItem('settings_just_updated');
            }
            
            // Load the language content directly
            const generalContent = await importLanguage(validLangCode);
            
            // Update all the necessary state
            setContent(generalContent);
            setIsLanguageLoaded(true);
            
            // Update HTML attributes for RTL languages
            const langInfo = getLanguageByCode(validLangCode);
            if (langInfo && typeof document !== "undefined") {
                document.documentElement.dir = langInfo.rtl ? "rtl" : "ltr";
                document.documentElement.lang = validLangCode;
            }
            
            // Increment the refresh counter to force dependent components to re-render
            setRefreshCounter(prev => prev + 1);
            
            return true;
        } catch (error) {
            console.error("Error refreshing language content:", error);
            return false;
        } finally {
            // Important: Release the update lock
            setTimeout(() => {
                isUpdatingLanguage.current = false;
            }, 50);
        }
    }, [currentLangCode]);

    // Load language content when language changes
    useEffect(() => {
        // Skip if we're in the middle of an update to prevent double loading
        if (isUpdatingLanguage.current) {
            console.log('[Language] Skipping load effect - update already in progress');
            return; 
        }
        
        console.log('[Language] Loading language content due to language code change:', currentLangCode);
        setIsLanguageLoaded(false);
        isUpdatingLanguage.current = true;

        const loadLanguage = async () => {
            try {
                // Ensure the language code is valid
                const validLangCode = supportedLanguages.some(l => l.code === currentLangCode)
                    ? currentLangCode
                    : defaultLanguage;

                console.log('[Language] Loading language content for:', validLangCode);
                
                // Load the language content
                const generalContent = await importLanguage(validLangCode);

                // Save the language preference to localStorage
                if (typeof window !== "undefined") {
                    localStorage.setItem("direct-language-preference", validLangCode);

                    // Update localStorage settings, but only if not in the middle of an update from elsewhere
                    if (!window.sessionStorage.getItem('settings_just_updated') && 
                        !window.sessionStorage.getItem('language_change_in_progress')) {
                        try {
                            // Try new key first, fall back to old key
                            let storedSettings = localStorage.getItem("vizor-settings");
                            if (!storedSettings) {
                                storedSettings = localStorage.getItem("revoluzion-settings");
                            }
                            const settings = storedSettings ? JSON.parse(storedSettings) : {};

                            // Update language setting
                            settings.language = {
                                ...(settings.language || {}),
                                interfaceLanguage: validLangCode,
                            };

                            // Save to new key
                            localStorage.setItem("vizor-settings", JSON.stringify(settings));
                        } catch (error) {
                            console.error("Error updating language in local settings:", error);
                        }
                    }
                }

                // Remove automatic database update from here - this should only happen
                // when the user explicitly changes the language and clicks "Save Settings"

                setContent(generalContent);
                setIsLanguageLoaded(true);

                // Update HTML dir attribute for RTL languages
                const langInfo = getLanguageByCode(validLangCode);
                if (langInfo && typeof document !== "undefined") {
                    document.documentElement.dir = langInfo.rtl ? "rtl" : "ltr";
                    document.documentElement.lang = validLangCode;
                }
                
                // Increment refresh counter to force re-renders in components using this hook
                setRefreshCounter(prev => prev + 1);
            } catch (error) {
                console.error("Error loading language:", error);
            } finally {
                // Clear the update flag
                isUpdatingLanguage.current = false;
                
                // Clear any session flags
                if (typeof window !== "undefined") {
                    window.sessionStorage.removeItem('settings_just_updated');
                    window.sessionStorage.removeItem('language_change_in_progress');
                }
            }
        };

        loadLanguage();
    }, [currentLangCode]);

    /**
     * Change the current language
     * @param langCode Language code to change to
     */
    const changeLanguage = useCallback((langCode: string) => {
        // Don't do anything if language is the same
        if (currentLangCode === langCode) {
            console.log(`[Language] Already using language: ${langCode}`);
            return;
        }
        
        if (isUpdatingLanguage.current) {
            console.log(`[Language] Skipping language change to ${langCode} - update already in progress`);
            return;
        }
        
        if (supportedLanguages.some(l => l.code === langCode)) {
            console.log('[Language] Changing language to:', langCode);
            
            // Clear any existing language change flags to prevent blocking
            if (typeof window !== "undefined") {
                window.sessionStorage.removeItem('language_change_in_progress');
                window.sessionStorage.removeItem('settings_just_updated');
            }
            
            // Mark that we're changing language to prevent multiple updates
            isUpdatingLanguage.current = true;
            
            // Store that user has explicitly selected a language
            if (typeof window !== "undefined") {
                localStorage.setItem("user_selected_language", langCode);
                localStorage.setItem("direct-language-preference", langCode);
            }
            
            // Important: Force content load immediately by modifying content first
            // This makes the UI update before the language code changes
            (async () => {
                try {
                    // Pre-load the new language content
                    const generalContent = await importLanguage(langCode);
                    
                    // Update content state and force a refresh immediately
                    setContent(generalContent);
                    setIsLanguageLoaded(true);
                    setRefreshCounter(prev => prev + 1);
                    
                    // Now that content is loaded, update the language code
                    // This will trigger the useEffect for formal processing
                    setTimeout(() => {
                        setCurrentLangCode(langCode);
                        setTimeout(() => {
                            isUpdatingLanguage.current = false;
                        }, 50);
                    }, 10);
                } catch (error) {
                    console.error("Error pre-loading language:", error);
                    // Fall back to normal language change
                    setCurrentLangCode(langCode);
                    isUpdatingLanguage.current = false;
                }
            })();
        } else {
            console.warn(`Language ${langCode} is not supported, using default language instead.`);
            setCurrentLangCode(defaultLanguage);
        }
    }, [currentLangCode]);

    return {
        content,
        currentLangCode,
        changeLanguage,
        isLanguageLoaded,
        supportedLanguages,
        refreshLanguageContent,
        refreshCounter
    };
};

export default useLanguage;
