import {

  Image as ImageIcon,

  Lightbulb,


  Plus,

  Telescope,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  // DropdownMenuSub,
  // DropdownMenuSubContent,
  // DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

type PlusChatMenuProps = {
  triggerClassName?: string
}

export function PlusChatMenu({ triggerClassName }: PlusChatMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            "h-9 w-9 shrink-0 rounded-full text-[#0D0D0D] hover:bg-gray-50",
            triggerClassName
          )}
          aria-label="Add — more options"
        >
          <Plus className="size-4" strokeWidth={2} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        side="bottom"
        sideOffset={8}
        className="w-[min(100vw-2rem,20rem)] rounded-xl border border-gray-200/80 bg-white p-1 shadow-lg"
      >
        <DropdownMenuItem
          className="flex cursor-pointer flex-col items-stretch gap-1 rounded-lg px-3 py-2.5 focus:bg-gray-100"
          onSelect={() => { }}
        >
        </DropdownMenuItem>



        <DropdownMenuItem
          className="cursor-pointer gap-2 rounded-lg px-3 py-2 focus:bg-gray-100"
          onSelect={() => { }}
        >
          <ImageIcon className="size-4" />
          Attach documents
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer gap-2 rounded-lg px-3 py-2 focus:bg-gray-100"
          onSelect={() => { }}
        >
          <Lightbulb className="size-4" />
          Provide vitals
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer gap-2 rounded-lg px-3 py-2 focus:bg-gray-100"
          onSelect={() => { }}
        >
          <Telescope className="size-4" />
          Upload lab report
        </DropdownMenuItem>


      </DropdownMenuContent>
    </DropdownMenu>
  )
}
