import type { ComponentType } from "react"
import {
  Grid2X2,
  Library,
  PanelLeft,
  Search,
} from "lucide-react"
import { NavLink } from "react-router-dom"

import { UserProfileMenu } from "@/components/layout/UserProfileMenu"
import { cn } from "@/lib/utils"
import logo from "@/assets/image.png"

type NavDef = {
  key: string
  to: string
  label: string
  Icon: ComponentType<{ className?: string }>
}

const NAV_ITEMS: NavDef[] = [
  { key: "grid", to: "/dashboard", label: "Dashboard", Icon: Grid2X2 },
  { key: "search", to: "/", label: "Search", Icon: Search },
  { key: "library", to: "/compose", label: "Library", Icon: Library },
]

type AppSidebarProps = {
  expanded: boolean
  onToggle: () => void
}

export function AppSidebar({ expanded, onToggle }: AppSidebarProps) {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex items-center gap-3 rounded-xl py-2.5 text-sm font-medium transition-colors",
      expanded ? "w-full justify-start px-3" : "w-10 justify-center px-0",
      isActive
        ? "bg-emerald-50 text-emerald-700"
        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
    )

  return (
    <>
      {/* Desktop: collapsible rail */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 hidden h-dvh flex-col border-r border-gray-100 bg-white transition-[width] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] md:flex",
          expanded ? "w-60" : "w-16"
        )}
        aria-label="Main navigation"
      >
        <div
          className={cn(
            "flex shrink-0 items-center pb-2 pt-6",
            expanded ? "justify-between px-4" : "justify-center px-0"
          )}
        >
          {expanded && (
            <NavLink
              to="/"
              end
              className="flex items-center gap-3 rounded-lg outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-ring"
              title="Home"
            >
              <img src={logo} alt="" className="h-10 w-10 shrink-0 object-contain" />
              <span className="truncate text-sm font-semibold text-[#1B1B1B]">
                AR360 Assistant
              </span>
            </NavLink>
          )}
          <button
            type="button"
            onClick={onToggle}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-expanded={expanded}
            aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
            title={expanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            <PanelLeft className="size-[18px]" strokeWidth={2} />
          </button>
        </div>

        <nav
          className="flex flex-1 flex-col gap-1 px-2 pt-4"
          aria-label="Primary"
        >
          {NAV_ITEMS.map(({ key, to, label, Icon }) => (
            <NavLink
              key={key}
              to={to}
              className={navLinkClass}
              title={label}
            >
              <Icon className="size-5 shrink-0" />
              {expanded && <span className="truncate">{label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto flex flex-col items-stretch gap-2 px-2 pb-4">
          <div
            className={cn(
              "flex items-center pt-1",
              expanded ? "justify-start px-1" : "justify-center"
            )}
          >
            <UserProfileMenu expanded={expanded} />
            {expanded && (
              <span className="ml-3 truncate text-xs text-muted-foreground">
                Profile
              </span>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile: bottom bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-gray-100 bg-white px-2 md:hidden"
        aria-label="Mobile navigation"
      >
        {NAV_ITEMS.map(({ key, to, label, Icon }) => (
          <NavLink
            key={key}
            to={to}
            aria-label={label}
            className={({ isActive }) =>
              cn(
                "rounded-lg p-2",
                isActive ? "text-emerald-600" : "text-gray-900"
              )
            }
          >
            <Icon className="size-6" />
          </NavLink>
        ))}
        <UserProfileMenu />
      </nav>
    </>
  )
}
