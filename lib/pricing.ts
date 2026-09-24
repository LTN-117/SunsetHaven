import { z } from 'zod'

const pricedItem = z.object({
  id: z.string().min(1).max(60),
  name: z.string().min(1).max(100),
  detail: z.string().max(240),
  price: z.number().int().min(0).max(10000000).nullable(),
  advance: z.boolean().optional(),
  available: z.boolean().optional(),
  cabanaPrice: z.number().int().min(0).max(10000000).nullable().optional(),
})

export const pricingSchema = z.object({
  access: z.object({ price: z.number().int().min(0), detail: z.string().min(1).max(500) }),
  cabanas: z.array(pricedItem).max(20),
  camping: z.array(pricedItem).max(30),
  activities: z.array(pricedItem).max(40),
  cabanaNote: z.string().max(500),
  bookingNote: z.string().max(240),
  refundNote: z.string().max(240),
})

export type Pricing = z.infer<typeof pricingSchema>

export const defaultPricing: Pricing = {
  access: {
    price: 5000,
    detail: 'Mandatory per person. Includes the hammock area and chairs, toilet and bathroom facilities, running water and power at night until midnight.',
  },
  cabanas: [
    { id: 'tunde', name: "Tunde’s Haven cabana", detail: '10–20 guests', price: 150000 },
    { id: 'tosin', name: "Tosin’s Haven cabana", detail: '21–30 guests', price: 200000 },
    { id: 'rooftop', name: 'Rooftop', detail: 'Final price depends on guest count', price: 250000 },
    { id: 'full-haven', name: 'Full Sunset Haven cabana', detail: '50+ guests · price discussed based on group size', price: null },
  ],
  cabanaNote: 'Exclusive beach cabana, hammock area, toilet and bathroom facilities, running water and power from 3pm to midnight. Guests leave the cabana by midnight.',
  camping: [
    { id: 'tent-2', name: 'Tent for 2', detail: 'Bare tent', price: 8000, available: true },
    { id: 'duvet', name: 'Duvet and pillow', detail: 'One set', price: 2000, available: true },
    { id: 'mat', name: 'Camp bed / mat', detail: 'Per person', price: 4000, available: true },
    { id: 'tent-4', name: '4-person tent', detail: 'Currently unavailable', price: 20000, available: false },
    { id: 'tent-6', name: '6-person tent', detail: 'Currently unavailable', price: 30000, available: false },
    { id: 'glamping', name: 'Glamping tent', detail: 'For 2 · bedding included', price: 40000, available: true },
  ],
  activities: [
    { id: 'bonfire', name: 'Bonfire', detail: '', price: 15000, advance: true },
    { id: 'lighthouse', name: 'Lighthouse tower tour', detail: '₦4,000 with general access; ₦2,000 with full cabana booking', price: 4000, cabanaPrice: 2000, advance: true },
    { id: 'movie', name: 'Movie night', detail: '', price: 150000, advance: true },
    { id: 'quad', name: 'Quad bike', detail: '', price: 5000 },
    { id: 'surfing', name: 'Surfing', detail: '', price: 20000 },
    { id: 'jetski-10', name: 'Jet ski · 10 minutes', detail: '', price: 30000 },
    { id: 'jetski-hour', name: 'Jet ski · 1 hour', detail: '', price: 170000 },
    { id: 'horse', name: 'Horse ride', detail: '', price: 5000 },
    { id: 'painting', name: 'Painting on pre-drawn canvas', detail: '', price: 15000 },
    { id: 'picnic', name: 'Romantic picnic for 2', detail: 'Fruit basket and dinner included', price: 100000 },
  ],
  bookingNote: 'Camping necessities must be booked ahead. Bonfire, lighthouse tour and movie night are paid ahead.',
  refundNote: 'No refunds.',
}

export const formatNaira = (amount: number | null) => amount === null ? 'Ask for a quote' : `₦${amount.toLocaleString('en-NG')}`
