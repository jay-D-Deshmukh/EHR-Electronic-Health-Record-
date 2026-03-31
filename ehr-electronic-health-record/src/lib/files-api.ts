export type ApiFileItem = {
  id: string
  name: string
  path: string
  type?: string
  updatedAt?: string
}

const fallbackFiles: ApiFileItem[] = [
  {
    id: "f1",
    name: "cbc-report-mar-2026.pdf",
    path: "/reports/labs/cbc-report-mar-2026.pdf",
    type: "PDF",
    updatedAt: "2026-03-28",
  },
  {
    id: "f2",
    name: "xray-chest-pa-view.png",
    path: "/reports/imaging/xray-chest-pa-view.png",
    type: "Image",
    updatedAt: "2026-03-18",
  },
  {
    id: "f3",
    name: "thyroid-panel-jan-2026.pdf",
    path: "/reports/labs/thyroid-panel-jan-2026.pdf",
    type: "PDF",
    updatedAt: "2026-01-20",
  },
  {
    id: "f4",
    name: "ecg-resting-2026-02-11.jpg",
    path: "/reports/cardio/ecg-resting-2026-02-11.jpg",
    type: "Image",
    updatedAt: "2026-02-11",
  },
]

function filterFiles(items: ApiFileItem[], query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return items
  return items.filter(
    (f) =>
      f.name.toLowerCase().includes(q) ||
      f.path.toLowerCase().includes(q) ||
      (f.type ?? "").toLowerCase().includes(q)
  )
}

export async function searchFilesFromApi(query: string): Promise<ApiFileItem[]> {
  try {
    const res = await fetch(`/api/files?search=${encodeURIComponent(query)}`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = (await res.json()) as { files?: ApiFileItem[] } | ApiFileItem[]
    const files = Array.isArray(data) ? data : (data.files ?? [])
    return filterFiles(files, query)
  } catch {
    await new Promise((r) => setTimeout(r, 120))
    return filterFiles(fallbackFiles, query)
  }
}

