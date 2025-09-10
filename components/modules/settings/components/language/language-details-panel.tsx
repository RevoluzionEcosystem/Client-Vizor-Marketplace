"use client"

import { Globe } from "lucide-react"
import Image from "next/image"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { supportedLanguages } from "@/lib/language-utils"

interface LanguageDetailsProps {
    currentLangCode: string;
    onLanguageChange: (value: string) => void;
    languageTerms: {
        default_language?: string;
        [key: string]: string | undefined;
    };
}

export function LanguageDetailsPanel({
    currentLangCode,
    onLanguageChange,
    languageTerms
}: LanguageDetailsProps) {
    // Get the current language object
    const currentLanguage = supportedLanguages.find(lang => lang.code === currentLangCode);

    return (
        <div className="space-y-4">
            {/* Current Language Indicator */}
            <div className="flex items-center space-x-3 px-2 py-3 bg-muted/50 rounded-md justify-center">
                <div className="relative w-8 h-5 overflow-hidden rounded-sm">
                    <Image
                        src={`/assets/country/${currentLanguage?.flagCode || 'gb'}.svg`}
                        alt={currentLanguage?.name || 'English'}
                        fill
                        className="object-cover"
                    />
                </div>
                <p className="text-sm text-muted-foreground font-medium">{currentLanguage?.nativeName || 'English'}</p>
                <p className="text-xs text-muted-foreground">{currentLanguage?.name || 'English'}</p>
            </div>

            {/* Language Selector */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4" />
                    <span>{languageTerms.default_language || "Default Language"}</span>
                </div>
                <Select
                    value={currentLangCode}
                    onValueChange={onLanguageChange}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={
                            supportedLanguages.find(lang => lang.code === currentLangCode)?.nativeName || "English"
                        } />
                    </SelectTrigger>
                    <SelectContent>
                        {supportedLanguages
                            .filter(lang => lang.active)
                            .map(lang => (
                                <SelectItem key={lang.code} value={lang.code}>
                                    <div className="flex items-center gap-2">
                                        <div className="relative w-4 h-3 overflow-hidden rounded-sm">
                                            <Image
                                                src={`/assets/country/${lang.flagCode}.svg`}
                                                alt={lang.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <span>{lang.nativeName}</span>
                                    </div>
                                </SelectItem>
                            ))
                        }
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}
