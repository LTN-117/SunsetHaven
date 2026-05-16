"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Menu, X, ChevronLeft, ChevronRight, Loader2, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/lib/supabase"

const ABOUT_PARAS = [
  "How It All Started",
  "Four years ago, we were running pop-up camping events on Tarkwa Bay — small gatherings for creatives who craved something beyond the usual weekend options.",
  "What started as intimate parties quickly revealed something bigger: people were hungry for experiential tourism that connected them with nature, community, and purpose.",
  "Our pop-ups kept selling out. People weren't just coming once — they were bringing friends, requesting longer stays, asking for workspace options. The demand outgrew our pop-up model.",
  "Instead of chasing venues, we created our own dedicated space — somewhere purpose-built for the community we'd discovered. Off-grid operations powered entirely by renewable energy.",
]
const ABOUT_WORDS = ABOUT_PARAS.map(p => p.split(' '))
const ABOUT_OFFSETS = ABOUT_WORDS.reduce<number[]>((acc, _, i) =>
  [...acc, i === 0 ? 0 : acc[i - 1] + ABOUT_WORDS[i - 1].length], [])
const ABOUT_TOTAL = ABOUT_OFFSETS[ABOUT_OFFSETS.length - 1] + ABOUT_WORDS[ABOUT_WORDS.length - 1].length

const BRAND = {
  amber: '#FEBE03',
  fire: '#FF3F02',
  gradient: 'linear-gradient(135deg, #FF3F02 0%, #FEBE03 100%)',
  dark1: '#12100e',
  dark2: '#0e0c0a',
  dark3: '#0a0908',
  body: '#d6d0c8',
  muted: '#6b6560',
}

