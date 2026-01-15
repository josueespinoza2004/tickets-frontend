import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Tickets e Incidencias - COOPEFACSA R.L.',
  description: 'Tickets e Incidencias - COOPEFACSA R.L.',
  generator: 'Tickets e Incidencias - COOPEFACSA R.L.',
  icons: {
    icon: [
      {
        url: '/coopefacsa.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/coopefacsa.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/coopefacsa.png',
        type: 'image/svg+xml',
      },
    ],
    apple: '/coopefacsa.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
