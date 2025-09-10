"use client"

import { ReactNode, useState } from "react"
import { Toaster } from "sonner"

import NavSidebar from "../navigation/old/sidebar"
import NavHeader from "../navigation/old/header"
import Footer from "../footer"
import WalletAlerts from "../wallet/notifications/wallet-alerts"
import { useWalletNotifications } from "../wallet/hooks/use-wallet-notifications"

export default function MainLayout({
    children
}: {
    children: ReactNode
}) {
    const [openSidebar, setOpenSidebar] = useState(false)
    
    // Initialize wallet notifications
    useWalletNotifications()

    return (
        <div className="min-h-screen p-2">
            <NavSidebar
                openSidebar={openSidebar}
                setOpenSidebar={setOpenSidebar}
            />
            <div className="p-1 xl:ml-56">
                <NavHeader
                    setOpenSidebar={() => setOpenSidebar(!openSidebar)}
                />
                <main className="p-4 min-h-[calc(100vh-12rem)] lg:min-h-[calc(100vh-9rem)]">
                    {children}
                </main>
                <Footer />
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