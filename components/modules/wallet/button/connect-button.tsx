'use client'

import { useAppKitAccount, useAppKit } from '@reown/appkit/react'
import { Button } from '@/components/ui/button'
import { Wallet, Loader2 } from 'lucide-react'
import { useClientMounted } from '../hooks/use-wallet-connection'
import { useState } from 'react'
import { toast } from 'sonner'
import ButtonCustom from '../../button/custom'

export const ConnectButton = ({
  variant = "secondary",
  className = "",
  size = "sm",
  showIcon = true,
  label = "Connect Wallet"
}: {
  variant?: "secondary" | "ghost" | "link" | "default" | "destructive" | "outline" | "custom",
  className?: string,
  size?: "default" | "sm" | "lg" | "icon",
  showIcon?: boolean,
  label?: string
}) => {
  const { isConnected, address } = useAppKitAccount()
  const { open } = useAppKit()
  const mounted = useClientMounted()
  const [isLoading, setIsLoading] = useState(false)

  // Don't render during SSR to prevent hydration errors
  if (!mounted) return null

  const handleConnect = async () => {
    try {
      setIsLoading(true)
      // Use appkit's open method directly - this is the key to making it work!
      await open()
    } catch (error) {
      console.error("Connection error:", error)
      toast.error("Failed to connect wallet")
    } finally {
      setTimeout(() => setIsLoading(false), 500)
    }
  }

  // If connected and we have an address
  if (isConnected && address) {
    return (
      <appkit-account-button />
    )
  }

  // Not connected state
  return (
    <ButtonCustom
      title={(
        <div className={`flex gap-1 align-middle text-normal text-[#1DBBFF]`}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin pt-1" />
          ) : (
            showIcon && <Wallet className="mr-2 h-4 w-4 pt-1" />
          )}
          <p className={`h-fit m-auto`}>
            {label}
          </p>
        </div>
      )}
      variant={variant ? variant : `custom`}
      onClick={handleConnect}
      disabled={isLoading}
      className={`${className} button-gradient rounded-full`}
    />
  )
}