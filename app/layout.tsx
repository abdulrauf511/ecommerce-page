import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { CartProvider } from "@/hooks/use-cart"
import ThemeToggle from "@/components/theme-toggle"
import { Analytics } from "@/components/analytics"
import { ErrorLogger } from "@/components/error-logger"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Premium Comfort Sneakers | E-Commerce Store",
  description:
    "Experience unparalleled comfort with our Premium Comfort Sneakers. Designed for all-day wear with advanced cushioning technology.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ErrorLogger>
            <CartProvider>
              <div className="min-h-screen flex flex-col">
                <header className="border-b">
                  <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="font-bold text-xl">E-Commerce Store</div>
                    <ThemeToggle />
                  </div>
                </header>
                {children}
              </div>
            </CartProvider>
            <Analytics />
          </ErrorLogger>
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'