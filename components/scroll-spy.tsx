"use client"

import { useEffect, useRef } from "react"

/**
 * ScrollSpy updates the URL hash as the user scrolls through the page sections.
 * It uses IntersectionObserver to detect which section is most prominently in
 * the viewport and replaces the hash (without adding history entries or
 * triggering a jump). This keeps the address bar in sync with the visible
 * section so links can be re-clicked and shared.
 */
export function ScrollSpy({ sectionIds }: { sectionIds: string[] }) {
  const activeIdRef = useRef<string | null>(null)

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (elements.length === 0) return

    // Track visibility ratios for each observed section.
    const ratios = new Map<string, number>()

    const updateHash = () => {
      let bestId: string | null = null
      let bestRatio = 0

      for (const [id, ratio] of ratios) {
        if (ratio > bestRatio) {
          bestRatio = ratio
          bestId = id
        }
      }

      // If we're at the very top before the first section, clear the hash.
      if (window.scrollY < 200) {
        if (activeIdRef.current !== null) {
          activeIdRef.current = null
          history.replaceState(null, "", window.location.pathname + window.location.search)
        }
        return
      }

      if (bestId && bestId !== activeIdRef.current && bestRatio > 0) {
        activeIdRef.current = bestId
        history.replaceState(null, "", `#${bestId}`)
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0)
        }
        updateHash()
      },
      {
        // Bias detection toward the upper-middle of the viewport so a section
        // becomes "active" as its heading scrolls into view.
        rootMargin: "-20% 0px -35% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    )

    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [sectionIds])

  return null
}
