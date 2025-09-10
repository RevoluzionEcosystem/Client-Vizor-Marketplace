"use client"

import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface CosmicDividerProps {
    className?: string
    width?: string
    color?: string
    animated?: boolean
}

export default function CosmicDivider({
    className,
    width = "w-20",
    color = "cyan-400",
    animated = false
}: CosmicDividerProps) {
    const dividerVariants = {
        hidden: { opacity: 0, width: "0%" },
        visible: {
            opacity: 1,
            width: "100%",
            transition: { duration: 0.6 }
        }
    }

    const glowVariants = {
        hidden: { opacity: 0, width: "0px" },
        visible: {
            opacity: 1,
            width: width,
            transition: {
                duration: 0.8,
                delay: 0.3
            }
        }
    }

    return (
        <div className={cn("my-8 relative", className)}>
            <div className="absolute inset-0 flex items-center">
                {animated ? (
                    <motion.div
                        className="w-full border-t border-slate-800"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={dividerVariants}
                    />
                ) : (
                    <div className="w-full border-t border-slate-800" />
                )}
            </div>
            <div className="relative flex justify-center">
                {animated ? (
                    <motion.div
                        className={`h-[1px] bg-gradient-to-r from-transparent via-${color} to-transparent`}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={glowVariants}
                    />
                ) : (
                    <div className={`${width} h-[1px] bg-gradient-to-r from-transparent via-${color} to-transparent`} />
                )}
            </div>
        </div>
    )
}