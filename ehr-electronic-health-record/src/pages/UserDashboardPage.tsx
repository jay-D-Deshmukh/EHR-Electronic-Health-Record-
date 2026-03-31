import { useId, useMemo, useRef, useState } from "react"
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  ClipboardList,
  Download,
  FileUp,
  FileText,
  Mail,
  Pencil,
  Phone,
  Upload,
} from "lucide-react"

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

  const summaryText = useMemo(() => {
    const latestEvent = filteredTimelineForSummary[0]
    const timelineSummary = filteredTimelineForSummary
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
      "",
      `Latest timeline event: ${latestEvent?.period ?? "-"} - ${latestEvent?.title ?? "-"}`,
      "",
      "Recent timeline highlights:",
      timelineSummary || "- No events available",
      "",
      `Generated on: ${new Date().toLocaleString()}`,
    ].join("\n")
  }, [filteredTimelineForSummary, summaryRangeLabel])

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
                <Button
                  type="button"
                  size="sm"
                  className="gap-2 bg-[#001a5e] hover:bg-[#001a5e]/90"
                  onClick={downloadSummary}
                >
                  <Download className="size-4" />
                  Download summary
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border border-gray-100 bg-[#fafafa] p-4">
                <p className="text-sm leading-6 text-[#334155]">
                  Ahmed Ali Hussain is currently being managed for obesity and
                  uncontrolled Type 2 diabetes mellitus. Latest recorded vitals
                  indicate BMI 22.4, weight 92 kg, height 175 cm, and blood
                  pressure 124/80. Current care barriers include fear of
                  medication and fear of insulin. The timeline contains{" "}
                  <span className="font-medium text-[#0f172a]">
                    {filteredTimelineForSummary.length}
                  </span>{" "}
                  events in{" "}
                  <span className="font-medium text-[#0f172a]">
                    {summaryRangeLabel}
                  </span>
                  , with the most recent event as{" "}
                  <span className="font-medium text-[#0f172a]">
                    {filteredTimelineForSummary[0]?.title ?? "N/A"}
                  </span>
                  .
                </p>
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

        {/* Medical history snippet (reference) */}
        <Card className="border border-gray-200/80 bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center gap-2">
              <ClipboardList className="size-5 text-[#001a5e]" />
              <CardTitle className="text-base font-semibold">
                Medical history
              </CardTitle>
            </div>
            <Button variant="link" size="sm" className="text-[#001a5e]">
              Edit
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { label: "Chronic disease", value: "Type 2 diabetes mellitus" },
                { label: "Diabetes emergencies", value: "None recorded" },
                { label: "Surgery", value: "Liposuction (2019)" },
                { label: "Family disease", value: "Maternal T2DM" },
              ].map((row) => (
                <div
                  key={row.label}
                  className="rounded-xl border border-gray-100 bg-[#fafafa] p-4"
                >
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {row.label}
                  </p>
                  <p className="mt-2 text-sm font-medium text-[#0f172a]">
                    {row.value}
                  </p>
                </div>
              ))}
              <div className="rounded-xl border border-gray-100 bg-[#fafafa] p-4 sm:col-span-2 lg:col-span-3">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Diabetes-related complication
                </p>
                <p className="mt-2 text-sm font-medium text-[#0f172a]">
                  Early retinopathy screening scheduled; no proliferative changes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
