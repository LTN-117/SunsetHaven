import Link from 'next/link'
import NextImage from 'next/image'
import { ArrowRight, CalendarDays, CircleHelp, Eye, Image, Inbox, Mail, MessageSquare, Monitor, MousePointer2, Save, Settings, Smartphone, Ticket, Trash2, Users } from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'

const guides = [
  { number: '01', title: 'Update prices', icon: Ticket, color: '#FEBE03', href: '/admin/pricing', steps: ['Open Pricing', 'Change the amount or wording', 'Tap Save pricing'], preview: ['General access', '₦5,000', 'Save pricing'] },
  { number: '02', title: 'Reply to a guest', icon: Inbox, color: '#ff9163', href: '/admin/inquiries', steps: ['Open Inquiries', 'Read the guest’s message', 'Use their phone number to reply'], preview: ['New inquiry', 'Guest message', 'Reply'] },
  { number: '03', title: 'Add an event', icon: CalendarDays, color: '#97d0bb', href: '/admin/events', steps: ['Open Events', 'Add title, date and details', 'Save and mark it active'], preview: ['Event name', 'Date', 'Active'] },
  { number: '04', title: 'Change photos', icon: Image, color: '#adc7ea', href: '/admin/gallery', steps: ['Open Gallery', 'Upload a photo', 'Choose where it appears'], preview: ['Upload', 'Photo', 'Show on site'] },
  { number: '05', title: 'Manage reviews', icon: MessageSquare, color: '#e5b5ca', href: '/admin/testimonials', steps: ['Open Testimonials', 'Add or edit a guest quote', 'Save and switch it on'], preview: ['Guest quote', 'Name', 'Active'] },
  { number: '06', title: 'See subscribers', icon: Mail, color: '#d6c295', href: '/admin/newsletter', steps: ['Open Newsletter', 'Review the email list', 'Export when needed'], preview: ['Subscribers', 'Email list', 'Export'] },
  { number: '07', title: 'Change contact details', icon: Settings, color: '#b3aeeb', href: '/admin/footer', steps: ['Open Footer', 'Edit phone, email or social link', 'Tap Save'], preview: ['Phone', 'Email', 'Save'] },
  { number: '08', title: 'Delete a photo', icon: Trash2, color: '#ff9163', href: '#delete-photo', steps: ['Find the photo in Gallery', 'Tap Actions, then Delete image', 'Confirm Delete or tap Cancel to keep it'], preview: ['Actions', 'Delete image', 'Confirm Delete'] },
]

const photoDeletionSteps = [
  { title: 'Tap Actions', text: 'Open Gallery and scroll to the photo you want to remove. Tap the Actions button below that photo.', image: '/admin-guide/gallery-actions.webp', alt: 'Mobile gallery with the Actions button below a photo highlighted in yellow' },
  { title: 'Tap Delete image', text: 'The menu shows all three photo actions. Tap the red Delete image option.', image: '/admin-guide/gallery-delete.webp', alt: 'Photo actions menu with Delete image highlighted in yellow' },
  { title: 'Confirm Delete', text: 'Check that you selected the right photo, then tap Delete in the confirmation box. The photo is removed immediately; no extra Save is needed.', image: '/admin-guide/gallery-confirm.webp', alt: 'Delete Image confirmation box with the red Delete button highlighted in yellow' },
]

