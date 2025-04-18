"use client"

// Advanced Feature: Custom image lazy loading with blur-up technique
export function useBlurImage() {
  // Generate a tiny blurred SVG placeholder
  const generateBlurPlaceholder = () => {
    // Create a simple SVG with a blur filter
    const svg = `
      <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
        <filter id="b" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="20" />
        </filter>
        <rect width="100%" height="100%" fill="#f0f0f0"/>
        <rect width="100%" height="100%" filter="url(#b)" fill="#e0e0e0"/>
      </svg>
    `

    // Convert SVG to base64
    const toBase64 = (str: string) =>
      typeof window === "undefined" ? Buffer.from(str).toString("base64") : window.btoa(str)

    return `data:image/svg+xml;base64,${toBase64(svg)}`
  }

  // Create a blur data URL
  const blurDataUrl = generateBlurPlaceholder()

  return {
    blurDataUrl,
  }
}
