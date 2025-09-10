"use client"

import { Globe } from "lucide-react"
import { Switch } from "@/components/ui/switch"

interface AutoDetectLanguagePanelProps {
    autoDetect: boolean;
    onAutoDetectToggle: (checked: boolean) => void;
    languageTerms: {
        auto_detect_language?: string;
        auto_detect_description?: string;
        availableLanguages?: string;
        [key: string]: string | undefined;
    };
}

export function AutoDetectLanguagePanel({
    autoDetect,
    onAutoDetectToggle,
    languageTerms
}: AutoDetectLanguagePanelProps) {
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4" />
                    <span>{languageTerms.auto_detect_language || "Auto-detect Language"}</span>
                </div>
                <Switch
                    checked={autoDetect}
                    onCheckedChange={onAutoDetectToggle}
                    size="sm"
                />
            </div>
            {autoDetect && (
                <p className="text-xs text-muted-foreground ml-6 mt-1">
                    {languageTerms.auto_detect_description ||
                        "When enabled, the application will use your browser's language settings."}
                </p>
            )}
        </div>
    )
}