export default function SunsetHavenResort() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [heroImageSlide, setHeroImageSlide] = useState(0)
  const [testimonialSlide, setTestimonialSlide] = useState(0)

  const [formData, setFormData] = useState({ name: "", phone: "", inquiry_type: "", message: "" })
  const [phoneError, setPhoneError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const [isGalleryHovered, setIsGalleryHovered] = useState(false)
  const galleryContainerRef = useRef<HTMLDivElement>(null)

  const [footerSettings, setFooterSettings] = useState<any>(null)
  const [heroImages, setHeroImages] = useState<string[]>(["/IMG_8277.JPG", "/IMG_8282.JPG", "/IMG_8285.JPG"])
  const [galleryImages, setGalleryImages] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])
  const [eventSlide, setEventSlide] = useState(0)
  const [newsletterEmail, setNewsletterEmail] = useState("")
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "success" | "error" | "duplicate">("idle")
  const [isSubmittingNewsletter, setIsSubmittingNewsletter] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [aboutWordsVisible, setAboutWordsVisible] = useState(0)
  const aboutRef = useRef<HTMLElement>(null)
  const aboutRevealed = useRef(false)
  const lastScrollY = useRef(0)
  const navRef = useRef<HTMLElement>(null)
  const [heroParallax, setHeroParallax] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      lastScrollY.current = y
      setIsScrolled(y > 30)
      setHeroParallax(y * 0.25)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    supabase.from('gallery_images').select('image_url').eq('show_in_hero', true).eq('is_active', true).order('display_order', { ascending: true })
      .then(({ data }) => { if (data && data.length > 0) setHeroImages(data.map(img => img.image_url)) })
  }, [])

  useEffect(() => {
    supabase.from('gallery_images').select('*').eq('is_active', true).order('display_order', { ascending: true }).limit(12)
      .then(({ data }) => setGalleryImages(data || []))
  }, [])

  useEffect(() => {
    supabase.from('footer_settings').select('*').single()
      .then(({ data }) => { if (data) setFooterSettings(data) })
  }, [])

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    supabase.from('events').select('*').eq('is_active', true).gte('event_date', today).order('event_date', { ascending: true }).limit(5)
      .then(({ data }) => setEvents(data || []))
  }, [])

  useEffect(() => {
    const id = setInterval(() => setHeroImageSlide(p => (p + 1) % heroImages.length), 5000)
    return () => clearInterval(id)
  }, [heroImages.length])

  useEffect(() => {
    const id = setInterval(() => {
      if (!isGalleryHovered && galleryContainerRef.current) {
        const c = galleryContainerRef.current
        if (c.scrollLeft >= c.scrollWidth - c.clientWidth - 10) {
          c.scrollLeft = 0
        } else {
          c.scrollLeft += 1
        }
      }
    }, 30)
    return () => clearInterval(id)
  }, [isGalleryHovered])

  useEffect(() => {
    const id = setInterval(() => setTestimonialSlide(p => (p + 1) % Math.max(testimonials.length, 1)), 4000)
    return () => clearInterval(id)
  }, [])

  const [experiences, setExperiences] = useState([
    { title: "Premium Camping", description: "Experience our eco-tourism camping site with proper beds, duvets and blankets in premium tents. Wake up to stunning island views and the sound of waves. Comfort meets nature in the perfect balance.", image: "/premium-camping.jpg", tag: "premium-camping" },
    { title: "Adventure Activities", description: "Island exploration, water sports, sunset sessions, quad bike rides, paint & sip, board games, meditation, journaling, and more. Every day brings new experiences.", image: "/adventure-activities.jpg", tag: "adventure-activities" },
    { title: "Bespoke Events", description: "From corporate retreats to themed celebrations, raves to intimate gatherings. We coordinate unforgettable experiences tailored to your vision.", image: "/bespoke-events.jpg", tag: "bespoke-events" },
    { title: "Curated Networking", description: "Join 600-1000+ monthly guests who return for the community. Connect with professionals, creatives, and explorers. Build relationships that last beyond your stay.", image: "/curated-networking.jpg", tag: "curated-networking" },
  ])

  useEffect(() => {
    supabase.from('gallery_images').select('tag, image_url').not('tag', 'is', null).eq('is_active', true)
      .in('tag', ['premium-camping', 'adventure-activities', 'curated-networking', 'bespoke-events'])
      .then(({ data }) => {
        if (data && data.length > 0) {
          setExperiences(prev => prev.map(exp => {
            const match = data.find(img => img.tag === exp.tag)
            return match ? { ...exp, image: match.image_url } : exp
          }))
        }
      })
  }, [])

  const [testimonials, setTestimonials] = useState<any[]>([
    { quote: "I love the feeling of waking up at night and feeling safe that Sunset Haven gives. It was great and I totally enjoyed my stay.", author: "Guest Review" },
    { quote: "I love the sunsets there. I enjoyed waking up to watch the sunrise. The staff are very warm and welcoming.", author: "Guest Review" },
  ])

  useEffect(() => {
    supabase.from('testimonials').select('*').eq('is_active', true).order('display_order', { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setTestimonials(data.map(t => ({
            quote: t.quote,
            author: t.guest_name + (t.guest_role ? `, ${t.guest_role}` : '')
          })))
        }
      })
  }, [])

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.phone || !formData.inquiry_type || !formData.message) {
      setSubmitStatus("error"); setTimeout(() => setSubmitStatus("idle"), 3000); return
    }
    const digits = formData.phone.replace(/\D/g, '')
    if (digits.length < 7 || digits.length > 15) {
      setPhoneError("Please enter a valid phone number"); setTimeout(() => setPhoneError(""), 4000); return
    }
    setIsSubmitting(true); setSubmitStatus("idle")
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) throw new Error('failed')
      setFormData({ name: "", phone: "", inquiry_type: "", message: "" })
      setSubmitStatus("success"); setTimeout(() => setSubmitStatus("idle"), 5000)
    } catch {
      setSubmitStatus("error"); setTimeout(() => setSubmitStatus("idle"), 5000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      setNewsletterStatus("error"); setTimeout(() => setNewsletterStatus("idle"), 5000); return
    }
    setIsSubmittingNewsletter(true)
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail }),
      })
      const data = await res.json()
      if (data.error === 'already_subscribed') { setNewsletterStatus("duplicate"); return }
      if (!res.ok) throw new Error('failed')
      setNewsletterEmail(""); setNewsletterStatus("success"); setTimeout(() => setNewsletterStatus("idle"), 5000)
    } catch {
      setNewsletterStatus("error"); setTimeout(() => setNewsletterStatus("idle"), 5000)
    } finally {
      setIsSubmittingNewsletter(false)
    }
  }

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount)

  const handleLearnMore = (experienceType: string) => {
    const map: { [k: string]: string } = { 'Premium Camping': 'Premium Camping', 'Adventure Activities': 'Adventure Activities', 'Curated Networking': 'Curated Networking', 'Bespoke Events': 'Bespoke Events' }
    if (map[experienceType]) setFormData({ ...formData, inquiry_type: map[experienceType] })
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    const el = aboutRef.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !aboutRevealed.current) {
        aboutRevealed.current = true
        observer.disconnect()
        let count = 0
        const id = setInterval(() => {
          count += 1
          setAboutWordsVisible(c => {
            if (c >= ABOUT_TOTAL) { clearInterval(id); return c }
            return count
          })
        }, 90)
      }
    }, { threshold: 0.05, rootMargin: '0px 0px -60px 0px' })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const scrollToContact = () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })

  useEffect(() => {
    const els = document.querySelectorAll<Element>('.reveal, .reveal-left, .reveal-right, .reveal-scale')
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target) } })
    }, { threshold: 0.12 })
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!isMenuOpen) return
    const handler = (e: MouseEvent | TouchEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setIsMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('touchstart', handler)
    return () => { document.removeEventListener('mousedown', handler); document.removeEventListener('touchstart', handler) }
  }, [isMenuOpen])

  const SectionEyebrow = ({ label }: { label: string }) => (
    <div className="reveal flex items-center gap-4 mb-10">
      <span className="text-xs tracking-[0.25em] uppercase font-semibold" style={{ color: BRAND.amber }}>{label}</span>
      <div className="flex-1 h-px" style={{ background: `rgba(254,190,3,0.2)` }} />
    </div>
  )

  return (
    <div style={{ background: BRAND.dark1, minHeight: '100vh' }}>

      {/* ── NAV ── */}
      <nav
        ref={navRef}
        className="fixed top-0 w-full z-50 transition-all duration-300"
        style={{
          background: isScrolled ? 'rgba(10,8,6,0.72)' : 'transparent',
          backdropFilter: isScrolled ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: isScrolled ? 'blur(20px)' : 'none',
          borderBottom: isScrolled ? `1px solid rgba(254,190,3,0.08)` : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            <a href="/" className="flex items-center gap-3" onClick={e => { e.preventDefault(); window.location.reload() }}>
              <Image src="/sunset-haven-logo.png" alt="Sunset Haven" width={38} height={38} className="rounded-lg" />
              <span className="font-bold text-white text-lg">Sunset Haven</span>
            </a>
            <div className="hidden md:flex items-center gap-8">
              {['Experiences', 'About', 'Contact'].map(label => (
                <a key={label} href={`#${label.toLowerCase()}`}
                  className="text-sm transition-colors"
                  style={{ color: BRAND.body }}
                  onMouseEnter={e => (e.currentTarget.style.color = BRAND.amber)}
                  onMouseLeave={e => (e.currentTarget.style.color = BRAND.body)}
                >{label}</a>
              ))}
            </div>
            <div className="hidden md:block">
              <button onClick={scrollToContact}
                className="btn-shimmer px-5 py-2 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90 hover:scale-105"
                style={{ background: BRAND.gradient }}>
                Book Now
              </button>
            </div>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-white">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden" style={{ background: 'rgba(10,8,6,0.90)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderTop: `1px solid rgba(254,190,3,0.1)` }}>
            <div className="px-6 py-8 flex flex-col gap-6">
              {['Experiences', 'About', 'Contact'].map(label => (
                <a key={label} href={`#${label.toLowerCase()}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-lg py-3 block transition-colors"
                  style={{ color: BRAND.body }}>
                  {label}
                </a>
              ))}
              <button onClick={() => { setIsMenuOpen(false); scrollToContact() }}
                className="w-fit px-6 py-3 rounded-full text-white font-semibold text-sm"
                style={{ background: BRAND.gradient }}>
                Book Now
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section className="relative w-full overflow-hidden" style={{ height: '100svh', minHeight: '600px' }}>
        {/* Full-bleed carousel */}
        <div className="absolute inset-0">
          <div className="flex h-full transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${heroImageSlide * 100}%)` }}>
            {heroImages.map((img, i) => (
              <div key={i} className="relative min-w-full h-full">
                <Image src={img} alt={`Sunset Haven ${i + 1}`} fill className="object-cover" priority loading="eager" sizes="100vw" />
              </div>
            ))}
          </div>
          {/* Overlay gradient */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(12,10,8,0.05) 0%, rgba(12,10,8,0.25) 40%, rgba(12,10,8,0.82) 100%)' }} />
          {/* Ambient orbs */}
          <div className="orb orb-amber" style={{ top: '8%', right: '12%' }} />
          <div className="orb orb-fire" style={{ bottom: '22%', left: '6%' }} />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center">
          <p className="text-xs tracking-[0.35em] uppercase font-medium mb-6" style={{ color: BRAND.amber }}>
            Tarkwa Bay Island, Lagos
          </p>
          <h1 className="font-bold text-white mb-6 text-balance"
            style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(2.4rem, 7vw, 5rem)', lineHeight: 1.1 }}>
            Your Island Escape,<br />Redefined
          </h1>
          <p className="text-lg md:text-xl mb-10 max-w-xl leading-relaxed" style={{ color: BRAND.body }}>
            Where professionals, creatives and explorers gather for experiences that matter.
          </p>
          <button onClick={scrollToContact}
            className="btn-shimmer px-8 py-4 rounded-full text-white font-semibold text-lg transition-all hover:opacity-90 hover:scale-105 shadow-xl"
            style={{ background: BRAND.gradient }}>
            Plan Your Escape →
          </button>
        </div>

        {/* Carousel dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {heroImages.map((_, i) => (
            <button key={i} onClick={() => setHeroImageSlide(i)}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{ width: i === heroImageSlide ? '2rem' : '0.5rem', background: i === heroImageSlide ? BRAND.amber : 'rgba(255,255,255,0.35)' }}
            />
          ))}
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-10 right-8 z-10 flex flex-col items-center gap-1.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
          <span className="text-xs tracking-widest uppercase" style={{ fontSize: '0.6rem' }}>Scroll</span>
          <ChevronRight size={14} className="rotate-90 animate-bounce" />
        </div>
      </section>

      {/* ── EVENTS ── */}
      <section className="py-24" style={{ background: BRAND.dark1 }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionEyebrow label="What's Happening" />
          <h2 className="reveal text-4xl md:text-5xl font-bold text-white mb-4 text-balance"
            style={{ fontFamily: 'var(--font-playfair)' }}>
            Upcoming Events
          </h2>
          <p className="reveal text-lg mb-16" style={{ color: BRAND.muted }}>
            From sunset parties to cultural celebrations - unforgettable experiences on the island.
          </p>

          {events.length === 0 ? (
            <div className="flex flex-col sm:flex-row gap-6 items-start p-6 md:p-8"
              style={{ borderLeft: `3px solid ${BRAND.amber}`, background: 'rgba(254,190,3,0.04)' }}>
              <div className="flex-1">
                <p className="font-semibold text-white mb-1">Nothing booked yet — be the first to know.</p>
                <p className="text-sm" style={{ color: BRAND.muted }}>
                  Sign up and we'll drop you a line when our next event goes live.
                </p>
              </div>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2 w-full sm:w-auto flex-col sm:flex-row">
                <Input type="email" placeholder="your@email.com" value={newsletterEmail}
                  onChange={e => setNewsletterEmail(e.target.value)}
                  className="text-white placeholder:text-[#6b6560] border-0 sm:w-60"
                  style={{ background: 'rgba(255,255,255,0.07)' }} required />
                <Button type="submit" className="text-white font-semibold px-5 whitespace-nowrap"
                  style={{ background: BRAND.gradient }} disabled={isSubmittingNewsletter}>
                  {isSubmittingNewsletter ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Notify Me'}
                </Button>
              </form>
              {newsletterStatus === 'success' && <p className="text-sm w-full sm:w-auto" style={{ color: BRAND.amber }}>You're in! We'll let you know.</p>}
              {newsletterStatus === 'duplicate' && <p className="text-sm w-full sm:w-auto" style={{ color: BRAND.amber }}>That email is already on our list.</p>}
              {newsletterStatus === 'error' && <p className="text-sm w-full sm:w-auto text-red-400">Check your email and try again.</p>}
            </div>
          ) : (
            <div>
              <div className="grid md:grid-cols-2 overflow-hidden"
                style={{ border: `1px solid rgba(254,190,3,0.1)`, background: 'rgba(255,255,255,0.02)' }}>
                <div className="relative h-80 md:h-auto" style={{ minHeight: '320px' }}>
                  <Image src={events[eventSlide].flier_url} alt={events[eventSlide].title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                </div>
                <div className="p-8 md:p-12 flex flex-col justify-between">
                  <div>
                    <p className="text-xs tracking-[0.2em] uppercase font-semibold mb-5" style={{ color: BRAND.amber }}>
                      {events.length > 1 ? `Event ${eventSlide + 1} of ${events.length}` : 'Upcoming Event'}
                    </p>
                    <p className="text-6xl font-bold mb-1" style={{ color: BRAND.amber, fontFamily: 'var(--font-playfair)' }}>
                      {new Date(events[eventSlide].event_date).getDate()}
                    </p>
                    <p className="text-sm mb-6" style={{ color: BRAND.muted }}>
                      {new Date(events[eventSlide].event_date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', year: 'numeric' })}
                    </p>
                    <h3 className="text-2xl font-bold text-white mb-3">{events[eventSlide].title}</h3>
                    <p className="text-sm leading-relaxed mb-6 line-clamp-3" style={{ color: BRAND.body }}>{events[eventSlide].description}</p>
                    {events[eventSlide].pricing_tiers && events[eventSlide].pricing_tiers.length > 0 ? (
                      <div className="space-y-2 mb-6">
                        {events[eventSlide].pricing_tiers.map((tier: any, i: number) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span style={{ color: BRAND.muted }}>{tier.label}</span>
                            <span className="text-white font-semibold">{formatCurrency(parseFloat(tier.price))}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-white font-semibold mb-6">From {formatCurrency(events[eventSlide].cost)}</p>
                    )}
                  </div>
                  <a href={events[eventSlide].paystack_payment_url} target="_blank" rel="noopener noreferrer"
                    className="inline-block text-center px-8 py-4 text-white font-semibold transition-all hover:opacity-90 hover:scale-[1.02]"
                    style={{ background: BRAND.gradient }}>
                    Grab Your Spot →
                  </a>
                </div>
              </div>
              {events.length > 1 && (
                <div className="flex items-center justify-center gap-4 mt-6">
                  <button onClick={() => setEventSlide(p => (p - 1 + events.length) % events.length)}
                    className="p-2 transition-colors" style={{ color: BRAND.muted }}
                    onMouseEnter={e => (e.currentTarget.style.color = BRAND.amber)}
                    onMouseLeave={e => (e.currentTarget.style.color = BRAND.muted)}>
                    <ChevronLeft size={20} />
                  </button>
                  <div className="flex gap-2">
                    {events.map((_, i) => (
                      <button key={i} onClick={() => setEventSlide(i)}
                        className="h-1.5 rounded-full transition-all"
                        style={{ width: i === eventSlide ? '1.5rem' : '0.375rem', background: i === eventSlide ? BRAND.amber : 'rgba(255,255,255,0.2)' }} />
                    ))}
                  </div>
                  <button onClick={() => setEventSlide(p => (p + 1) % events.length)}
                    className="p-2 transition-colors" style={{ color: BRAND.muted }}
                    onMouseEnter={e => (e.currentTarget.style.color = BRAND.amber)}
                    onMouseLeave={e => (e.currentTarget.style.color = BRAND.muted)}>
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── ABOUT + STATS ── */}
      <section id="about" ref={aboutRef as React.RefObject<HTMLDivElement>} className="py-24" style={{ background: BRAND.dark2 }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Animated eyebrow — "How It All Started" word by word */}
          <div className="flex items-center gap-4 mb-10">
            <span className="text-xs tracking-[0.25em] uppercase font-semibold" style={{ color: BRAND.amber }}>
              {ABOUT_WORDS[0].map((word, i) => (
                <span key={i} style={{ opacity: ABOUT_OFFSETS[0] + i < aboutWordsVisible ? 1 : 0, transition: 'opacity 0.2s ease' }}>{word}{' '}</span>
              ))}
            </span>
            <div className="flex-1 h-px" style={{ background: 'rgba(254,190,3,0.2)', opacity: aboutWordsVisible >= ABOUT_OFFSETS[0] + ABOUT_WORDS[0].length ? 1 : 0, transition: 'opacity 0.4s ease 0.2s' }} />
          </div>

          <div className="grid md:grid-cols-2 gap-16 mb-20">
            {/* Left: pull quote + story */}
            <div>
              <blockquote className="text-2xl md:text-3xl font-bold mb-8 leading-snug pl-6"
                style={{ color: BRAND.amber, fontFamily: 'var(--font-playfair)', borderLeft: `3px solid ${BRAND.amber}`, opacity: aboutWordsVisible >= ABOUT_OFFSETS[1] ? 1 : 0, transition: 'opacity 0.5s ease' }}>
                "Nigeria's first eco-tourism camping site designed around experience, not just accommodation."
              </blockquote>
              <p className="text-lg mb-6 leading-relaxed" style={{ color: BRAND.body }}>
                {ABOUT_WORDS[1].map((word, i) => (
                  <span key={i} style={{ opacity: ABOUT_OFFSETS[1] + i < aboutWordsVisible ? 1 : 0, transition: 'opacity 0.2s ease' }}>{word}{' '}</span>
                ))}
              </p>
              <p className="text-lg leading-relaxed" style={{ color: BRAND.body }}>
                {ABOUT_WORDS[2].map((word, i) => (
                  <span key={i} style={{ opacity: ABOUT_OFFSETS[2] + i < aboutWordsVisible ? 1 : 0, transition: 'opacity 0.2s ease' }}>{word}{' '}</span>
                ))}
              </p>
            </div>

            {/* Right: big stat numbers */}
            <div className="flex flex-col justify-center gap-10 md:pl-10"
              style={{ borderLeft: '1px solid rgba(254,190,3,0.1)' }}>
              {[
                { num: '60%', label: 'Guest Return Rate', sub: 'People don\'t just visit, they become part of the community' },
                { num: '12+', label: 'Local Jobs Created', sub: '85% of staff hired from Tarkwa Bay Island' },
                { num: '70%', label: 'Goods Sourced Locally', sub: 'Supporting island artisans and businesses' },
              ].map((stat, si) => (
                <div key={stat.num} className={`reveal-scale stagger-${si + 1}`}>
                  <p className="text-6xl md:text-7xl font-bold mb-1 leading-none"
                    style={{ color: BRAND.amber, fontFamily: 'var(--font-playfair)' }}>{stat.num}</p>
                  <p className="font-semibold text-white mb-1">{stat.label}</p>
                  <p className="text-sm" style={{ color: BRAND.muted }}>{stat.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* The Evolution - two columns */}
          <div className="grid md:grid-cols-2 gap-10 pt-12"
            style={{ borderTop: '1px solid rgba(254,190,3,0.08)' }}>
            <div>
              <h3 className="font-bold text-white mb-4">The Evolution</h3>
              <p className="leading-relaxed text-sm" style={{ color: BRAND.body }}>
                {ABOUT_WORDS[3].map((word, i) => (
                  <span key={i} style={{ opacity: ABOUT_OFFSETS[3] + i < aboutWordsVisible ? 1 : 0, transition: 'opacity 0.2s ease' }}>{word}{' '}</span>
                ))}
              </p>
            </div>
            <div>
              <p className="leading-relaxed text-sm" style={{ color: BRAND.body }}>
                {ABOUT_WORDS[4].map((word, i) => (
                  <span key={i} style={{ opacity: ABOUT_OFFSETS[4] + i < aboutWordsVisible ? 1 : 0, transition: 'opacity 0.2s ease' }}>{word}{' '}</span>
                ))}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── EXPERIENCES ── */}
      <section id="experiences" className="py-24" style={{ background: BRAND.dark1 }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-16">
          <SectionEyebrow label="What We've Built" />
          <h2 className="reveal text-4xl md:text-5xl font-bold text-white mb-4 text-balance"
            style={{ fontFamily: 'var(--font-playfair)' }}>
            Curated for You
          </h2>
          <p className="text-lg" style={{ color: BRAND.muted }}>
            More than accommodation — experiences that blend community, adventure, and sustainability.
          </p>
        </div>

        {/* 2×2 hover-reveal grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0.5">
          {experiences.map((exp, i) => (
            <div key={i} className={`reveal-scale stagger-${(i % 4) + 1} group relative overflow-hidden rounded-2xl`} style={{ height: '420px', cursor: 'pointer' }} onClick={() => handleLearnMore(exp.title)}>
              <Image src={exp.image || '/placeholder.svg'} alt={exp.title} fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy" sizes="(max-width: 768px) 100vw, 50vw" />
              {/* Default overlay */}
              <div className="absolute inset-0 transition-all duration-500"
                style={{ background: 'linear-gradient(to top, rgba(12,10,8,0.85) 0%, rgba(12,10,8,0.05) 55%)' }} />
              {/* Hover overlay */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: 'rgba(12,10,8,0.6)' }} />
              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-8 z-10">
                <h3 className="text-2xl font-bold text-white mb-3 transition-transform duration-500 group-hover:-translate-y-1"
                  style={{ fontFamily: 'var(--font-playfair)' }}>
                  {exp.title}
                </h3>
                <p className="text-sm leading-relaxed mb-5 opacity-100 md:opacity-0 md:translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500"
                  style={{ color: BRAND.body }}>
                  {exp.description}
                </p>
                <button
                  className="w-fit text-sm font-semibold px-5 py-2.5 rounded-xl text-white opacity-100 md:opacity-0 md:translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 btn-shimmer"
                  style={{ background: BRAND.gradient }}>
                  Book This →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── GALLERY ── */}
      <section className="py-24 relative overflow-hidden" style={{ background: BRAND.dark2 }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-12">
          <SectionEyebrow label="The Island Life" />
          <h2 className="reveal text-4xl md:text-5xl font-bold text-white mb-4 text-balance"
            style={{ fontFamily: 'var(--font-playfair)' }}>
            Moments That Matter
          </h2>
          <p className="text-lg" style={{ color: BRAND.muted }}>
            From sunrise meditations to sunset raves. Every weekend brings new stories.
          </p>
        </div>

        <div className="relative group">
          <button onClick={() => galleryContainerRef.current && (galleryContainerRef.current.scrollLeft -= 400)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-white"
            style={{ background: 'rgba(18,16,14,0.85)', backdropFilter: 'blur(8px)' }}>
            <ChevronLeft size={20} />
          </button>
          <button onClick={() => galleryContainerRef.current && (galleryContainerRef.current.scrollLeft += 400)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-white"
            style={{ background: 'rgba(18,16,14,0.85)', backdropFilter: 'blur(8px)' }}>
            <ChevronRight size={20} />
          </button>

          <div ref={galleryContainerRef}
            onMouseEnter={() => setIsGalleryHovered(true)}
            onMouseLeave={() => setIsGalleryHovered(false)}
            className="overflow-x-auto scrollbar-hide px-6"
            style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}>
            {galleryImages.length > 0 ? (
              <div className="flex gap-3 min-w-max">
                {galleryImages.map((img, i) => {
                  const ws = ['w-80', 'w-64', 'w-96', 'w-72', 'w-80', 'w-64']
                  return (
                    <div key={img.id} className={`relative ${ws[i % ws.length]} h-96 flex-shrink-0 overflow-hidden`}>
                      <Image src={img.image_url} alt={img.caption || 'Gallery image'} fill
                        className="object-cover hover:scale-105 transition-transform duration-700"
                        loading="lazy" sizes="400px" />
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-20 px-6" style={{ color: BRAND.muted }}>Gallery loading…</div>
            )}
          </div>
        </div>
      </section>

      {/* ── INSTAGRAM ── */}
      <section className="py-24 text-center" style={{ background: BRAND.dark1 }}>
        <div className="max-w-2xl mx-auto px-6">
          <div className="flex justify-center mb-6">
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24" style={{ color: BRAND.amber }}>
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </div>
          <h2 className="reveal text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
            Stay Connected
          </h2>
          <p className="mb-4" style={{ color: BRAND.body }}>
            Daily sunsets, island vibes, and behind-the-scenes moments.
          </p>
          <a href="https://instagram.com/sunset.haven__" target="_blank" rel="noopener noreferrer"
            className="text-2xl font-bold transition-opacity hover:opacity-70"
            style={{ color: BRAND.amber }}>
            @sunset.haven__
          </a>
          <div className="mt-8">
            <a href="https://instagram.com/sunset.haven__" target="_blank" rel="noopener noreferrer"
              className="inline-block px-8 py-3 text-white font-semibold transition-all hover:opacity-90 hover:scale-105"
              style={{ background: BRAND.gradient }}>
              Follow Along →
            </a>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24" style={{ background: BRAND.dark2 }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <SectionEyebrow label="What Guests Say" />
          <h2 className="reveal text-4xl md:text-5xl font-bold text-white mb-16 text-balance"
            style={{ fontFamily: 'var(--font-playfair)' }}>
            Travelers Tell
          </h2>

          {/* Cards — show 1 at a time on mobile, slide through */}
          <div className="overflow-hidden">
            <div className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${testimonialSlide * 100}%)` }}>
              {testimonials.map((t, i) => (
                <div key={i} className="min-w-full md:min-w-[50%] lg:min-w-[33.333%] pr-4 flex-shrink-0 max-w-full">
                  <div className="p-8 h-full flex flex-col rounded-2xl"
                    style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid rgba(254,190,3,0.1)`, overflowWrap: 'break-word', wordBreak: 'break-word', overflow: 'hidden' }}>
                    <svg className="w-7 h-7 mb-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" style={{ color: BRAND.amber, opacity: 0.5 }}>
                      <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
                    </svg>
                    <p className="text-base leading-relaxed text-white mb-6 flex-1">"{t.quote}"</p>
                    <div>
                      <p className="font-semibold text-white text-sm">{t.author}</p>
                      <p className="text-xs mt-0.5" style={{ color: BRAND.muted }}>Verified Guest</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-10">
            <button onClick={() => setTestimonialSlide(p => (p - 1 + testimonials.length) % testimonials.length)}
              className="p-2 transition-colors" style={{ color: BRAND.muted }}
              onMouseEnter={e => (e.currentTarget.style.color = BRAND.amber)}
              onMouseLeave={e => (e.currentTarget.style.color = BRAND.muted)}>
              <ChevronLeft size={20} />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setTestimonialSlide(i)}
                  className="h-1.5 rounded-full transition-all"
                  style={{ width: i === testimonialSlide ? '1.5rem' : '0.375rem', background: i === testimonialSlide ? BRAND.amber : 'rgba(255,255,255,0.2)' }} />
              ))}
            </div>
            <button onClick={() => setTestimonialSlide(p => (p + 1) % testimonials.length)}
              className="p-2 transition-colors" style={{ color: BRAND.muted }}
              onMouseEnter={e => (e.currentTarget.style.color = BRAND.amber)}
              onMouseLeave={e => (e.currentTarget.style.color = BRAND.muted)}>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="py-24" style={{ background: BRAND.dark1 }}>
        <div className="max-w-2xl mx-auto px-6 text-center">
          <SectionEyebrow label="Get In Touch" />
          <h2 className="reveal text-4xl md:text-5xl font-bold text-white mb-4 text-balance"
            style={{ fontFamily: 'var(--font-playfair)' }}>
            Ready for your island escape?
          </h2>
          <p className="text-lg mb-12" style={{ color: BRAND.muted }}>
            Reach out and we'll make it happen.
          </p>

          <form onSubmit={handleFormSubmit} className="reveal-right space-y-4 text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: BRAND.body }}>Name</label>
                <Input placeholder="Your name" value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="text-white placeholder:text-[#6b6560] border-0"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                  disabled={isSubmitting} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: BRAND.body }}>Phone</label>
                <Input type="tel" placeholder="Your phone number" value={formData.phone}
                  onChange={e => {
                    const val = e.target.value.replace(/[^0-9+\s\-()]/g, '')
                    setFormData({ ...formData, phone: val })
                    setPhoneError("")
                  }}
                  className="text-white placeholder:text-[#6b6560] border-0"
                  style={{ background: 'rgba(255,255,255,0.06)', borderColor: phoneError ? 'rgba(255,63,2,0.5)' : undefined }}
                  disabled={isSubmitting} required />
                {phoneError && <p className="text-xs mt-1" style={{ color: '#FF3F02' }}>{phoneError}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: BRAND.body }}>What are you inquiring about?</label>
              <Select value={formData.inquiry_type} onValueChange={v => setFormData({ ...formData, inquiry_type: v })} disabled={isSubmitting} required>
                <SelectTrigger className="text-white border-0" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Premium Camping">Premium Camping</SelectItem>
                  <SelectItem value="Adventure Activities">Adventure Activities</SelectItem>
                  <SelectItem value="Curated Networking">Curated Networking</SelectItem>
                  <SelectItem value="Bespoke Events">Bespoke Events</SelectItem>
                  <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                  <SelectItem value="Partnership Opportunities">Partnership Opportunities</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: BRAND.body }}>Message</label>
              <Textarea placeholder="Tell us what you have in mind" rows={4} value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                className="text-white placeholder:text-[#6b6560] border-0 resize-none"
                style={{ background: 'rgba(255,255,255,0.06)' }}
                disabled={isSubmitting} required />
            </div>

            {submitStatus === 'success' && (
              <div className="p-4 text-left" style={{ background: 'rgba(254,190,3,0.07)', borderLeft: `3px solid ${BRAND.amber}` }}>
                <p className="text-white text-sm">Thank you! Your inquiry has been submitted. We'll get back to you soon.</p>
              </div>
            )}
            {submitStatus === 'error' && (
              <div className="p-4 text-left" style={{ background: 'rgba(255,63,2,0.07)', borderLeft: `3px solid ${BRAND.fire}` }}>
                <p className="text-red-400 text-sm">Please fill all fields and try again.</p>
              </div>
            )}

            <Button type="submit" className="w-full text-white font-semibold py-4 text-base transition-all hover:opacity-90"
              style={{ background: BRAND.gradient }} disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending…</> : "Let's Make It Happen →"}
            </Button>
          </form>

          {/* Contact info pills — click to copy */}
          <div className="flex flex-wrap justify-center gap-3 mt-10">
            {[
              footerSettings?.email || 'tarkwabaylifestyle@gmail.com',
              footerSettings?.phone || '+234 806 935 9028',
              footerSettings?.address || 'Tarkwa Bay Island, Lagos',
            ].map((info, i) => (
              <button key={i} onClick={() => handleCopy(info, i)}
                className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl transition-all"
                style={{
                  background: copiedIndex === i ? 'rgba(254,190,3,0.1)' : 'rgba(255,255,255,0.04)',
                  color: copiedIndex === i ? BRAND.amber : BRAND.body,
                  border: copiedIndex === i ? `1px solid rgba(254,190,3,0.3)` : '1px solid rgba(255,255,255,0.07)',
                  cursor: 'pointer',
                }}>
                {info}
                {copiedIndex === i
                  ? <Check size={13} style={{ color: BRAND.amber }} />
                  : <Copy size={13} style={{ color: BRAND.muted }} />}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-16" style={{ background: BRAND.dark3, borderTop: '1px solid rgba(254,190,3,0.08)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-12">
            <Image src="/sunset-haven-logo.png" alt="Sunset Haven" width={36} height={36} className="rounded-lg" />
            <span className="font-bold text-white">Sunset Haven</span>
          </div>
          <div className="grid md:grid-cols-3 gap-10 mb-12">
            <div>
              <h4 className="text-xs tracking-[0.2em] uppercase font-semibold mb-5" style={{ color: BRAND.amber }}>Contact</h4>
              <div className="space-y-2 text-sm" style={{ color: BRAND.muted }}>
                <p>{footerSettings?.email || 'tarkwabaylifestyle@gmail.com'}</p>
                <p>{footerSettings?.phone || '+234 806 935 9028'}</p>
                <p>{footerSettings?.address || 'Tarkwa Bay Island, Lagos'}</p>
                <p>{footerSettings?.additional_info || '15 minutes by boat from Lagos'}</p>
              </div>
            </div>
            <div>
              <h4 className="text-xs tracking-[0.2em] uppercase font-semibold mb-5" style={{ color: BRAND.amber }}>Follow Us</h4>
              <div className="space-y-2 text-sm">
                <a href={footerSettings?.instagram_url || 'https://instagram.com/sunset.haven__'} target="_blank" rel="noopener noreferrer"
                  className="block transition-colors"
                  style={{ color: BRAND.muted }}
                  onMouseEnter={e => (e.currentTarget.style.color = BRAND.amber)}
                  onMouseLeave={e => (e.currentTarget.style.color = BRAND.muted)}>
                  {footerSettings?.instagram_handle || '@sunset.haven__'}
                </a>
                <p style={{ color: BRAND.muted }}>{footerSettings?.availability_text || 'Year-round availability'}</p>
                <p style={{ color: BRAND.muted }}>{footerSettings?.transport_text || 'Boat transport available'}</p>
              </div>
            </div>
            <div>
              <h4 className="text-xs tracking-[0.2em] uppercase font-semibold mb-5" style={{ color: BRAND.amber }}>Legal</h4>
              <div className="space-y-2 text-sm">
                <a href="#" className="block transition-colors" style={{ color: BRAND.muted }}
                  onMouseEnter={e => (e.currentTarget.style.color = BRAND.amber)}
                  onMouseLeave={e => (e.currentTarget.style.color = BRAND.muted)}>
                  Privacy Policy
                </a>
                <a href="#" className="block transition-colors" style={{ color: BRAND.muted }}
                  onMouseEnter={e => (e.currentTarget.style.color = BRAND.amber)}
                  onMouseLeave={e => (e.currentTarget.style.color = BRAND.muted)}>
                  Accessibility Statement
                </a>
              </div>
            </div>
          </div>
          <div className="pt-8 text-center text-sm" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', color: BRAND.muted }}>
            <p>{footerSettings?.copyright_text || '© 2025 by Sunset Haven. Powered and secured by Vercel.'}</p>
          </div>
        </div>
      </footer>

    </div>
  )
}
