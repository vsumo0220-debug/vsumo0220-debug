import { createGroq } from '@ai-sdk/groq'
import { generateText } from 'ai'
import { NextResponse } from 'next/server'

const groq = createGroq({ apiKey: process.env.GROQ_API_KEY })

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const messages = Array.isArray(body.messages) ? body.messages.slice(-20) : []
    if (!messages.length) return NextResponse.json({ error: 'No message supplied.' }, { status: 400 })
    const result = await generateText({
      model: groq('openai/gpt-oss-120b'),
      system: 'You are JARVIS, a sophisticated personal computer assistant. Be calm, concise, intelligent, professional, and helpful. Avoid theatrical language. Keep responses under 120 words unless detail is needed.',
      messages,
    })
    return NextResponse.json({ text: result.text })
  } catch (error) {
    console.error('[v0] Chat service error:', error)
    return NextResponse.json({ error: 'AI SERVICE UNAVAILABLE' }, { status: 502 })
  }
}
