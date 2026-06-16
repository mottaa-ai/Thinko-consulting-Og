"use client"

import dynamic from "next/dynamic"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createArticleAction, updateArticleAction } from "@/app/actions/blog"
import { lexicalToMarkdown, markdownToLexical } from "@/lib/lexical-markdown"

// Load the MD editor only on the client (it uses window)
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 bg-[#0f172a] border border-slate-700 animate-pulse" />
  ),
})

type ArticleFormValues = {
  title: string
  slug: string
  author: string
  category: string
  excerpt: string
  coverImage: string
  status: string
  seoTitle: string
  seoDescription: string
  contentMarkdown: string
}

const STATUS_OPTIONS = ["draft", "published"]

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export function ArticleForm({
  articleId,
  initial,
  initialContent,
}: {
  articleId?: number | string
  initial?: Partial<ArticleFormValues>
  /** Raw Lexical JSON from Payload, converted to Markdown for editing */
  initialContent?: any
}) {
  const router = useRouter()
  const [values, setValues] = useState<ArticleFormValues>({
    title: initial?.title ?? "",
    slug: initial?.slug ?? "",
    author: initial?.author ?? "",
    category: initial?.category ?? "",
    excerpt: initial?.excerpt ?? "",
    coverImage: initial?.coverImage ?? "",
    status: initial?.status ?? "draft",
    seoTitle: initial?.seoTitle ?? "",
    seoDescription: initial?.seoDescription ?? "",
    contentMarkdown: initial?.contentMarkdown ?? lexicalToMarkdown(initialContent),
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function set<K extends keyof ArticleFormValues>(key: K, value: ArticleFormValues[K]) {
    setValues((prev) => {
      const next = { ...prev, [key]: value }
      // Auto-generate slug from title if slug is empty
      if (key === "title" && !prev.slug) {
        next.slug = slugify(value as string)
      }
      return next
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const lexicalContent = markdownToLexical(values.contentMarkdown)

    const payload = {
      title: values.title,
      slug: values.slug || slugify(values.title),
      author: values.author,
      category: values.category,
      excerpt: values.excerpt,
      coverImage: values.coverImage,
      status: values.status,
      seoTitle: values.seoTitle,
      seoDescription: values.seoDescription,
      content: lexicalContent,
    }

    const result = articleId
      ? await updateArticleAction(articleId, payload)
      : await createArticleAction(payload)

    setSaving(false)

    if (!result.ok) {
      setError(result.error ?? "Error al guardar.")
      return
    }

    router.push("/admin/blog")
    router.refresh()
  }

  const inputClass =
    "w-full bg-[#0f172a] border border-slate-700 px-3 py-2 text-sm text-white focus:border-[#00b8b4] focus:outline-none transition-colors"
  const labelClass = "block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2"

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className={labelClass} htmlFor="title">
          Título
        </label>
        <input
          id="title"
          required
          className={inputClass}
          value={values.title}
          onChange={(e) => set("title", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className={labelClass} htmlFor="slug">
            Slug (URL)
          </label>
          <input
            id="slug"
            className={inputClass}
            placeholder="se-genera-del-titulo"
            value={values.slug}
            onChange={(e) => set("slug", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="category">
            Categoría
          </label>
          <input
            id="category"
            className={inputClass}
            value={values.category}
            onChange={(e) => set("category", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className={labelClass} htmlFor="author">
            Autor
          </label>
          <input
            id="author"
            className={inputClass}
            value={values.author}
            onChange={(e) => set("author", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="status">
            Estado
          </label>
          <select
            id="status"
            className={inputClass}
            value={values.status}
            onChange={(e) => set("status", e.target.value)}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s === "draft" ? "Borrador" : "Publicado"}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="coverImage">
          Imagen destacada (URL)
        </label>
        <input
          id="coverImage"
          className={inputClass}
          placeholder="https://..."
          value={values.coverImage}
          onChange={(e) => set("coverImage", e.target.value)}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="excerpt">
          Extracto
        </label>
        <textarea
          id="excerpt"
          rows={3}
          className={`${inputClass} resize-y`}
          value={values.excerpt}
          onChange={(e) => set("excerpt", e.target.value)}
        />
      </div>

      {/* Rich text / Markdown editor */}
      <div>
        <label className={labelClass}>Contenido</label>
        <div data-color-mode="dark">
          <MDEditor
            value={values.contentMarkdown}
            onChange={(val) => set("contentMarkdown", val ?? "")}
            height={480}
            preview="edit"
            style={{
              background: "#0f172a",
              borderRadius: 0,
              border: "1px solid rgb(51,65,85)",
            }}
          />
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Escribe en Markdown. Usa **negrita**, *cursiva*, ## Título, - Lista, etc.
        </p>
      </div>

      <div>
        <label className={labelClass} htmlFor="seoTitle">
          SEO Title
        </label>
        <input
          id="seoTitle"
          className={inputClass}
          value={values.seoTitle}
          onChange={(e) => set("seoTitle", e.target.value)}
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="seoDescription">
          SEO Description
        </label>
        <textarea
          id="seoDescription"
          rows={2}
          className={`${inputClass} resize-y`}
          value={values.seoDescription}
          onChange={(e) => set("seoDescription", e.target.value)}
        />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-[#00b8b4] text-[#0f172a] py-3 px-8 font-semibold uppercase tracking-wider text-xs hover:bg-[#00a39f] transition-colors disabled:opacity-50"
        >
          {saving ? "Guardando..." : articleId ? "Guardar cambios" : "Crear publicación"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/blog")}
          className="text-xs uppercase tracking-wider text-slate-400 hover:text-white transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
