"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home } from "lucide-react"
import { capitalizeFirstLetter, splitPathname } from "@/lib/helpers"

import AdvancedSettings from "../settings/components/advanced-settings"
import MenuToggle from "../button/menu"
// import SearchModal from "./search-modal"

import { useLanguageContext } from "@/components/language-provider"
import { ConnectButton } from "../wallet/button/connect-button"
import { useClientMounted } from "../wallet/hooks/use-wallet-connection"

export default function NavHeader({ setOpenSidebar }: { setOpenSidebar?: () => void }) {
    const pathname = usePathname()
    const mounted = useClientMounted()
    const { content } = useLanguageContext()

    // Generate breadcrumb links
    const generateBreadcrumbPath = (index: number) => {
        const pathParts = splitPathname(pathname)
        let path = ""
        // Build the path up to the current breadcrumb
        for (let i = 0; i <= index; i++) {
            path += `/${pathParts[i]}`
        }
        return path
    }    // Truncate breadcrumb items to prevent UI stretching
    const formatBreadcrumbItem = (item: string) => {
        
        // Two-part strategy:
        
        // 1. For any item over 20 characters, always truncate
        if (item.length > 20) {
            return `${item.substring(0, 4)}...${item.substring(item.length - 4)}`
        }
        
        // 2. For items over 8 characters that look like IDs (UUIDs, wallet addresses, etc.)
        if (item.length > 20 && 
            (item.includes('-') || // Has hyphens (like UUIDs)
             /^[0-9a-fA-F]+$/.test(item) || // Hex format (like addresses)
             /^[0-9a-zA-Z_]+$/.test(item))) { // Alphanumeric plus underscore
            return `${item.substring(0, 4)}...${item.substring(item.length - 4)}`
        }

        // Default behavior: capitalize the item
        return capitalizeFirstLetter(item)
    }

    return (
        <nav className="bg-black/20 backdrop-blur-lg border border-slate-800/50 hover:border-cyan-400/30 rounded-xl transition-all sticky top-2 z-40 py-2 px-2 md:px-3 xl:top-4 xl:px-4">
            <div className="flex flex-col-reverse justify-between gap-2 md:flex-row md:items-center">
                <div className="flex items-center font-light text-xs sm:text-sm md:text-base overflow-x-auto no-scrollbar">                    
                    {/* Home Link */}
                    <Link href="/" className="flex items-center hover:text-primary transition-colors min-w-max">
                        <Home width={12} height={12} className="mr-1 sm:w-[15px] sm:h-[15px]" />
                        <span className="whitespace-nowrap">{content?.project_title || "Vizor"}</span>
                    </Link>

                    {/* Breadcrumb Navigation */}
                    {pathname !== "/" && splitPathname(pathname).length > 0 && splitPathname(pathname).map((item, index) => (
                        <div key={`breadcrumb-${index}`} className="flex items-center min-w-max">
                            <span className="mx-1"> &gt; </span>                            
                            <Link
                                href={generateBreadcrumbPath(index)}
                                className={`hover:text-primary transition-colors whitespace-nowrap ${index + 1 === splitPathname(pathname).length ? 'font-bold' : ''}`}
                                title={item.length > 8 ? item : undefined}
                            >
                                {formatBreadcrumbItem(item)}
                            </Link>
                        </div>
                    ))}
                </div>
                <div className="flex items-center gap-2">

                    {/* Mobile Menu Toggle */}
                    <MenuToggle setOpenSidebar={setOpenSidebar} />

                    {/* Improved wallet connection button */}
                    {mounted && <ConnectButton />}

                    {/* Advanced Settings */}
                    <AdvancedSettings />
                </div>
            </div>
        </nav>
    )
}