"use client"

import { useState, useEffect, useCallback } from "react"
import { useLanguageContext } from "@/components/language-provider"
import { useSettings } from "../settings-provider"
import { supportedLanguages } from "@/lib/language-utils"

export function useLanguageDetails() {
    const { 
        content, 
        currentLangCode, 
        changeLanguage, 
        refreshLanguageContent, 
        refreshCounter 
    } = useLanguageContext();
    const { updateSettings } = useSettings();

    // Auto-detect state
    const [autoDetect, setAutoDetect] = useState(false);

    // Initialize autoDetect state from localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setAutoDetect(localStorage.getItem('autoDetectLanguage') === 'true');
        }
    }, []);

    // Get language terms from content
    const languageTerms = content?.terms || {};    // Function to handle language change
    const handleLanguageChange = useCallback((langCode: string) => {
        console.log('[LanguageSettings] Changing language to:', langCode);
        
        // Don't do anything if language is the same
        if (currentLangCode === langCode) {
            console.log('[LanguageSettings] Language already set to:', langCode);
            return;
        }
        
        // Update settings first so they're saved
        updateSettings('language', 'interfaceLanguage', langCode);
        
        // IMPORTANT: Mark that the user has chosen a language explicitly
        if (typeof window !== "undefined") {
            // Set a flag to indicate the user explicitly triggered this change
            window.sessionStorage.setItem('user_triggered_language_change', 'true');
            localStorage.setItem("user_selected_language", langCode);
            localStorage.setItem("direct-language-preference", langCode);
        }
        
        // Important: Call changeLanguage last to trigger the immediate content update
        // This is the function we've modified to pre-load content before changing the language code
        changeLanguage(langCode);
        
        // The refreshCounter from the context will ensure components re-render with new content
        console.log('[LanguageSettings] Language change initiated with refresh counter:', refreshCounter);
    }, [changeLanguage, updateSettings, currentLangCode, refreshCounter]);

    // Function to toggle auto-detect
    const toggleAutoDetect = useCallback((checked: boolean) => {
        setAutoDetect(checked);
        if (typeof window !== 'undefined') {
            localStorage.setItem('autoDetectLanguage', checked.toString());
        }

        if (checked) {
            // Auto-detect browser language
            const browserLang = navigator.language.split('-')[0];
            const supportedLang = supportedLanguages.find(lang => lang.code === browserLang);

            if (supportedLang) {
                handleLanguageChange(supportedLang.code);
            }
        }
    }, [handleLanguageChange]);

    // Get available languages
    const availableLanguages = supportedLanguages.filter(lang => lang.active);

    return {
        currentLangCode,
        languageTerms,
        availableLanguages,
        autoDetect,
        toggleAutoDetect,
        changeLanguage: handleLanguageChange
    };
}
