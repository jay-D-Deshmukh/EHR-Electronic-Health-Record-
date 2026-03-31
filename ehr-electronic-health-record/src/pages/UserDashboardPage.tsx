import { useId, useMemo, useRef, useState } from "react"
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  Download,
  FileUp,
  FileText,
  Mail,
  Pencil,
  Phone,
  Upload,
} from "lucide-react"

import { SAMPLE_LIBRARY_FILES } from "@/lib/library-files"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

type TimelineEntry = {
  id: string
  period: string
  title: string
  detail: string
  attachment?: string
  eventDate?: string
}

type SummaryRange = "30d" | "90d" | "all"

const INITIAL_TIMELINE: TimelineEntry[] = [
  {
    id: "t1",
    period: "Dec 2022",
    title: "Type 2 diagnosis",
    detail: "A1c: 8.2%",
    eventDate: "2022-12-10",
  },
  {
    id: "t2",
    period: "Jan 2022",
    title: "Pre-diabetic follow-up",
    detail: "Lifestyle counseling",
    eventDate: "2022-01-14",
  },
  {
    id: "t3",
    period: "Jul 2021",
    title: "Annual labs",
    detail: "Fasting glucose elevated",
    eventDate: "2021-07-22",
  },
]

function makeId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`
}

export default function UserDashboardPage() {
  const timelineInputId = useId()
  const timelineInputRef = useRef<HTMLInputElement>(null)

  const [timeline, setTimeline] = useState<TimelineEntry[]>(INITIAL_TIMELINE)
  const [summaryRange, setSummaryRange] = useState<SummaryRange>("90d")
  const [summaryGenerated, setSummaryGenerated] = useState(false)
  const [selectedUploadIds, setSelectedUploadIds] = useState<string[]>([])
  const [generatedTimelineIds, setGeneratedTimelineIds] = useState<string[]>([])
  const [summaryDate, setSummaryDate] = useState("")

  const filteredTimelineForSummary = useMemo(() => {
    if (summaryRange === "all") return timeline
    const days = summaryRange === "30d" ? 30 : 90
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - days)
    return timeline.filter((item) => {
      if (!item.eventDate) return false
      return new Date(item.eventDate) >= cutoff
    })
  }, [summaryRange, timeline])

  const summaryRangeLabel =
    summaryRange === "30d"
      ? "Last 30 days"
      : summaryRange === "90d"
        ? "Last 90 days"
        : "All time"

  const libraryTimelineFiles = useMemo<TimelineEntry[]>(
    () =>
      SAMPLE_LIBRARY_FILES.map((file) => ({
        id: `lib-${file.id}`,
        period: new Date(file.modifiedAt).toLocaleString(undefined, {
          month: "short",
          year: "numeric",
        }),
        title: "Library file available",
        detail: "File from Library section",
        attachment: file.name,
        eventDate: file.modifiedAt.slice(0, 10),
      })),
    []
  )

  const uploadedTimelineFiles = useMemo(() => {
    const timelineUploads = filteredTimelineForSummary.filter((item) => !!item.attachment)
    const combined = [...timelineUploads, ...libraryTimelineFiles]
    const uniqueById = new Map(combined.map((item) => [item.id, item]))
    const result = Array.from(uniqueById.values())
    if (!summaryDate) return result
    return result.filter((item) => (item.eventDate ?? "") === summaryDate)
  }, [filteredTimelineForSummary, libraryTimelineFiles, summaryDate])

  const visibleUploadedIds = useMemo(
    () => new Set(uploadedTimelineFiles.map((item) => item.id)),
    [uploadedTimelineFiles]
  )

  const effectiveSelectedUploadIds = useMemo(
    () => selectedUploadIds.filter((id) => visibleUploadedIds.has(id)),
    [selectedUploadIds, visibleUploadedIds]
  )

  const generatedTimelineEntries = useMemo(
    () => generatedTimelineIds
      .map((id) => uploadedTimelineFiles.find((item) => item.id === id))
      .filter((item): item is TimelineEntry => !!item),
    [generatedTimelineIds, uploadedTimelineFiles]
  )

  const summaryText = useMemo(() => {
    const latestEvent = generatedTimelineEntries[0]
    const timelineSummary = generatedTimelineEntries
      .slice(0, 4)
      .map((item) => {
        const when = item.eventDate ?? item.period
        return `- ${when}: ${item.title} (${item.detail})`
      })
      .join("\n")

    return [
      "Patient Summary",
      "===============",
      "",
      "Patient: Ahmed Ali Hussain",
      "DOB: 12 Dec 1992",
      "Known conditions: Obesity, Uncontrolled Type 2 diabetes mellitus",
      "Recent vitals: BMI 22.4, Weight 92 kg, Height 175 cm, BP 124/80",
      "Barriers: Fear of medication, Fear of insulin",
      `Summary window: ${summaryRangeLabel}`,
      `Uploaded timeline files in window: ${uploadedTimelineFiles.length}`,
      `Files used for generated summary: ${generatedTimelineEntries.length}`,
      "",
      `Latest selected event: ${latestEvent?.period ?? "-"} - ${latestEvent?.title ?? "-"}`,
      "",
      "Timeline highlights derived from uploaded files:",
      timelineSummary || "- No generated summary available yet",
      "",
      `Generated on: ${new Date().toLocaleString()}`,
    ].join("\n")
  }, [generatedTimelineEntries, summaryRangeLabel, uploadedTimelineFiles.length])

  function downloadSummary() {
    const blob = new Blob([summaryText], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `health-summary-${new Date().toISOString().slice(0, 10)}.txt`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  function toggleUploadSelection(id: string) {
    setSelectedUploadIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
    setSummaryGenerated(false)
  }

  function generateSummaryFromSelection() {
    if (uploadedTimelineFiles.length === 0) return
    const selectedEntries = uploadedTimelineFiles.filter((item) =>
      effectiveSelectedUploadIds.includes(item.id)
    )
    const usedEntries =
      selectedEntries.length > 0 ? selectedEntries : [uploadedTimelineFiles[0]]
    setGeneratedTimelineIds(usedEntries.map((item) => item.id))
    setSummaryGenerated(true)
  }

  function addTimelineFromFiles(files: FileList | null) {
    if (!files?.length) return
    const f = files[0]
    const entry: TimelineEntry = {
      id: makeId("tl"),
      period: new Date().toLocaleString(undefined, {
        month: "short",
        year: "numeric",
      }),
      title: "Document uploaded",
      detail: "New file added to your record",
      attachment: f.name,
      eventDate: new Date().toISOString().slice(0, 10),
    }
    setTimeline((prev) => [entry, ...prev])
    setSummaryGenerated(false)
  }

  return (
    <div className="min-h-screen min-w-0 max-w-full overflow-x-hidden bg-[#f6f7f9]">
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 md:px-8 md:py-10">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-[#0f172a] md:text-3xl">
            Your health dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Patient profile overview and timeline — upload files anytime.
          </p>
        </header>

        {/* Patient profile (reference layout, simplified) */}
        <Card className="overflow-hidden border border-gray-200/80 bg-white shadow-sm">
          <CardContent className="p-0">
            <div className="flex flex-col gap-6 p-6 lg:flex-row lg:items-start">
              <div className="flex flex-col items-center gap-3 lg:w-44">
                <div className="flex h-36 w-36 items-center justify-center rounded-2xl bg-linear-to-br from-slate-200 to-slate-100 text-sm font-medium text-slate-600">
                  Photo
                </div>
                <div className="flex gap-2">
                  <span
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-xs text-muted-foreground"
                    title="Non-smoker"
                  >
                    🚭
                  </span>
                  <span
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-xs text-muted-foreground"
                    title="Alcohol"
                  >
                    🍷
                  </span>
                </div>
              </div>

              <div className="min-w-0 flex-1 space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-semibold text-[#0f172a]">
                        Ahmed Ali Hussain
                      </h2>
                      <button
                        type="button"
                        className="rounded-full p-1.5 text-muted-foreground hover:bg-muted"
                        aria-label="Call"
                      >
                        <Phone className="size-4" />
                      </button>
                      <button
                        type="button"
                        className="rounded-full p-1.5 text-muted-foreground hover:bg-muted"
                        aria-label="Email"
                      >
                        <Mail className="size-4" />
                      </button>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Male · El Sheikh Zayed, Giza · Accountant · DOB 12 Dec 1992
                      (33 yrs)
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Pencil className="size-4" />
                    Edit
                  </Button>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-xl border border-gray-100 bg-[#fafafa] px-4 py-3">
                    <p className="text-xs font-medium text-muted-foreground">
                      BMI
                    </p>
                    <p className="mt-1 flex items-baseline gap-2 text-lg font-semibold">
                      22.4
                      <span className="inline-flex items-center gap-0.5 text-xs font-medium text-emerald-600">
                        <ArrowDownRight className="size-3.5" />
                        0.4
                      </span>
                    </p>
                  </div>
                  <div className="rounded-xl border border-gray-100 bg-[#fafafa] px-4 py-3">
                    <p className="text-xs font-medium text-muted-foreground">
                      Weight
                    </p>
                    <p className="mt-1 flex items-baseline gap-2 text-lg font-semibold">
                      92 kg
                      <span className="inline-flex items-center gap-0.5 text-xs font-medium text-emerald-600">
                        <ArrowDownRight className="size-3.5" />1 kg
                      </span>
                    </p>
                  </div>
                  <div className="rounded-xl border border-gray-100 bg-[#fafafa] px-4 py-3">
                    <p className="text-xs font-medium text-muted-foreground">
                      Height
                    </p>
                    <p className="mt-1 text-lg font-semibold">175 cm</p>
                  </div>
                  <div className="rounded-xl border border-gray-100 bg-[#fafafa] px-4 py-3">
                    <p className="text-xs font-medium text-muted-foreground">
                      Blood pressure
                    </p>
                    <p className="mt-1 flex items-baseline gap-2 text-lg font-semibold">
                      124/80
                      <span className="inline-flex items-center gap-0.5 text-xs font-medium text-red-600">
                        <ArrowUpRight className="size-3.5" />
                        4
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-6">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Own diagnosis
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-800">
                        Obesity
                      </span>
                      <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-800">
                        Uncontrolled Type 2
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Health barriers
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-800">
                        Fear of medication
                      </span>
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-800">
                        Fear of insulin
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <Card className="border border-gray-200/80 bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="size-5 text-[#001a5e]" />
                <CardTitle className="text-base font-semibold">
                  Patient summary
                </CardTitle>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex rounded-lg bg-muted p-1">
                  {([
                    ["30d", "30D"],
                    ["90d", "90D"],
                    ["all", "All"],
                  ] as const).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSummaryRange(key)}
                      className={cn(
                        "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                        summaryRange === key
                          ? "bg-white text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <input
                  type="date"
                  value={summaryDate}
                  onChange={(e) => setSummaryDate(e.target.value)}
                  className="h-8 rounded-md border border-gray-200 bg-white px-2 text-xs text-foreground outline-none focus:border-gray-300"
                  aria-label="Select timeline date"
                />
                <Button
                  type="button"
                  size="sm"
                  className="gap-2 bg-[#001a5e] hover:bg-[#001a5e]/90"
                  onClick={downloadSummary}
                  disabled={!summaryGenerated || generatedTimelineEntries.length === 0}
                >
                  <Download className="size-4" />
                  Download summary
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border border-gray-100 bg-[#fafafa] p-4">
                <p className="text-sm leading-6 text-[#334155]">
                  Generate a clinical summary from the uploaded timeline files.
                  The summary engine uses files attached through{" "}
                  <span className="font-medium text-[#0f172a]">
                    Upload to timeline
                  </span>{" "}
                  within{" "}
                  <span className="font-medium text-[#0f172a]">
                    {summaryRangeLabel}
                  </span>{" "}
                  and currently found{" "}
                  <span className="font-medium text-[#0f172a]">
                    {uploadedTimelineFiles.length}
                  </span>
                  upload-based timeline event(s).
                </p>
                <div className="mt-4 rounded-lg border border-gray-200 bg-white p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Select timeline files for summary
                  </p>
                  <div className="mt-2 space-y-2">
                    {uploadedTimelineFiles.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No uploaded files in the selected time range.
                      </p>
                    ) : (
                      uploadedTimelineFiles.map((item) => (
                        <label
                          key={item.id}
                          className="flex cursor-pointer items-start gap-2 rounded-md border border-gray-100 px-2.5 py-2 hover:bg-gray-50"
                        >
                          <input
                            type="checkbox"
                            checked={effectiveSelectedUploadIds.includes(item.id)}
                            onChange={() => toggleUploadSelection(item.id)}
                            className="mt-0.5"
                          />
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-medium text-[#0f172a]">
                              {item.attachment}
                            </span>
                            <span className="block text-xs text-muted-foreground">
                              {item.eventDate ?? item.period}
                            </span>
                          </span>
                        </label>
                      ))
                    )}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    If no timeline is selected, summary uses the most recent uploaded file.
                  </p>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={generateSummaryFromSelection}
                    disabled={uploadedTimelineFiles.length === 0}
                  >
                    Generate summary from uploads
                  </Button>
                  {summaryDate && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setSummaryDate("")}
                    >
                      Clear date
                    </Button>
                  )}
                  <span className="font-medium text-[#0f172a]">
                    {uploadedTimelineFiles.length === 0
                      ? "No files found for the selected timeline date."
                      : summaryGenerated
                        ? generatedTimelineEntries.length === 1 &&
                          effectiveSelectedUploadIds.length === 0
                          ? "Summary generated from most recent uploaded timeline file."
                          : "Summary generated from selected timeline file(s)."
                        : "Select timeline files or generate with most recent file."}
                  </span>
                </div>
                {summaryGenerated && generatedTimelineEntries.length > 0 && (
                  <div className="mt-4 rounded-lg border border-gray-200 bg-white p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Included uploaded files
                    </p>
                    <ul className="mt-2 space-y-1 text-sm text-[#334155]">
                      {generatedTimelineEntries.slice(0, 5).map((item) => (
                        <li key={item.id} className="truncate">
                          - {item.attachment}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Timeline + upload */}
          <Card className="border border-gray-200/80 bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div className="flex items-center gap-2">
                <CalendarDays className="size-5 text-[#001a5e]" />
                <CardTitle className="text-base font-semibold">Timeline</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <input
                  ref={timelineInputRef}
                  id={timelineInputId}
                  type="file"
                  className="sr-only"
                  accept=".pdf,.png,.jpg,.jpeg,.webp"
                  onChange={(e) => {
                    addTimelineFromFiles(e.target.files)
                    e.target.value = ""
                  }}
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="gap-2"
                  onClick={() => timelineInputRef.current?.click()}
                >
                  <FileUp className="size-4" />
                  Upload to timeline
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                {timeline.map((item, index) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="flex w-6 flex-col items-center pt-1">
                      <div className="size-3 shrink-0 rounded-full bg-[#001a5e] ring-4 ring-white" />
                      {index < timeline.length - 1 ? (
                        <div className="mt-2 min-h-13 w-px flex-1 bg-gray-200" />
                      ) : null}
                    </div>
                    <div
                      className={cn(
                        "min-w-0 flex-1",
                        index === timeline.length - 1 ? "pb-0" : "pb-8"
                      )}
                    >
                      <p className="text-xs font-medium text-muted-foreground">
                        {item.period}
                      </p>
                      <p className="mt-1 font-medium text-[#0f172a]">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.detail}</p>
                      {item.attachment ? (
                        <p className="mt-2 inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs text-foreground">
                          <Upload className="size-3.5" />
                          {item.attachment}
                        </p>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
