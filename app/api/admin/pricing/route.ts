import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { pricingSchema } from '@/lib/pricing'

export async function PATCH(request: NextRequest) {
  const body = await request.json().catch(() => null)
  const parsed = pricingSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Please check the pricing fields.' }, { status: 400 })
  const { error } = await supabaseAdmin.from('site_pricing').upsert({ id: 1, data: parsed.data, updated_at: new Date().toISOString() })
  if (error) return NextResponse.json({ error: 'Pricing could not be saved.' }, { status: 500 })
  return NextResponse.json({ success: true })
}
