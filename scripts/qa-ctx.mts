import { auth } from "../lib/auth"
const ctx = await auth.$context
const email = `sig-${Date.now()}@thinko.test`
const hash = await ctx.password.hash("TempPass1234")
const u = await ctx.internalAdapter.createUser({ name: "Sig Test", email, emailVerified: false, role: "admin" })
console.log("createUser returned:", JSON.stringify(u))
const acc = await ctx.internalAdapter.createAccount({
  userId: u.id,
  providerId: "credential",
  accountId: u.id,
  password: hash,
})
console.log("createAccount returned:", JSON.stringify(acc))
process.exit(0)
