import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'WA Electrical CE | Short Stop Electrical',
  description: 'Washington State 24-hour continuing education for electrical contractors — Short Stop Electrical LLC',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
