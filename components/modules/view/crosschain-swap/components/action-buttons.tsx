"use client";

import { BookOpen, Clock, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";

interface ActionButtonsProps {
    onHistoryClick: () => void;
    onSupportClick: () => void;
    onGuideClick: () => void;
    isGuideOpen: boolean;
    isHistoryOpen: boolean;
}

export default function ActionButtons({
    onHistoryClick,
    onSupportClick,
    onGuideClick,
    isGuideOpen,
    isHistoryOpen
}: ActionButtonsProps) {
    const isMobile = useIsMobile();

    return (
        <div className={`flex items-center justify-between ${isMobile ? "gap-1" : "gap-2"} mb-1`}>
            <Tabs defaultValue="history" className="w-full">
                <TabsList className={`w-full ${isMobile ? "h-8" : ""}`}>
                    <TabsTrigger
                        value="guide"
                        className={`flex items-center ${isMobile ? "gap-0.5 py-1" : "gap-1"} w-1/3`}
                        onClick={onGuideClick}
                        data-state={isGuideOpen ? "active" : "inactive"}
                    >
                        <BookOpen className={`${isMobile ? "h-3 w-3" : "h-3.5 w-3.5"}`} />
                        <span className={`${isMobile ? "text-xs" : ""}`}>Guide</span>
                    </TabsTrigger>                    
                    <TabsTrigger
                        value="history"
                        className={`flex items-center ${isMobile ? "gap-0.5 py-1" : "gap-1"} w-1/3`}
                        onClick={onHistoryClick}
                        data-state={isHistoryOpen ? "active" : "inactive"}
                    >
                        <Clock className={`${isMobile ? "h-3 w-3" : "h-3.5 w-3.5"}`} />
                        <span className={`${isMobile ? "text-xs" : ""}`}>History</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="support"
                        className={`flex items-center ${isMobile ? "gap-0.5 py-1" : "gap-1"} w-1/3`}
                        onClick={onSupportClick}
                    >
                        <HelpCircle className={`${isMobile ? "h-3 w-3" : "h-3.5 w-3.5"}`} />
                        <span className={`${isMobile ? "text-xs" : ""}`}>Support</span>
                    </TabsTrigger>
                </TabsList>
            </Tabs>
        </div>
    );
}