"use client"

import type React from "react"

import { useEffect } from "react"

interface ErrorLoggerProps {
  children: React.ReactNode
}

export function ErrorLogger({ children }: ErrorLoggerProps) {
  useEffect(() => {
    // Global error handler
    const originalConsoleError = console.error
    console.error = (...args) => {
      // Log to your error tracking service
      logError(args.join(" "))
      // Call the original console.error
      originalConsoleError.apply(console, args)
    }

    // Unhandled promise rejection handler
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      logError(`Unhandled Promise Rejection: ${event.reason}`)
    }

    // Unhandled error handler
    const handleError = (event: ErrorEvent) => {
      logError(`Unhandled Error: ${event.message}`)
      event.preventDefault()
    }

    // Add event listeners
    window.addEventListener("unhandledrejection", handleUnhandledRejection)
    window.addEventListener("error", handleError)

    // Clean up
    return () => {
      console.error = originalConsoleError
      window.removeEventListener("unhandledrejection", handleUnhandledRejection)
      window.removeEventListener("error", handleError)
    }
  }, [])

  // Function to log errors to a service
  const logError = (error: string) => {
    // In a real implementation, you would send this to your error logging service
    // Example: Sentry.captureException(error)
    console.log(`[ErrorLogger] ${error}`)
  }

  return <>{children}</>
}
