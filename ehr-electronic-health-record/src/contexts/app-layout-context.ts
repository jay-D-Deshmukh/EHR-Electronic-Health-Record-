import { useOutletContext } from "react-router-dom"

export type AppLayoutOutletContext = {
  sidebarExpanded: boolean
  setSidebarExpanded: (value: boolean) => void
  toggleSidebar: () => void
}

export function useAppLayoutOutlet(): AppLayoutOutletContext {
  return useOutletContext<AppLayoutOutletContext>()
}
