import type { Metadata } from 'next'
import { Newsreader, Manrope } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const newsreader = Newsreader({ 
  subsets: ["latin"],
  variable: '--font-headline',
  style: ['normal', 'italic'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
})

const manrope = Manrope({ 
  subsets: ["latin"],
  variable: '--font-body',
})

export const metadata: Metadata = {
  title: 'Thinko Consulting | Estrategia TaylorMade',
  description: 'Consultoría de alta precisión en estrategia, opinión pública y análisis político para quienes exigen exclusividad y rigor metodológico.',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${newsreader.variable} ${manrope.variable} scroll-smooth bg-surface`}>
      <body className="font-body antialiased bg-surface text-on-surface">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
