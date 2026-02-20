import * as React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { ConditionalLayout } from "@/components/ConditionalLayout"

export const metadata: Metadata = {
  title: "Pokémon GO Database",
  description: "Complete Pokémon GO data hub with Pokédex, moves, raids, and more",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <ConditionalLayout>{children}</ConditionalLayout>
        <Analytics />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('unhandledrejection', function(event) {
                // Suppress MetaMask and other wallet extension errors
                if (event.reason?.message?.includes('MetaMask') || 
                    event.reason?.message?.includes('ethereum') ||
                    event.reason?.message?.includes('wallet')) {
                  console.warn('[v0] External extension error suppressed:', event.reason.message);
                  event.preventDefault();
                }
              });
            `,
          }}
        />
      </body>
    </html>
  )
}
