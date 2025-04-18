"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import ProductGallery from "./product-gallery"
import ProductInfo from "./product-info"
import ProductDescription from "./product-description"
import type { Product, ProductVariant } from "@/types/product"
import { useCart } from "@/hooks/use-cart"

// Mock product data
const productData: Product = {
  id: "1",
  name: "Premium Comfort Sneakers",
  price: 129.99,
  description:
    "Experience unparalleled comfort with our Premium Comfort Sneakers. Designed for all-day wear, these sneakers feature advanced cushioning technology, breathable materials, and stylish design that complements any outfit.",
  features: [
    "Lightweight cushioned insole for all-day comfort",
    "Breathable mesh upper keeps feet cool",
    "Durable rubber outsole provides excellent traction",
    "Eco-friendly materials: 30% recycled content",
    "Removable insole for custom orthotics",
  ],
  care: "Spot clean with mild detergent and warm water. Air dry away from direct heat or sunlight. Do not machine wash or tumble dry.",
  variants: [
    { id: "1-1", color: "Black", colorCode: "#000000", size: "7", inventory: 10 },
    { id: "1-2", color: "Black", colorCode: "#000000", size: "8", inventory: 15 },
    { id: "1-3", color: "Black", colorCode: "#000000", size: "9", inventory: 20 },
    { id: "1-4", color: "White", colorCode: "#FFFFFF", size: "7", inventory: 12 },
    { id: "1-5", color: "White", colorCode: "#FFFFFF", size: "8", inventory: 18 },
    { id: "1-6", color: "White", colorCode: "#FFFFFF", size: "9", inventory: 5 },
    { id: "1-7", color: "Blue", colorCode: "#0047AB", size: "7", inventory: 8 },
    { id: "1-8", color: "Blue", colorCode: "#0047AB", size: "8", inventory: 14 },
    { id: "1-9", color: "Blue", colorCode: "#0047AB", size: "9", inventory: 0 },
  ],
  images: [
    {
      id: "1",
      color: "Black",
      urls: [
        "https://images.unsplash.com/photo-1543508282-6319a3e2621f?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1000&auto=format&fit=crop",
      ],
    },
    {
      id: "2",
      color: "White",
      urls: [
        "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?q=80&w=1000&auto=format&fit=crop",
      ],
    },
    {
      id: "3",
      color: "Blue",
      urls: [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1556048219-bb6978360b84?q=80&w=1000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=1000&auto=format&fit=crop",
      ],
    },
  ],
}

export default function ProductPage() {
  const [selectedColor, setSelectedColor] = useState<string>(productData.variants[0].color)
  const [selectedSize, setSelectedSize] = useState<string>(productData.variants[0].size)
  const [quantity, setQuantity] = useState<number>(1)
  const { addToCart } = useCart()
  const { theme } = useTheme()

  // Get available sizes for the selected color
  const availableSizes = productData.variants
    .filter((variant) => variant.color === selectedColor)
    .map((variant) => variant.size)

  // Get available colors
  const availableColors = Array.from(new Set(productData.variants.map((variant) => variant.color)))

  // Get current variant
  const currentVariant = productData.variants.find(
    (variant) => variant.color === selectedColor && variant.size === selectedSize,
  )

  // Get images for the selected color
  const colorImages = productData.images.find((img) => img.color === selectedColor)?.urls || []

  const handleColorChange = (color: string) => {
    setSelectedColor(color)
    // Reset size to first available for this color
    const sizesForColor = productData.variants
      .filter((variant) => variant.color === color)
      .map((variant) => variant.size)
    setSelectedSize(sizesForColor[0])
  }

  const handleSizeChange = (size: string) => {
    setSelectedSize(size)
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > 0 && currentVariant && newQuantity <= currentVariant.inventory) {
      setQuantity(newQuantity)
    }
  }

  const handleAddToCart = () => {
    if (currentVariant) {
      addToCart({
        id: currentVariant.id,
        productId: productData.id,
        name: productData.name,
        price: productData.price,
        color: currentVariant.color,
        size: currentVariant.size,
        quantity,
        image: colorImages[0],
      })
    }
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <ProductGallery images={colorImages} productName={productData.name} />

        <ProductInfo
          product={productData}
          selectedColor={selectedColor}
          selectedSize={selectedSize}
          quantity={quantity}
          availableColors={availableColors}
          availableSizes={availableSizes}
          currentVariant={currentVariant as ProductVariant}
          onColorChange={handleColorChange}
          onSizeChange={handleSizeChange}
          onQuantityChange={handleQuantityChange}
          onAddToCart={handleAddToCart}
        />
      </div>

      <ProductDescription
        description={productData.description}
        features={productData.features}
        care={productData.care}
      />
    </main>
  )
}
