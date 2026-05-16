import type React from "react"
import type { Metadata } from "next"
import { GeistMono } from "geist/font/mono"
import { Poppins, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import Script from "next/script"
import "./globals.css"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-poppins",
  display: "swap",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Sunset Haven",
  description:
    "Experience luxury eco-tourism at Sunset Haven Resort on Takwa Bay Island, Lagos. Premium glamping, sustainable practices, and unforgettable island adventures.",
  icons: {
    icon: '/sunset-haven-logo.png',
    shortcut: '/sunset-haven-logo.png',
    apple: '/sunset-haven-logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${poppins.variable} ${GeistMono.variable} ${playfair.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        <Analytics />

        {/* Microsoft Clarity Analytics for Frontend */}
        <Script id="clarity-script" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "tzmrwdpg8l");
          `}
        </Script>
      </body>
    </html>
  )
}
