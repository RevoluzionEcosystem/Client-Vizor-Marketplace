"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

// Define the available size options
type SwitchSize = "sm" | "md" | "lg"

// Extend the Props type to include our size prop
interface SwitchProps extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
  size?: SwitchSize
}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(({ className, size = "md", ...props }, ref) => {
  // Define size-specific classes
  const sizeClasses = {
    sm: {
      switch: "h-4 w-7",
      thumb: "h-3 w-3 data-[state=checked]:translate-x-3",
      after: "after:top-[1.5px] after:left-[1.5px] after:h-2 after:w-2"
    },
    md: {
      switch: "h-6 w-11",
      thumb: "h-5 w-5 data-[state=checked]:translate-x-5",
      after: "after:top-[2px] after:left-[2px] after:h-4 after:w-4"
    },
    lg: {
      switch: "h-7 w-14",
      thumb: "h-6 w-6 data-[state=checked]:translate-x-7",
      after: "after:top-[3px] after:left-[3px] after:h-5 after:w-5"
    }
  }

  const { switch: switchClass, thumb: thumbClass, after: afterClass } = sizeClasses[size]

  return (
    <SwitchPrimitives.Root
      className={cn(
        "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-cyan-500 data-[state=checked]:to-blue-600 data-[state=unchecked]:bg-slate-700",
        switchClass,
        className
      )}
      {...props}
      ref={ref}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          "pointer-events-none relative block rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=unchecked]:translate-x-0 data-[state=checked]:bg-slate-100",
          thumbClass,
          "after:absolute after:rounded-full after:bg-cyan-400/10 after:opacity-0 data-[state=checked]:after:opacity-100",
          afterClass
        )}
        asChild
      >
        <motion.div
          layout
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30
          }}
        >
          <div className="h-full w-full rounded-full" />
        </motion.div>
      </SwitchPrimitives.Thumb>
    </SwitchPrimitives.Root>
  )
})

Switch.displayName = "Switch"

export { Switch }