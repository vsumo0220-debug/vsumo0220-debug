'use client'

import { useEffect, useMemo, useState } from 'react'
import { Activity, AudioLines, ChevronDown, Copy, Cpu, Globe2, Menu, Mic, PanelRight, Pause, Play, Power, RotateCcw, Search, Send, Settings2, ShieldCheck, Sparkles, Volume2, X, Zap } from 'lucide-react'

type Mode = 'idle' | 'listening' | 'thinking' | 'speaking' | 'searching'
type Message = { role: 'user' | 'assistant'; text: string; time: string }
type SearchResult = { title: string; link: string; snippet?: string; source?: string }

const bootLines = ['INITIALIZING SYSTEM', 'LOADING AI CORE', 'CONNECTING VOICE SYSTEM', 'CONNECTING SEARCH SYSTEM', 'SYSTEM CHECK COMPLETE']

function now() { return new Date().toLocaleTimeString([], { hour12: false }) }

function Core({ mode, onClick }: { mode: Mode; onClick: () => void }) {
  return <button aria-label={`JARVIS core, currently ${mode}. Activate voice input`} className={`core core-${mode}`} onClick={onClick}>
    <span className="core-orbit orbit-a" /><span className="core-orbit orbit-b" /><span className="core-orbit orbit-c" />
    <span className="core-grid" /><span className="core-scan" />
    <span className="core-center"><span className="core-mark">J</span><strong>JARVIS</strong><small>{mode === 'idle' ? 'ONLINE' : mode.toUpperCase()}</small></span>
  </button>
}

function HudPanel({ title, eyebrow, children, className = '' }: { title: string; eyebrow?: string; children: React.ReactNode; className?: string }) {
  return <section className={`hud-panel ${className}`}><div className="panel-heading"><div><span className="eyebrow">{eyebrow || 'SYSTEM MODULE'}</span><h2>{title}</h2></div><span className="panel-dot" /></div>{children}</section>
}

