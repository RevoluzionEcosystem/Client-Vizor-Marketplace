"use client"

import { ReactNode } from "react"
import { ThemeProvider } from "./theme-provider"
import MainLayout from "./modules/layout"
import ContextProvider from './modules/wallet/context/index'
import { State } from "wagmi"
import LoadingProvider from "./loading-provider"
import { LanguageProvider } from "./language-provider"
import { SettingsProvider } from "./modules/settings/settings-provider"

export default function RootClientLayout({
  children,
  initialState
}: {
  children: ReactNode,
  initialState?: State
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <LanguageProvider>
        <SettingsProvider>
          <ContextProvider initialState={initialState}>
            <LoadingProvider>
              <MainLayout>
                {children}
              </MainLayout>
            </LoadingProvider>
          </ContextProvider>
        </SettingsProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}