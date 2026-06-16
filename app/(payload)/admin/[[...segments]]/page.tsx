import type { Metadata } from "next"
import { RootPage, generatePageMetadata } from "@payloadcms/next/views"
import config from "@payload-config"

export const generateMetadata = (): Promise<Metadata> =>
  generatePageMetadata({ config })

export default function Page({ params, searchParams }: any) {
  return RootPage({ config, params, searchParams })
}
