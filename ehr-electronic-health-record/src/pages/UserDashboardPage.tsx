import { useId, useRef, useState } from "react"
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  ClipboardList,
  FileUp,
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
}

type MedicalDoc = {
  id: string
  name: string
  uploadedAt: string
  type: string
}

const INITIAL_TIMELINE: TimelineEntry[] = [
  {
    id: "t1",
    period: "Dec 2022",
    title: "Type 2 diagnosis",
    detail: "A1c: 8.2%",
  },
  {
    id: "t2",
    period: "Jan 2022",
    title: "Pre-diabetic follow-up",
    detail: "Lifestyle counseling",
  },
  {
    id: "t3",
    period: "Jul 2021",
    title: "Annual labs",
    detail: "Fasting glucose elevated",
  },
]

const INITIAL_DOCS: MedicalDoc[] = [
  {
    id: "d1",
    name: "Lab_report_Dec2024.pdf",
    uploadedAt: "2024-12-02",
    type: "Lab",
  },
  {
    id: "d2",
    name: "Chest_XRay_overview.png",
    uploadedAt: "2024-08-14",
    type: "Imaging",
  },
]

function makeId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`
}

export default function UserDashboardPage() {
  const docsInputId = useId()
  const timelineInputId = useId()
  const docsInputRef = useRef<HTMLInputElement>(null)
  const timelineInputRef = useRef<HTMLInputElement>(null)

  const [timeline, setTimeline] = useState<TimelineEntry[]>(INITIAL_TIMELINE)
  const [documents, setDocuments] = useState<MedicalDoc[]>(INITIAL_DOCS)

  function addDocumentsFromFiles(files: FileList | null) {
    if (!files?.length) return
    const next: MedicalDoc[] = []
    for (let i = 0; i < files.length; i++) {
      const f = files[i]
      next.push({
        id: makeId("doc"),
        name: f.name,
        uploadedAt: new Date().toISOString().slice(0, 10),
        type: "Upload",
      })
    }
    setDocuments((prev) => [...next, ...prev])
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
    }
    setTimeline((prev) => [entry, ...prev])
    setDocuments((prev) => [
      {
        id: makeId("doc"),
        name: f.name,
        uploadedAt: new Date().toISOString().slice(0, 10),
        type: "Timeline",
      },
      ...prev,
    ])
  }

  return (
    <div className="min-h-screen min-w-0 max-w-full overflow-x-hidden bg-[#f6f7f9]">
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 md:px-8 md:py-10">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-[#0f172a] md:text-3xl">
            Your health dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Patient profile overview, document repository, and timeline — upload
            files anytime.
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

        <div className="grid gap-6 lg:grid-cols-2">
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

          {/* Medical documents repository */}
          <Card className="border border-gray-200/80 bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div className="flex items-center gap-2">
                <ClipboardList className="size-5 text-[#001a5e]" />
                <CardTitle className="text-base font-semibold">
                  Medical documents
                </CardTitle>
              </div>
              <div>
                <input
                  ref={docsInputRef}
                  id={docsInputId}
                  type="file"
                  className="sr-only"
                  multiple
                  accept=".pdf,.png,.jpg,.jpeg,.webp"
                  onChange={(e) => {
                    addDocumentsFromFiles(e.target.files)
                    e.target.value = ""
                  }}
                />
                <Button
                  type="button"
                  size="sm"
                  className="gap-2 bg-[#001a5e] hover:bg-[#001a5e]/90"
                  onClick={() => docsInputRef.current?.click()}
                >
                  <Upload className="size-4" />
                  Upload
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="max-w-full overflow-x-auto rounded-lg border border-gray-100">
                <table className="w-full min-w-[280px] text-left text-sm">
                  <thead className="bg-muted/50 text-xs font-medium text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="hidden px-4 py-3 sm:table-cell">Uploaded</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((doc) => (
                      <tr
                        key={doc.id}
                        className={cn(
                          "border-t border-gray-100",
                          "hover:bg-muted/30"
                        )}
                      >
                        <td className="max-w-[200px] truncate px-4 py-3 font-medium">
                          {doc.name}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {doc.type}
                        </td>
                        <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                          {doc.uploadedAt}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                PDF and images are accepted. Files stay in this repository and can
                be linked from timeline uploads.
              </p>
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
