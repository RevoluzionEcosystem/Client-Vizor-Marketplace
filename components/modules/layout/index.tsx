"use client"

import { ReactNode, useState } from "react"
import { Toaster } from "sonner"
import { useWalletNotifications } from "../wallet/hooks/use-wallet-notifications"
import { ConnectButton } from "../wallet/button/connect-button"
import { useClientMounted } from "../wallet/hooks/use-wallet-connection"

import NavSidebar from "../navigation/sidebar"
import WalletAlerts from "../wallet/notifications/wallet-alerts"
import logo from "@/public/assets/images/logo.png"
import Image from "next/image"
import ButtonCustom from "../button/custom"
import { usePathname, useRouter } from "next/navigation"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function MainLayout({
    children
}: {
    children: ReactNode
}) {    
    const mounted = useClientMounted()
    const router = useRouter()
    const pathname = usePathname()

    // Initialize wallet notifications
    useWalletNotifications()

    return (
        <div className="min-h-screen p-2">
            <div className={`grid grid-cols-2 lg:grid-cols-[auto_1fr_auto] align-middle gap-4 py-2 px-4`}>
                <div className={`w-fit h-fit my-auto`}>
                    <Image
                        width={logo.width}
                        height={logo.height}
                        src={logo.src}
                        alt={`Vizor`}
                        className={`w-[3rem] h-auto mx-auto my-auto py-3 transition duration-300 ease-in-out`}
                    />
                </div>
                <div className={`hidden lg:flex gap-2 mx-4 w-fit h-fit my-auto align-middle`}>
                    <ButtonCustom
                        title={(
                            <h2 className={`flex gap-2 items-center align-middle`}>
                                Dashboard
                            </h2>
                        )}
                        variant={`${pathname === "/" ? `custom` : `ghost`}`}
                        onClick={() => router.push("/")}
                        className={`${pathname === "/" ? "button-gradient text-[#1DBBFF]" : "text-white"} rounded-full`}
                    />
                    <ButtonCustom
                        title={(
                            <h2 className={`flex gap-2 items-center align-middle`}>
                                Release Value
                            </h2>
                        )}
                        variant={`${pathname === "#" ? `custom` : `ghost`}`}
                        onClick={() => router.push("#")}
                        className={`${pathname === "#" ? "button-gradient text-[#1DBBFF]" : "text-white"} rounded-full`}
                    />
                    <ButtonCustom
                        title={(
                            <h2 className={`flex gap-2 items-center align-middle`}>
                                Capture Potential
                            </h2>
                        )}
                        variant={`${pathname === "#" ? `custom` : `ghost`}`}
                        onClick={() => router.push("#")}
                        className={`${pathname === "#" ? "button-gradient text-[#1DBBFF]" : "text-white"} rounded-full`}
                    />
                </div>
                {mounted && <div className={`w-fit h-fit my-auto ml-auto lg:ml-0`}>
                    <ConnectButton variant={`custom`} className={`button-gradient rounded-full mb-4`} />
                </div>}
            </div>
            <div className="p-1 grid grid-cols-1 gap-4 lg:grid-cols-[auto_1fr] grid-rows-[1fr_auto] md:grid-rows-1">
                <NavSidebar />
                <ScrollArea className="h-[calc(100vh-170px)] lg:h-full w-full">
                    <main className="p-4 min-h-[75vh] w-full lg:min-h-[calc(100vh-5.2rem)]">
                        {children}
                    </main>
                </ScrollArea>
            </div>
            <WalletAlerts />
            <Toaster
                position="bottom-right"
                richColors={true}
                theme="dark"
                closeButton
            />
        </div>
    )
}