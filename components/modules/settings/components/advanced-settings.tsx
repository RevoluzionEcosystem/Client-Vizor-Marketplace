"use client"

import { Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"

import { useLanguageContext } from "@/components/language-provider";
import { LanguageSettings } from "./language/language-settings"
import { WalletSettings } from "./wallet/wallet-settings"
import { NetworkSettings } from "./network/network-settings"

interface Terms {
    preset?: string;
    close?: string;
    [key: string]: string | any;
}

export default function AdvancedSettings() {
    const { content } = useLanguageContext();
    const terms = (content?.terms || {}) as Terms;

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    className={`w-fit justify-start px-2 py-1`}
                    variant={`secondary`}
                    size={`sm`}
                >
                    <Settings className={`md:mr-2 h-4 w-4`} />
                    <span className="hidden lg:block">{terms.preset || "Settings"}</span>
                </Button>
            </SheetTrigger>
            <SheetContent className="w-[450px] overflow-auto">
                <SheetHeader>
                    <SheetTitle>{terms.preset || "Settings"}</SheetTitle>
                    <SheetDescription>
                        Customize your preference
                    </SheetDescription>
                </SheetHeader>

                <Separator className="mt-4 mb-4" />  

                {/* Primary Settings Sections */}
                <WalletSettings />
                <NetworkSettings />
                <LanguageSettings />


                <SheetFooter className="mt-2">
                        <SheetClose asChild>
                            <Button
                                className={`w-fit justify-end px-6 py-1`}
                                variant={`secondary`}
                                size={`default`}
                            >
                                {terms.close || "Close"}
                            </Button>
                        </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}