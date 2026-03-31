import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { PanelLeft } from "lucide-react"
import { Outlet } from "react-router-dom"

import { AppSidebar } from "@/components/layout/AppSidebar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const STORAGE_KEY = "ehr-sidebar-expanded"

const panelSpring = { type: "spring" as const, stiffness: 450, damping: 28 }

export default function AppLayout() {
  const [sidebarExpanded, setSidebarExpanded] = useState(() => {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === null) return true
    return v === "true"
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(sidebarExpanded))
  }, [sidebarExpanded])

  const toggleSidebar = () => setSidebarExpanded((prev) => !prev)

  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <AppSidebar expanded={sidebarExpanded} />
      {/*
        Padding (not margin) avoids horizontal overflow.
        Collapse control: outside the sidebar rail, same vertical band as the
        logo + “Health Assistant” row (pt-6 pb-2, h-10).
      */}
      <div
        className={cn(
          "relative box-border flex min-h-screen w-full min-w-0 max-w-full flex-col pb-20 transition-[padding] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] md:pb-0",
          sidebarExpanded ? "md:pl-60" : "md:pl-16"
        )}
      >
        {/* Desktop: ChatGPT-style PanelLeft — main column only, inline with sidebar header row */}
        <header className="hidden shrink-0 items-center px-4 pb-2 pt-6 md:flex">
          <motion.div
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.92 }}
            transition={panelSpring}
            className="flex h-10 items-center"
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 shrink-0 text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={toggleSidebar}
              aria-expanded={sidebarExpanded}
              aria-label={
                sidebarExpanded ? "Collapse sidebar" : "Expand sidebar"
              }
              title={
                sidebarExpanded ? "Collapse sidebar" : "Expand sidebar"
              }
            >
              <PanelLeft className="size-[18px]" strokeWidth={2} />
            </Button>
          </motion.div>
        </header>

        <div className="min-h-0 flex-1">
          <Outlet
            context={{
              sidebarExpanded,
              setSidebarExpanded,
              toggleSidebar,
            }}
          />
        </div>
      </div>
    </div>
  )
}
