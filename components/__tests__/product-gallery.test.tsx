import { render, screen, fireEvent } from "@testing-library/react"
import ProductGallery from "../product-gallery"
import { expect, jest, describe, it } from "@jest/globals"

// Mock the useBlurImage hook
jest.mock("@/hooks/use-blur-image", () => ({
  useBlurImage: () => ({ blurDataUrl: "data:image/svg+xml;base64,test" }),
}))

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props) => {
    // Call onLoad immediately to simulate image loading
    if (props.onLoad) {
      setTimeout(() => props.onLoad(), 0)
    }
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />
  },
}))

describe("ProductGallery", () => {
  const mockImages = [
    "/placeholder.svg?height=800&width=800",
    "/placeholder.svg?height=800&width=800",
    "/placeholder.svg?height=800&width=800",
  ]
  const mockProductName = "Test Product"

  it("renders the gallery with the first image selected", () => {
    render(<ProductGallery images={mockImages} productName={mockProductName} />)

    // Check if main image is rendered
    const mainImage = screen.getByAltText(`${mockProductName} - Image 1`)
    expect(mainImage).toBeInTheDocument()

    // Check if thumbnails are rendered
    const thumbnails = screen.getAllByRole("button", { name: /View image/i })
    expect(thumbnails).toHaveLength(mockImages.length)
  })

  it("changes the selected image when a thumbnail is clicked", () => {
    render(<ProductGallery images={mockImages} productName={mockProductName} />)

    // Click the second thumbnail
    const secondThumbnail = screen.getByRole("button", { name: "View image 2" })
    fireEvent.click(secondThumbnail)

    // Check if the main image has been updated
    const mainImage = screen.getByAltText(`${mockProductName} - Image 2`)
    expect(mainImage).toBeInTheDocument()
  })

  it("navigates images with arrow buttons", () => {
    render(<ProductGallery images={mockImages} productName={mockProductName} />)

    // Get the navigation buttons
    const nextButton = screen.getByRole("button", { name: "Next image" })

    // Click next button
    fireEvent.click(nextButton)

    // Check if the main image has been updated
    const mainImage = screen.getByAltText(`${mockProductName} - Image 2`)
    expect(mainImage).toBeInTheDocument()

    // Click next button again
    fireEvent.click(nextButton)

    // Check if the main image has been updated
    const updatedMainImage = screen.getByAltText(`${mockProductName} - Image 3`)
    expect(updatedMainImage).toBeInTheDocument()
  })

  it("toggles zoom when clicking on the main image", async () => {
    render(<ProductGallery images={mockImages} productName={mockProductName} />)

    // Wait for image to load
    await screen.findByAltText(`${mockProductName} - Image 1`)

    // Get the main image container
    const imageContainer = screen.getByRole("button", { name: "Zoom in" })

    // Click to zoom in
    fireEvent.click(imageContainer)

    // Check if the aria-label has been updated
    expect(imageContainer).toHaveAttribute("aria-label", "Zoom out")

    // Click again to zoom out
    fireEvent.click(imageContainer)

    // Check if the aria-label has been updated back
    expect(imageContainer).toHaveAttribute("aria-label", "Zoom in")
  })

  it("shows loading indicator while image is loading", () => {
    // Override the mock to not call onLoad immediately
    jest.mock("next/image", () => ({
      __esModule: true,
      default: (props) => <img {...props} />,
    }))

    render(<ProductGallery images={mockImages} productName={mockProductName} />)

    // Check if loading indicator is present
    const loadingIndicator = screen.getByRole("status")
    expect(loadingIndicator).toBeInTheDocument()
  })

  it("handles image errors gracefully", () => {
    // Override the mock to simulate an error
    jest.mock("next/image", () => ({
      __esModule: true,
      default: (props) => {
        if (props.onError) {
          setTimeout(() => props.onError({ target: { src: "", onerror: null } }), 0)
        }
        return <img {...props} />
      },
    }))

    render(<ProductGallery images={["invalid-url"]} productName={mockProductName} />)

    // The component should not crash
    expect(screen.getByRole("button", { name: "Zoom in" })).toBeInTheDocument()
  })
})
