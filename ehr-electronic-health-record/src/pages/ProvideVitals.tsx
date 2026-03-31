import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react"
import { motion } from "framer-motion"
import { File, Mic, Send } from "lucide-react"

import { PlusChatMenu } from "@/components/provide-vitals/PlusChatMenu"
import { Card } from "@/components/ui/card"
import type { ApiFileItem } from "@/lib/files-api"
import { searchFilesFromApi } from "@/lib/files-api"
import { cn } from "@/lib/utils"

/** ~20% smaller than original query bar / hero (scale 0.8) */
const Q = {
  maxW: "max-w-[732px]", // 915 * 0.8
  barH: "h-[51px] md:h-[62px]", // 64, 78 * 0.8
  title:
    "text-[22px] font-semibold leading-tight tracking-[-0.85px] text-[#1B1B1B] md:text-[27px] md:leading-[41px]",
  input: "text-base font-normal text-[#1B1B1B] outline-none placeholder:text-[#989898] md:text-[15px]",
  shadow:
    "shadow-[0px_0px_32px_0px_rgba(0,0,0,0.02)] focus-within:shadow-[0_0_0_2px_rgba(0,0,0,0.05),0_8px_12px_-3px_rgba(0,0,0,0.1)]",
} as const

const springContent = { type: "spring" as const, stiffness: 320, damping: 34 }
const springCard = { type: "spring" as const, stiffness: 300, damping: 32, delay: 0.06 }

