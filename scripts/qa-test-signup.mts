import { auth } from "../lib/auth.ts"

try {
  const result = await auth.api.signUpEmail({
    body: { name: "Script Test", email: "script-test@thinko.test", password: "ScriptPass1234" },
  })
  console.log("OK", JSON.stringify(result).slice(0, 200))
} catch (e) {
  console.log("ERROR_NAME:", e?.constructor?.name)
  console.log("ERROR_MSG:", e?.message)
  console.log("ERROR_BODY:", JSON.stringify(e?.body ?? e?.cause ?? {}))
}
process.exit(0)
