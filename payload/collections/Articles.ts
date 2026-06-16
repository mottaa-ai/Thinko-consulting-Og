import type { CollectionConfig } from "payload"

export const Articles: CollectionConfig = {
  slug: "articles",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "status", "publishedAt"],
    description: "Artículos del blog de Thinko Consulting",
  },
  access: {
    read: () => true, // public read for the site
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      label: "Título",
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      label: "Slug (URL)",
      admin: {
        description: "Identificador único en la URL: /blog/este-slug",
      },
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "draft",
      label: "Estado",
      options: [
        { label: "Borrador", value: "draft" },
        { label: "Publicado", value: "published" },
      ],
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "publishedAt",
      type: "date",
      label: "Fecha de publicación",
      admin: {
        position: "sidebar",
        date: {
          pickerAppearance: "dayOnly",
          displayFormat: "d MMM yyy",
        },
      },
    },
    {
      name: "featured",
      type: "checkbox",
      label: "Destacado",
      defaultValue: false,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "author",
      type: "text",
      label: "Autor",
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "category",
      type: "text",
      label: "Categoría",
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "tags",
      type: "array",
      label: "Etiquetas",
      admin: {
        position: "sidebar",
      },
      fields: [
        {
          name: "tag",
          type: "text",
          label: "Etiqueta",
        },
      ],
    },
    {
      name: "excerpt",
      type: "textarea",
      label: "Extracto",
    },
    {
      name: "coverImage",
      type: "text",
      label: "Imagen destacada (URL)",
      admin: {
        description: "URL de la imagen de portada del artículo",
      },
    },
    {
      name: "content",
      type: "richText",
      label: "Contenido",
      editor: lexicalEditorRef(),
    },
    // SEO fields
    {
      name: "seo",
      type: "group",
      label: "SEO",
      fields: [
        {
          name: "title",
          type: "text",
          label: "SEO Title",
        },
        {
          name: "description",
          type: "textarea",
          label: "SEO Description",
        },
        {
          name: "canonicalUrl",
          type: "text",
          label: "Canonical URL",
        },
      ],
    },
    // Source attribution
    {
      name: "source",
      type: "text",
      label: "Fuente",
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "sourceUrl",
      type: "text",
      label: "URL fuente",
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "readingTime",
      type: "number",
      label: "Tiempo de lectura (min)",
      admin: {
        position: "sidebar",
      },
    },
    // Keep original Notion ID for migration reference
    {
      name: "notionId",
      type: "text",
      label: "Notion ID (migración)",
      admin: {
        position: "sidebar",
        readOnly: true,
        description: "ID original del artículo en Notion (solo referencia)",
      },
    },
  ],
  timestamps: true,
}

// Lazy reference to avoid circular imports — the editor is configured in payload.config.ts
function lexicalEditorRef() {
  // This is replaced at runtime by the editor defined in payload.config.ts
  // Returning undefined here tells Payload to use the global default editor
  return undefined as any
}
