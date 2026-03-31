import { LogOut, Settings } from "lucide-react"
import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

type UserProfileMenuProps = {
  expanded?: boolean
  className?: string
}

export function UserProfileMenu({ expanded = false, className }: UserProfileMenuProps) {
  const navigate = useNavigate()

  function handleLogout() {
    navigate("/", { replace: true })
  }

  function handleSettings() {
    navigate("/settings")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            "rounded-full border border-[#B5E5DC] bg-[#1CBF9F] text-[10px] font-medium text-[#A6F3ED] hover:bg-[#1CBF9F] hover:brightness-105",
            expanded ? "h-9 w-9 shrink-0" : "h-8 w-8",
            className
          )}
          aria-label="Account menu"
        >
          AB
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-0.5">
            <span className="text-sm font-medium">Account</span>
            <span className="text-xs text-muted-foreground">Signed in</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handleSettings}>
          <Settings className="size-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-destructive focus:bg-destructive/10 focus:text-destructive"
          onSelect={handleLogout}
        >
          <LogOut className="size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
