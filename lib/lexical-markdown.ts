/**
 * Converts a Markdown string to a minimal Lexical JSON structure
 * compatible with Payload CMS richText fields.
 *
 * This handles the common editorial elements: headings, bold, italic,
 * blockquotes, ordered/unordered lists, horizontal rules, and paragraphs.
 */
export function markdownToLexical(markdown: string): object {
  if (!markdown?.trim()) {
    return { root: { children: [], direction: null, format: "", indent: 0, type: "root", version: 1 } }
  }

  const lines = markdown.split("\n")
  const children: any[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // Horizontal rule
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) {
      children.push({ type: "horizontalrule", version: 1 })
      i++
      continue
    }

    // Headings
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/)
    if (headingMatch) {
      const level = headingMatch[1].length
      const tag = `h${Math.min(level, 4)}` as "h1" | "h2" | "h3" | "h4"
      children.push({
        type: "heading",
        tag,
        children: parseInline(headingMatch[2]),
        direction: "ltr",
        format: "",
        indent: 0,
        version: 1,
      })
      i++
      continue
    }

    // Blockquote
    if (line.startsWith("> ")) {
      const quoteLines: string[] = []
      while (i < lines.length && lines[i].startsWith("> ")) {
        quoteLines.push(lines[i].slice(2))
        i++
      }
      children.push({
        type: "quote",
        children: parseInline(quoteLines.join(" ")),
        direction: "ltr",
        format: "",
        indent: 0,
        version: 1,
      })
      continue
    }

    // Unordered list
    if (/^[-*+]\s+/.test(line)) {
      const listItems: any[] = []
      while (i < lines.length && /^[-*+]\s+/.test(lines[i])) {
        listItems.push({
          type: "listitem",
          children: parseInline(lines[i].replace(/^[-*+]\s+/, "")),
          direction: "ltr",
          format: "",
          indent: 0,
          value: listItems.length + 1,
          checked: undefined,
          version: 1,
        })
        i++
      }
      children.push({
        type: "list",
        listType: "bullet",
        children: listItems,
        direction: "ltr",
        format: "",
        indent: 0,
        start: 1,
        tag: "ul",
        version: 1,
      })
      continue
    }

    // Ordered list
    if (/^\d+\.\s+/.test(line)) {
      const listItems: any[] = []
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        listItems.push({
          type: "listitem",
          children: parseInline(lines[i].replace(/^\d+\.\s+/, "")),
          direction: "ltr",
          format: "",
          indent: 0,
          value: listItems.length + 1,
          checked: undefined,
          version: 1,
        })
        i++
      }
      children.push({
        type: "list",
        listType: "number",
        children: listItems,
        direction: "ltr",
        format: "",
        indent: 0,
        start: 1,
        tag: "ol",
        version: 1,
      })
      continue
    }

    // Empty line — skip
    if (!line.trim()) {
      i++
      continue
    }

    // Paragraph (default)
    const paraLines: string[] = []
    while (i < lines.length && lines[i].trim() !== "" && !/^(#{1,6}\s|[-*+]\s|\d+\.\s|> |---|\*\*\*|___)/.test(lines[i])) {
      paraLines.push(lines[i])
      i++
    }
    if (paraLines.length > 0) {
      children.push({
        type: "paragraph",
        children: parseInline(paraLines.join(" ")),
        direction: "ltr",
        format: "",
        indent: 0,
        textFormat: 0,
        version: 1,
      })
    }
  }

  return {
    root: {
      children,
      direction: "ltr",
      format: "",
      indent: 0,
      type: "root",
      version: 1,
    },
  }
}

/**
 * Converts a Lexical JSON structure back to Markdown for editing in the textarea.
 */
export function lexicalToMarkdown(lexical: any): string {
  if (!lexical) return ""
  const root = lexical?.root ?? lexical
  if (!root?.children) return ""
  return root.children.map(nodeToMd).filter(Boolean).join("\n\n")
}

function nodeToMd(node: any): string {
  if (!node) return ""
  switch (node.type) {
    case "paragraph":
      return childrenToMd(node.children)
    case "heading": {
      const level = parseInt(node.tag?.replace("h", "") ?? "2")
      return `${"#".repeat(level)} ${childrenToMd(node.children)}`
    }
    case "quote":
      return `> ${childrenToMd(node.children)}`
    case "list":
      return (node.children ?? [])
        .map((item: any, idx: number) =>
          node.listType === "number"
            ? `${idx + 1}. ${childrenToMd(item.children)}`
            : `- ${childrenToMd(item.children)}`,
        )
        .join("\n")
    case "horizontalrule":
      return "---"
    case "text": {
      let t = node.text ?? ""
      const fmt = node.format ?? 0
      if (fmt & 16) t = `\`${t}\``
      if (fmt & 2) t = `_${t}_`
      if (fmt & 1) t = `**${t}**`
      return t
    }
    case "link":
      return `[${childrenToMd(node.children)}](${node.fields?.url ?? node.url ?? ""})`
    default:
      if (node.children) return childrenToMd(node.children)
      return ""
  }
}

function childrenToMd(children: any[]): string {
  if (!children) return ""
  return children.map(nodeToMd).join("")
}

// ---- Inline parser ----

function parseInline(text: string): any[] {
  const nodes: any[] = []
  // Tokenize: **bold**, *italic*, `code`, [link](url)
  const re = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`|\[([^\]]+)\]\(([^)]+)\))/g
  let last = 0
  let match: RegExpExecArray | null

  while ((match = re.exec(text)) !== null) {
    if (match.index > last) {
      nodes.push(textNode(text.slice(last, match.index), 0))
    }

    if (match[2] !== undefined) {
      // **bold**
      nodes.push(textNode(match[2], 1))
    } else if (match[3] !== undefined) {
      // *italic*
      nodes.push(textNode(match[3], 2))
    } else if (match[4] !== undefined) {
      // `code`
      nodes.push(textNode(match[4], 16))
    } else if (match[5] !== undefined) {
      // [text](url)
      nodes.push({
        type: "link",
        children: [textNode(match[5], 0)],
        direction: "ltr",
        format: "",
        indent: 0,
        version: 1,
        fields: { url: match[6], newTab: match[6].startsWith("http") },
      })
    }
    last = match.index + match[0].length
  }

  if (last < text.length) {
    nodes.push(textNode(text.slice(last), 0))
  }

  return nodes.length > 0 ? nodes : [textNode(text, 0)]
}

function textNode(text: string, format: number): any {
  return {
    type: "text",
    text,
    format,
    detail: 0,
    mode: "normal",
    style: "",
    version: 1,
  }
}
