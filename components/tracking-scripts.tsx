"use client"

import { useEffect } from "react"

type Props = {
  metaPixel?: string
  googleAnalytics?: string
  googleTagManager?: string
}

/**
 * Injects admin-provided tracking snippets into <head> by recreating real
 * <script> nodes (setting innerHTML does not execute scripts). Each snippet may
 * contain external (src) and inline scripts plus <noscript>/other markup.
 */
export function TrackingScripts({ metaPixel, googleAnalytics, googleTagManager }: Props) {
  useEffect(() => {
    const snippets = [
      { id: "track-ga", html: googleAnalytics },
      { id: "track-gtm", html: googleTagManager },
      { id: "track-meta", html: metaPixel },
    ].filter((s) => s.html && s.html.trim().length > 0)

    const injected: Node[] = []

    for (const snippet of snippets) {
      // Skip if this snippet group was already injected (avoids duplicates on nav).
      if (document.querySelector(`[data-track-group="${snippet.id}"]`)) continue

      const template = document.createElement("template")
      template.innerHTML = snippet.html!.trim()

      const nodes = Array.from(template.content.childNodes)
      for (const node of nodes) {
        if (node.nodeName === "SCRIPT") {
          const original = node as HTMLScriptElement
          const script = document.createElement("script")
          // Copy attributes (src, async, type, id, etc.)
          for (const attr of Array.from(original.attributes)) {
            script.setAttribute(attr.name, attr.value)
          }
          // Copy inline code
          if (original.textContent) script.textContent = original.textContent
          script.setAttribute("data-track-group", snippet.id)
          document.head.appendChild(script)
          injected.push(script)
        } else {
          // Non-script nodes (e.g. <noscript> for GTM) can be cloned directly.
          const clone = node.cloneNode(true)
          if (clone instanceof HTMLElement) clone.setAttribute("data-track-group", snippet.id)
          document.head.appendChild(clone)
          injected.push(clone)
        }
      }
    }

    return () => {
      // Leave scripts in place across client navigations; only the analytics
      // libraries themselves manage their lifecycle. No cleanup needed.
    }
  }, [metaPixel, googleAnalytics, googleTagManager])

  return null
}
