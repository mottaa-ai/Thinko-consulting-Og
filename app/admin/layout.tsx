import type { ReactNode } from "react"

// The admin area has its own minimal shell. Auth protection happens at the
// page level (dashboard + editors) so that /admin/login and /admin/setup
// remain publicly reachable.
export const metadata = {
  title: "Panel | Thinko Consulting",
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-[#0f172a] text-white">{children}</div>
}
