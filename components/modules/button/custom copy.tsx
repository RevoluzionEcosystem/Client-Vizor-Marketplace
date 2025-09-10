"use client"

import { ReactNode } from "react";
import { Button } from "../../ui/button"

export default function ButtonCustom({
    title,
    variant,
    size,
    onClick,
    className
} : {
    title: ReactNode
    variant?: "secondary" | "default" | "destructive" | "outline" | "ghost" | "link" | "custom"
    size?: "sm" | "default" | "lg"
    onClick?: any
    className?: string
}) {
	return (		
        <Button className={`${className} w-fit justify-start px-6 py-6`} variant={variant ? variant : "custom"} size={size ? size : "default"} onClick={onClick}>
            {title ? title : `Title`}
		</Button>
	)
}