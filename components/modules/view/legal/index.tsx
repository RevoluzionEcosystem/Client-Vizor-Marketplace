"use client"

import React, { useState, useEffect, useMemo } from "react"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"

import {
  ClipboardType,
  FileText,
  Shield,
  Lock,
  Download,
  Printer,
  Search,
  Calendar,
  History,
  AlertCircle,
  FileCheck,
  Scale,
  AlertTriangle,
  X,
} from "lucide-react"
import { HeaderContent } from "@/components/modules/header"

import legalDocuments from "./components/legal-data"
import versionHistory from "./components/legal-version"
import { AnimatePresence, motion } from "framer-motion"

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */
type Section = { title: string; content: string }
type LegalDoc = {
  title: string
  lastUpdated: string
  version?: string
  sections: Section[]
}

/* ------------------------------------------------------------------ */
/*  Icon map + helper                                                 */
/* ------------------------------------------------------------------ */
const iconMap: Record<string, JSX.Element> = {
  legalPolicy: <Scale className="mr-2 h-4 w-4" />,
  termsAndConditions: <FileCheck className="mr-2 h-4 w-4" />,
  privacyPolicy: <Lock className="mr-2 h-4 w-4" />,
  serviceLevelAndClientPolicy: <Shield className="mr-2 h-4 w-4" />,
  riskDisclosure: <AlertTriangle className="mr-2 h-4 w-4" />,
  cookiePolicy: <FileText className="mr-2 h-4 w-4" />,
}

const highlightMatches = (txt: string, q: string) =>
  !q || q.length < 3
    ? txt
    : txt.split(new RegExp(`(${q})`, "gi")).map((p, i) =>
      p.toLowerCase() === q.toLowerCase() ? (
        <span key={i} className="bg-teal-900/30 text-teal-400">
          {p}
        </span>
      ) : (
        p
      )
    )