export default function Page() {
  const [booting, setBooting] = useState(true)
  const [bootStep, setBootStep] = useState(0)
  const [mode, setMode] = useState<Mode>('idle')
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([{ role: 'assistant', text: 'Good evening. All systems are operational. How may I assist you?', time: now() }])
  const [results, setResults] = useState<SearchResult[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [panelOpen, setPanelOpen] = useState(true)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [muted, setMuted] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [intensity, setIntensity] = useState(72)
  const [alert, setAlert] = useState('')

  useEffect(() => { const timer = setInterval(() => setBootStep((s) => { if (s >= bootLines.length) { clearInterval(timer); setTimeout(() => setBooting(false), 500); return s } return s + 1 }), 560); return () => clearInterval(timer) }, [])
  useEffect(() => { if (window.innerWidth <= 1050) setPanelOpen(false) }, [])
  useEffect(() => { document.documentElement.style.setProperty('--intensity', String(intensity / 100)) }, [intensity])

  const statusLabel = useMemo(() => ({ idle: 'READY FOR COMMAND', listening: 'LISTENING', thinking: 'PROCESSING REQUEST', searching: 'SEARCHING NETWORK', speaking: 'SPEAKING' }[mode]), [mode])

  async function sendMessage(text = input) {
    const value = text.trim(); if (!value || mode === 'thinking' || mode === 'searching') return
    setInput(''); setMessages((m) => [...m, { role: 'user', text: value, time: now() }])
    const shouldSearch = /\b(search|latest|news|weather|current|today)\b/i.test(value)
    setMode(shouldSearch ? 'searching' : 'thinking')
    try {
      if (shouldSearch) { const r = await fetch('/api/search', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: value }) }); const data = await r.json(); if (!r.ok) throw new Error(data.error); setResults(data.results || []); setSearchQuery(value) }
      const r = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: [...messages, { role: 'user', content: value }].map((m) => ({ role: m.role, content: 'text' in m ? m.text : m.content })) }) }); const data = await r.json(); if (!r.ok) throw new Error(data.error); setMessages((m) => [...m, { role: 'assistant', text: data.text, time: now() }]); setMode('speaking'); if (voiceEnabled && !muted) speak(data.text); else setTimeout(() => setMode('idle'), 900)
    } catch (e) { setAlert(e instanceof Error ? e.message : 'SERVICE UNAVAILABLE'); setMode('idle') }
  }
  async function speak(text: string) { try { const response = await fetch('/api/voice', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) }); if (response.ok) { const audio = new Audio(URL.createObjectURL(await response.blob())); audio.onended = () => setMode('idle'); await audio.play(); return } const data = await response.json().catch(() => ({})); setAlert(data.error || 'ELEVENLABS VOICE UNAVAILABLE'); } catch { setAlert('ELEVENLABS VOICE UNAVAILABLE'); } setMode('idle') }
  function listen() { if (!('webkitSpeechRecognition' in window)) { setAlert('MICROPHONE API NOT AVAILABLE IN THIS BROWSER'); return } const Recognition = (window as Window & { webkitSpeechRecognition: new () => SpeechRecognition }).webkitSpeechRecognition; const recognition = new Recognition(); recognition.lang = 'en-US'; recognition.onstart = () => setMode('listening'); recognition.onresult = (e) => { const transcript = e.results[0][0].transcript; setInput(transcript); setMode('thinking'); setTimeout(() => sendMessage(transcript), 50) }; recognition.onerror = () => { setAlert('MICROPHONE PERMISSION REQUIRED'); setMode('idle') }; recognition.onend = () => { if (mode === 'listening') setMode('idle') }; recognition.start() }
  function clearConversation() { setMessages([{ role: 'assistant', text: 'Conversation cleared. Standing by.', time: now() }]); setResults([]) }

  if (booting) return <main className="boot-screen"><div className="boot-emblem"><span>J</span></div><div className="boot-copy"><p className="eyebrow">STARK INDUSTRIES // PERSONAL AI SYSTEM</p>{bootLines.slice(0, bootStep).map((line, i) => <div key={line} className="boot-line"><span>{String(i + 1).padStart(2, '0')}</span>{line}<b>OK</b></div>)}{bootStep >= bootLines.length && <h1>J.A.R.V.I.S <em>ONLINE</em></h1>}</div></main>

  return <main className="jarvis-shell" style={{ '--intensity': intensity / 100 } as React.CSSProperties}>
    <header className="topbar"><div className="brand"><div className="brand-glyph">J</div><div><span>J.A.R.V.I.S</span><small>PERSONAL AI SYSTEM / V.1.0</small></div></div><div className="topbar-center"><span className="live-indicator" /> SESSION ACTIVE <span className="divider" /> {now()} UTC</div><div className="top-actions"><span className="online-label"><i /> SYSTEM ONLINE</span><button className="icon-button" aria-label="Open settings" onClick={() => setSettingsOpen(true)}><Settings2 size={17} /></button><button className="icon-button mobile-menu" aria-label="Toggle conversation panel" onClick={() => setPanelOpen(!panelOpen)}><Menu size={18} /></button></div></header>
    <div className="workspace">
      <aside className="left-rail"><HudPanel title="System status" eyebrow="TELEMETRY"><div className="telemetry"><div><span>CPU LOAD</span><b>24%</b></div><div className="meter"><i style={{ width: '24%' }} /></div><div><span>MEMORY</span><b>41%</b></div><div className="meter"><i style={{ width: '41%' }} /></div><div><span>NETWORK</span><b className="cyan">CONNECTED</b></div><div className="rail-divider" /><div className="data-row"><span>UPTIME</span><b>04:18:32</b></div><div className="data-row"><span>LATENCY</span><b>18 MS</b></div></div></HudPanel><HudPanel title="Active modules" eyebrow="SUBSYSTEMS"><div className="module-list"><span><Cpu size={14} /> COGNITIVE ENGINE <b>READY</b></span><span><Volume2 size={14} /> VOICE SYNTHESIS <b>READY</b></span><span><Globe2 size={14} /> SEARCH INDEX <b>READY</b></span></div></HudPanel></aside>
      <section className="core-stage"><div className="stage-label"><span className="eyebrow">CORE INTERFACE</span><span className="stage-line" /><span className="eyebrow">NODE 01 / MAIN</span></div><Core mode={mode} onClick={listen} /><p className="core-caption">{mode === 'idle' ? 'Good evening, operator.' : statusLabel}</p><div className="voice-status"><span className={`voice-dot ${mode !== 'idle' ? 'active' : ''}`} /><span>{statusLabel}</span><div className="waveform">{[1,2,3,4,5,6,7,8,9,10,11].map((n) => <i key={n} />)}</div></div><div className="core-controls"><button className="round-control" aria-label="Activate microphone" onClick={listen}><Mic size={19} /></button><button className="round-control primary-control" aria-label="Stop speaking" onClick={() => { window.speechSynthesis?.cancel(); setMode('idle') }}><Pause size={17} /></button><span className="control-hint">TAP CORE TO SPEAK</span></div></section>
      <aside className={`right-rail ${panelOpen ? 'open' : ''}`}><div className="rail-tabs"><button className="active">TRANSMISSIONS</button><button onClick={() => setSettingsOpen(true)}>CONFIG</button><button onClick={() => setPanelOpen(false)} className="close-rail" aria-label="Close panel"><X size={15} /></button></div><div className="conversation">{messages.map((m, i) => <article className={`transmission ${m.role}`} key={`${m.time}-${i}`}><div className="transmission-meta"><span>{m.role === 'assistant' ? 'JARVIS' : 'OPERATOR'}</span><time>{m.time}</time></div><p>{m.text}</p>{m.role === 'assistant' && <div className="message-actions"><button aria-label="Copy response" onClick={() => navigator.clipboard?.writeText(m.text)}><Copy size={12} /></button><button aria-label="Regenerate response" onClick={() => sendMessage(messages[i - 1]?.text || '')}><RotateCcw size={12} /></button></div>}</article>)}</div>{results.length > 0 && <div className="search-results"><div className="search-heading"><span><Search size={13} /> SEARCH INDEX</span><b>COMPLETE</b></div><small>QUERY // {searchQuery}</small>{results.slice(0, 3).map((r, i) => <a href={r.link} target="_blank" rel="noreferrer" key={r.link}><b>0{i + 1} / {r.title}</b><small>{r.source || new URL(r.link).hostname}</small><p>{r.snippet}</p></a>)}</div>}<div className="command-bar"><button aria-label="Microphone" onClick={listen}><Mic size={16} /></button><input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.nativeEvent.isComposing && e.keyCode !== 229) sendMessage() }} placeholder="Speak to JARVIS..." /><button aria-label="Send command" onClick={() => sendMessage()}><Send size={16} /></button></div></aside>
    </div>
    <footer className="bottombar"><span><ShieldCheck size={14} /> ENCRYPTED SESSION</span><span className="footer-center">JARVIS CORE // <b>{mode.toUpperCase()}</b></span><button onClick={clearConversation}><Power size={13} /> CLEAR SESSION</button></footer>
    {alert && <div className="system-alert"><div className="alert-icon"><Zap size={18} /></div><div><span className="eyebrow">SYSTEM ALERT</span><strong>{alert}</strong></div><button aria-label="Dismiss alert" onClick={() => setAlert('')}><X size={15} /></button></div>}
    {settingsOpen && <div className="settings-backdrop" onClick={() => setSettingsOpen(false)}><section className="settings-panel" onClick={(e) => e.stopPropagation()}><div className="panel-heading"><div><span className="eyebrow">SYSTEM CONFIGURATION</span><h2>Preferences</h2></div><button className="icon-button" onClick={() => setSettingsOpen(false)} aria-label="Close settings"><X size={16} /></button></div><label>VOICE OUTPUT <button className={`toggle ${voiceEnabled ? 'on' : ''}`} onClick={() => setVoiceEnabled(!voiceEnabled)}><i /></button></label><label>AUTO-SPEAK RESPONSES <button className={`toggle ${voiceEnabled && !muted ? 'on' : ''}`} onClick={() => setMuted(!muted)}><i /></button></label><label>ANIMATION INTENSITY <output>{intensity}%</output><input type="range" min="20" max="100" value={intensity} onChange={(e) => setIntensity(Number(e.target.value))} /></label><div className="settings-note"><Activity size={15} /> Preferences are stored locally on this device. Provider credentials remain server-side.</div></section></div>}
  </main>
}

declare global { interface Window { webkitSpeechRecognition: new () => SpeechRecognition } interface SpeechRecognition { lang: string; onstart: () => void; onresult: (event: SpeechRecognitionEvent) => void; onerror: () => void; onend: () => void; start: () => void } interface SpeechRecognitionEvent { results: { [index: number]: { [index: number]: { transcript: string } } } } }
