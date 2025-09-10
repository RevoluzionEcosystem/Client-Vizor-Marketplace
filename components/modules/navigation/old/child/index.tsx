"use client"

import { useRouter } from "next/navigation"
import { getNavIcon } from "@/lib/helpers"
import { Button } from "@/components/ui/button"

export default function NavChild({
    title,
    id,
    type,
    link,
    pathName,
    className,
    size,
    asChild,
    onClick
}: {
    title
    id
    type
    link
    pathName
    className?
    size?
    asChild?,
    onClick?
}) {
    const router = useRouter()

    const clicked = (val) => {
        onClick()
        router.push(val)
    }

    return (
        type === "internal" ? (
            <a href={link} onClick={onClick}>
                <Button
                    className={`${className} group transition-all hover:bg-accent/20 hover:text-accent`}
                    variant={pathName === link ? `secondary` : `ghost`}
                    size={size}
                    asChild={asChild}
                    onClick={() => clicked(link)}
                >
                    <div className="flex items-center">
                        <span className="mr-2 text-accent group-hover:text-accent transition-colors">{getNavIcon(id)}</span>
                        <span className={`${pathName === link ? 'text-slate-100' : 'text-slate-200'} group-hover:text-accent transition-colors`}>{title}</span>
                    </div>
                </Button>
            </a>
        ) : (<a target="_blank" href={link} onClick={onClick}>
            <Button
                className={`${className} group transition-all hover:bg-accent/20 hover:text-accent`}
                variant={`ghost`}
                size={size}
                asChild={asChild}
            >
                <div className="flex items-center">
                    <span className="mr-2 text-accent group-hover:text-accent transition-colors">{getNavIcon(id)}</span>
                    <span className="text-slate-200 group-hover:text-accent transition-colors">{title}</span>
                </div>
            </Button>
        </a>
        )
    )
}