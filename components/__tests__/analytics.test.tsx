import { render } from "@testing-library/react"
import { Analytics } from "../analytics"
import { expect, jest, describe, it, beforeEach, afterEach } from "@jest/globals"

// Mock Next.js navigation hooks
jest.mock("next/navigation", () => ({
  usePathname: () => "/test-path",
  useSearchParams: () => ({ toString: () => "param=test" }),
}))

describe("Analytics", () => {
  beforeEach(() => {
    // Spy on console.log which is used for analytics tracking in our implementation
    jest.spyOn(console, "log").mockImplementation(() => {})
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("tracks page views on render", () => {
    render(<Analytics />)

    // Check if analytics was logged
    expect(console.log).toHaveBeenCalledWith("[Analytics] Page view: /test-path?param=test")
  })

  it("tracks product view events for product pages", () => {
    // Mock product page path
    jest.mock("next/navigation", () => ({
      usePathname: () => "/product/123",
      useSearchParams: () => ({ toString: () => "" }),
    }))

    render(<Analytics />)

    // Check if product view event was logged
    expect(console.log).toHaveBeenCalledWith("[Analytics] Product view event tracked")
  })
})
