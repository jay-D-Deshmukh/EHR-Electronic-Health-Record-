import { useEffect, useState } from "react"
import { Outlet } from "react-router-dom"

import { AppSidebar } from "@/components/layout/AppSidebar"
import { cn } from "@/lib/utils"

const STORAGE_KEY = "ehr-sidebar-expanded"

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
      <AppSidebar expanded={sidebarExpanded} onToggle={toggleSidebar} />
      <div
        className={cn(
          "relative box-border flex min-h-screen w-full min-w-0 max-w-full flex-col pb-20 transition-[padding] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] md:pb-0",
          sidebarExpanded ? "md:pl-60" : "md:pl-16"
        )}
      >
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
