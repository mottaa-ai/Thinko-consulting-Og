"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { saveSection, resetSection } from "@/app/actions/content"
import type { Locale } from "@/lib/i18n/types"
import { FieldEditor } from "./field-editor"

type Props = {
  section: string
  label: string
  /** Default (bundled) content per locale, used as the editing baseline. */
  defaults: Record<Locale, unknown>
  /** Stored overrides per locale (null when using defaults). */
  stored: Record<Locale, unknown>
}

export function ContentEditor({ section, label, defaults, stored }: Props) {
  const router = useRouter()
  const [locale, setLocale] = useState<Locale>("es")

  // Initialize working state by merging stored values over defaults.
  const [values, setValues] = useState<Record<Locale, unknown>>(() => ({
    es: structuredClone(stored.es ?? defaults.es),
    en: structuredClone(stored.en ?? defaults.en),
  }))

  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  function updateValue(next: unknown) {
    setValues((prev) => ({ ...prev, [locale]: next }))
  }

  async function handleSave() {
    setSaving(true)
    setMessage(null)
    try {
      await saveSection(section, locale, values[locale])
      setMessage("Cambios guardados y publicados.")
    } catch {
      setMessage("Error al guardar. Intenta de nuevo.")
    } finally {
      setSaving(false)
    }
  }

  async function handleReset() {
    if (!confirm("¿Restaurar el contenido original de esta sección? Se perderán tus cambios.")) return
    setSaving(true)
    try {
      await resetSection(section, locale)
      setValues((prev) => ({ ...prev, [locale]: structuredClone(defaults[locale]) }))
      setMessage("Sección restaurada al contenido original.")
      router.refresh()
    } catch {
      setMessage("Error al restaurar.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Locale switcher */}
      <div className="flex items-center gap-1 border border-slate-800 w-fit p-1">
        {(["es", "en"] as Locale[]).map((l) => (
          <button
            key={l}
            onClick={() => setLocale(l)}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-colors ${
              locale === l ? "bg-[#00b8b4] text-[#0f172a]" : "text-slate-400 hover:text-white"
            }`}
          >
            {l === "es" ? "Español" : "English"}
          </button>
        ))}
      </div>

      <div className="border border-slate-800 bg-[#1e293b]/30 p-6">
        <FieldEditor value={values[locale]} onChange={updateValue} />
      </div>

      {message && <p className="text-sm text-[#00b8b4]">{message}</p>}

      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#00b8b4] text-[#0f172a] py-3 px-8 font-semibold uppercase tracking-wider text-xs hover:bg-[#00a39f] transition-colors disabled:opacity-50"
        >
          {saving ? "Guardando..." : "Guardar y publicar"}
        </button>
        <button
          onClick={handleReset}
          disabled={saving}
          className="text-xs uppercase tracking-wider text-slate-400 hover:text-red-400 transition-colors disabled:opacity-50"
        >
          Restaurar original
        </button>
      </div>
    </div>
  )
}
