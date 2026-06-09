"use client"

import { useState } from "react"
import { saveTrackingCodes, type TrackingCodes } from "@/app/actions/tracking"

const FIELDS: {
  key: keyof TrackingCodes
  label: string
  description: string
  placeholder: string
}[] = [
  {
    key: "googleAnalytics",
    label: "Google Analytics",
    description: "Pega el fragmento completo de Google Analytics (gtag.js), incluyendo las etiquetas <script>.",
    placeholder: `<!-- Google tag (gtag.js) -->\n<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>\n<script>\n  window.dataLayer = window.dataLayer || [];\n  function gtag(){dataLayer.push(arguments);}\n  gtag('js', new Date());\n  gtag('config', 'G-XXXXXXXXXX');\n</script>`,
  },
  {
    key: "googleTagManager",
    label: "Google Tag Manager",
    description: "Pega el fragmento de Google Tag Manager que va en el <head> de tu sitio.",
    placeholder: `<!-- Google Tag Manager -->\n<script>(function(w,d,s,l,i){...})(window,document,'script','dataLayer','GTM-XXXXXXX');</script>\n<!-- End Google Tag Manager -->`,
  },
  {
    key: "metaPixel",
    label: "Meta Pixel",
    description: "Pega el código base del Meta Pixel (Facebook), incluyendo las etiquetas <script>.",
    placeholder: `<!-- Meta Pixel Code -->\n<script>\n  !function(f,b,e,v,n,t,s){...}(window, document,'script',...);\n  fbq('init', 'YOUR_PIXEL_ID');\n  fbq('track', 'PageView');\n</script>`,
  },
]

export function TrackingEditor({ initial }: { initial: TrackingCodes }) {
  const [values, setValues] = useState<TrackingCodes>(initial)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  function update(key: keyof TrackingCodes, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }))
    setMessage(null)
  }

  async function handleSave() {
    setSaving(true)
    setMessage(null)
    try {
      await saveTrackingCodes(values)
      setMessage("Códigos guardados y publicados en el sitio.")
    } catch {
      setMessage("Error al guardar. Intenta de nuevo.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      {FIELDS.map((field) => (
        <div key={field.key} className="border border-slate-800 bg-[#1e293b]/30 p-6">
          <label htmlFor={field.key} className="block">
            <span className="font-headline text-lg font-light text-white">{field.label}</span>
            <span className="block text-sm text-slate-400 mt-1 leading-relaxed">{field.description}</span>
          </label>
          <textarea
            id={field.key}
            value={values[field.key]}
            onChange={(e) => update(field.key, e.target.value)}
            placeholder={field.placeholder}
            spellCheck={false}
            rows={8}
            className="mt-4 w-full bg-[#0f172a] border border-slate-800 text-slate-200 font-mono text-xs leading-relaxed p-4 focus:border-[#00b8b4] focus:outline-none resize-y"
          />
        </div>
      ))}

      {message && <p className="text-sm text-[#00b8b4]">{message}</p>}

      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#00b8b4] text-[#0f172a] py-3 px-8 font-semibold uppercase tracking-wider text-xs hover:bg-[#00a39f] transition-colors disabled:opacity-50"
        >
          {saving ? "Guardando..." : "Guardar y publicar"}
        </button>
      </div>

      <div className="border-t border-slate-800 pt-6">
        <p className="text-xs text-slate-500 leading-relaxed">
          Estos códigos se insertan automáticamente en el encabezado de todas las páginas del sitio.
          Pega el fragmento completo (incluyendo las etiquetas {"<script>"}) tal como lo entrega cada
          plataforma. Deja un campo vacío para no cargar ese servicio.
        </p>
      </div>
    </div>
  )
}
