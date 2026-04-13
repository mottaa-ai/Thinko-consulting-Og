"use server"

interface ContactFormData {
  name: string
  email: string
  company: string
  message: string
}

const WEBHOOK_URL = "https://hook.us2.make.com/r8r6fwmz5z0421iyoazgcf8rlfxc105y"

export async function submitContactForm(data: ContactFormData): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        timestamp: new Date().toISOString(),
        source: "thinko-consulting-website",
      }),
    })

    if (!response.ok) {
      throw new Error(`Webhook failed with status: ${response.status}`)
    }

    return { success: true }
  } catch (error) {
    console.error("Contact form submission error:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    }
  }
}
