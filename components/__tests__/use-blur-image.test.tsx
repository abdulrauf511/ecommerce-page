import { renderHook } from "@testing-library/react"
import { useBlurImage } from "@/hooks/use-blur-image"
import { expect, describe, it } from "@jest/globals"

describe("useBlurImage", () => {
  it("returns a valid data URL for blur placeholder", () => {
    const { result } = renderHook(() => useBlurImage())

    // Check if blurDataUrl is a valid data URL
    expect(result.current.blurDataUrl).toMatch(/^data:image\/svg\+xml;base64,/)

    // Decode the base64 to ensure it's valid
    const base64 = result.current.blurDataUrl.split(",")[1]
    let decodedSvg

    // This shouldn't throw an error if the base64 is valid
    expect(() => {
      if (typeof window !== "undefined") {
        decodedSvg = atob(base64)
      } else {
        decodedSvg = Buffer.from(base64, "base64").toString()
      }
    }).not.toThrow()

    // Check if the decoded content is an SVG
    expect(decodedSvg).toContain("<svg")
  })
})
