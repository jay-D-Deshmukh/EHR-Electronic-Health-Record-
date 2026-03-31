import { useEffect, useMemo, useRef, useState } from "react"
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  FileImage,
  FileSpreadsheet,
  FileText,
  Grid2X2,
  List,
  LoaderCircle,
  Search,
  Upload,
  UploadCloud,
  X,
} from "lucide-react"

import { cn } from "@/lib/utils"

type FileKind = "image" | "document" | "sheet"
type LibraryItem = {
  id: string
  name: string
  kind: FileKind
  sizeKb: number
  modifiedAt: string
}

const SAMPLE_FILES: LibraryItem[] = [
  { id: "f1", name: "John_Walker_Knee_Xray_Mar27.jpeg", kind: "image", sizeKb: 302, modifiedAt: "2026-03-27T09:12:00" },
  { id: "f2", name: "Emily_Johnson_Chest_CT_Mar24.jpeg", kind: "image", sizeKb: 638, modifiedAt: "2026-03-24T11:45:00" },
  { id: "f3", name: "Michael_Brown_Elbow_Xray_Mar23.jpeg", kind: "image", sizeKb: 117, modifiedAt: "2026-03-23T15:18:00" },
  { id: "f4", name: "Discharge_Summary_Sophia_Davis.pdf", kind: "document", sizeKb: 512, modifiedAt: "2026-03-21T18:02:00" },
  { id: "f5", name: "Lab_Report_James_Wilson.pdf", kind: "document", sizeKb: 253, modifiedAt: "2026-03-21T14:36:00" },
  { id: "f6", name: "Cardiology_Notes_Olivia_Martin.pdf", kind: "document", sizeKb: 512, modifiedAt: "2026-03-21T12:21:00" },
  { id: "f7", name: "Followup_Plan_Daniel_Thompson.pdf", kind: "document", sizeKb: 284, modifiedAt: "2026-03-21T10:03:00" },
  { id: "f8", name: "Care_Plan_Ava_Anderson.docx", kind: "document", sizeKb: 217, modifiedAt: "2026-03-12T08:57:00" },
  { id: "f9", name: "Vitals_Trend_March_US_Clinic.xlsx", kind: "sheet", sizeKb: 156, modifiedAt: "2026-03-12T09:18:00" },
]

type ViewMode = "list" | "grid"
type FilterMode = "all" | "images" | "files"
type UploadStatus = "queued" | "uploading" | "done"
type UploadItem = {
  id: string
  file: File
  progress: number
  status: UploadStatus
}

function formatDateHeading(input: string) {
  return new Date(input).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function formatTime(input: string) {
  return new Date(input).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })
}

function formatSize(kb: number) {
  if (kb >= 1024) return `${(kb / 1024).toFixed(1)} MB`
  return `${kb} KB`
}

function iconForKind(kind: FileKind) {
  if (kind === "image") return <FileImage className="size-4 text-blue-500" />
  if (kind === "sheet") return <FileSpreadsheet className="size-4 text-emerald-600" />
  return <FileText className="size-4 text-rose-500" />
}

