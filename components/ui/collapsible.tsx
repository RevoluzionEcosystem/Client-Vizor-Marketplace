"use client"

import * as React from "react"
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const Collapsible = CollapsiblePrimitive.Root

const CollapsibleTrigger = CollapsiblePrimitive.Trigger

const CollapsibleContent = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <CollapsiblePrimitive.Content
    ref={ref}
    className={cn(
      "overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down",
      className
    )}
    {...props}
    asChild
  >
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ 
        opacity: 1, 
        height: "auto",
        transition: {
          height: {
            type: "spring",
            stiffness: 300,
            damping: 30
          },
          opacity: { duration: 0.2 }
        }
      }}
      exit={{ 
        opacity: 0, 
        height: 0,
        transition: {
          height: { duration: 0.2 },
          opacity: { duration: 0.15 }
        }
      }}
    >
      <div className="pt-2 pb-4">{children}</div>
    </motion.div>
  </CollapsiblePrimitive.Content>
))

CollapsibleContent.displayName = "CollapsibleContent"

export { Collapsible, CollapsibleTrigger, CollapsibleContent }