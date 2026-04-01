import { useMemo, useState } from "react"
import { CalendarDays, ChevronRight, ChevronsUpDown, Plus, Search, UploadCloud, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

type ViewMode = "year" | "month" | "week"
type FilterMode = "all" | "report" | "image" | "prescription" | "lab"
type RecordItem = {
  id: number
  title: string
  date: string
  type: Exclude<FilterMode, "all"> | "document"
  notes: string
  fileName?: string
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

const TYPE_META: Record<RecordItem["type"], { label: string; badge: string; dot: string; icon: string }> = {
  report: { label: "Report", badge: "bg-emerald-100 text-emerald-800", dot: "border-emerald-700", icon: "📄" },
  image: { label: "Imaging", badge: "bg-blue-100 text-blue-800", dot: "border-blue-700", icon: "🩻" },
  prescription: { label: "Prescription", badge: "bg-amber-100 text-amber-800", dot: "border-amber-700", icon: "💊" },
  lab: { label: "Lab Result", badge: "bg-pink-100 text-pink-800", dot: "border-pink-700", icon: "🧪" },
  document: { label: "Document", badge: "bg-lime-100 text-lime-800", dot: "border-lime-700", icon: "📋" },
}

const INITIAL_RECORDS: RecordItem[] = [
  { id: 1, title: "Cardiology follow-up report", date: "2025-11-18", type: "report", notes: "Reviewed ECG results. No arrhythmia detected." },
  { id: 2, title: "Chest X-Ray - AP View", date: "2025-11-18", type: "image", notes: "Clear lung fields." },
  { id: 3, title: "Metformin 500mg prescription", date: "2025-09-03", type: "prescription", notes: "Twice daily with meals." },
  { id: 4, title: "HbA1c & Lipid Panel", date: "2025-09-03", type: "lab", notes: "HbA1c: 6.8%, LDL: 112 mg/dL." },
  { id: 5, title: "Annual Physical Examination", date: "2025-06-14", type: "report", notes: "BP: 128/82. BMI: 24.3." },
]

function fmtDate(date: string) {
  const [y, m, d] = date.split("-")
  return `${Number(d)} ${MONTHS[Number(m) - 1]} ${y}`
}

function weekStartIso(date: string) {
  const d = new Date(`${date}T00:00:00`)
  const s = new Date(d)
  s.setDate(d.getDate() - d.getDay())
  return s.toISOString().slice(0, 10)
}

export default function LibraryPage() {
  const [records, setRecords] = useState<RecordItem[]>(INITIAL_RECORDS)
  const [view, setView] = useState<ViewMode>("year")
  const [filter, setFilter] = useState<FilterMode>("all")
  const [collapseMap, setCollapseMap] = useState<Record<string, boolean>>({})
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [title, setTitle] = useState("")
  const [date, setDate] = useState("")
  const [type, setType] = useState<RecordItem["type"]>("report")
  const [notes, setNotes] = useState("")
  const [fileName, setFileName] = useState("")
  const [search, setSearch] = useState("")

  const filtered = useMemo(() => {
    const base = filter === "all" ? records : records.filter((r) => r.type === filter)
    const q = search.trim().toLowerCase()
    const searched = q
      ? base.filter((r) =>
          [r.title, r.notes, r.fileName ?? ""].some((v) =>
            v.toLowerCase().includes(q)
          )
        )
      : base
    return [...searched].sort((a, b) => b.date.localeCompare(a.date))
  }, [records, filter, search])

  const grouped = useMemo<Record<string, RecordItem[]>>(() => {
    return filtered.reduce<Record<string, RecordItem[]>>((acc, r) => {
      const key =
        view === "year"
          ? r.date.slice(0, 4)
          : view === "month"
            ? r.date.slice(0, 7)
            : weekStartIso(r.date)
      acc[key] ??= []
      acc[key].push(r)
      return acc
    }, {})
  }, [filtered, view])

  const groupKeys = Object.keys(grouped).sort((a, b) => b.localeCompare(a))
  const latestRecord = filtered[0]

  function keyForGroup(key: string) {
    return `${view}:${key}`
  }

  function isOpen(key: string) {
    return collapseMap[keyForGroup(key)] !== false
  }

  function toggleGroup(key: string) {
    setCollapseMap((prev) => ({ ...prev, [keyForGroup(key)]: !isOpen(key) }))
  }

  function openAddModal() {
    setEditingId(null)
    setTitle("")
    setDate(new Date().toISOString().slice(0, 10))
    setType("report")
    setNotes("")
    setFileName("")
    setModalOpen(true)
  }

  function openEditModal(item: RecordItem) {
    setEditingId(item.id)
    setTitle(item.title)
    setDate(item.date)
    setType(item.type)
    setNotes(item.notes)
    setFileName(item.fileName ?? "")
    setModalOpen(true)
  }

  function saveRecord() {
    if (!title.trim() || !date) return
    if (editingId) {
      setRecords((prev) =>
        prev.map((r) =>
          r.id === editingId
            ? { ...r, title: title.trim(), date, type, notes: notes.trim(), fileName }
            : r
        )
      )
    } else {
      setRecords((prev) => [
        {
          id: Math.max(0, ...prev.map((r) => r.id)) + 1,
          title: title.trim(),
          date,
          type,
          notes: notes.trim(),
          fileName,
        },
        ...prev,
      ])
    }
    setModalOpen(false)
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-[#f8fafc] to-[#f2f5f8]">
      <div className="px-3 pt-4 md:px-4">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-[0_1px_8px_rgba(15,23,42,0.04)] md:px-4">
          <p className="text-base font-semibold tracking-tight text-slate-900 md:text-lg">
            Medical Timeline
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <label className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search records"
                className="h-8 w-44 rounded-md border border-slate-200 bg-white pl-8 pr-2 text-xs text-slate-700 outline-none transition-colors focus:border-slate-300 md:w-52"
              />
            </label>
            <div className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
              {(["year", "month", "week"] as const).map((v) => (
                <Button
                  key={v}
                  variant={view === v ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "h-7 rounded-md px-3 text-xs font-medium",
                    view === v
                      ? "bg-slate-900 text-white hover:bg-slate-900"
                      : "text-slate-600 hover:bg-white hover:text-slate-900"
                  )}
                  onClick={() => setView(v)}
                >
                  {v[0].toUpperCase() + v.slice(1)}
                </Button>
              ))}
            </div>
            <div className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1">
              {(["all", "report", "image", "prescription", "lab"] as const).map((f) => (
                <Button
                  key={f}
                  variant={filter === f ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "h-7 rounded-md px-2.5 text-xs font-medium",
                    filter === f
                      ? "bg-slate-900 text-white hover:bg-slate-900"
                      : "text-slate-600 hover:bg-white hover:text-slate-900"
                  )}
                  onClick={() => setFilter(f)}
                >
                  {f === "all" ? "All" : TYPE_META[f].label}
                </Button>
              ))}
            </div>
            <Button
              size="sm"
              className="h-8 rounded-md bg-slate-900 px-3 text-xs font-medium hover:bg-slate-800"
              onClick={openAddModal}
            >
              <Plus className="mr-1 size-4" />
              Add
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-3 py-5 md:px-4 md:py-6">
        {latestRecord && (
          <section className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Latest info
            </p>
            <div className="flex items-start gap-3">
              <div className="mt-1 size-2 rounded-full border-2 border-emerald-700" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span>{TYPE_META[latestRecord.type].icon}</span>
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {latestRecord.title}
                  </p>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-medium",
                      TYPE_META[latestRecord.type].badge
                    )}
                  >
                    {TYPE_META[latestRecord.type].label}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{fmtDate(latestRecord.date)}</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">{latestRecord.notes}</p>
                {latestRecord.fileName && (
                  <p className="mt-1 text-xs text-slate-500">File: {latestRecord.fileName}</p>
                )}
              </div>
            </div>
          </section>
        )}

        {groupKeys.length === 0 ? (
          <div className="rounded-lg border bg-white p-8 text-center text-sm text-slate-500">No records found.</div>
        ) : (
          groupKeys.map((groupKey) => {
            const items = grouped[groupKey] ?? []
            const open = isOpen(groupKey)
            return (
              <section key={groupKey} className="mb-3">
                <button type="button" onClick={() => toggleGroup(groupKey)} className="flex w-full items-center gap-2 rounded-md border bg-white px-3 py-2 text-left">
                  <ChevronRight className={cn("size-4 text-slate-500 transition-transform", open && "rotate-90")} />
                  <span className="flex-1 text-sm font-medium text-slate-800">{groupKey}</span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{items.length}</span>
                </button>
                {open && (
                  <div className="relative mt-2 space-y-2 pl-6 before:absolute before:bottom-2 before:left-[11px] before:top-2 before:w-px before:bg-slate-200">
                    {items.map((r: RecordItem) => (
                      <article key={r.id} className="relative rounded-xl border bg-white p-3">
                        <div className={cn("absolute -left-[18px] top-5 size-3 rounded-full border-2 bg-white", TYPE_META[r.type].dot)} />
                        <div className="mb-2 flex items-start gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span>{TYPE_META[r.type].icon}</span>
                              <p className="truncate text-sm font-medium text-slate-900">{r.title}</p>
                              <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium", TYPE_META[r.type].badge)}>{TYPE_META[r.type].label}</span>
                            </div>
                            <p className="text-xs text-slate-500">{fmtDate(r.date)}</p>
                            <p className="mt-1 text-xs text-slate-600">{r.notes}</p>
                            {r.fileName && (
                              <p className="mt-1 text-xs text-slate-500">File: {r.fileName}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => openEditModal(r)}>Edit</Button>
                          <Button size="sm" variant="outline" onClick={() => setRecords((prev) => prev.filter((x) => x.id !== r.id))}>Delete</Button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            )
          })
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl border bg-white p-4">
            <h3 className="mb-3 text-sm font-semibold text-slate-900">{editingId ? "Edit medical record" : "Add medical record"}</h3>
            <div className="space-y-2">
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className="h-9 w-full rounded-md border px-3 text-sm" />
              <div className="grid grid-cols-2 gap-2">
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-9 justify-between px-3 text-sm font-normal"
                    >
                      <span className="inline-flex items-center gap-2 truncate">
                        <CalendarDays className="size-4 text-slate-500" />
                        {date ? fmtDate(date) : "Pick date"}
                      </span>
                      <ChevronsUpDown className="size-4 text-slate-500" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-72 p-3" align="start">
                    <DropdownMenuLabel className="px-0 pb-2 pt-0 text-xs text-slate-600">
                      Calendar
                    </DropdownMenuLabel>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="h-9 w-full rounded-md border px-3 text-sm"
                    />
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-9 justify-between px-3 text-sm font-normal"
                    >
                      {TYPE_META[type].label}
                      <ChevronsUpDown className="size-4 text-slate-500" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-44" align="start">
                    {(["report", "image", "prescription", "lab", "document"] as const).map(
                      (t) => (
                        <DropdownMenuItem
                          key={t}
                          onSelect={() => setType(t)}
                          className={cn(type === t && "bg-accent")}
                        >
                          {TYPE_META[t].label}
                        </DropdownMenuItem>
                      )
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <label className="flex h-9 cursor-pointer items-center rounded-md border px-3 text-sm text-slate-600 hover:bg-slate-50">
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
                />
                {fileName || "Upload file"}
              </label>
              <label className="block cursor-pointer rounded-md border border-dashed border-slate-300 bg-slate-50/70 p-3 hover:bg-slate-50">
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
                />
                <div className="flex items-start gap-2">
                  <UploadCloud className="mt-0.5 size-4 text-slate-500" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-700">
                      Upload supporting file
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Click to browse PDF, JPG, PNG, or DOCX
                    </p>
                    {fileName && (
                      <span className="mt-2 inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700">
                        <span className="max-w-[180px] truncate">{fileName}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setFileName("")
                          }}
                          className="rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                          aria-label="Remove selected file"
                        >
                          <X className="size-3" />
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              </label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Clinical notes" className="min-h-20 w-full rounded-md border px-3 py-2 text-sm" />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button onClick={saveRecord}>Save record</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