export default function LibraryPage() {
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<FilterMode>("all")
  const [view, setView] = useState<ViewMode>("list")
  const [uploadOpen, setUploadOpen] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [uploads, setUploads] = useState<UploadItem[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [openDates, setOpenDates] = useState<Record<string, boolean>>({
    "2026-03-27": true,
    "2026-03-24": true,
    "2026-03-23": false,
    "2026-03-21": true,
    "2026-03-12": false,
  })

  const filtered = useMemo(() => {
    return SAMPLE_FILES.filter((file) => {
      const matchesQuery = file.name.toLowerCase().includes(query.toLowerCase())
      const matchesFilter =
        filter === "all" ||
        (filter === "images" && file.kind === "image") ||
        (filter === "files" && file.kind !== "image")
      return matchesQuery && matchesFilter
    }).sort((a, b) => +new Date(b.modifiedAt) - +new Date(a.modifiedAt))
  }, [query, filter])

  const grouped = useMemo(() => {
    return filtered.reduce<Record<string, LibraryItem[]>>((acc, item) => {
      const day = item.modifiedAt.slice(0, 10)
      acc[day] ??= []
      acc[day].push(item)
      return acc
    }, {})
  }, [filtered])

  function toggleDate(day: string) {
    setOpenDates((prev) => ({ ...prev, [day]: !prev[day] }))
  }

  const dateKeys = Object.keys(grouped).sort((a, b) => +new Date(b) - +new Date(a))

  useEffect(() => {
    const timer = window.setInterval(() => {
      setUploads((prev) =>
        prev.map((item) => {
          if (item.status === "done") return item
          const next = Math.min(item.progress + 12, 100)
          return {
            ...item,
            progress: next,
            status: next >= 100 ? "done" : "uploading",
          }
        })
      )
    }, 260)

    return () => window.clearInterval(timer)
  }, [])

  function toUploadItem(file: File): UploadItem {
    return {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      file,
      progress: 0,
      status: "queued",
    }
  }

  function onFilesAdded(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return
    const next = Array.from(fileList).map(toUploadItem)
    setUploads((prev) => [...next, ...prev])
    setUploadOpen(true)
  }

  function removeUpload(id: string) {
    setUploads((prev) => prev.filter((item) => item.id !== id))
  }

  function clearCompleted() {
    setUploads((prev) => prev.filter((item) => item.status !== "done"))
  }

  return (
    <div className="min-h-screen bg-white px-5 py-6 md:px-8">
      <div className="mx-auto w-full max-w-6xl rounded-3xl border border-[#e8ecef] bg-white/95 p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)] backdrop-blur-sm md:p-7">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-semibold tracking-tight text-[#171717]">Library</h1>
          <button
            type="button"
            onClick={() => {
              setUploadOpen(true)
              fileInputRef.current?.click()
            }}
            className="inline-flex items-center gap-2 rounded-full bg-[#111] px-4 py-2 text-sm font-medium text-white shadow-[0_4px_12px_rgba(17,17,17,0.24)] transition-all hover:-translate-y-0.5 hover:bg-black"
          >
            <Upload className="size-4" />
            Upload
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => {
              onFilesAdded(e.target.files)
              e.currentTarget.value = ""
            }}
          />
        </div>

        {uploadOpen && (
          <section className="mb-5 overflow-hidden rounded-2xl border border-[#e7ebf0] bg-white shadow-[0_6px_18px_rgba(15,23,42,0.06)]">
            <div className="flex items-center justify-between border-b border-[#eef1f4] px-4 py-3">
              <h2 className="text-sm font-semibold text-gray-800">Upload files</h2>
              <div className="flex items-center gap-2">
                {uploads.some((item) => item.status === "done") && (
                  <button
                    type="button"
                    onClick={clearCompleted}
                    className="rounded-md px-2.5 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-800"
                  >
                    Clear completed
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setUploadOpen(false)}
                  className="inline-flex size-7 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
                  aria-label="Close upload panel"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            <div className="grid gap-4 p-4 md:grid-cols-[1.1fr_1fr]">
              <div
                role="button"
                tabIndex={0}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    fileInputRef.current?.click()
                  }
                }}
                onDragOver={(e) => {
                  e.preventDefault()
                  setDragOver(true)
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault()
                  setDragOver(false)
                  onFilesAdded(e.dataTransfer.files)
                }}
                className={cn(
                  "flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-5 text-center transition-all",
                  dragOver
                    ? "border-gray-500 bg-gray-50"
                    : "border-[#d8dee5] bg-[#fbfcfd] hover:border-gray-400 hover:bg-gray-50"
                )}
              >
                <UploadCloud className="mb-2 size-8 text-gray-500" />
                <p className="text-sm font-semibold text-gray-800">
                  Drag and drop files here
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  or click to browse (PDF, JPG, PNG, DOCX, XLSX)
                </p>
              </div>

              <div className="rounded-xl border border-[#e9edf2] bg-[#fcfdff] p-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Upload queue
                  </p>
                  <p className="text-xs text-gray-500">{uploads.length} file(s)</p>
                </div>
                <div className="max-h-44 space-y-2 overflow-y-auto pr-1">
                  {uploads.length === 0 ? (
                    <p className="rounded-lg border border-dashed border-gray-200 bg-white px-3 py-4 text-xs text-gray-500">
                      No files selected yet.
                    </p>
                  ) : (
                    uploads.map((item) => (
                      <article key={item.id} className="rounded-lg border border-gray-200 bg-white p-2.5">
                        <div className="mb-1 flex items-center justify-between gap-2">
                          <p className="truncate text-xs font-medium text-gray-800">
                            {item.file.name}
                          </p>
                          <button
                            type="button"
                            onClick={() => removeUpload(item.id)}
                            className="inline-flex size-5 items-center justify-center rounded text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                            aria-label={`Remove ${item.file.name}`}
                          >
                            <X className="size-3.5" />
                          </button>
                        </div>
                        <div className="mb-1 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                          <div
                            className="h-full rounded-full bg-gray-700 transition-all duration-300"
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-[11px] text-gray-500">
                            {formatSize(Math.max(1, Math.round(item.file.size / 1024)))}
                          </p>
                          <span className="inline-flex items-center gap-1 text-[11px] text-gray-500">
                            {item.status === "done" ? (
                              <>
                                <CheckCircle2 className="size-3.5 text-emerald-600" />
                                Completed
                              </>
                            ) : (
                              <>
                                <LoaderCircle className="size-3.5 animate-spin" />
                                Uploading {item.progress}%
                              </>
                            )}
                          </span>
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex rounded-xl bg-[#f3f4f6] p-1">
            {(["all", "images", "files"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-all",
                  filter === tab
                    ? "bg-white text-gray-900 shadow-[0_1px_4px_rgba(15,23,42,0.08)]"
                    : "text-gray-500 hover:text-gray-900"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                className="h-10 w-56 rounded-full border border-gray-200 bg-white pl-9 pr-3 text-sm outline-none transition-all focus:border-gray-300 focus:ring-4 focus:ring-gray-100 md:w-72"
              />
            </label>
            <div className="inline-flex rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setView("list")}
                className={cn(
                  "rounded-md p-2 transition-colors",
                  view === "list" ? "bg-gray-100 text-gray-900" : "text-gray-500"
                )}
                aria-label="List view"
              >
                <List className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setView("grid")}
                className={cn(
                  "rounded-md p-2 transition-colors",
                  view === "grid" ? "bg-gray-100 text-gray-900" : "text-gray-500"
                )}
                aria-label="Grid view"
              >
                <Grid2X2 className="size-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200">
          <div className="hidden grid-cols-[minmax(240px,1.7fr)_1fr_120px] gap-3 border-b border-gray-200/80 px-4 py-3 text-sm font-medium text-gray-500 md:grid">
            <span>Name</span>
            <span>Modified</span>
            <span>Size</span>
          </div>

          <div className="max-h-[65vh] overflow-y-auto">
            {dateKeys.length === 0 ? (
              <p className="px-4 py-8 text-sm text-muted-foreground">
                No files found for this filter.
              </p>
            ) : (
              <div className="divide-y divide-gray-100">
                {dateKeys.map((day) => {
                  const items = grouped[day]
                  const isOpen = !!openDates[day]
                  return (
                    <section key={day}>
                      <button
                        type="button"
                        onClick={() => toggleDate(day)}
                        className="flex w-full items-center justify-between bg-linear-to-r from-[#f8fafc] to-[#f3f4f6] px-4 py-2 text-left transition-colors hover:from-[#f3f4f6] hover:to-[#eef2f7]"
                      >
                        <span className="inline-flex items-center gap-2 text-sm font-semibold text-gray-800">
                          {isOpen ? (
                            <ChevronDown className="size-4 text-gray-500" />
                          ) : (
                            <ChevronRight className="size-4 text-gray-500" />
                          )}
                          {formatDateHeading(day)}
                          <span className="text-xs font-medium text-gray-500">
                            ({items.length})
                          </span>
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatSize(items.reduce((sum, item) => sum + item.sizeKb, 0))}
                        </span>
                      </button>

                      {isOpen && (
                        <div
                          className={cn(
                            "p-2",
                            view === "grid" ? "grid gap-2 md:grid-cols-2" : "space-y-1"
                          )}
                        >
                          {items.map((item) => (
                            <article
                              key={item.id}
                              className={cn(
                                "rounded-xl border border-transparent px-3 py-2 transition-all hover:border-[#e7ebf0] hover:bg-[#f8fafc]",
                                view === "list"
                                  ? "grid items-center gap-2 md:grid-cols-[minmax(240px,1.7fr)_1fr_120px]"
                                  : "flex items-center justify-between"
                              )}
                            >
                              <div className="min-w-0">
                                <p className="inline-flex min-w-0 items-center gap-2 text-sm font-medium text-gray-800">
                                  {iconForKind(item.kind)}
                                  <span className="truncate">{item.name}</span>
                                </p>
                                {view === "grid" && (
                                  <p className="mt-1 text-xs text-gray-500">{formatDateHeading(item.modifiedAt)}</p>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">
                                {formatDateHeading(item.modifiedAt)} at {formatTime(item.modifiedAt)}
                              </p>
                              <p className="text-sm text-gray-600">{formatSize(item.sizeKb)}</p>
                            </article>
                          ))}
                        </div>
                      )}
                    </section>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
