export interface ProductVariant {
  id: string
  color: string
  colorCode: string
  size: string
  inventory: number
}

export interface ProductImage {
  id: string
  color: string
  urls: string[]
}

export interface Product {
  id: string
  name: string
  price: number
  description: string
  features: string[]
  care: string
  variants: ProductVariant[]
  images: ProductImage[]
}

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  color: string
  size: string
  quantity: number
  image: string
}
