"use client"

import { Component, type ReactNode } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Filter out MetaMask and other extension errors
    if (
      error.message?.includes("MetaMask") ||
      error.message?.includes("ethereum") ||
      error.message?.includes("wallet")
    ) {
      console.warn("[v0] External extension error caught and suppressed:", error.message)
      return
    }
    console.error("[v0] Error caught by boundary:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      // Don't show error UI for extension-related errors
      if (
        this.state.error?.message?.includes("MetaMask") ||
        this.state.error?.message?.includes("ethereum") ||
        this.state.error?.message?.includes("wallet")
      ) {
        return this.props.children
      }

      return (
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-lg mx-auto p-8 text-center space-y-4">
            <AlertCircle className="w-12 h-12 mx-auto text-destructive" />
            <h2 className="text-2xl font-bold">Something went wrong</h2>
            <p className="text-muted-foreground">An unexpected error occurred. Please try refreshing the page.</p>
            <Button onClick={() => this.setState({ hasError: false })}>Try again</Button>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
