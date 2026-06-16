export type Locale = 'es' | 'en'

export interface NavbarContent {
  links: {
    philosophy: string
    services: string
    team: string
    insights: string
    contact: string
  }
}

export interface HeroContent {
  tagline: string
  title: string
  titleHighlight: string
  subtitle: string
}

export interface PhilosophyContent {
  label: string
  title: string
  description: string
}

export interface ServiceItem {
  id: string
  title: string
  description: string
  features: string[]
  sectionTitle?: string
  items?: Array<{ name: string; detail: string }>
}

export interface ServicesContent {
  label: string
  title: string
  services: ServiceItem[]
}

export interface VisionContent {
  backgroundText: string
  quote: string
}

export interface ArticleItem {
  id: string
  category: string
  date: string
  title: string
  excerpt: string
}

export interface InsightsContent {
  label: string
  title: string
  articles: ArticleItem[]
}

export interface ContactContent {
  label: string
  title: string
  subtitle: string
  form: {
    name: string
    email: string
    company: string
    message: string
    submit: string
    submitting: string
    successTitle: string
    successMessage: string
    errorTitle: string
    errorMessage: string
  }
  info: {
    location?: {
      label: string
      value: string
    }
    email: {
      label: string
      value: string
    }
    schedule?: {
      label: string
      value: string
    }
  }
}

export interface FooterLink {
  label: string
  href: string
}

export interface FooterContent {
  tagline: string
  sections: {
    navigation: {
      title: string
      links: FooterLink[]
    }
    services: {
      title: string
      links: FooterLink[]
    }
    contact: {
      title: string
      email: string
      location?: string
    }
  }
  legal: {
    copyright: string
    links: FooterLink[]
  }
  social?: {
    linkedin?: string
    twitter?: string
  }
}

export interface TeamMember {
  id: string
  name: string
  role: string
  bio: string
}

export interface TeamContent {
  hero: {
    title: string
    quote: string
  }
  members: TeamMember[]
  cta: {
    title: string
    description: string
    button: string
  }
}

export interface AllContent {
  navbar: NavbarContent
  hero: HeroContent
  philosophy: PhilosophyContent
  services: ServicesContent
  vision: VisionContent
  insights: InsightsContent
  contact: ContactContent
  footer: FooterContent
  team: TeamContent
}
