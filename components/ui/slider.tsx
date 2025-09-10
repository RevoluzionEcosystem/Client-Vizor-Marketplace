"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-slate-800/50 border border-slate-700/50">
      <SliderPrimitive.Range className="absolute h-full bg-gradient-to-r from-cyan-500 to-blue-600 will-change-transform" />
    </SliderPrimitive.Track>
    
    {props.value?.map((_, i) => (
      <SliderPrimitive.Thumb
        key={i}
        asChild
        className="block h-5 w-5 rounded-full border border-cyan-400/50 bg-slate-900 shadow-md shadow-black/50 ring-offset-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      >
        <motion.span
          whileTap={{ scale: 1.1 }}
          whileHover={{ 
            scale: 1.10,
            boxShadow: "0 0 8px 2px rgba(11, 171, 245, 0.3)" 
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 15
          }}
        >
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
          </span>
        </motion.span>
      </SliderPrimitive.Thumb>
    ))}
  </SliderPrimitive.Root>
))

Slider.displayName = "Slider"

export { Slider }