export default function AdminGuidePage() {
  return <AdminLayout><div className="mx-auto max-w-6xl pb-12"><div className="relative overflow-hidden rounded-[2rem] bg-[#FEBE03] p-6 text-[#211407] sm:p-10"><div className="absolute -right-10 -top-10 h-44 w-44 rounded-full border-[28px] border-black/5" /><div className="relative"><p className="text-xs font-extrabold uppercase tracking-[0.25em]">Sunset Haven · site manager guide</p><h2 className="mt-4 max-w-2xl text-3xl font-black leading-tight sm:text-5xl">Manage the website in three simple moves.</h2><p className="mt-5 max-w-xl text-base leading-relaxed">Open a section. Make the change. Save it. This guide works on your phone or computer.</p><div className="mt-7 flex flex-wrap gap-2"><span className="inline-flex items-center gap-2 rounded-full bg-black/10 px-4 py-2 text-sm font-bold"><Smartphone size={16} /> Phone friendly</span><span className="inline-flex items-center gap-2 rounded-full bg-black/10 px-4 py-2 text-sm font-bold"><Monitor size={16} /> Computer friendly</span></div></div></div>

    <div className="mt-7 grid gap-4 md:grid-cols-3">{[{ icon: Users, title: '1. Sign in', text: 'Open the admin login and use the credentials given by your administrator.' }, { icon: MousePointer2, title: '2. Pick a section', text: 'On a phone, tap the menu icon at the top left. Choose what you want to manage.' }, { icon: Save, title: '3. Save and check', text: 'Tap Save, then open the public site to make sure the change looks right.' }].map(step => <div key={step.title} className="rounded-3xl border border-white/10 bg-[#1b1814] p-6"><step.icon size={30} className="text-[#FEBE03]" /><h3 className="mt-5 text-lg font-bold text-white">{step.title}</h3><p className="mt-2 text-sm leading-relaxed text-[#b5a99b]">{step.text}</p></div>)}</div>

    <div className="mt-12 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FEBE03]">Tap a task to start</p><h2 className="mt-2 text-3xl font-bold text-white">What would you like to change?</h2></div><Link href="/" target="_blank" className="inline-flex items-center gap-2 text-sm font-semibold text-[#FEBE03]">View public website <ArrowRight size={16} /></Link></div>

    <div className="mt-6 grid gap-4 lg:grid-cols-2">{guides.map(guide => <Link key={guide.number} href={guide.href} className="group rounded-3xl border border-white/10 bg-[#1b1814] p-5 transition hover:border-[#FEBE03]/50 sm:p-6"><div className="flex items-start justify-between gap-3"><div className="flex items-center gap-3"><span className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: `${guide.color}20`, color: guide.color }}><guide.icon size={24} /></span><div><p className="text-xs font-bold tracking-widest text-[#8d8278]">TASK {guide.number}</p><h3 className="text-xl font-bold text-white">{guide.title}</h3></div></div><ArrowRight className="mt-2 text-[#FEBE03] transition group-hover:translate-x-1" size={20} /></div><div className="mt-6 grid grid-cols-3 gap-2">{guide.preview.map((label, index) => <div key={`${guide.number}-${index}`} className="flex min-h-16 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] p-2 text-center text-xs font-semibold text-[#d3c7b8]">{label}</div>)}</div><ol className="mt-5 space-y-2">{guide.steps.map((step, index) => <li key={step} className="flex items-start gap-3 text-sm text-[#c4b8ab]"><span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FEBE03] text-[11px] font-black text-[#211407]">{index + 1}</span>{step}</li>)}</ol></Link>)}</div>

    <section id="delete-photo" aria-labelledby="delete-photo-title" className="mt-12 scroll-mt-24 rounded-3xl border border-white/10 bg-[#1b1814] p-5 sm:p-6">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FEBE03]">Mobile photo guide</p>
      <h2 id="delete-photo-title" className="mt-2 text-3xl font-bold text-white">Delete a photo on your phone</h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#d3c7b8]">Every photo has a visible Actions button with a menu icon. You can add or remove a photo from the hero, show or hide it, or delete it from this menu.</p>
      <Link href="/admin/gallery" className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#FEBE03]">Open Gallery <ArrowRight size={16} /></Link>
      <ol className="mt-5 grid gap-8 lg:grid-cols-3">
        {photoDeletionSteps.map((step, index) => <li key={step.title} className="min-w-0">
          <div className="flex items-center gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FEBE03] text-sm font-black text-[#211407]">{index + 1}</span><h3 className="text-lg font-bold text-white">{step.title}</h3></div>
          <p className="mt-3 text-sm leading-relaxed text-[#d3c7b8]">{step.text}</p>
          <NextImage src={step.image} alt={step.alt} width={390} height={660} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 390px, 33vw" className="mx-auto mt-4 h-auto w-full max-w-[390px] rounded-2xl border border-white/10" />
        </li>)}
      </ol>
      <p className="mt-6 rounded-2xl border border-[#FEBE03]/25 bg-[#FEBE03]/10 p-4 text-sm leading-relaxed text-[#d3c7b8]">Changed your mind? Tap <strong className="text-white">Cancel</strong> to keep the photo. Deleting cannot be undone. To temporarily hide a photo instead, choose <strong className="text-white">Hide image</strong> from its Actions menu.</p>
    </section>

    <div className="mt-8 grid gap-4 md:grid-cols-2"><div className="rounded-3xl border border-[#FEBE03]/25 bg-[#FEBE03]/10 p-6"><Smartphone size={27} className="text-[#FEBE03]" /><h3 className="mt-4 text-lg font-bold text-white">Using a phone?</h3><p className="mt-2 text-sm leading-relaxed text-[#d3c7b8]">Tap the menu icon in the top-left corner. Scroll inside the menu to find Pricing, Gallery, Events and the other sections. In Gallery, use the Actions button below each photo to manage it. Forms stack vertically so you can edit one field at a time.</p></div><div className="rounded-3xl border border-white/10 bg-[#1b1814] p-6"><Eye size={27} className="text-[#FEBE03]" /><h3 className="mt-4 text-lg font-bold text-white">Before you finish</h3><p className="mt-2 text-sm leading-relaxed text-[#d3c7b8]">Look for a success message after saving. Open the public website and check the new text or photo. If something looks wrong, return to the same section and edit it again.</p></div></div>

    <div className="mt-8 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm text-[#bdb1a4]"><CircleHelp className="h-5 w-5 shrink-0 text-[#FEBE03]" /><p>Need access? Ask your administrator for a login. Keep your password private. Pricing changes become visible on the public site after you save.</p></div>
  </div></AdminLayout>
}
