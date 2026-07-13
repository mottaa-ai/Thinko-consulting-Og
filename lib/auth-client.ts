"use client"

import { createAuthClient } from "better-auth/react"

// Use the current window origin so auth calls always hit the same server,
// whether running in the v0 iframe preview, a Vercel preview deploy, or production.
const baseURL = typeof window !== "undefined" ? window.location.origin : process.env.NEXT_PUBLIC_APP_URL

export const authClient = createAuthClient({ baseURL })

export const { signIn, signUp, signOut, useSession } = authClient
