"use client"

import { useState } from "react"
import Link from "next/link"
import { Send } from "lucide-react"

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Form submitted:", formData)
  }

  return (
    <section className="py-32 px-8 md:px-24 bg-surface-container-highest" id="contact">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
        <div className="lg:col-span-5">
          <span className="text-xs uppercase tracking-[0.3em] text-on-surface-variant mb-8 block">
            Contacto Directo
          </span>
          <h2 className="font-serif text-5xl md:text-6xl font-light mb-12">
            Inicie una conversación estratégica
          </h2>
          <div className="space-y-8">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-on-primary-container mb-2">
                E-mail
              </p>
              <Link 
                href="mailto:info@thinkoconsulting.com" 
                className="text-xl font-light hover:text-on-tertiary-container transition-colors italic"
              >
                info@thinkoconsulting.com
              </Link>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-on-primary-container mb-2">
                Presencia Digital
              </p>
              <div className="flex gap-6">
                <Link 
                  href="https://x.com/mottafocus" 
                  target="_blank" 
                  className="text-sm font-bold hover:underline"
                >
                  X / Twitter
                </Link>
                <Link 
                  href="https://instagram.com/mottafocus" 
                  target="_blank" 
                  className="text-sm font-bold hover:underline"
                >
                  Instagram
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <FloatingInput
                id="name"
                label="Nombre Completo"
                type="text"
                value={formData.name}
                onChange={(value) => setFormData({ ...formData, name: value })}
              />
              <FloatingInput
                id="email"
                label="Correo Institucional"
                type="email"
                value={formData.email}
                onChange={(value) => setFormData({ ...formData, email: value })}
              />
            </div>
            
            <div className="relative group">
              <select
                id="service"
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                className="peer w-full bg-transparent border-0 border-b border-outline-variant/30 focus:ring-0 focus:border-primary px-0 py-4 appearance-none font-light"
              >
                <option value="" disabled>Área de Interés</option>
                <option value="opinion">Opinión Pública</option>
                <option value="public">Asuntos Públicos</option>
                <option value="strategy">Estrategia Empresarial</option>
              </select>
            </div>
            
            <FloatingTextarea
              id="message"
              label="Detalles del Requerimiento"
              value={formData.message}
              onChange={(value) => setFormData({ ...formData, message: value })}
            />
            
            <button 
              type="submit" 
              className="bg-primary text-on-primary px-16 py-5 text-xs font-bold tracking-widest uppercase hover:opacity-90 transition-all flex items-center gap-4"
            >
              Enviar Solicitud
              <Send className="w-4 h-4" />
            </button>
          </form>
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
}: {
  id: string
  label: string
  type: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="relative group">
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder=" "
        className="peer w-full bg-transparent border-0 border-b border-outline-variant/30 focus:ring-0 focus:border-primary px-0 py-4 transition-all placeholder-transparent font-light"
      />
      <label
        htmlFor={id}
        className="absolute left-0 top-4 text-on-surface-variant/60 pointer-events-none transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-primary peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-[10px]"
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
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="relative group">
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder=" "
        rows={4}
        className="peer w-full bg-transparent border-0 border-b border-outline-variant/30 focus:ring-0 focus:border-primary px-0 py-4 transition-all placeholder-transparent font-light resize-none"
      />
      <label
        htmlFor={id}
        className="absolute left-0 top-4 text-on-surface-variant/60 pointer-events-none transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-primary peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-[10px]"
      >
        {label}
      </label>
    </div>
  )
}
