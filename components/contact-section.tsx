"use client"

import { useState } from "react"
import Link from "next/link"
import { Send, CheckCircle, AlertCircle } from "lucide-react"
import { useTranslation } from "@/lib/i18n"
import { submitContactForm } from "@/actions/contact"
import { db } from "@/lib/firebase"
import { collection, addDoc } from "firebase/firestore"

type FormStatus = "idle" | "submitting" | "success" | "error"

export function ContactSection() {
  const t = useTranslation('contact')
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  })
  const [status, setStatus] = useState<FormStatus>("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("submitting")
    
    try {
      // Save to Firebase Firestore
      await addDoc(collection(db, "contacts"), {
        ...formData,
        timestamp: new Date().toISOString(),
        createdAt: new Date(),
        source: "thinko-consulting-website",
      })
      
      // Also send to webhook
      await submitContactForm(formData)
      
      setStatus("success")
      setFormData({ name: "", email: "", company: "", message: "" })
    } catch (error) {
      console.error("Error submitting form:", error)
      setStatus("error")
    }
  }

  return (
    <section className="py-32 px-8 md:px-24 bg-surface-container-low" id="contact">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
        <div className="lg:col-span-5">
          <span className="text-xs uppercase tracking-[0.3em] text-[#00b8b4] mb-8 block font-semibold">
            {t.label}
          </span>
          <h2 className="font-headline text-5xl md:text-6xl font-light mb-8 text-foreground tracking-tight">
            {t.title}
          </h2>
          <div className="h-[2px] w-16 bg-[#00b8b4] mb-8" />
          <p className="text-on-surface-variant font-light leading-relaxed mb-12 text-lg">
            {t.subtitle}
          </p>
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant mb-3 font-semibold">
              {t.info.email.label}
            </p>
            <Link 
              href={`mailto:${t.info.email.value}`}
              className="text-xl md:text-2xl font-light text-foreground hover:text-[#00b8b4] transition-colors"
            >
              {t.info.email.value}
            </Link>
          </div>
        </div>
        
        <div className="lg:col-span-7">
          {status === "success" ? (
            <div className="flex flex-col items-center justify-center h-full py-20 text-center bg-white p-12">
              <CheckCircle className="w-16 h-16 text-[#00b8b4] mb-6" />
              <h3 className="font-headline text-3xl font-light mb-4">{t.form.successTitle}</h3>
              <p className="text-on-surface-variant font-light">{t.form.successMessage}</p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-8 text-sm font-semibold tracking-widest uppercase border-b-2 border-[#00b8b4] pb-2 hover:opacity-60 transition-opacity"
              >
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-12 bg-white p-8 md:p-12">
              {status === "error" && (
                <div className="flex items-center gap-4 p-4 bg-red-50 border border-red-200 text-red-800">
                  <AlertCircle className="w-5 h-5" />
                  <div>
                    <p className="font-bold">{t.form.errorTitle}</p>
                    <p className="text-sm">{t.form.errorMessage}</p>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <FloatingInput
                  id="name"
                  label={t.form.name}
                  type="text"
                  value={formData.name}
                  onChange={(value) => setFormData({ ...formData, name: value })}
                  required
                  disabled={status === "submitting"}
                />
                <FloatingInput
                  id="email"
                  label={t.form.email}
                  type="email"
                  value={formData.email}
                  onChange={(value) => setFormData({ ...formData, email: value })}
                  required
                  disabled={status === "submitting"}
                />
              </div>
              
              <FloatingInput
                id="company"
                label={t.form.company}
                type="text"
                value={formData.company}
                onChange={(value) => setFormData({ ...formData, company: value })}
                disabled={status === "submitting"}
              />
              
              <FloatingTextarea
                id="message"
                label={t.form.message}
                value={formData.message}
                onChange={(value) => setFormData({ ...formData, message: value })}
                required
                disabled={status === "submitting"}
              />
              
              <button 
                type="submit"
                disabled={status === "submitting"}
                className="bg-foreground text-white px-12 py-5 text-xs font-semibold tracking-widest uppercase hover:bg-[#00b8b4] transition-colors flex items-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === "submitting" ? t.form.submitting : t.form.submit}
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

function FloatingInput({
  id,
  label,
  type,
  value,
  onChange,
  required,
  disabled,
}: {
  id: string
  label: string
  type: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  disabled?: boolean
}) {
  return (
    <div className="relative group">
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder=" "
        required={required}
        disabled={disabled}
        className="peer w-full bg-transparent border-0 border-b border-slate-300 focus:ring-0 focus:border-[#00b8b4] focus:outline-none px-0 py-4 transition-all placeholder-transparent font-light disabled:opacity-50 text-foreground"
      />
      <label
        htmlFor={id}
        className="absolute left-0 top-4 text-on-surface-variant pointer-events-none transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-[#00b8b4] peer-focus:font-semibold peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-widest peer-[:not(:placeholder-shown)]:font-semibold"
      >
        {label}
      </label>
    </div>
  )
}

function FloatingTextarea({
  id,
  label,
  value,
  onChange,
  required,
  disabled,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  disabled?: boolean
}) {
  return (
    <div className="relative group">
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder=" "
        rows={4}
        required={required}
        disabled={disabled}
        className="peer w-full bg-transparent border-0 border-b border-slate-300 focus:ring-0 focus:border-[#00b8b4] focus:outline-none px-0 py-4 transition-all placeholder-transparent font-light resize-none disabled:opacity-50 text-foreground"
      />
      <label
        htmlFor={id}
        className="absolute left-0 top-4 text-on-surface-variant pointer-events-none transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-[#00b8b4] peer-focus:font-semibold peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-widest peer-[:not(:placeholder-shown)]:font-semibold"
      >
        {label}
      </label>
    </div>
  )
}
