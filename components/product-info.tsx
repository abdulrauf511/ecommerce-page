"use client"

import { useState, useEffect } from "react"
import { Check, Minus, Plus, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Product, ProductVariant } from "@/types/product"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ProductInfoProps {
  product: Product
  selectedColor: string
  selectedSize: string
  quantity: number
  availableColors: string[]
  availableSizes: string[]
  currentVariant: ProductVariant
  onColorChange: (color: string) => void
  onSizeChange: (size: string) => void
  onQuantityChange: (quantity: number) => void
  onAddToCart: () => void
}

export default function ProductInfo({
  product,
  selectedColor,
  selectedSize,
  quantity,
  availableColors,
  availableSizes,
  currentVariant,
  onColorChange,
  onSizeChange,
  onQuantityChange,
  onAddToCart,
}: ProductInfoProps) {
  const [addedToCart, setAddedToCart] = useState(false)
  const [lowStockAlert, setLowStockAlert] = useState(false)

  // Check for low stock
  useEffect(() => {
    if (currentVariant && currentVariant.inventory > 0 && currentVariant.inventory <= 5) {
      setLowStockAlert(true)
    } else {
      setLowStockAlert(false)
    }
  }, [currentVariant])

  const handleAddToCart = () => {
    onAddToCart()
    setAddedToCart(true)

    // Reset the added state after 2 seconds
    setTimeout(() => {
      setAddedToCart(false)
    }, 2000)
  }

  const isOutOfStock = !currentVariant || currentVariant.inventory === 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
        <div className="mt-2 flex items-center">
          <p className="text-2xl font-semibold">${product.price.toFixed(2)}</p>
        </div>
      </div>

      {/* Color selection */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="color-selection" className="text-base font-medium">
            Color: <span className="font-semibold">{selectedColor}</span>
          </Label>
          {isOutOfStock && <Badge variant="destructive">Out of Stock</Badge>}
        </div>
        <div className="flex flex-wrap gap-2" id="color-selection" role="radiogroup" aria-label="Select a color">
          {availableColors.map((color) => {
            const colorVariants = product.variants.filter((v) => v.color === color)
            const isAvailable = colorVariants.some((v) => v.inventory > 0)

            return (
              <button
                key={color}
                className={cn(
                  "relative h-10 w-10 rounded-full border-2 transition-all",
                  selectedColor === color ? "border-primary ring-2 ring-primary ring-offset-2" : "border-muted",
                  !isAvailable && "opacity-50 cursor-not-allowed",
                )}
                style={{ backgroundColor: colorVariants[0].colorCode }}
                onClick={() => isAvailable && onColorChange(color)}
                disabled={!isAvailable}
                aria-label={`${color}${!isAvailable ? " (Out of stock)" : ""}`}
                aria-pressed={selectedColor === color}
                role="radio"
              >
                {selectedColor === color && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <Check className={cn("h-5 w-5", color === "White" ? "text-black" : "text-white")} />
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Size selection */}
      <div className="space-y-2">
        <Label htmlFor="size-selection" className="text-base font-medium">
          Size: <span className="font-semibold">{selectedSize}</span>
        </Label>
        <RadioGroup
          id="size-selection"
          value={selectedSize}
          onValueChange={onSizeChange}
          className="flex flex-wrap gap-2"
        >
          {availableSizes.map((size) => {
            const sizeVariant = product.variants.find((v) => v.color === selectedColor && v.size === size)
            const isAvailable = sizeVariant && sizeVariant.inventory > 0

            return (
              <div key={size} className="flex items-center">
                <Label
                  htmlFor={`size-${size}`}
                  className={cn(
                    "flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border text-sm transition-all",
                    selectedSize === size ? "border-primary bg-primary text-primary-foreground" : "border-input",
                    !isAvailable && "opacity-50 cursor-not-allowed",
                  )}
                >
                  <RadioGroupItem
                    id={`size-${size}`}
                    value={size}
                    className="sr-only"
                    disabled={!isAvailable}
                    aria-label={`Size ${size}${!isAvailable ? " (Out of stock)" : ""}`}
                  />
                  {size}
                </Label>
              </div>
            )
          })}
        </RadioGroup>
      </div>

      {/* Low stock alert */}
      {lowStockAlert && (
        <Alert variant="destructive" className="bg-amber-50 text-amber-800 border-amber-200">
          <AlertDescription>Only {currentVariant.inventory} left in stock - order soon!</AlertDescription>
        </Alert>
      )}

      {/* Quantity selector */}
      <div className="space-y-2">
        <Label htmlFor="quantity" className="text-base font-medium">
          Quantity
        </Label>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onQuantityChange(quantity - 1)}
            disabled={quantity <= 1 || isOutOfStock}
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span
            id="quantity"
            className="flex h-10 w-12 items-center justify-center rounded-md border border-input bg-background px-3 py-2"
            aria-live="polite"
            aria-atomic="true"
          >
            {quantity}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onQuantityChange(quantity + 1)}
            disabled={isOutOfStock || (currentVariant && quantity >= currentVariant.inventory)}
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </Button>

          {currentVariant && currentVariant.inventory > 0 && (
            <span className="text-sm text-muted-foreground ml-2">{currentVariant.inventory} available</span>
          )}
        </div>
      </div>

      {/* Add to cart button */}
      <Button className="w-full" size="lg" onClick={handleAddToCart} disabled={isOutOfStock} aria-live="assertive">
        {addedToCart ? (
          <>
            <Check className="mr-2 h-5 w-5" />
            Added to Cart
          </>
        ) : (
          <>
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Cart
          </>
        )}
      </Button>
    </div>
  )
}
