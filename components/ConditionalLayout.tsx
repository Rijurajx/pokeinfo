'use client'

import { usePathname } from 'next/navigation'
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Suspense } from "react"
import { ErrorBoundary } from "@/components/ErrorBoundary"

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isStudioRoute = pathname?.startsWith('/studio')
  
  if (isStudioRoute) {
    // Render only children for studio routes (no Navbar/Footer)
    return <>{children}</>
  }
  
  // Render with Navbar/Footer for all other routes
  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <Navbar />
        <main className="min-h-screen pt-16">{children}</main>
        <Footer />
      </Suspense>
    </ErrorBoundary>
  )
}
