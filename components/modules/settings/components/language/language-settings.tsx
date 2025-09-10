"use client"

import { Globe } from "lucide-react"
import { AdvancedSettings } from "../.."
import { useLanguageDetails } from "../../hooks/use-language-details"
import { LanguageDetailsPanel } from "./language-details-panel"
import { AutoDetectLanguagePanel } from "./auto-detect-language-panel"

export function LanguageSettings() {
    const {
        currentLangCode,
        languageTerms,
        autoDetect,
        toggleAutoDetect,
        changeLanguage
    } = useLanguageDetails();

    return (
        <AdvancedSettings
            icon={<Globe className="mr-2 text-green-500 h-5 w-5" />}
            title={languageTerms.language_settings || "Language Settings"}
        >
            {/* Language Details Panel */}
            <LanguageDetailsPanel
                currentLangCode={currentLangCode}
                onLanguageChange={changeLanguage}
                languageTerms={languageTerms}
            />

            {/* Auto-detect Language Panel */}
            <AutoDetectLanguagePanel
                autoDetect={autoDetect}
                onAutoDetectToggle={toggleAutoDetect}
                languageTerms={languageTerms}
            />
        </AdvancedSettings>
    )
}