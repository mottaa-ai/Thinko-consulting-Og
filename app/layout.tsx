import type { Metadata } from 'next'
import { Montserrat, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { I18nProvider } from '@/lib/i18n'
import './globals.css'

const montserrat = Montserrat({ 
  subsets: ["latin"],
  variable: '--font-headline',
  style: ['normal', 'italic'],
  weight: ['300', '400', '500', '600', '700', '800'],
})

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-body',
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Thinko Consulting | Estrategia tailor-made',
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
    <html lang="es" data-scroll-behavior="smooth" className={`${montserrat.variable} ${inter.variable} scroll-smooth bg-surface`}>
      <body className="font-body antialiased bg-surface text-on-surface">
        <I18nProvider>
          {children}
        </I18nProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
