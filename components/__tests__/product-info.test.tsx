import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import ProductInfo from "../product-info"
import type { Product, ProductVariant } from "@/types/product"
import { expect, jest, describe, it } from "@jest/globals"

describe("ProductInfo", () => {
  const mockProduct: Product = {
    id: "1",
    name: "Test Product",
    price: 99.99,
    description: "Test description",
    features: ["Feature 1", "Feature 2"],
    care: "Test care instructions",
    variants: [
      { id: "1-1", color: "Black", colorCode: "#000000", size: "7", inventory: 10 },
      { id: "1-2", color: "Black", colorCode: "#000000", size: "8", inventory: 0 },
      { id: "1-3", color: "White", colorCode: "#FFFFFF", size: "7", inventory: 5 },
      { id: "1-4", color: "White", colorCode: "#FFFFFF", size: "8", inventory: 2 }, // Low stock
    ],
    images: [
      { id: "1", color: "Black", urls: ["/test1.jpg", "/test2.jpg"] },
      { id: "2", color: "White", urls: ["/test3.jpg", "/test4.jpg"] },
    ],
  }

  const mockCurrentVariant: ProductVariant = mockProduct.variants[0]

  const mockProps = {
    product: mockProduct,
    selectedColor: "Black",
    selectedSize: "7",
    quantity: 1,
    availableColors: ["Black", "White"],
    availableSizes: ["7", "8"],
    currentVariant: mockCurrentVariant,
    onColorChange: jest.fn(),
    onSizeChange: jest.fn(),
    onQuantityChange: jest.fn(),
    onAddToCart: jest.fn(),
  }

  it("renders product information correctly", () => {
    render(<ProductInfo {...mockProps} />)

    // Check if product name and price are displayed
    expect(screen.getByText("Test Product")).toBeInTheDocument()
    expect(screen.getByText("$99.99")).toBeInTheDocument()

    // Check if color and size options are displayed
    expect(screen.getByText(/Color:/)).toBeInTheDocument()
    expect(screen.getByText(/Size:/)).toBeInTheDocument()

    // Check if quantity selector is displayed
    expect(screen.getByText("Quantity")).toBeInTheDocument()

    // Check if add to cart button is displayed
    expect(screen.getByRole("button", { name: /Add to Cart/i })).toBeInTheDocument()
  })

  it("calls onColorChange when a color is selected", () => {
    render(<ProductInfo {...mockProps} />)

    // Find and click the White color option
    const whiteColorButton = screen.getByRole("radio", { name: /White/i })
    fireEvent.click(whiteColorButton)

    // Check if onColorChange was called with the correct color
    expect(mockProps.onColorChange).toHaveBeenCalledWith("White")
  })

  it("calls onSizeChange when a size is selected", () => {
    render(<ProductInfo {...mockProps} />)

    // Find and click the size 8 option
    const size8Button = screen.getByLabelText("Size 8")
    fireEvent.click(size8Button)

    // Check if onSizeChange was called with the correct size
    expect(mockProps.onSizeChange).toHaveBeenCalledWith("8")
  })

  it("calls onQuantityChange when quantity buttons are clicked", () => {
    render(<ProductInfo {...mockProps} />)

    // Find and click the increase quantity button
    const increaseButton = screen.getByRole("button", { name: "Increase quantity" })
    fireEvent.click(increaseButton)

    // Check if onQuantityChange was called with the correct quantity
    expect(mockProps.onQuantityChange).toHaveBeenCalledWith(2)

    // Find and click the decrease quantity button
    const decreaseButton = screen.getByRole("button", { name: "Decrease quantity" })
    fireEvent.click(decreaseButton)

    // Check if onQuantityChange was called with the correct quantity
    expect(mockProps.onQuantityChange).toHaveBeenCalledWith(0)
  })

  it("calls onAddToCart when add to cart button is clicked", () => {
    render(<ProductInfo {...mockProps} />)

    // Find and click the add to cart button
    const addToCartButton = screen.getByRole("button", { name: /Add to Cart/i })
    fireEvent.click(addToCartButton)

    // Check if onAddToCart was called
    expect(mockProps.onAddToCart).toHaveBeenCalled()
  })

  it("disables add to cart button when product is out of stock", () => {
    const outOfStockProps = {
      ...mockProps,
      currentVariant: { ...mockCurrentVariant, inventory: 0 },
    }

    render(<ProductInfo {...outOfStockProps} />)

    // Check if add to cart button is disabled
    const addToCartButton = screen.getByRole("button", { name: /Add to Cart/i })
    expect(addToCartButton).toBeDisabled()

    // Check if out of stock badge is displayed
    expect(screen.getByText("Out of Stock")).toBeInTheDocument()
  })

  it("shows low stock alert when inventory is 5 or less", () => {
    const lowStockProps = {
      ...mockProps,
      currentVariant: { ...mockCurrentVariant, inventory: 3 },
    }

    render(<ProductInfo {...lowStockProps} />)

    // Check if low stock alert is displayed
    expect(screen.getByText(/Only 3 left in stock/)).toBeInTheDocument()
  })

  it("shows success message after adding to cart", async () => {
    jest.useFakeTimers()

    render(<ProductInfo {...mockProps} />)

    // Find and click the add to cart button
    const addToCartButton = screen.getByRole("button", { name: /Add to Cart/i })
    fireEvent.click(addToCartButton)

    // Check if success message is displayed
    expect(screen.getByText("Added to Cart")).toBeInTheDocument()

    // Advance timers
    jest.advanceTimersByTime(2000)

    // Check if button text is back to normal
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Add to Cart/i })).toBeInTheDocument()
    })

    jest.useRealTimers()
  })
})
