import type { Metadata } from 'next'
import { Montserrat, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { I18nProvider } from '@/lib/i18n'
import { getContentOverrides, getTrackingCodes } from '@/lib/content-store'
import { TrackingScripts } from '@/components/tracking-scripts'
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
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const overrides = await getContentOverrides()
  const tracking = await getTrackingCodes()
  return (
    <html lang="es" data-scroll-behavior="smooth" className={`${montserrat.variable} ${inter.variable} scroll-smooth bg-surface`}>
      <body className="font-body antialiased bg-surface text-on-surface">
        <TrackingScripts
          metaPixel={tracking.metaPixel}
          googleAnalytics={tracking.googleAnalytics}
          googleTagManager={tracking.googleTagManager}
        />
        <I18nProvider overrides={overrides}>
          {children}
        </I18nProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
