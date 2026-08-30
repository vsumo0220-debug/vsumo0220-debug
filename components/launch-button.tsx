"use client"

import { useState } from "react"
import { ArrowUpRight, Check } from "lucide-react"

export function LaunchButton() {
  const [started, setStarted] = useState(false)
  return <button type="button" onClick={() => setStarted(true)} className="group flex w-fit items-center gap-3 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">{started ? <>Workspace ready <Check className="size-4 text-accent" /></> : <>Begin a session <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></>}</button>
}
