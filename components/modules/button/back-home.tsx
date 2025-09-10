"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, ArrowLeft, ChevronLeft } from "lucide-react"
import { Button } from "../../ui/button"
import { motion } from "framer-motion"
import { cn } from "../../../lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../ui/tooltip"

interface BackHomeButtonProps {
  href?: string
  variant?: "default" | "outline" | "ghost" | "secondary"
  size?: "sm" | "default" | "lg"
  showText?: boolean
  className?: string
  icon?: "arrow" | "chevron" | "none"
}

export default function BackHomeButton({
  href = "/",
  variant = "outline",
  size = "default",
  showText = true,
  className = "",
  icon = "chevron",
}: BackHomeButtonProps) {
  const pathname = usePathname()
  
  // Don't show the button if already on the home page
  if (pathname === "/") return null
  
  return (
    <TooltipProvider>
      <Tooltip>
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="inline-block"
        >
          <TooltipTrigger asChild>
            <Button
              variant={variant}
              size={size}
              asChild
              className={cn(
                "bg-slate-800/70 border-slate-600/30 hover:bg-slate-700/70",
                "transition-all duration-200",
                !showText && "px-2.5",
                className
              )}
            >
              <Link href={href} className="flex items-center gap-2">
                {icon === "arrow" && <ArrowLeft className="h-4 w-4" />}
                {icon === "chevron" && <ChevronLeft className="h-4 w-4" />}
                <Home className="h-4 w-4" />
                {showText && <span>Home</span>}
              </Link>
            </Button>
          </TooltipTrigger>
          {!showText && <TooltipContent>Back to Home</TooltipContent>}
        </motion.div>
      </Tooltip>
    </TooltipProvider>
  )
}