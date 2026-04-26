import Link from "next/link"
import Image from "next/image"

interface RichText {
  plain_text: string
  href?: string | null
  annotations: {
    bold?: boolean
    italic?: boolean
    underline?: boolean
    strikethrough?: boolean
    code?: boolean
  }
}

function renderRichText(richText: RichText[] = []) {
  return richText.map((text, i) => {
    let element: React.ReactNode = text.plain_text
    const a = text.annotations || {}

    if (a.bold) element = <strong key={`b-${i}`}>{element}</strong>
    if (a.italic) element = <em key={`i-${i}`}>{element}</em>
    if (a.underline) element = <u key={`u-${i}`}>{element}</u>
    if (a.strikethrough) element = <s key={`s-${i}`}>{element}</s>
    if (a.code)
      element = (
        <code key={`c-${i}`} className="bg-slate-100 px-1.5 py-0.5 text-sm font-mono">
          {element}
        </code>
      )

    if (text.href) {
      element = (
        <Link
          key={`l-${i}`}
          href={text.href}
          target={text.href.startsWith("http") ? "_blank" : undefined}
          rel={text.href.startsWith("http") ? "noopener noreferrer" : undefined}
          className="text-[#00b8b4] underline underline-offset-4 hover:text-foreground transition-colors"
        >
          {element}
        </Link>
      )
    }

    return <span key={i}>{element}</span>
  })
}

function getImageUrl(image: any): string {
  if (image?.type === "external") return image.external.url
  if (image?.type === "file") return image.file.url
  return ""
}

export function NotionBlocks({ blocks }: { blocks: any[] }) {
  return (
    <>
      {blocks.map((block) => (
        <NotionBlock key={block.id} block={block} />
      ))}
    </>
  )
}

function NotionBlock({ block }: { block: any }) {
  const { type } = block
  const data = block[type]

  switch (type) {
    case "paragraph":
      return (
        <p className="font-light text-base md:text-lg leading-relaxed text-on-surface mb-6">
          {renderRichText(data.rich_text)}
        </p>
      )

    case "heading_1":
      return (
        <h2 className="font-headline text-3xl md:text-4xl font-medium tracking-tight text-foreground mt-12 mb-6">
          {renderRichText(data.rich_text)}
        </h2>
      )

    case "heading_2":
      return (
        <h3 className="font-headline text-2xl md:text-3xl font-medium tracking-tight text-foreground mt-10 mb-4">
          {renderRichText(data.rich_text)}
        </h3>
      )

    case "heading_3":
      return (
        <h4 className="font-headline text-xl md:text-2xl font-medium tracking-tight text-foreground mt-8 mb-3">
          {renderRichText(data.rich_text)}
        </h4>
      )

    case "bulleted_list_item":
      return (
        <ul className="mb-2">
          <li className="font-light text-base md:text-lg leading-relaxed text-on-surface ml-6 list-disc marker:text-[#00b8b4]">
            {renderRichText(data.rich_text)}
          </li>
        </ul>
      )

    case "numbered_list_item":
      return (
        <ol className="mb-2">
          <li className="font-light text-base md:text-lg leading-relaxed text-on-surface ml-6 list-decimal marker:text-[#00b8b4]">
            {renderRichText(data.rich_text)}
          </li>
        </ol>
      )

    case "quote":
      return (
        <blockquote className="border-l-4 border-[#00b8b4] pl-6 my-8 font-headline italic text-xl md:text-2xl text-foreground leading-relaxed">
          {renderRichText(data.rich_text)}
        </blockquote>
      )

    case "callout":
      return (
        <div className="bg-slate-50 border-l-4 border-[#00b8b4] p-6 my-8">
          <div className="font-light text-base leading-relaxed text-on-surface">
            {renderRichText(data.rich_text)}
          </div>
        </div>
      )

    case "image": {
      const url = getImageUrl(data)
      const caption = getPlain(data.caption)
      if (!url) return null
      return (
        <figure className="my-10">
          <div className="relative w-full aspect-[16/9] bg-slate-100">
            <Image
              src={url || "/placeholder.svg"}
              alt={caption || "Article image"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
          {caption && (
            <figcaption className="mt-3 text-sm text-on-surface-variant text-center font-light italic">
              {caption}
            </figcaption>
          )}
        </figure>
      )
    }

    case "divider":
      return <hr className="my-12 border-t border-slate-200" />

    case "code":
      return (
        <pre className="bg-slate-900 text-slate-50 p-6 my-6 overflow-x-auto text-sm font-mono">
          <code>{getPlain(data.rich_text)}</code>
        </pre>
      )

    case "bookmark":
    case "embed":
      if (!data.url) return null
      return (
        <Link
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block my-6 p-4 border border-slate-200 hover:border-[#00b8b4] transition-colors"
        >
          <div className="text-xs uppercase tracking-widest text-on-surface-variant">
            {data.url}
          </div>
        </Link>
      )

    default:
      return null
  }
}

function getPlain(rt: RichText[] = []): string {
  return rt.map((t) => t.plain_text).join("")
}
