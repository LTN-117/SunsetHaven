import { ArrowUpRight, Check, Clock3, Tent, Ticket, Waves } from 'lucide-react'
import { formatNaira, type Pricing } from '@/lib/pricing'

export default function PricingSection({ pricing, onBook }: { pricing: Pricing; onBook: () => void }) {
  return (
    <section id="pricing" className="relative overflow-hidden py-20 sm:py-28" style={{ background: '#17110c' }}>
      <div className="pointer-events-none absolute -right-36 top-0 h-96 w-96 rounded-full bg-[#ff3f02]/10 blur-3xl" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-[#FEBE03]">Plan your visit</p>
            <h2 className="max-w-2xl text-4xl font-bold text-white sm:text-5xl" style={{ fontFamily: 'var(--font-playfair)' }}>Clear prices. Better island days.</h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-[#bdb0a4]">Choose a day pass or make the cabana yours. Add camping comforts and activities to shape the day.</p>
          </div>
          <button onClick={onBook} className="inline-flex min-h-12 items-center justify-center gap-2 self-start rounded-full bg-[#FEBE03] px-6 font-bold text-[#211407] transition hover:bg-white">Ask about a booking <ArrowUpRight size={17} /></button>
        </div>

        <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="relative overflow-hidden rounded-[2rem] bg-[#FEBE03] p-7 text-[#211407] sm:p-9">
            <Ticket className="mb-12 h-9 w-9" strokeWidth={1.5} />
            <p className="text-sm font-bold uppercase tracking-[0.18em]">General access</p>
            <div className="mt-2 text-5xl font-black tracking-tight sm:text-6xl">{formatNaira(pricing.access.price)}</div>
            <p className="mt-2 font-semibold">per person · mandatory for guests</p>
            <p className="mt-8 max-w-md leading-relaxed">{pricing.access.detail}</p>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 sm:p-9">
            <div className="mb-7 flex items-center gap-3"><Waves className="text-[#FEBE03]" /><h3 className="text-2xl font-semibold text-white">Full cabana bookings</h3></div>
            <div className="divide-y divide-white/10">
              {pricing.cabanas.map(item => <div key={item.id} className="flex flex-col justify-between gap-1 py-4 sm:flex-row sm:items-center sm:gap-4"><div><p className="font-semibold text-white">{item.name}</p><p className="mt-1 text-sm text-[#a99b8d]">{item.detail}</p></div><p className="shrink-0 text-xl font-bold text-[#FEBE03]">{formatNaira(item.price)}</p></div>)}
            </div>
            <p className="mt-6 flex items-start gap-2 text-sm leading-relaxed text-[#bdb0a4]"><Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-[#FEBE03]" />{pricing.cabanaNote}</p>
          </div>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-white/10 bg-[#211a14] p-6 sm:p-9">
            <div className="mb-6 flex items-center gap-3"><Tent className="text-[#FEBE03]" /><h3 className="text-2xl font-semibold text-white">Camping comforts</h3></div>
            <div className="divide-y divide-white/10">{pricing.camping.map(item => <div key={item.id} className="flex items-start justify-between gap-4 py-3"><div><p className="font-medium text-white">{item.name}</p><p className="text-sm text-[#a99b8d]">{item.detail}</p></div><span className="shrink-0 text-right font-semibold text-[#FEBE03]">{item.available === false ? 'Unavailable' : formatNaira(item.price)}</span></div>)}</div>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-[#211a14] p-6 sm:p-9">
            <div className="mb-6 flex items-center gap-3"><Waves className="text-[#FEBE03]" /><h3 className="text-2xl font-semibold text-white">Things to do</h3></div>
            <div className="divide-y divide-white/10">{pricing.activities.map(item => <div key={item.id} className="flex items-start justify-between gap-4 py-3"><div><p className="font-medium text-white">{item.name}</p><p className="text-sm text-[#a99b8d]">{item.detail}{item.advance ? ' · Pay ahead' : ''}</p></div><span className="shrink-0 text-right font-semibold text-[#FEBE03]">{formatNaira(item.price)}{item.cabanaPrice != null && <small className="block text-xs font-normal text-[#d6d0c8]">Cabana: {formatNaira(item.cabanaPrice)}</small>}</span></div>)}</div>
          </div>
        </div>
        <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-[#FEBE03]/30 bg-[#FEBE03]/10 p-5 text-sm text-[#f6e9d4] sm:flex-row sm:items-center sm:justify-between"><span className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#FEBE03]" />{pricing.bookingNote}</span><strong className="text-[#FEBE03]">{pricing.refundNote}</strong></div>
      </div>
    </section>
  )
}
