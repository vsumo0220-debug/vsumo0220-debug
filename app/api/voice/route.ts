import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { text } = await request.json()
    if (typeof text !== 'string' || !text.trim()) return NextResponse.json({ error: 'Text is required.' }, { status: 400 })
    const voiceId = process.env.ELEVENLABS_VOICE_ID
    if (!process.env.ELEVENLABS_API_KEY || !voiceId) return NextResponse.json({ error: 'VOICE SERVICE NOT CONFIGURED' }, { status: 503 })
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}`, { method: 'POST', headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY, 'Content-Type': 'application/json', Accept: 'audio/mpeg' }, body: JSON.stringify({ text: text.trim(), model_id: 'eleven_multilingual_v2', voice_settings: { stability: 0.55, similarity_boost: 0.75 } }) })
    if (!response.ok) throw new Error(`ElevenLabs ${response.status}`)
    return new NextResponse(await response.arrayBuffer(), { headers: { 'Content-Type': 'audio/mpeg', 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('[v0] Voice service error:', error)
    return NextResponse.json({ error: 'VOICE SERVICE UNAVAILABLE' }, { status: 502 })
  }
}