export default function ProvideVitals() {
  const [prompt, setPrompt] = useState("")
  const [caretPos, setCaretPos] = useState(0)
  const [mentionQuery, setMentionQuery] = useState("")
  const [mentionStart, setMentionStart] = useState<number | null>(null)
  const [fileResults, setFileResults] = useState<ApiFileItem[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [loadingFiles, setLoadingFiles] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const canSend = prompt.trim().length > 0
  const mentionOpen = mentionStart !== null

  const mentionContext = useMemo(() => {
    const uptoCaret = prompt.slice(0, caretPos)
    const match = /(?:^|\s)@([^\s@]*)$/.exec(uptoCaret)
    if (!match) return null
    const query = match[1] ?? ""
    const start = uptoCaret.length - query.length - 1
    return { query, start }
  }, [prompt, caretPos])

  useEffect(() => {
    if (!mentionContext) {
      setMentionStart(null)
      setMentionQuery("")
      setFileResults([])
      setActiveIndex(0)
      return
    }
    setMentionStart(mentionContext.start)
    setMentionQuery(mentionContext.query)
  }, [mentionContext])

  useEffect(() => {
    if (!mentionOpen) return
    let alive = true
    setLoadingFiles(true)
    searchFilesFromApi(mentionQuery)
      .then((files) => {
        if (!alive) return
        setFileResults(files)
        setActiveIndex(0)
      })
      .finally(() => {
        if (!alive) return
        setLoadingFiles(false)
      })
    return () => {
      alive = false
    }
  }, [mentionOpen, mentionQuery])

  function insertMention(file: ApiFileItem) {
    if (mentionStart === null) return
    const end = caretPos
    const before = prompt.slice(0, mentionStart)
    const after = prompt.slice(end)
    const token = `@${file.name} `
    const next = `${before}${token}${after}`
    const nextCaret = before.length + token.length
    setPrompt(next)
    setMentionStart(null)
    setMentionQuery("")
    setFileResults([])
    requestAnimationFrame(() => {
      inputRef.current?.focus()
      inputRef.current?.setSelectionRange(nextCaret, nextCaret)
      setCaretPos(nextCaret)
    })
  }

  function onInputKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (!mentionOpen) return
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIndex((prev) => (fileResults.length ? (prev + 1) % fileResults.length : 0))
      return
    }
    if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIndex((prev) =>
        fileResults.length ? (prev - 1 + fileResults.length) % fileResults.length : 0
      )
      return
    }
    if (e.key === "Enter" && fileResults[activeIndex]) {
      e.preventDefault()
      insertMention(fileResults[activeIndex])
      return
    }
    if (e.key === "Escape") {
      e.preventDefault()
      setMentionStart(null)
      setMentionQuery("")
      setFileResults([])
    }
  }

  return (
    <div className="relative flex min-h-screen w-full min-w-0 max-w-full flex-col items-center justify-center bg-white px-6 pb-20 md:pb-0">
      <motion.div
        className="mb-8 max-w-3xl w-full text-center"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springContent}
      >
        <h1 className={Q.title}>
          Provide vitals or upload the lab report or upload x-ray image.
        </h1>
      </motion.div>

      <motion.div
        className={cn("relative w-full px-4", Q.maxW)}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springCard}
      >
        <Card
          className={cn(
            "flex w-full flex-row items-center gap-0 rounded-full border border-[#E8E8E8] bg-white p-0 px-3 ring-0",
            Q.barH,
            "md:px-5",
            Q.shadow
          )}
        >
          <div className="shrink-0 [&_button]:hover:bg-gray-50">
            <PlusChatMenu />
          </div>

          <input
            ref={inputRef}
            type="text"
            placeholder="Ask anything"
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value)
              setCaretPos(e.currentTarget.selectionStart ?? e.currentTarget.value.length)
            }}
            onClick={(e) => setCaretPos(e.currentTarget.selectionStart ?? 0)}
            onKeyUp={(e) => setCaretPos(e.currentTarget.selectionStart ?? 0)}
            onSelect={(e) => setCaretPos(e.currentTarget.selectionStart ?? 0)}
            onKeyDown={onInputKeyDown}
            className={cn(
              "min-w-0 flex-1 border-none bg-transparent px-3",
              Q.input
            )}
          />

          <div className="flex items-center space-x-1.5 md:space-x-3">
            <motion.button
              type="button"
              className="rounded-full p-1.5 transition-colors hover:bg-gray-50"
              aria-label="Microphone"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <Mic className="size-[14px] text-[#1B1B1B]" />
            </motion.button>

            <motion.button
              type="button"
              disabled={!canSend}
              className={cn(
                "flex size-8 items-center justify-center rounded-full bg-[#0D0D0D] transition-colors hover:bg-gray-800 disabled:opacity-50 disabled:hover:bg-[#0D0D0D]",
                "md:size-9 md:h-9"
              )}
              aria-label="Send"
              whileHover={canSend ? { scale: 1.05 } : undefined}
              whileTap={canSend ? { scale: 0.95 } : undefined}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <Send className="size-4 text-white" />
            </motion.button>
          </div>
        </Card>

        {mentionOpen && (
          <div className="absolute left-6 right-6 top-full z-40 mt-2 rounded-xl border border-gray-200 bg-white p-2 shadow-lg md:left-8 md:right-8">
            <div className="mb-2 rounded-md border border-gray-200 bg-gray-50 px-2 py-1.5">
              <input
                value={mentionQuery}
                onChange={(e) => {
                  const q = e.target.value
                  setMentionQuery(q)
                  if (mentionStart !== null) {
                    const before = prompt.slice(0, mentionStart)
                    const after = prompt.slice(caretPos)
                    const next = `${before}@${q}${after}`
                    const nextCaret = before.length + q.length + 1
                    setPrompt(next)
                    setCaretPos(nextCaret)
                    requestAnimationFrame(() => {
                      inputRef.current?.focus()
                      inputRef.current?.setSelectionRange(nextCaret, nextCaret)
                    })
                  }
                }}
                placeholder="Search files"
                className="w-full bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>

            <div className="max-h-56 overflow-y-auto">
              {loadingFiles ? (
                <p className="px-2 py-3 text-xs text-muted-foreground">Loading files...</p>
              ) : fileResults.length === 0 ? (
                <p className="px-2 py-3 text-xs text-muted-foreground">No files found</p>
              ) : (
                <ul className="space-y-1">
                  {fileResults.map((file, idx) => (
                    <li key={file.id}>
                      <button
                        type="button"
                        onClick={() => insertMention(file)}
                        className={cn(
                          "flex w-full items-start gap-2 rounded-lg px-2 py-1.5 text-left",
                          idx === activeIndex ? "bg-gray-100" : "hover:bg-gray-50"
                        )}
                      >
                        <File className="mt-0.5 size-3.5 text-muted-foreground" />
                        <span className="min-w-0">
                          <span className="block truncate text-xs font-medium text-foreground">
                            {file.name}
                          </span>
                          <span className="block truncate text-[11px] text-muted-foreground">
                            {file.path}
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
