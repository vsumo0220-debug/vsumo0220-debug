import { ArrowUpRight, Command, MoveUpRight } from "lucide-react"
import { LaunchButton } from "@/components/launch-button"

const principles = [
  { number: "01", title: "Make space", text: "Remove the noise. Keep the signal." },
  { number: "02", title: "Move clearly", text: "Small steps compound into meaningful work." },
  { number: "03", title: "Stay curious", text: "The best direction is usually discovered." },
]

export default function Home() {
  return (
    <main className="min-h-screen px-6 py-6 md:px-10 md:py-8">
      <nav className="mx-auto flex max-w-7xl items-center justify-between" aria-label="Main navigation">
        <a href="#top" className="font-mono text-sm tracking-tight text-foreground"><span className="mr-2 text-accent">✳</span>signal</a>
        <div className="hidden items-center gap-8 text-xs uppercase tracking-[0.18em] text-muted-foreground md:flex">
          <a href="#principles" className="transition-colors hover:text-foreground">Principles</a>
          <a href="#start" className="transition-colors hover:text-foreground">Start here</a>
        </div>
        <a href="#start" className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-medium transition-colors hover:border-accent hover:text-accent">Open workspace <ArrowUpRight className="size-3.5" /></a>
      </nav>

      <section id="top" className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-7xl flex-col justify-center py-20">
        <p className="mb-7 font-mono text-xs uppercase tracking-[0.24em] text-accent">A quieter way forward</p>
        <h1 className="max-w-5xl text-balance text-5xl font-semibold leading-[0.96] tracking-[-0.07em] text-foreground sm:text-7xl lg:text-[9rem]">Turn a clear thought into <span className="text-muted-foreground">momentum.</span></h1>
        <div className="mt-12 flex flex-col gap-8 border-t border-border pt-6 sm:flex-row sm:items-start sm:justify-between">
          <p className="max-w-md text-pretty text-base leading-7 text-muted-foreground">Signal is a focused starting point for the work that matters. Capture the idea, find the thread, and keep moving.</p>
          <LaunchButton />
        </div>
      </section>

      <section id="principles" className="mx-auto max-w-7xl border-t border-border py-16 md:py-24">
        <div className="mb-12 flex items-start justify-between gap-6"><p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">How we work</p><Command className="size-5 text-accent" /></div>
        <div className="grid gap-10 md:grid-cols-3 md:gap-8">{principles.map((item) => <article key={item.number} className="group border-t border-border pt-5"><p className="font-mono text-xs text-accent">{item.number}</p><h2 className="mt-12 text-2xl font-medium tracking-tight transition-colors group-hover:text-accent">{item.title}</h2><p className="mt-3 max-w-xs leading-6 text-muted-foreground">{item.text}</p></article>)}</div>
      </section>

      <section id="start" className="mx-auto flex max-w-7xl flex-col gap-8 border-t border-border py-16 md:flex-row md:items-end md:justify-between md:py-24"><div><p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">Ready when you are</p><h2 className="mt-4 max-w-2xl text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">Start with one good question.</h2></div><a href="mailto:hello@signal.work" className="group flex items-center gap-2 pb-2 text-sm text-muted-foreground transition-colors hover:text-foreground">hello@signal.work <MoveUpRight className="size-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" /></a></section>
      <footer className="mx-auto flex max-w-7xl justify-between border-t border-border py-6 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground"><span>© 2026 Signal</span><span>Built for forward motion</span></footer>
    </main>
  )
}
