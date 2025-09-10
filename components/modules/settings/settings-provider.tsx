import React, { createContext, useContext, useState, useEffect } from 'react';
import { defaultSettings, SettingsConfig } from '@/data/settings/config';
import { useLanguageContext } from '@/components/language-provider';
import { useAppKitAccount } from "@reown/appkit/react";

interface SettingsContextType {
    settings: SettingsConfig;
    updateSettings: (section: keyof SettingsConfig, key: string, value: string | boolean | number | object) => void;
    resetSettings: () => void;
    isWalletConnected: boolean;
}

// Create the context with default values
const SettingsContext = createContext<SettingsContextType>({
    settings: defaultSettings,
    updateSettings: () => { },
    resetSettings: () => { },
    isWalletConnected: false,
});

// Custom hook to use the settings context
export const useSettings = () => useContext(SettingsContext);

// Settings provider component
export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<SettingsConfig>(defaultSettings);

    // Get the wallet address and connection status from AppKit
    const { isConnected: isWalletConnected } = useAppKitAccount();
    const languageContext = useLanguageContext();

    // Load settings from localStorage on component mount
    useEffect(() => {
        try {
            // Check for old settings key first for backwards compatibility
            let storedSettings = localStorage.getItem('revoluzion-settings');
            if (!storedSettings) {
                // Try the new settings key
                storedSettings = localStorage.getItem('vizor-settings');
            }
            if (storedSettings) {
                const parsedSettings = JSON.parse(storedSettings);
                setSettings(parsedSettings);

                // Only change the language if:
                // 1. Language context exists
                // 2. We have a language setting
                // 3. It's different from the current language
                // 4. The language context is fully loaded
                // 5. There is no direct language preference that should take precedence
                const directLanguagePreference = localStorage.getItem("direct-language-preference");

                if (languageContext &&
                    parsedSettings.language?.current &&
                    languageContext.currentLangCode !== parsedSettings.language.current &&
                    languageContext.isLanguageLoaded &&
                    (!directLanguagePreference || directLanguagePreference === parsedSettings.language.current)) {

                    console.log('[SettingsProvider] Loading language from localStorage settings:', parsedSettings.language.current);
                    languageContext.changeLanguage(parsedSettings.language.current);
                }
            }
        } catch (error) {
            console.error('Failed to load settings from localStorage:', error);
            // If loading fails, use default settings
            setSettings(defaultSettings);
        }
    }, [languageContext]);
    
    // Save settings to localStorage whenever they change
    useEffect(() => {
        try {
            localStorage.setItem('vizor-settings', JSON.stringify(settings));
            
            // For backwards compatibility, also save to old key
            localStorage.setItem('revoluzion-settings', JSON.stringify(settings));

            // Add a flag to indicate settings were updated in localStorage
            if (typeof window !== 'undefined') {
                window.sessionStorage.setItem('settings_just_updated', 'true');
            }
        } catch (error) {
            console.error('Failed to save settings to localStorage:', error);
        }
    }, [settings]);

    // Update a specific setting
    const updateSettings = (section: keyof SettingsConfig, key: string, value: string | boolean | number | object) => {
        setSettings((prevSettings) => {
            const newSettings = {
                ...prevSettings,
                [section]: {
                    ...prevSettings[section],
                    [key]: value,
                },
            };
            return newSettings;
        });
    };

    // Reset all settings to default
    const resetSettings = () => {
        // Get the default language before resetting
        const defaultLang = defaultSettings.language?.current;

        // Reset settings
        setSettings(defaultSettings);

        // Reset language to default if language context is available
        if (languageContext && defaultLang) {
            languageContext.changeLanguage(defaultLang);
        }
    };

    return (
        <SettingsContext.Provider
            value={{
                settings,
                updateSettings,
                resetSettings,
                isWalletConnected,
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
};

export default SettingsProvider;
