import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { query } = await request.json()
    if (typeof query !== 'string' || query.trim().length < 2) return NextResponse.json({ error: 'A search query is required.' }, { status: 400 })
    const url = new URL('https://www.searchapi.io/api/v1/search')
    url.searchParams.set('engine', 'google'); url.searchParams.set('q', query.trim()); url.searchParams.set('api_key', process.env.SEARCHAPI_KEY || '')
    const response = await fetch(url, { cache: 'no-store' })
    if (!response.ok) throw new Error(`SearchAPI ${response.status}`)
    const data = await response.json()
    const results = (data.organic_results || []).map((item: { title?: string; link?: string; snippet?: string; source?: string }) => ({ title: item.title || 'Untitled result', link: item.link || '#', snippet: item.snippet || '', source: item.source || '' }))
    return NextResponse.json({ results })
  } catch (error) {
    console.error('[v0] Search service error:', error)
    return NextResponse.json({ error: 'SEARCH SERVICE UNAVAILABLE' }, { status: 502 })
  }
}
