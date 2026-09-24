import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { defaultPricing, pricingSchema } from '@/lib/pricing'

export const dynamic = 'force-dynamic'

export async function GET() {
  const { data, error } = await supabaseAdmin.from('site_pricing').select('data,updated_at').eq('id', 1).maybeSingle()
  if (error) {
    console.error('Pricing load failed:', error.message)
    return NextResponse.json({ pricing: defaultPricing, source: 'fallback' })
  }
  const parsed = pricingSchema.safeParse(data?.data)
  return NextResponse.json({ pricing: parsed.success ? parsed.data : defaultPricing, source: parsed.success ? 'database' : 'fallback', updatedAt: data?.updated_at || null })
}