/* ------------------------------------------------------------------ */
/*  Iframe print helpers                                              */
/* ------------------------------------------------------------------ */
function createPrintFrame(html: string, mode: "print" | "pdf") {
  const iframe = document.createElement("iframe")
  Object.assign(iframe.style, {
    position: "fixed",
    right: 0,
    bottom: 0,
    width: "0",
    height: "0",
    border: "0",
  } as unknown as CSSStyleDeclaration)
  document.body.appendChild(iframe)

  const doc = iframe.contentDocument || iframe.contentWindow?.document
  if (!doc) return
  doc.open()
  doc.write(html)
  doc.close()

  iframe.onload = () => {
    if (mode === "pdf") toast.info("Choose “Save as PDF” in the dialog.")
    iframe.contentWindow?.print()
    setTimeout(() => document.body.removeChild(iframe), 800)
  }
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */
export default function LegalView() {
  const [extraDoc, setExtraDoc] = useState<{ title: string; content: string } | null>(null)
  // Default to first selector; will be overridden if URL provides a valid tab query parameter.
  const [activeTab, setActiveTab] = useState(
    legalDocuments.selector[0].value
  )
  const [searchQuery, setSearchQuery] = useState("")
  const [showHistoryCard, setShowHistoryCard] = useState(false)

  const currentDocument: LegalDoc = useMemo(
    () => (legalDocuments as any)[activeTab] ?? legalDocuments.legalPolicy,
    [activeTab]
  )

  const filteredSections = useMemo(() => {
    if (searchQuery.length < 3) return currentDocument.sections
    const q = searchQuery.toLowerCase()
    return currentDocument.sections.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.content.toLowerCase().includes(q)
    )
  }, [searchQuery, currentDocument])

  /** print extra doc */
  const handleExtraDocPrint = (mode: "print" | "pdf") => {
    if (!extraDoc) return
    const html = `
      <html><head>
        <title>${extraDoc.title}</title>
        <style>
          body { font-family: system-ui, sans-serif; padding: 2rem; color: #111; }
          h1 { font-size: 2rem; margin-bottom: 1rem; }
          pre { white-space: pre-wrap; }
        </style>
      </head><body>
        <h1>${extraDoc.title}</h1>
        <pre>${extraDoc.content}</pre>
      </body></html>
    `
    createPrintFrame(html, mode)
  }

  // New: Read tab from URL query parameters on mount.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const tab = params.get("tab")
    if (tab && legalDocuments.selector.find((item) => item.value === tab)) {
      setActiveTab(tab)
    }
  }, [])

  // New: Update the URL query parameter whenever activeTab changes.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    params.set("tab", activeTab)
    window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`)
  }, [activeTab])

  /** print whole document */
  const handleWholeDoc = (mode: "print" | "pdf") => {
    const html = `
      <html><head>
        <title>${currentDocument.title}</title>
        <style>
          body { font-family: system-ui, sans-serif; padding: 2rem; color: #111; }
          h1 { font-size: 2rem; margin-top: 2.5rem; }
          h2 { font-size: 1.25rem; margin-top: 1.5rem; }
          pre { white-space: pre-wrap; margin-top: 0.5rem; }
        </style>
      </head><body>
        <h1>${currentDocument.title}</h1>
        ${currentDocument.sections
        .map(
          (sec) => `<h2>${sec.title}</h2><pre>${sec.content}</pre>`
        )
        .join("")}
      </body></html>
    `
    createPrintFrame(html, mode)
  }

  /** print a single section */
  const handleSection = (sec: Section, mode: "print" | "pdf") => {
    const html = `
      <html><head>
        <title>${sec.title}</title>
        <style>
          body { font-family: system-ui, sans-serif; padding: 2rem; color: #111; }
          h1 { font-size: 1.5rem; margin-bottom: 1rem; }
          pre { white-space: pre-wrap; }
        </style>
      </head><body>
        <h1>${sec.title}</h1>
        <pre>${sec.content}</pre>
      </body></html>
    `
    createPrintFrame(html, mode)
  }

  return (
    <div className="space-y-6">
      {/* Header with title */}
      <HeaderContent
        headline="Legal Documents & Policies"
        subheadline="Explore our comprehensive legal documents and policies, ensuring transparency and compliance with regulations."
        Icon={ClipboardType}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-screen-md mx-auto"
      >
        {/* Search & Actions */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search legal documents…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-teal-950/30 border-teal-600/30 w-full"
              aria-label="Search legal documents"
            />
          </div>

          {/* Export dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="bg-teal-950/30 border-teal-600/30 flex items-center gap-1"
              >
                <Printer className="h-4 w-4" /> Print / PDF
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="bg-teal-950 border border-slate-700/50 max-h-[350px] overflow-y-auto"
            >
              <DropdownMenuItem onClick={() => handleWholeDoc("print")}>
                Print document
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleWholeDoc("pdf")}>
                Save document as PDF
              </DropdownMenuItem>

              <Separator className="my-1 bg-slate-700/50" />

              <DropdownMenuLabel className="text-teal-400">
                Print / Save section
              </DropdownMenuLabel>

              {currentDocument.sections.map((sec, idx) => (
                <DropdownMenuItem
                  key={idx}
                  onClick={() => handleSection(sec, "print")}
                >
                  {sec.title}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            size="sm"
            className={`bg-teal-950/30 ${showHistoryCard ? "border-teal-500" : "border-teal-600/30"}`}
            onClick={() => setShowHistoryCard(!showHistoryCard)}
          >
            <History className="mr-2 h-4 w-4" /> Version History
          </Button>
        </div>

        {/* Version History */}
        <AnimatePresence>
          {showHistoryCard && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <Card className="bg-teal-950/30 border-teal-600/30">
                <CardHeader className="pb-2">
                  <CardTitle>Version History</CardTitle>
                  <CardDescription>
                    Track changes to our legal documents over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {versionHistory.map((v, i) => (
                      <div
                        key={i}
                        className="flex flex-col sm:flex-row sm:items-center p-3 rounded-md bg-teal-950/50 border border-slate-700/50"
                      >
                        <div className="flex items-center mb-2 sm:mb-0">
                          <Badge className="mr-2 bg-teal-900/20 text-teal-400 border-teal-400/30">
                            v{v.version}
                          </Badge>
                          <span className="text-sm text-gray-400 mr-4">
                            {new Date(v.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm font-medium">
                            {v.document}:
                          </span>
                          <span className="text-sm text-gray-300 ml-2">
                            {v.changes}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs & Document Body */}
        <div className="bg-teal-950/30 border border-teal-600/30 rounded-lg overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="px-4 pt-4">
              <TabsList className="flex overflow-x-auto space-x-2 rounded-md h-full w-full bg-teal-950/50 p-2">
                {legalDocuments.selector.map(({ value, title }) => (
                  <TabsTrigger
                    key={value}
                    value={value}
                    className="flex-shrink-0 whitespace-nowrap data-[state=active]:bg-teal-500 data-[state=active]:text-black px-3 py-1"
                  >
                    {iconMap[value] || <FileText className="mr-2 h-4 w-4" />}
                    {title}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <Separator className="mt-2" />

            <div className="p-6">
              {/* Document Header */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold">{currentDocument.title}</h2>
                <div className="text-gray-400 flex items-center text-sm mt-1">
                  <Calendar className="mr-2 h-4 w-4" />
                  Last Updated:&nbsp;
                  {new Date(currentDocument.lastUpdated).toLocaleDateString()}
                  {currentDocument.version && (
                    <Badge className="ml-3 bg-teal-900/20 text-teal-400 border-teal-400/30">
                      v{currentDocument.version}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Search Results Notice */}
              {searchQuery.length >= 3 && (
                <div className="mb-6 p-3 bg-teal-900/20 border border-teal-400/30 rounded-lg flex items-center">
                  <Search className="text-teal-400 mr-3 h-5 w-5" />
                  <div>
                    <p className="font-medium">
                      Search results for “{searchQuery}”
                    </p>
                    <p className="text-sm text-gray-400">
                      Found in {filteredSections.length} of{" "}
                      {currentDocument.sections.length} sections
                    </p>
                  </div>
                </div>
              )}

              {/* Document Body */}
              {filteredSections.length ? (
                <div className="space-y-4 print:space-y-8">
                  {filteredSections.map((sec, i) => (
                    <div key={i} className="print:mb-6">
                      <h3 className="text-xl font-medium mb-3">{sec.title}</h3>
                      <p className="text-slate-400 leading-relaxed whitespace-pre-line">
                        {highlightMatches(sec.content, searchQuery)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <AlertCircle className="h-12 w-12 text-gray-500 mx-auto mb-3" />
                  <h3 className="text-xl font-medium mb-2">No matches found</h3>
                  <p className="text-gray-400">
                    Your search for “{searchQuery}” did not match any content.
                  </p>
                </div>
              )}

              <AnimatePresence>
                {extraDoc && (
                  <motion.div
                    id="extra-doc"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 30 }}
                    transition={{ duration: 0.4 }}
                    // Added pr-12 to give room for the absolute close button.
                    className="relative mt-10 bg-teal-950/60 border border-slate-700/50 rounded-lg p-6 pr-12"
                  >
                    {/* Title and Print/PDF Buttons Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                      <h3 className="text-xl font-bold">{extraDoc.title}</h3>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="whitespace-nowrap"
                          onClick={() => handleExtraDocPrint("print")}
                        >
                          <Printer className="h-4 w-4 mr-1" />
                          Print
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="whitespace-nowrap"
                          onClick={() => handleExtraDocPrint("pdf")}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          PDF
                        </Button>
                        {/* Absolute positioned close button */}
                        <Button
                          size="sm"
                          variant="outline"
                          className="absolute top-2 right-2 sm:top-4 sm:right-4 flex items-center justify-center rounded-full bg-transparent hover:bg-red-500 hover:text-white transition-colors duration-200 p-1 sm:p-2"
                          onClick={() => setExtraDoc(null)}
                          aria-label="Close"
                        >
                          <X className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </Tabs>
        </div>
      </motion.div>
    </div>
  )
}