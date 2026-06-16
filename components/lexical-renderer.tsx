import Link from "next/link"
import Image from "next/image"

/**
 * Renders the Lexical JSON rich text format produced by Payload CMS.
 * Handles the most common node types used in editorial content.
 */
export function LexicalRenderer({ content }: { content: any }) {
  if (!content) return null

  const root = content?.root ?? content
  if (!root?.children) return null

  return <>{root.children.map((node: any, i: number) => renderNode(node, i))}</>
}

function renderNode(node: any, key: number | string): React.ReactNode {
  if (!node) return null

  switch (node.type) {
    case "paragraph":
      return (
        <p
          key={key}
          className="font-light text-base md:text-lg leading-relaxed text-on-surface mb-6"
        >
          {renderChildren(node.children)}
        </p>
      )

    case "heading": {
      const level = node.tag ?? "h2"
      const classMap: Record<string, string> = {
        h1: "font-headline text-3xl md:text-4xl font-medium tracking-tight text-foreground mt-12 mb-6",
        h2: "font-headline text-3xl md:text-4xl font-medium tracking-tight text-foreground mt-12 mb-6",
        h3: "font-headline text-2xl md:text-3xl font-medium tracking-tight text-foreground mt-10 mb-4",
        h4: "font-headline text-xl md:text-2xl font-medium tracking-tight text-foreground mt-8 mb-3",
      }
      const cls = classMap[level] ?? classMap.h2
      return (
        <h2 key={key} className={cls}>
          {renderChildren(node.children)}
        </h2>
      )
    }

    case "list": {
      const isOrdered = node.listType === "number"
      const listClass = "mb-6 pl-6 space-y-1"
      const itemClass =
        "font-light text-base md:text-lg leading-relaxed text-on-surface marker:text-[#00b8b4]"
      if (isOrdered) {
        return (
          <ol key={key} className={`${listClass} list-decimal`}>
            {(node.children ?? []).map((item: any, i: number) => (
              <li key={i} className={itemClass}>
                {renderChildren(item.children)}
              </li>
            ))}
          </ol>
        )
      }
      return (
        <ul key={key} className={`${listClass} list-disc`}>
          {(node.children ?? []).map((item: any, i: number) => (
            <li key={i} className={itemClass}>
              {renderChildren(item.children)}
            </li>
          ))}
        </ul>
      )
    }

    case "quote":
      return (
        <blockquote
          key={key}
          className="border-l-4 border-[#00b8b4] pl-6 my-8 font-headline italic text-xl md:text-2xl text-foreground leading-relaxed"
        >
          {renderChildren(node.children)}
        </blockquote>
      )

    case "horizontalrule":
      return <hr key={key} className="my-12 border-t border-slate-200" />

    case "image": {
      const src = node.src ?? node.value?.url
      if (!src) return null
      return (
        <figure key={key} className="my-10">
          <div className="relative w-full aspect-[16/9] bg-slate-100">
            <Image
              src={src}
              alt={node.altText ?? ""}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
          {node.caption && (
            <figcaption className="mt-3 text-sm text-on-surface-variant text-center font-light italic">
              {node.caption}
            </figcaption>
          )}
        </figure>
      )
    }

    case "code":
      return (
        <pre key={key} className="bg-slate-900 text-slate-50 p-6 my-6 overflow-x-auto text-sm font-mono">
          <code>{node.code ?? renderChildren(node.children)}</code>
        </pre>
      )

    case "link": {
      const url = node.fields?.url ?? node.url ?? "#"
      const isExternal = url.startsWith("http")
      return (
        <Link
          key={key}
          href={url}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="text-[#00b8b4] underline underline-offset-4 hover:text-foreground transition-colors"
        >
          {renderChildren(node.children)}
        </Link>
      )
    }

    case "text": {
      let el: React.ReactNode = node.text ?? ""
      const fmt = node.format ?? 0
      // Lexical format flags: 1=bold, 2=italic, 4=strikethrough, 8=underline, 16=code, 32=subscript, 64=superscript
      if (fmt & 16)
        el = (
          <code key={key} className="bg-slate-100 px-1.5 py-0.5 text-sm font-mono">
            {el}
          </code>
        )
      if (fmt & 4) el = <s key={key}>{el}</s>
      if (fmt & 8) el = <u key={key}>{el}</u>
      if (fmt & 2) el = <em key={key}>{el}</em>
      if (fmt & 1) el = <strong key={key}>{el}</strong>
      return el
    }

    case "linebreak":
      return <br key={key} />

    default:
      // Fallback: render children if present
      if (node.children) return <>{renderChildren(node.children)}</>
      return null
  }
}

function renderChildren(children: any[]): React.ReactNode {
  if (!children) return null
  return children.map((child, i) => renderNode(child, i))
}
