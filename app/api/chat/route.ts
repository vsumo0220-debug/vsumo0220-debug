import { createOpenAI } from '@ai-sdk/openai'
import { generateText } from 'ai'

const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY })
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const messages = Array.isArray(body.messages) ? body.messages.slice(-20) : []
    if (!messages.length) return NextResponse.json({ error: 'No message supplied.' }, { status: 400 })
    const result = await generateText({
      model: openai('gpt-4o-mini'),
      system: 'You are JARVIS, a sophisticated personal computer assistant. Be calm, concise, intelligent, professional, and helpful. Avoid theatrical language. Keep responses under 120 words unless detail is needed.',
      messages,
    })
    return NextResponse.json({ text: result.text })
  } catch (error) {
    console.error('[v0] Chat service error:', error)
    return NextResponse.json({ error: 'AI SERVICE UNAVAILABLE' }, { status: 502 })
  }
}
