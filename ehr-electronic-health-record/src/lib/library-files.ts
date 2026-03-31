export type LibraryFileKind = "image" | "document" | "sheet"

export type LibraryFileItem = {
  id: string
  name: string
  kind: LibraryFileKind
  sizeKb: number
  modifiedAt: string
}

export const SAMPLE_LIBRARY_FILES: LibraryFileItem[] = [
  {
    id: "f1",
    name: "John_Walker_Knee_Xray_Mar27.jpeg",
    kind: "image",
    sizeKb: 302,
    modifiedAt: "2026-03-27T09:12:00",
  },
  {
    id: "f2",
    name: "Emily_Johnson_Chest_CT_Mar24.jpeg",
    kind: "image",
    sizeKb: 638,
    modifiedAt: "2026-03-24T11:45:00",
  },
  {
    id: "f3",
    name: "Michael_Brown_Elbow_Xray_Mar23.jpeg",
    kind: "image",
    sizeKb: 117,
    modifiedAt: "2026-03-23T15:18:00",
  },
  {
    id: "f4",
    name: "Discharge_Summary_Sophia_Davis.pdf",
    kind: "document",
    sizeKb: 512,
    modifiedAt: "2026-03-21T18:02:00",
  },
  {
    id: "f5",
    name: "Lab_Report_James_Wilson.pdf",
    kind: "document",
    sizeKb: 253,
    modifiedAt: "2026-03-21T14:36:00",
  },
  {
    id: "f6",
    name: "Cardiology_Notes_Olivia_Martin.pdf",
    kind: "document",
    sizeKb: 512,
    modifiedAt: "2026-03-21T12:21:00",
  },
  {
    id: "f7",
    name: "Followup_Plan_Daniel_Thompson.pdf",
    kind: "document",
    sizeKb: 284,
    modifiedAt: "2026-03-21T10:03:00",
  },
  {
    id: "f8",
    name: "Care_Plan_Ava_Anderson.docx",
    kind: "document",
    sizeKb: 217,
    modifiedAt: "2026-03-12T08:57:00",
  },
  {
    id: "f9",
    name: "Vitals_Trend_March_US_Clinic.xlsx",
    kind: "sheet",
    sizeKb: 156,
    modifiedAt: "2026-03-12T09:18:00",
  },
]
