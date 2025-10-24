"use client"

import { useState, useEffect, useRef } from "react"
import { Menu, X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SunsetHavenResort() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [heroImageSlide, setHeroImageSlide] = useState(0)
  const [testimonialSlide, setTestimonialSlide] = useState(0)

  const heroImages = [
    "/IMG_8277.JPG",
    "/IMG_8282.JPG",
    "/IMG_8285.JPG"
  ]

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

  const experiences = [
    {
      title: "Premium Camping",
      description:
        "Proper beds with duvets and blankets in premium tents. Wake up to stunning island views and the sound of waves. Comfort meets nature in the perfect balance.",
      image: "/premium-camping.jpg",
    },
    {
      title: "Adventure Activities",
      description:
        "Island exploration, water sports, sunset sessions, quad bike rides, paint & sip, board games, meditation, journaling, and more. Every day brings new experiences.",
      image: "/adventure-activities.jpg",
    },
    {
      title: "Curated Networking",
      description:
        "Join 600-1000+ monthly guests who return for the community. Connect with professionals, creatives, and explorers. Build relationships that last beyond your stay.",
      image: "/curated-networking.jpg",
    },
    {
      title: "Bespoke Events",
      description:
        "From corporate retreats to themed celebrations, raves to intimate gatherings. We coordinate unforgettable experiences tailored to your vision.",
      image: "/bespoke-events.jpg",
    },
  ]

  const testimonials = [
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
  ]

  return (
    <div className="min-h-screen relative" style={{ background: '#0a0a0a' }}>
      <nav className="fixed top-0 w-full z-50 text-white backdrop-blur-sm rounded-b-3xl" style={{ background: 'linear-gradient(135deg, rgba(254, 190, 3, 0.95) 0%, rgba(255, 63, 2, 0.95) 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
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
                className="text-white px-8 py-3 text-lg rounded-full hover:opacity-90 hover:scale-105 transition-all duration-300"
                style={{ background: 'linear-gradient(135deg, #FF3F02 0%, #FEBE03 100%)' }}
              >
                Book Your Experience
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
                      <img
                        src={image}
                        alt={`Sunset Haven Resort ${index + 1}`}
                        className="w-full h-full object-cover"
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
                  Instead of chasing venues, we'd create our own dedicated space. Somewhere purpose-built for the community we'd discovered.
                </p>
              </div>
              <div className="bg-white/10 rounded-3xl p-8">
                <p className="text-xl font-bold leading-relaxed opacity-95">
                  Nigeria's first eco-tourism resort designed around experience, not just accommodation.
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

      <section id="experiences" className="scroll-section neon-border pt-4 pb-20 rounded-3xl" style={{
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
                    <img
                      src={experience.image || "/placeholder.svg"}
                      alt={experience.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div
                    className={`p-8 md:p-12 flex flex-col justify-center ${index % 2 === 1 ? "md:order-1" : "md:order-2"}`}
                  >
                    <h3 className="text-3xl md:text-4xl font-bold mb-4 text-white">{experience.title}</h3>
                    <p className="text-lg leading-relaxed text-gray-300">{experience.description}</p>
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

          {/* Photo Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="col-span-2 row-span-2">
              <img
                src="/IMG_8052.jpg"
                alt="Camping event"
                className="w-full h-full object-cover rounded-3xl"
              />
            </div>
            <div className="col-span-1 row-span-1">
              <img
                src="/IMG_8598.jpg"
                alt="Event gathering"
                className="w-full h-full object-cover rounded-3xl"
              />
            </div>
            <div className="col-span-1 row-span-1">
              <img
                src="/IMG_8739.jpg"
                alt="Sunset session"
                className="w-full h-full object-cover rounded-3xl"
              />
            </div>
            <div className="col-span-1 row-span-1">
              <img
                src="/IMG_8817.jpg"
                alt="Beach activities"
                className="w-full h-full object-cover rounded-3xl"
              />
            </div>
            <div className="col-span-1 row-span-1">
              <img
                src="/IMG_8915.jpg"
                alt="Community gathering"
                className="w-full h-full object-cover rounded-3xl"
              />
            </div>
            <div className="col-span-2 row-span-1">
              <img
                src="/IMG_8026.jpg"
                alt="Event celebration"
                className="w-full h-full object-cover rounded-3xl"
              />
            </div>
            <div className="col-span-1 row-span-1">
              <img
                src="/IMG_8041.jpg"
                alt="Island adventure"
                className="w-full h-full object-cover rounded-3xl"
              />
            </div>
            <div className="col-span-1 row-span-1">
              <img
                src="/IMG_2807.jpg"
                alt="Camping setup"
                className="w-full h-full object-cover rounded-3xl"
              />
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
                      <img
                        src="/IMG_8026.jpg"
                        alt="Guests enjoying Sunset Haven"
                        className="w-full h-full object-cover"
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
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                  <Input placeholder="Enter your name" className="bg-background text-foreground rounded-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Phone number</label>
                  <Input type="tel" placeholder="Enter your phone number" className="bg-background text-foreground rounded-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">What are you inquiring about?</label>
                  <Select>
                    <SelectTrigger className="bg-background text-foreground rounded-full">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="premium-camping">Premium Camping</SelectItem>
                      <SelectItem value="adventure-activities">Adventure Activities</SelectItem>
                      <SelectItem value="curated-networking">Curated Networking</SelectItem>
                      <SelectItem value="bespoke-events">Bespoke Events</SelectItem>
                      <SelectItem value="general-inquiry">General Inquiry</SelectItem>
                      <SelectItem value="partnership">Partnership Opportunities</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                  <Textarea
                    placeholder="Tell us more about your inquiry"
                    rows={4}
                    className="bg-background text-foreground rounded-2xl"
                  />
                </div>
                <Button className="w-full text-white rounded-full font-semibold hover:opacity-90" style={{ background: 'linear-gradient(135deg, #FF3F02 0%, #FEBE03 100%)' }}>
                  Send
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
                <p>tarkwabaylifestyle@gmail.com</p>
                <p>+234 806 935 9028</p>
                <p>Tarkwa Bay Island, Lagos</p>
                <p className="text-sm pt-2">15 minutes by boat from Lagos</p>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="font-bold text-lg mb-4">Follow Us</h3>
              <div className="space-y-2">
                <a href="https://instagram.com/sunset.haven__" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity block">
                  Instagram: @sunset.haven__
                </a>
                <p className="text-sm opacity-75 pt-2">Year-round availability</p>
                <p className="text-sm opacity-75">Boat transport available</p>
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
            <p>© 2025 by Sunset Haven. Powered and secured by Vercel.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
