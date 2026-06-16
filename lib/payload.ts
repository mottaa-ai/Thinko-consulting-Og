import "server-only"
import { getPayload } from "payload"
import config from "@payload-config"

let payloadInstance: Awaited<ReturnType<typeof getPayload>> | null = null

/**
 * Returns a singleton Payload instance for use in Server Components and Server Actions.
 * Uses the Local API (no HTTP overhead).
 */
export async function getPayloadClient() {
  if (!payloadInstance) {
    payloadInstance = await getPayload({ config })
  }
  return payloadInstance
}
