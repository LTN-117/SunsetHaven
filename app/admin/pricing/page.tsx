'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Save, Trash2, ExternalLink, CircleHelp } from 'lucide-react'
import { toast } from 'sonner'
import AdminLayout from '@/components/admin/AdminLayout'
import { defaultPricing, type Pricing } from '@/lib/pricing'

type Item = Pricing['cabanas'][number]
type Section = 'cabanas' | 'camping' | 'activities'

const inputClass = 'min-h-11 w-full rounded-xl border border-white/15 bg-[#211d19] px-3 text-base text-white outline-none focus:border-[#FEBE03]'
const labelClass = 'block text-xs font-semibold uppercase tracking-wider text-[#b5a99b] mb-2'

export default function PricingEditor() {
  const [pricing, setPricing] = useState<Pricing>(defaultPricing)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [source, setSource] = useState('fallback')

  useEffect(() => {
    fetch('/api/pricing').then(response => response.json()).then(result => {
      if (result.pricing) setPricing(result.pricing)
      setSource(result.source)
    }).catch(() => toast.error('Could not load saved pricing')).finally(() => setLoading(false))
  }, [])

  function updateItem(section: Section, index: number, patch: Partial<Item>) {
    setPricing(current => ({ ...current, [section]: current[section].map((item, i) => i === index ? { ...item, ...patch } : item) }))
  }

  function addItem(section: Section) {
    setPricing(current => ({ ...current, [section]: [...current[section], { id: crypto.randomUUID(), name: 'New item', detail: '', price: null, ...(section === 'camping' ? { available: true } : {}), ...(section === 'activities' ? { advance: false } : {}) }] }))
  }

  function removeItem(section: Section, index: number) {
    setPricing(current => ({ ...current, [section]: current[section].filter((_, i) => i !== index) }))
  }

  async function save() {
    setSaving(true)
    try {
      const response = await fetch('/api/admin/pricing', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(pricing) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Could not save pricing')
      setSource('database')
      toast.success('Pricing saved. The public website is updated.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not save pricing')
    } finally {
      setSaving(false)
    }
  }

  const textField = (label: string, value: string, onChange: (value: string) => void, multiline = false) => <label className="block"><span className={labelClass}>{label}</span>{multiline ? <textarea className={`${inputClass} min-h-24 py-3`} value={value} onChange={event => onChange(event.target.value)} /> : <input className={inputClass} value={value} onChange={event => onChange(event.target.value)} />}</label>
  const priceField = (label: string, value: number | null, onChange: (value: number | null) => void) => <label className="block"><span className={labelClass}>{label}</span><input className={inputClass} type="number" min="0" inputMode="numeric" placeholder="Leave empty for quote" value={value ?? ''} onChange={event => onChange(event.target.value === '' ? null : Number(event.target.value))} /></label>

  const itemSection = (section: Section, title: string, hint: string) => <section className="rounded-3xl border border-white/10 bg-[#171410] p-4 sm:p-6"><div className="mb-5 flex flex-wrap items-start justify-between gap-3"><div><h3 className="text-xl font-bold text-white">{title}</h3><p className="mt-1 text-sm text-[#a99b8d]">{hint}</p></div><button type="button" onClick={() => addItem(section)} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#FEBE03]/40 px-4 text-sm font-semibold text-[#FEBE03]"><Plus size={16} /> Add item</button></div><div className="space-y-4">{pricing[section].map((item, index) => <div key={item.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"><div className="mb-4 flex items-start justify-between gap-3"><span className="rounded-full bg-[#FEBE03]/15 px-3 py-1 text-xs font-bold text-[#FEBE03]">{index + 1}</span><button type="button" onClick={() => removeItem(section, index)} aria-label={`Remove ${item.name}`} className="rounded-lg p-2 text-[#baaba0] hover:bg-red-500/10 hover:text-red-300"><Trash2 size={17} /></button></div><div className="grid gap-4 sm:grid-cols-2">{textField('Name', item.name, value => updateItem(section, index, { name: value }))}{priceField('Price in naira', item.price, value => updateItem(section, index, { price: value }))}<div className="sm:col-span-2">{textField('Short description', item.detail, value => updateItem(section, index, { detail: value }))}</div>{section === 'activities' && <>{item.cabanaPrice !== undefined && priceField('Full cabana price (optional)', item.cabanaPrice ?? null, value => updateItem(section, index, { cabanaPrice: value }))}<label className="flex min-h-11 items-center gap-3 text-sm text-white"><input type="checkbox" checked={item.advance ?? false} onChange={event => updateItem(section, index, { advance: event.target.checked })} className="h-5 w-5 accent-[#FEBE03]" /> Must pay ahead</label></>}{section === 'camping' && <label className="flex min-h-11 items-center gap-3 text-sm text-white"><input type="checkbox" checked={item.available !== false} onChange={event => updateItem(section, index, { available: event.target.checked })} className="h-5 w-5 accent-[#FEBE03]" /> Available now</label>}</div></div>)}</div></section>

  return <AdminLayout><div className="mx-auto max-w-5xl space-y-6 pb-24"><div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.24em] text-[#FEBE03]">Website content</p><h2 className="mt-2 text-3xl font-bold text-white">Edit pricing</h2><p className="mt-2 max-w-xl text-sm leading-relaxed text-[#afa397]">Change a price, add an item, then tap Save. The public pricing section reads the saved values.</p></div><div className="flex gap-2"><Link href="/admin/guide" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/15 px-4 text-sm text-white"><CircleHelp size={16} /> Guide</Link><Link href="/#pricing" target="_blank" className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/15 px-4 text-sm text-white"><ExternalLink size={16} /> View site</Link></div></div>{loading ? <p className="py-16 text-center text-[#b5a99b]">Loading pricing…</p> : <><div className="rounded-2xl border border-[#FEBE03]/25 bg-[#FEBE03]/10 p-4 text-sm text-[#f4db9c]">{source === 'database' ? 'Showing saved prices from Supabase.' : 'Showing starter prices. Save once to publish these values to Supabase.'}</div><section className="rounded-3xl border border-white/10 bg-[#171410] p-4 sm:p-6"><h3 className="mb-5 text-xl font-bold text-white">General access</h3><div className="grid gap-4 sm:grid-cols-[180px_1fr]">{priceField('Price per person', pricing.access.price, value => setPricing(current => ({ ...current, access: { ...current.access, price: value ?? 0 } })))}{textField('What is included', pricing.access.detail, value => setPricing(current => ({ ...current, access: { ...current.access, detail: value } })), true)}</div></section>{itemSection('cabanas', 'Full cabana bookings', 'Leave a price empty when guests should ask for a quote.')}{textField('Cabana access note', pricing.cabanaNote, value => setPricing(current => ({ ...current, cabanaNote: value })), true)}{itemSection('camping', 'Camping necessities', 'Turn off availability for items that cannot be booked.')}{itemSection('activities', 'Activities', 'Lighthouse tour has a separate full cabana price.')}<section className="grid gap-4 rounded-3xl border border-white/10 bg-[#171410] p-4 sm:grid-cols-2 sm:p-6">{textField('Booking ahead note', pricing.bookingNote, value => setPricing(current => ({ ...current, bookingNote: value })), true)}{textField('Refund policy', pricing.refundNote, value => setPricing(current => ({ ...current, refundNote: value })), true)}</section><div className="sticky bottom-4 z-20 flex justify-end rounded-2xl border border-white/10 bg-[#171410]/95 p-3 shadow-2xl backdrop-blur"><button onClick={save} disabled={saving} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#FEBE03] px-7 font-bold text-[#211407] disabled:opacity-60 sm:w-auto"><Save size={18} />{saving ? 'Saving…' : 'Save pricing'}</button></div></>}</div></AdminLayout>
}
