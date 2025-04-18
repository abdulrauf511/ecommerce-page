import { render, screen, fireEvent } from "@testing-library/react"
import ProductDescription from "../product-description"
import { expect, describe, it } from "@jest/globals"

describe("ProductDescription", () => {
  const mockProps = {
    description: "Test product description",
    features: ["Feature 1", "Feature 2", "Feature 3"],
    care: "Test care instructions",
  }

  it("renders all section headers", () => {
    render(<ProductDescription {...mockProps} />)

    expect(screen.getByText("Product Description")).toBeInTheDocument()
    expect(screen.getByText("Features")).toBeInTheDocument()
    expect(screen.getByText("Care Instructions")).toBeInTheDocument()
  })

  it("expands description section by default", () => {
    render(<ProductDescription {...mockProps} />)

    // Description should be visible by default
    expect(screen.getByText("Test product description")).toBeVisible()

    // Features and care should be hidden
    const featuresContent = screen.getByText("Feature 1").parentElement
    const careContent = screen.getByText("Test care instructions").parentElement

    expect(featuresContent).toHaveClass("max-h-0")
    expect(careContent).toHaveClass("max-h-0")
  })

  it("toggles sections when headers are clicked", () => {
    render(<ProductDescription {...mockProps} />)

    // Click on Features header
    fireEvent.click(screen.getByText("Features"))

    // Features should now be visible
    const featuresContent = screen.getByText("Feature 1").parentElement
    expect(featuresContent).toHaveClass("max-h-96")

    // Click on Features header again to collapse
    fireEvent.click(screen.getByText("Features"))

    // Features should now be hidden again
    expect(featuresContent).toHaveClass("max-h-0")
  })

  it("maintains proper ARIA attributes for accessibility", () => {
    render(<ProductDescription {...mockProps} />)

    // Check description section
    const descriptionButton = screen.getByRole("button", { name: "Product Description" })
    expect(descriptionButton).toHaveAttribute("aria-expanded", "true")
    expect(descriptionButton).toHaveAttribute("aria-controls", "description-content")

    // Check features section
    const featuresButton = screen.getByRole("button", { name: "Features" })
    expect(featuresButton).toHaveAttribute("aria-expanded", "false")
    expect(featuresButton).toHaveAttribute("aria-controls", "features-content")

    // Toggle features section
    fireEvent.click(featuresButton)
    expect(featuresButton).toHaveAttribute("aria-expanded", "true")
  })
})
