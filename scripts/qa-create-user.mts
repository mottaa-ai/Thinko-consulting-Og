import { auth } from "../lib/auth.ts"
import { db } from "../lib/db/index.ts"
import { user } from "../lib/db/schema.ts"
import { eq } from "drizzle-orm"

const email = "qa-temp@thinko.test"
const password = "QaTempPass1234"

try {
  const res = await auth.api.signUpEmail({
    body: { name: "QA Temp", email, password },
  })
  const id = res?.user?.id
  await db.update(user).set({ role: "superadmin" }).where(eq(user.email, email))
  console.log("CREATED", id, email, password)
} catch (e) {
  console.log("ERR", e.message)
}
process.exit(0)
