import { auth } from "../lib/auth"

const ctx = await auth.$context
console.log("password keys:", Object.keys(ctx.password ?? {}))
console.log("internalAdapter has createUser:", typeof ctx.internalAdapter?.createUser)
console.log("internalAdapter has linkAccount:", typeof ctx.internalAdapter?.linkAccount)
console.log("internalAdapter has createAccount:", typeof ctx.internalAdapter?.createAccount)
process.exit(0)
