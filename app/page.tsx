import { ArrowUpRight, Cpu, GitBranch, MapPin, Terminal, Zap } from 'lucide-react'

const projects = [
  { title: 'Raspberry Pi Smart AI Assistant', tag: 'HARDWARE / AI', description: 'An always-on assistant exploring voice interfaces, local automation, and helpful robotics.' },
  { title: 'Learning in Public', tag: 'FOUNDATIONS', description: 'Building fluency in C, Python, Git, and computer science fundamentals one project at a time.' },
]

export default function Home() {
  return (
    <main className="shell">
      <nav className="nav"><div className="mark"><span className="mark-dot" />SUMO<span className="muted">.DEV</span></div><a className="nav-link" href="https://github.com/vsumo0220-debug" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={15} /></a></nav>
      <section className="hero"><div className="eyebrow"><Terminal size={15} /> COMPUTER SCIENCE / AI / ROBOTICS</div><h1>Curious mind.<br /><em>Useful machines.</em></h1><p className="intro">I&apos;m Sumo, a student from Laos building at the intersection of software, hardware, and artificial intelligence.</p><div className="actions"><a className="button primary" href="#projects">Explore projects <ArrowUpRight size={16} /></a><a className="button secondary" href="mailto:hello@sumo.dev">Say hello</a></div></section>
      <section className="signal"><div className="signal-label"><span className="live" />NOW EXPLORING</div><div className="signal-text">How can technology feel more <strong>human?</strong></div><Cpu className="signal-icon" size={34} strokeWidth={1.3} /></section>
      <section id="projects" className="content"><div className="section-heading"><span>Selected work</span><span className="count">02 / 02</span></div><div className="project-list">{projects.map((project, index) => <article className="project" key={project.title}><div className="project-number">0{index + 1}</div><div className="project-body"><div className="project-tag">{project.tag}</div><h2>{project.title}</h2><p>{project.description}</p><a href="#" className="project-link">View project <ArrowUpRight size={16} /></a></div><div className="project-art">{index === 0 ? <><Zap size={32} /><span>ONLINE</span></> : <><GitBranch size={32} /><span>BUILD / LEARN</span></>}</div></article>)}</div></section>
      <footer><span><MapPin size={14} /> Based in Laos</span><span>© 2026 Sumo</span></footer>
    </main>
  )
}
