import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = { title: 'Sumo — Computer Science, AI & Robotics', description: 'Sumo is a student from Laos building useful machines with software, hardware, and AI.' }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en" className="bg-[#101313]"><body>{children}</body></html> }
