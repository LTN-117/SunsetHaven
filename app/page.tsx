"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Menu, X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/lib/supabase"

export default function SunsetHavenResort() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [heroImageSlide, setHeroImageSlide] = useState(0)
  const [testimonialSlide, setTestimonialSlide] = useState(0)

  // Contact form state
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    inquiry_type: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  // Gallery auto-scroll state
  const [galleryScrollPosition, setGalleryScrollPosition] = useState(0)
  const [isGalleryHovered, setIsGalleryHovered] = useState(false)
  const galleryContainerRef = useRef<HTMLDivElement>(null)

  // Footer settings state
  const [footerSettings, setFooterSettings] = useState<any>(null)

  // Hero images from database
  const [heroImages, setHeroImages] = useState<string[]>([
    "/IMG_8277.JPG",
    "/IMG_8282.JPG",
    "/IMG_8285.JPG"
  ])

  // Gallery images for "Moments That Matter"
  const [galleryImages, setGalleryImages] = useState<any[]>([])

  // Events state
  const [events, setEvents] = useState<any[]>([])
  const [eventSlide, setEventSlide] = useState(0)
  const [newsletterEmail, setNewsletterEmail] = useState("")
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "success" | "error">("idle")
  const [isSubmittingNewsletter, setIsSubmittingNewsletter] = useState(false)

  // Load hero images from database
  useEffect(() => {
    const loadHeroImages = async () => {
      try {
        const { data, error } = await supabase
          .from('gallery_images')
          .select('image_url')
          .eq('show_in_hero', true)
          .eq('is_active', true)
          .order('display_order', { ascending: true })

        if (error) throw error
        if (data && data.length > 0) {
          setHeroImages(data.map(img => img.image_url))
        }
      } catch (error) {
        console.error('Error loading hero images:', error)
      }
    }

    loadHeroImages()
  }, [])

  // Load gallery images from database
  useEffect(() => {
    const loadGalleryImages = async () => {
      try {
        const { data, error } = await supabase
          .from('gallery_images')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true })
          .limit(12)

        if (error) throw error
        setGalleryImages(data || [])
      } catch (error) {
        console.error('Error loading gallery images:', error)
      }
    }

    loadGalleryImages()
  }, [])

  // Load footer settings from database
  useEffect(() => {
    const loadFooterSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('footer_settings')
          .select('*')
          .single()

        if (error) throw error
        setFooterSettings(data)
      } catch (error) {
        console.error('Error loading footer settings:', error)
      }
    }

    loadFooterSettings()
  }, [])

  // Load upcoming events from database
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const today = new Date().toISOString().split('T')[0]
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('is_active', true)
          .gte('event_date', today)
          .order('event_date', { ascending: true })
          .limit(5)

        if (error) throw error
        setEvents(data || [])
      } catch (error) {
        console.error('Error loading events:', error)
      }
    }

    loadEvents()
  }, [])

  useEffect(() => {
    const heroInterval = setInterval(() => {
      setHeroImageSlide((prev) => (prev + 1) % heroImages.length)
    }, 5000)

    return () => clearInterval(heroInterval)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.scroll-section')

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect()
        const windowHeight = window.innerHeight

        // Calculate how much of the section is in view
        const inViewPercentage = Math.max(0, Math.min(1,
          (windowHeight - rect.top) / (windowHeight + rect.height)
        ))

        // Apply zoom based on scroll position (sharper effect, no opacity change)
        if (inViewPercentage > 0 && inViewPercentage < 1) {
          const scale = 0.7 + (inViewPercentage * 0.3) // Scale from 0.7 to 1 (more dramatic)

          ;(section as HTMLElement).style.transform = `scale(${scale})`
          ;(section as HTMLElement).style.opacity = '1' // Keep opacity at 1 to prevent fading
        } else if (inViewPercentage >= 1) {
          ;(section as HTMLElement).style.transform = 'scale(1)'
          ;(section as HTMLElement).style.opacity = '1'
        } else {
          // When section is not in view at all
          ;(section as HTMLElement).style.transform = 'scale(0.7)'
          ;(section as HTMLElement).style.opacity = '1'
        }
      })
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial check

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Gallery auto-scroll effect
  useEffect(() => {
    const galleryInterval = setInterval(() => {
      if (!isGalleryHovered && galleryContainerRef.current) {
        const container = galleryContainerRef.current
        const scrollAmount = 1 // Slow scroll speed

        if (container.scrollLeft >= container.scrollWidth - container.clientWidth - 10) {
          // Reset to start when reaching end
          container.scrollLeft = 0
        } else {
          container.scrollLeft += scrollAmount
        }
      }
    }, 30) // Run every 30ms for smooth scrolling

    // Start scrolling after 1.5s delay
    const startDelay = setTimeout(() => {
      return galleryInterval
    }, 1500)

    return () => {
      clearInterval(galleryInterval)
      clearTimeout(startDelay)
    }
  }, [isGalleryHovered])

  // Handle contact form submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!formData.name || !formData.phone || !formData.inquiry_type || !formData.message) {
      setSubmitStatus("error")
      setTimeout(() => setSubmitStatus("idle"), 3000)
      return
    }

    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      const { error } = await supabase
        .from("inquiries")
        .insert([
          {
            name: formData.name,
            phone: formData.phone,
            inquiry_type: formData.inquiry_type,
            message: formData.message,
            status: "new"
          }
        ])

      if (error) throw error

      // Success - reset form and show success message
      setFormData({ name: "", phone: "", inquiry_type: "", message: "" })
      setSubmitStatus("success")
      setTimeout(() => setSubmitStatus("idle"), 5000)
    } catch (error) {
      console.error("Error submitting form:", error)
      setSubmitStatus("error")
      setTimeout(() => setSubmitStatus("idle"), 5000)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle newsletter signup
  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      setNewsletterStatus("error")
      setTimeout(() => setNewsletterStatus("idle"), 5000)
      return
    }

    setIsSubmittingNewsletter(true)
    try {
      const { error } = await supabase
        .from("event_newsletter_signups")
        .insert([{ email: newsletterEmail }])

      if (error) {
        // Check if email already exists
        if (error.code === '23505') {
          setNewsletterStatus("error")
          setTimeout(() => setNewsletterStatus("idle"), 5000)
          return
        }
        throw error
      }

      setNewsletterEmail("")
      setNewsletterStatus("success")
      setTimeout(() => setNewsletterStatus("idle"), 5000)
    } catch (error) {
      console.error("Error subscribing to newsletter:", error)
      setNewsletterStatus("error")
      setTimeout(() => setNewsletterStatus("idle"), 5000)
    } finally {
      setIsSubmittingNewsletter(false)
    }
  }

  const formatEventDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-NG').format(num)
  }

  const handleLearnMore = (experienceType: string) => {
    // Map experience titles to inquiry types (using the same values as SelectItem)
    const inquiryTypeMap: { [key: string]: string } = {
      'Premium Camping': 'Premium Camping',
      'Adventure Activities': 'Adventure Activities',
      'Curated Networking': 'Curated Networking',
      'Bespoke Events': 'Bespoke Events'
    }

    const inquiryType = inquiryTypeMap[experienceType]
    if (inquiryType) {
      setFormData({ ...formData, inquiry_type: inquiryType })
    }

    // Scroll to contact form
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  // Experience cards with dynamic images from database
  const [experiences, setExperiences] = useState([
    {
      title: "Premium Camping",
      description:
        "Experience our eco-tourism camping site with proper beds, duvets and blankets in premium tents. Wake up to stunning island views and the sound of waves. Comfort meets nature in the perfect balance.",
      image: "/premium-camping.jpg",
      tag: "premium-camping"
    },
    {
      title: "Adventure Activities",
      description:
        "Island exploration, water sports, sunset sessions, quad bike rides, paint & sip, board games, meditation, journaling, and more. Every day brings new experiences.",
      image: "/adventure-activities.jpg",
      tag: "adventure-activities"
    },
    {
      title: "Bespoke Events",
      description:
        "From corporate retreats to themed celebrations, raves to intimate gatherings. We coordinate unforgettable experiences tailored to your vision.",
      image: "/bespoke-events.jpg",
      tag: "bespoke-events"
    },
    {
      title: "Curated Networking",
      description:
        "Join 600-1000+ monthly guests who return for the community. Connect with professionals, creatives, and explorers. Build relationships that last beyond your stay.",
      image: "/curated-networking.jpg",
      tag: "curated-networking"
    },
  ])

  // Load tagged images for experience cards
  useEffect(() => {
    const loadExperienceImages = async () => {
      try {
        const { data, error } = await supabase
          .from('gallery_images')
          .select('tag, image_url')
          .not('tag', 'is', null)
          .eq('is_active', true)
          .in('tag', ['premium-camping', 'adventure-activities', 'curated-networking', 'bespoke-events'])

        if (error) throw error

        if (data && data.length > 0) {
          // Update experiences with images from database
          setExperiences(prev => prev.map(exp => {
            const taggedImage = data.find(img => img.tag === exp.tag)
            return taggedImage ? { ...exp, image: taggedImage.image_url } : exp
          }))
        }
      } catch (error) {
        console.error('Error loading experience images:', error)
      }
    }

    loadExperienceImages()
  }, [])

  // Testimonials from database
  const [testimonials, setTestimonials] = useState<any[]>([
    {
      quote: "Everything about Sunset Haven was my favorite part",
      author: "Guest Review",
      text: "I love the feeling of waking up at night and feeling safe that Sunset Haven gives. It was great and I totally enjoyed my stay.",
    },
    {
      quote: "Perfect, awesome, wonderful, beautiful, peaceful",
      author: "Guest Review",
      text: "I love the sunsets there. I enjoyed waking up to watch the sunrise. The staff are very warm and welcoming.",
    },
  ])

  // Load testimonials from database
  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true })

        if (error) throw error
        if (data && data.length > 0) {
          // Map database fields to component format
          setTestimonials(data.map(t => ({
            quote: t.quote,
            author: t.guest_name + (t.guest_role ? `, ${t.guest_role}` : ''),
            text: t.quote // Using quote as the main text
          })))
        }
      } catch (error) {
        console.error('Error loading testimonials:', error)
      }
    }

    loadTestimonials()
  }, [])

  return (
    <div className="min-h-screen relative" style={{
      background: '#0a0a0a',
      backgroundImage: 'linear-gradient(rgba(10, 10, 10, 0.85), rgba(10, 10, 10, 0.85)), url(/IMG_8277.JPG)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <nav className="fixed top-0 w-full z-50 text-white backdrop-blur-sm rounded-b-3xl" style={{ background: 'linear-gradient(135deg, rgba(254, 190, 3, 0.95) 0%, rgba(255, 63, 2, 0.95) 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <Image
                src="/sunset-haven-logo.png"
                alt="Sunset Haven Logo"
                width={48}
                height={48}
                className="rounded-lg"
              />
              <span className="font-bold text-xl">Sunset Haven</span>
            </div>

            {/* Center - Navigation Links */}
            <div className="hidden md:flex space-x-8">
              <a href="#experiences" className="hover:opacity-80 transition-opacity font-medium">
                Experiences
              </a>
              <a href="#about" className="hover:opacity-80 transition-opacity font-medium">
                About
              </a>
              <a href="#contact" className="hover:opacity-80 transition-opacity font-medium">
                Contact
              </a>
            </div>

            {/* Right - Menu Icon */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 md:hidden rounded-full">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-white/20 rounded-b-3xl" style={{ background: 'linear-gradient(135deg, #FEBE03 0%, #FF3F02 100%)' }}>
            <div className="px-4 py-4 space-y-3">
              <a href="#experiences" className="block hover:opacity-80 py-2 font-medium">
                Experiences
              </a>
              <a href="#about" className="block hover:opacity-80 py-2 font-medium">
                About
              </a>
              <a href="#contact" className="block hover:opacity-80 py-2 font-medium">
                Contact
              </a>
            </div>
          </div>
        )}
      </nav>

      <section className="scroll-section neon-border relative pt-20 pb-20 rounded-3xl overflow-hidden" style={{
        '--section-bg': 'linear-gradient(135deg, rgba(10, 10, 10, 0.95) 0%, rgba(20, 20, 30, 0.95) 100%)',
        background: 'linear-gradient(135deg, rgba(10, 10, 10, 0.95) 0%, rgba(20, 20, 30, 0.95) 100%)',
        position: 'relative'
      } as React.CSSProperties}>
        {/* Subtle background image overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'url(/IMG_8277.JPG)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          mixBlendMode: 'overlay'
        }}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Static Text Content */}
            <div className="animate-slide-in-left">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 text-balance">Your Island Escape, Redefined</h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Where professionals, creatives, and explorers gather for experiences that matter. We blend luxury with sustainability, networking with adventure, work with play.
              </p>
              <Button
                size="lg"
                onClick={() => {
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="text-white px-8 py-3 text-lg rounded-full hover:opacity-90 hover:scale-105 transition-all duration-300"
                style={{ background: 'linear-gradient(135deg, #FF3F02 0%, #FEBE03 100%)' }}
              >
                Book Your Experience - Get Quote
              </Button>
            </div>

            {/* Image Carousel - Only images change */}
            <div className="relative h-96 md:h-full rounded-3xl overflow-hidden shadow-lg animate-slide-in-right">
              {/* Images Container */}
              <div className="relative w-full h-full">
                <div
                  className="flex transition-transform duration-700 ease-in-out h-full"
                  style={{ transform: `translateX(-${heroImageSlide * 100}%)` }}
                >
                  {heroImages.map((image, index) => (
                    <div key={index} className="min-w-full h-full">
                      <Image
                        src={image}
                        alt={`Sunset Haven Resort ${index + 1}`}
                        fill
                        className="object-cover"
                        priority={index === 0}
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Arrows - Inside Image Container */}
              <button
                onClick={() => setHeroImageSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all z-10"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={() => setHeroImageSlide((prev) => (prev + 1) % heroImages.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all z-10"
              >
                <ChevronRight size={24} />
              </button>

              {/* Dots Indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {heroImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setHeroImageSlide(index)}
                    className={`h-3 rounded-full transition-all ${
                      index === heroImageSlide ? 'w-8' : 'w-3'
                    }`}
                    style={{
                      background: index === heroImageSlide
                        ? 'linear-gradient(135deg, #FF3F02 0%, #FEBE03 100%)'
                        : '#FFFFFF'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="scroll-section neon-border py-20 rounded-3xl" style={{
        '--section-bg': 'linear-gradient(135deg, rgba(15, 15, 25, 0.95) 0%, rgba(10, 10, 15, 0.95) 100%)',
        background: 'linear-gradient(135deg, rgba(15, 15, 25, 0.95) 0%, rgba(10, 10, 15, 0.95) 100%)',
        position: 'relative'
      } as React.CSSProperties}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold mb-2 text-gray-500">What's Happening</p>
            <h2 className="text-5xl md:text-6xl font-bold mb-4 text-white">Upcoming Events</h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              From sunset parties to cultural celebrations, join us for unforgettable experiences on the island.
            </p>
          </div>

          {events.length === 0 ? (
            /* No Events - Email Capture */
            <div className="max-w-2xl mx-auto rounded-3xl overflow-hidden border border-gray-800 p-8 md:p-12 text-center" style={{
              background: 'rgba(20, 20, 30, 0.6)',
              backdropFilter: 'blur(10px)'
            }}>
              <div className="mb-6">
                <svg className="w-20 h-20 mx-auto text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">No Upcoming Events Yet</h3>
              <p className="text-gray-400 mb-8">
                Be the first to know when we announce our next event! Sign up for our newsletter and get exclusive early-bird access.
              </p>

              <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="flex-1 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                    required
                  />
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-[#FF3F02] to-[#FEBE03] text-white hover:opacity-90 px-8"
                    disabled={isSubmittingNewsletter}
                  >
                    {isSubmittingNewsletter ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Notify Me'
                    )}
                  </Button>
                </div>

                {newsletterStatus === "success" && (
                  <p className="mt-4 text-green-400 text-sm">
                    Thank you! We'll notify you when new events are announced.
                  </p>
                )}
                {newsletterStatus === "error" && (
                  <p className="mt-4 text-red-400 text-sm">
                    Please enter a valid email address.
                  </p>
                )}
              </form>
            </div>
          ) : events.length === 1 ? (
            /* Single Event - Large Card */
            <div className="max-w-4xl mx-auto rounded-3xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all" style={{
              background: 'rgba(20, 20, 30, 0.6)',
              backdropFilter: 'blur(10px)'
            }}>
              <div className="grid md:grid-cols-2 gap-0">
                {/* Event Flier */}
                <div className="relative h-96 md:h-auto">
                  <Image
                    src={events[0].flier_url}
                    alt={events[0].title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>

                {/* Event Details */}
                <div className="p-8 md:p-10 flex flex-col justify-between">
                  <div>
                    <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4"
                      style={{ background: 'linear-gradient(135deg, #FF3F02 0%, #FEBE03 100%)' }}>
                      Upcoming Event
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-4">{events[0].title}</h3>
                    <p className="text-gray-300 mb-6 leading-relaxed">{events[0].description}</p>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-gray-400">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-white">{formatEventDate(events[0].event_date)}</span>
                      </div>

                      {/* Pricing Tiers */}
                      {events[0].pricing_tiers && events[0].pricing_tiers.length > 0 ? (
                        <div className="space-y-2">
                          <p className="text-gray-400 text-sm font-semibold">Pricing:</p>
                          {events[0].pricing_tiers.map((tier: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between bg-gray-800/30 px-3 py-2 rounded-lg">
                              <span className="text-white text-sm">{tier.label}</span>
                              <span className="text-white font-semibold">{formatCurrency(parseFloat(tier.price))}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 text-gray-400">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-white font-semibold">From {formatCurrency(events[0].cost)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <a
                    href={events[0].paystack_payment_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-center px-8 py-4 rounded-full text-white font-semibold hover:opacity-90 transition-opacity"
                    style={{ background: 'linear-gradient(135deg, #FF3F02 0%, #FEBE03 100%)' }}
                  >
                    Get Tickets
                  </a>
                </div>
              </div>
            </div>
          ) : (
            /* Multiple Events - Carousel */
            <div className="relative max-w-4xl mx-auto">
              <div className="rounded-3xl overflow-hidden border border-gray-800" style={{
                background: 'rgba(20, 20, 30, 0.6)',
                backdropFilter: 'blur(10px)'
              }}>
                <div className="grid md:grid-cols-2 gap-0">
                  {/* Event Flier */}
                  <div className="relative h-96 md:h-auto">
                    <Image
                      src={events[eventSlide].flier_url}
                      alt={events[eventSlide].title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>

                  {/* Event Details */}
                  <div className="p-8 md:p-10 flex flex-col justify-between">
                    <div>
                      <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4"
                        style={{ background: 'linear-gradient(135deg, #FF3F02 0%, #FEBE03 100%)' }}>
                        Event {eventSlide + 1} of {events.length}
                      </div>
                      <h3 className="text-3xl font-bold text-white mb-4">{events[eventSlide].title}</h3>
                      <p className="text-gray-300 mb-6 leading-relaxed line-clamp-4">{events[eventSlide].description}</p>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 text-gray-400">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-white">{formatEventDate(events[eventSlide].event_date)}</span>
                        </div>

                        {/* Pricing Tiers */}
                        {events[eventSlide].pricing_tiers && events[eventSlide].pricing_tiers.length > 0 ? (
                          <div className="space-y-2">
                            <p className="text-gray-400 text-sm font-semibold">Pricing:</p>
                            {events[eventSlide].pricing_tiers.map((tier: any, idx: number) => (
                              <div key={idx} className="flex items-center justify-between bg-gray-800/30 px-3 py-2 rounded-lg">
                                <span className="text-white text-sm">{tier.label}</span>
                                <span className="text-white font-semibold">{formatCurrency(parseFloat(tier.price))}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 text-gray-400">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-white font-semibold">From {formatCurrency(events[eventSlide].cost)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <a
                      href={events[eventSlide].paystack_payment_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block text-center px-8 py-4 rounded-full text-white font-semibold hover:opacity-90 transition-opacity"
                      style={{ background: 'linear-gradient(135deg, #FF3F02 0%, #FEBE03 100%)' }}
                    >
                      Get Tickets
                    </a>
                  </div>
                </div>
              </div>

              {/* Carousel Controls */}
              <div className="flex items-center justify-center gap-4 mt-6">
                <button
                  onClick={() => setEventSlide((eventSlide - 1 + events.length) % events.length)}
                  className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition-colors"
                  aria-label="Previous event"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex gap-2">
                  {events.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setEventSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all ${index === eventSlide ? 'w-8 bg-gradient-to-r from-[#FF3F02] to-[#FEBE03]' : 'bg-gray-600 hover:bg-gray-500'}`}
                      aria-label={`Go to event ${index + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => setEventSlide((eventSlide + 1) % events.length)}
                  className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition-colors"
                  aria-label="Next event"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <section id="about" className="scroll-section neon-border py-20 text-white rounded-3xl relative overflow-hidden" style={{
        '--section-bg': 'linear-gradient(135deg, #FF3F02 0%, #FEBE03 100%)',
        background: 'linear-gradient(135deg, #FF3F02 0%, #FEBE03 100%)',
        position: 'relative'
      } as React.CSSProperties}>
        {/* Subtle background image overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'url(/IMG_8277.JPG)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          mixBlendMode: 'overlay'
        }}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left Content */}
            <div>
              <p className="text-sm font-semibold mb-4 opacity-90">How It All Started</p>
              <h2 className="text-5xl md:text-6xl font-bold mb-8">The Tarkwa Bay Story</h2>
              <p className="text-lg leading-relaxed opacity-95 mb-6">
                Four years ago, we were running pop-up camping events on Tarkwa Bay, small gatherings for creatives who craved something beyond the usual weekend options.
              </p>
              <p className="text-lg leading-relaxed opacity-95">
                What started as intimate parties quickly revealed something bigger: people were hungry for experiential tourism that connected them with nature, community, and purpose.
              </p>
            </div>

            {/* Right Content */}
            <div className="space-y-8">
              <div className="bg-white/10 rounded-3xl p-8">
                <h3 className="text-2xl font-bold mb-4">The Evolution</h3>
                <p className="text-lg leading-relaxed opacity-95 mb-4">
                  Our pop-ups kept selling out. People weren't just coming once, they were bringing friends, requesting longer stays, asking for workspace options. The demand outgrew our pop-up model.
                </p>
                <p className="text-lg leading-relaxed opacity-95">
                  Instead of chasing venues, We created our own dedicated space. Somewhere purpose-built for the community we'd discovered.
                </p>
              </div>
              <div className="bg-white/10 rounded-3xl p-8">
                <p className="text-xl font-bold leading-relaxed opacity-95">
                  Nigeria's first eco-tourism camping site designed around experience, not just accommodation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats Section */}
      <section className="scroll-section neon-border pt-20 pb-4 rounded-3xl" style={{
        '--section-bg': 'linear-gradient(135deg, rgba(15, 15, 25, 0.95) 0%, rgba(10, 10, 15, 0.95) 100%)',
        background: 'linear-gradient(135deg, rgba(15, 15, 25, 0.95) 0%, rgba(10, 10, 15, 0.95) 100%)',
        position: 'relative'
      } as React.CSSProperties}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl md:text-6xl font-bold text-center mb-4 text-white">Impact In Numbers</h2>
          <p className="text-center text-gray-400 text-lg mb-16 max-w-2xl mx-auto">
            When you stay with us, you're directly supporting island economic development
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Stat 1 */}
            <div className="text-center p-8 rounded-3xl border border-gray-800" style={{
              background: 'rgba(20, 20, 30, 0.5)',
              backdropFilter: 'blur(10px)'
            }}>
              <div className="text-6xl font-bold mb-4" style={{ background: 'linear-gradient(135deg, #FF3F02 0%, #FEBE03 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                60%
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Guest Return Rate</h3>
              <p className="text-gray-400">
                People don't just visit, they become part of the community
              </p>
            </div>

            {/* Stat 2 */}
            <div className="text-center p-8 rounded-3xl border border-gray-800" style={{
              background: 'rgba(20, 20, 30, 0.5)',
              backdropFilter: 'blur(10px)'
            }}>
              <div className="text-6xl font-bold mb-4" style={{ background: 'linear-gradient(135deg, #FF3F02 0%, #FEBE03 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                12+
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Local Jobs Created</h3>
              <p className="text-gray-400">
                85% of staff hired from Tarkwa Bay Island
              </p>
            </div>

            {/* Stat 3 */}
            <div className="text-center p-8 rounded-3xl border border-gray-800" style={{
              background: 'rgba(20, 20, 30, 0.5)',
              backdropFilter: 'blur(10px)'
            }}>
              <div className="text-6xl font-bold mb-4" style={{ background: 'linear-gradient(135deg, #FF3F02 0%, #FEBE03 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                70%
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Goods Sourced Locally</h3>
              <p className="text-gray-400">
                Supporting island artisans and businesses
              </p>
            </div>

            {/* Stat 4 */}
            <div className="text-center p-8 rounded-3xl border border-gray-800" style={{
              background: 'rgba(20, 20, 30, 0.5)',
              backdropFilter: 'blur(10px)'
            }}>
              <div className="text-6xl font-bold mb-4" style={{ background: 'linear-gradient(135deg, #FF3F02 0%, #FEBE03 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                30%
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Carbon Reduction</h3>
              <p className="text-gray-400">
                Compared to traditional resort locations
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              We've invested in local events, beach clean ups and artisan partnerships. Off-grid operations powered entirely by renewable energy.
            </p>
          </div>
        </div>
      </section>

      <section id="experiences" className="scroll-section neon-border pb-20 rounded-3xl" style={{
        '--section-bg': 'linear-gradient(135deg, rgba(10, 10, 15, 0.95) 0%, rgba(15, 15, 20, 0.95) 100%)',
        background: 'linear-gradient(135deg, rgba(10, 10, 15, 0.95) 0%, rgba(15, 15, 20, 0.95) 100%)',
        position: 'relative'
      } as React.CSSProperties}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl md:text-6xl font-bold text-center mb-4 text-white">What We've Built</h2>
          <p className="text-center text-gray-400 text-lg mb-16 max-w-2xl mx-auto">
            More than just accommodation - curated experiences that blend community, adventure, and sustainability.
          </p>

          {/* Experience Cards */}
          <div className="space-y-12">
            {experiences.map((experience, index) => (
              <div
                key={index}
                className="rounded-3xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all"
                style={{
                  background: 'rgba(20, 20, 30, 0.6)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <div
                  className={`grid md:grid-cols-2 gap-0 items-stretch ${index % 2 === 1 ? "md:flex-row-reverse" : ""}`}
                >
                  {/* Image */}
                  <div className={`relative h-96 md:h-auto ${index % 2 === 1 ? "md:order-2" : "md:order-1"}`}>
                    <Image
                      src={experience.image || "/placeholder.svg"}
                      alt={experience.title}
                      fill
                      className="object-cover"
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>

                  {/* Content */}
                  <div
                    className={`p-8 md:p-12 flex flex-col justify-center ${index % 2 === 1 ? "md:order-1" : "md:order-2"}`}
                  >
                    <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white">{experience.title}</h3>
                    <p className="text-lg leading-relaxed text-gray-300 mb-6">{experience.description}</p>
                    <div>
                      <Button
                        onClick={() => handleLearnMore(experience.title)}
                        className="bg-gradient-to-r from-[#FF3F02] to-[#FEBE03] text-white hover:opacity-90"
                      >
                        Learn More
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events Gallery Section */}
      <section className="scroll-section neon-border py-20 rounded-3xl" style={{
        '--section-bg': 'linear-gradient(135deg, rgba(15, 15, 25, 0.95) 0%, rgba(10, 10, 15, 0.95) 100%)',
        background: 'linear-gradient(135deg, rgba(15, 15, 25, 0.95) 0%, rgba(10, 10, 15, 0.95) 100%)',
        position: 'relative'
      } as React.CSSProperties}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-6xl font-bold mb-4 text-white">Moments That Matter</h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              From sunrise meditations to sunset raves, intimate gatherings to epic celebrations. Every weekend brings new stories.
            </p>
          </div>

          {/* Horizontal Scrolling Gallery - Layout B */}
          <div className="relative group">
            {/* Subtle Left Arrow */}
            <button
              onClick={() => {
                if (galleryContainerRef.current) {
                  galleryContainerRef.current.scrollLeft -= 400
                }
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Subtle Right Arrow */}
            <button
              onClick={() => {
                if (galleryContainerRef.current) {
                  galleryContainerRef.current.scrollLeft += 400
                }
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Scrolling Container */}
            <div
              ref={galleryContainerRef}
              onMouseEnter={() => setIsGalleryHovered(true)}
              onMouseLeave={() => setIsGalleryHovered(false)}
              className="overflow-x-auto scrollbar-hide"
              style={{
                scrollBehavior: 'smooth',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              {/* Two Rows Grid */}
              {galleryImages.length > 0 ? (
                <div className="grid grid-rows-2 gap-4 min-w-max pr-8">
                  {/* Row 1 - First half of images */}
                  <div className="flex gap-4">
                    {galleryImages.slice(0, Math.ceil(galleryImages.length / 2)).map((image, index) => {
                      const widths = ['w-96', 'w-72', 'w-72', 'w-96', 'w-80', 'w-96']
                      return (
                        <div key={image.id} className={`relative ${widths[index % widths.length]} h-64`}>
                          <Image
                            src={image.image_url}
                            alt={image.caption || 'Gallery image'}
                            fill
                            className="object-cover rounded-3xl"
                            loading="lazy"
                            sizes="(max-width: 768px) 50vw, 400px"
                          />
                        </div>
                      )
                    })}
                  </div>

                  {/* Row 2 - Second half of images */}
                  <div className="flex gap-4">
                    {galleryImages.slice(Math.ceil(galleryImages.length / 2)).map((image, index) => {
                      const widths = ['w-72', 'w-72', 'w-96', 'w-72', 'w-80', 'w-96']
                      return (
                        <div key={image.id} className={`relative ${widths[index % widths.length]} h-64`}>
                          <Image
                            src={image.image_url}
                            alt={image.caption || 'Gallery image'}
                            fill
                            className="object-cover rounded-3xl"
                            loading="lazy"
                            sizes="(max-width: 768px) 50vw, 400px"
                          />
                        </div>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 text-gray-400">
                  <p>No gallery images available yet. Add images in the admin panel!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Feed Section */}
      <section className="scroll-section neon-border py-20 rounded-3xl" style={{
        '--section-bg': 'linear-gradient(135deg, rgba(15, 15, 25, 0.95) 0%, rgba(20, 20, 30, 0.95) 100%)',
        background: 'linear-gradient(135deg, rgba(15, 15, 25, 0.95) 0%, rgba(20, 20, 30, 0.95) 100%)',
        position: 'relative'
      } as React.CSSProperties}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <p className="text-sm font-semibold mb-2 text-gray-500">Stay Connected</p>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">Follow Our Journey</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Experience the magic through our lens. Follow{" "}
              <a
                href="https://instagram.com/sunset.haven__"
                target="_blank"
                rel="noopener noreferrer"
                className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF3F02] to-[#FEBE03] hover:opacity-80 transition-opacity font-semibold"
              >
                @sunset.haven__
              </a>
              {" "}for daily sunsets, island vibes, and behind-the-scenes moments.
            </p>
          </div>

          {/* Instagram Feed Widget Container */}
          <div className="rounded-3xl overflow-hidden border border-gray-800 p-8" style={{
            background: 'rgba(20, 20, 30, 0.6)',
            backdropFilter: 'blur(10px)'
          }}>
            {/* Placeholder - Replace with actual widget code */}
            <div className="text-center py-16">
              <div className="mb-6">
                <svg
                  className="w-20 h-20 mx-auto text-gray-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Instagram Feed Coming Soon</h3>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                We're setting up our live Instagram feed. In the meantime, visit our Instagram to see our latest posts!
              </p>
              <a
                href="https://instagram.com/sunset.haven__"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold hover:opacity-90 transition-opacity"
                style={{ background: 'linear-gradient(135deg, #FF3F02 0%, #FEBE03 100%)' }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                Visit @sunset.haven__
              </a>
{/*               <div className="mt-8 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 max-w-2xl mx-auto">
                <p className="text-sm text-blue-300">
                  <strong>Admin Note:</strong> Replace this placeholder with your Instagram widget code. See instructions in the README.
                </p>
              </div> */}
            </div>
          </div>
        </div>
      </section>

      <section className="scroll-section neon-border py-20 rounded-3xl" style={{
        '--section-bg': 'linear-gradient(135deg, rgba(10, 10, 15, 0.95) 0%, rgba(15, 15, 20, 0.95) 100%)',
        background: 'linear-gradient(135deg, rgba(10, 10, 15, 0.95) 0%, rgba(15, 15, 20, 0.95) 100%)',
        position: 'relative'
      } as React.CSSProperties}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-sm font-semibold mb-2 text-gray-500">Testimonials</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white">Travelers Tell</h2>
          </div>

          <div className="relative">
            {/* Carousel Container */}
            <div className="overflow-hidden rounded-3xl">
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${testimonialSlide * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="min-w-full">
                    {/* Full Width Image Container with Floating Card */}
                    <div className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl">
                      {/* Background Image */}
                      <Image
                        src="/IMG_8026.jpg"
                        alt="Guests enjoying Sunset Haven"
                        fill
                        className="object-cover"
                        loading="lazy"
                        sizes="100vw"
                      />

                      {/* Dark Overlay for better text contrast */}
                      <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>

                      {/* Floating Testimonial Card */}
                      <div className="absolute left-8 md:left-16 top-1/2 -translate-y-1/2 max-w-lg">
                        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 md:p-10 shadow-2xl">
                          {/* Quote Icon */}
                          <div className="mb-6">
                            <svg className="w-12 h-12 opacity-20" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
                            </svg>
                          </div>

                          {/* Quote */}
                          <p className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
                            {testimonial.quote}
                          </p>

                          {/* Testimonial Text */}
                          <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-6">
                            {testimonial.text}
                          </p>

                          {/* Author */}
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{ background: 'linear-gradient(135deg, #FEBE03 0%, #FF3F02 100%)' }}>
                              {testimonial.author.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{testimonial.author}</p>
                              <p className="text-sm text-gray-600">Verified Guest</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Navigation Arrows */}
                      <button
                        onClick={() => setTestimonialSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-xl transition-all z-20"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <button
                        onClick={() => setTestimonialSlide((prev) => (prev + 1) % testimonials.length)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-xl transition-all z-20"
                      >
                        <ChevronRight size={24} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setTestimonialSlide(index)}
                  className={`h-3 rounded-full transition-all ${
                    index === testimonialSlide ? 'w-8' : 'w-3'
                  }`}
                  style={{
                    background: index === testimonialSlide
                      ? 'linear-gradient(135deg, #FF3F02 0%, #FEBE03 100%)'
                      : '#D1D5DB'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="scroll-section neon-border py-20 rounded-3xl" style={{
        '--section-bg': 'linear-gradient(135deg, rgba(15, 15, 25, 0.95) 0%, rgba(10, 10, 15, 0.95) 100%)',
        background: 'linear-gradient(135deg, rgba(15, 15, 25, 0.95) 0%, rgba(10, 10, 15, 0.95) 100%)',
        position: 'relative'
      } as React.CSSProperties}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-5xl md:text-6xl font-bold mb-8 text-white">Get In Touch</h2>
              <p className="text-lg leading-relaxed text-gray-300">
                Feel free to reach out to us for any inquiries, collaborations, or feedback. We love hearing from our
                guests!
              </p>
            </div>

            {/* Contact Form */}
            <div className="rounded-3xl p-8 border border-gray-800" style={{
              background: 'rgba(20, 20, 30, 0.6)',
              backdropFilter: 'blur(10px)'
            }}>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                  <Input
                    placeholder="Enter your name"
                    className="bg-background text-foreground rounded-full"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={isSubmitting}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Phone number</label>
                  <Input
                    type="tel"
                    placeholder="Enter your phone number"
                    className="bg-background text-foreground rounded-full"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={isSubmitting}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">What are you inquiring about?</label>
                  <Select
                    value={formData.inquiry_type}
                    onValueChange={(value) => setFormData({ ...formData, inquiry_type: value })}
                    disabled={isSubmitting}
                    required
                  >
                    <SelectTrigger className="bg-background text-foreground rounded-full">
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
                  <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                  <Textarea
                    placeholder="Tell us more about your inquiry"
                    rows={4}
                    className="bg-background text-foreground rounded-2xl"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    disabled={isSubmitting}
                    required
                  />
                </div>

                {/* Success Message */}
                {submitStatus === "success" && (
                  <div className="p-4 rounded-lg bg-green-500/20 border border-green-500/50 text-green-400 text-center">
                    Thank you! Your inquiry has been submitted successfully. We'll get back to you soon!
                  </div>
                )}

                {/* Error Message */}
                {submitStatus === "error" && (
                  <div className="p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 text-center">
                    Oops! Something went wrong. Please try again.
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full text-white rounded-full font-semibold hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #FF3F02 0%, #FEBE03 100%)' }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send"
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer className="text-white py-16 rounded-t-3xl relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #FEBE03 0%, #FF3F02 100%)' }}>
        {/* Subtle background image overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'url(/IMG_8277.JPG)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          mixBlendMode: 'overlay'
        }}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            {/* Contact Info */}
            <div>
              <h3 className="font-bold text-lg mb-4">Contact</h3>
              <div className="space-y-2 opacity-90">
                <p>{footerSettings?.email || 'tarkwabaylifestyle@gmail.com'}</p>
                <p>{footerSettings?.phone || '+234 806 935 9028'}</p>
                <p>{footerSettings?.address || 'Tarkwa Bay Island, Lagos'}</p>
                <p className="text-sm pt-2">{footerSettings?.additional_info || '15 minutes by boat from Lagos'}</p>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="font-bold text-lg mb-4">Follow Us</h3>
              <div className="space-y-2">
                <a
                  href={footerSettings?.instagram_url || 'https://instagram.com/sunset.haven__'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity block"
                >
                  Instagram: {footerSettings?.instagram_handle || '@sunset.haven__'}
                </a>
                <p className="text-sm opacity-75 pt-2">{footerSettings?.availability_text || 'Year-round availability'}</p>
                <p className="text-sm opacity-75">{footerSettings?.transport_text || 'Boat transport available'}</p>
              </div>
            </div>

            {/* Links */}
            <div>
              <h3 className="font-bold text-lg mb-4">Legal</h3>
              <div className="space-y-2">
                <a href="#" className="hover:opacity-80 transition-opacity block opacity-90">
                  Privacy Policy
                </a>
                <a href="#" className="hover:opacity-80 transition-opacity block opacity-90">
                  Accessibility Statement
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-white/20 pt-8 text-center opacity-90 rounded-2xl">
            <p>{footerSettings?.copyright_text || '© 2025 by Sunset Haven. Powered and secured by Vercel.'}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
