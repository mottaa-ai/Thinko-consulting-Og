"use client"

// Human-readable labels for known JSON keys. Falls back to the raw key.
const LABELS: Record<string, string> = {
  tagline: "Etiqueta",
  title: "Título",
  titleHighlight: "Título destacado",
  subtitle: "Subtítulo",
  label: "Etiqueta",
  description: "Descripción",
  quote: "Cita",
  backgroundText: "Texto de fondo",
  name: "Nombre",
  role: "Cargo",
  bio: "Biografía",
  email: "Correo",
  company: "Empresa",
  message: "Mensaje",
  submit: "Botón enviar",
  submitting: "Texto enviando",
  successTitle: "Título de éxito",
  successMessage: "Mensaje de éxito",
  errorTitle: "Título de error",
  errorMessage: "Mensaje de error",
  location: "Ubicación",
  schedule: "Horario",
  value: "Valor",
  features: "Características",
  services: "Servicios",
  articles: "Artículos",
  members: "Miembros",
  links: "Enlaces",
  href: "Enlace (URL)",
  copyright: "Copyright",
  tagline_: "Tagline",
  category: "Categoría",
  date: "Fecha",
  excerpt: "Extracto",
  button: "Botón",
}

function labelFor(key: string) {
  return LABELS[key] ?? key.charAt(0).toUpperCase() + key.slice(1)
}

// Keys that should never be editable (stable identifiers).
const HIDDEN_KEYS = new Set(["id"])

type Props = {
  value: unknown
  onChange: (next: unknown) => void
  depth?: number
}

export function FieldEditor({ value, onChange, depth = 0 }: Props) {
  // String / number leaf
  if (typeof value === "string") {
    const isLong = value.length > 60
    return isLong ? (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={Math.min(8, Math.ceil(value.length / 50) + 1)}
        className="w-full bg-[#0f172a] border border-slate-700 px-3 py-2 text-sm text-white focus:border-[#00b8b4] focus:outline-none transition-colors resize-y"
      />
    ) : (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#0f172a] border border-slate-700 px-3 py-2 text-sm text-white focus:border-[#00b8b4] focus:outline-none transition-colors"
      />
    )
  }

  if (typeof value === "number") {
    return (
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full bg-[#0f172a] border border-slate-700 px-3 py-2 text-sm text-white focus:border-[#00b8b4] focus:outline-none transition-colors"
      />
    )
  }

  // Array of items
  if (Array.isArray(value)) {
    return (
      <div className="space-y-4">
        {value.map((item, idx) => (
          <div key={idx} className="border border-slate-800 bg-[#0f172a]/50 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                {`#${idx + 1}`}
              </span>
              {typeof item === "string" && (
                <button
                  onClick={() => {
                    const next = [...value]
                    next.splice(idx, 1)
                    onChange(next)
                  }}
                  className="text-xs text-slate-500 hover:text-red-400 transition-colors"
                >
                  Eliminar
                </button>
              )}
            </div>
            <FieldEditor
              value={item}
              depth={depth + 1}
              onChange={(next) => {
                const arr = [...value]
                arr[idx] = next
                onChange(arr)
              }}
            />
          </div>
        ))}
      </div>
    )
  }

  // Object with nested fields
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>
    return (
      <div className={depth === 0 ? "space-y-5" : "space-y-4"}>
        {Object.entries(obj).map(([key, val]) => {
          if (HIDDEN_KEYS.has(key)) return null
          return (
            <div key={key} className="space-y-2">
              <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold">
                {labelFor(key)}
              </label>
              <FieldEditor
                value={val}
                depth={depth + 1}
                onChange={(next) => onChange({ ...obj, [key]: next })}
              />
            </div>
          )
        })}
      </div>
    )
  }

  // Fallback for null/boolean
  return null
}
