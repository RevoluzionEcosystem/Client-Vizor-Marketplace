"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface HeaderContentProps {
    headline: string;
    subheadline: string;
    Icon: LucideIcon;
    iconColor?: string;
    className?: string;
}

export function HeaderContent({
    headline,
    subheadline,
    Icon,
    iconColor = "text-cyan-500",
    className = "",
}: HeaderContentProps) {
    return (
        <header className={`relative overflow-hidden rounded-xl bg-gradient-to-br from-black to-slate-950 pl-2 mb-4 ${className}`}>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 px-4 pt-6"
            >
                <div className="mb-8">
                    <div className="flex items-center">
                        <div className="mr-3 p-2 rounded-xl bg-gradient-to-br from-cyan-500/10 to-slate-900/80 border border-cyan-500/20">
                            <Icon className={`h-5 w-5 md:h-8 md:w-8 ${iconColor}`} />
                        </div>
                        <h1 className="text-lg md:text-4xl font-bold tracking-tight text-white mb-1 relative">
                            <span className="bg-gradient-to-br from-slate-200 via-slate-300 to-slate-500 bg-clip-text text-transparent">
                                {headline}
                            </span>
                        </h1>
                    </div>
                    <p className="text-slate-400 md:text-sm text-xs max-w-xl mt-2">
                        {subheadline}
                    </p>
                </div>
            </motion.div>
        </header>
    );
}