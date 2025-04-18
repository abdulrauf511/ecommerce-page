"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useBlurImage } from "@/hooks/use-blur-image"

interface ProductGalleryProps {
  images: string[]
  productName: string
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })
  const [imageLoaded, setImageLoaded] = useState(false)
  const imageContainerRef = useRef<HTMLDivElement>(null)
  const { blurDataUrl } = useBlurImage()

  // Reset selected image index when images change (color change)
  useEffect(() => {
    setSelectedImageIndex(0)
    setImageLoaded(false)
  }, [images])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        navigateImage(-1)
      } else if (e.key === "ArrowRight") {
        navigateImage(1)
      } else if (e.key === "Escape" && isZoomed) {
        setIsZoomed(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedImageIndex, isZoomed])

  const navigateImage = (direction: number) => {
    const newIndex = selectedImageIndex + direction
    if (newIndex >= 0 && newIndex < images.length) {
      setSelectedImageIndex(newIndex)
      setImageLoaded(false)
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current || !isZoomed) return

    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100

    setZoomPosition({ x, y })
  }

  const handleMouseLeave = () => {
    setIsZoomed(false)
  }

  const toggleZoom = () => {
    if (imageLoaded) {
      setIsZoomed(!isZoomed)
    }
  }

  // Ensure we have a valid image URL
  const currentImage = images[selectedImageIndex] || "/placeholder.svg?height=800&width=800"

  return (
    <div className="space-y-4">
      {/* Loading indicator */}
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-background/50">
          <div
            className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"
            role="status"
            aria-label="Loading image"
          >
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}

      <div
        ref={imageContainerRef}
        className={cn(
          "relative overflow-hidden rounded-lg aspect-square",
          isZoomed ? "cursor-zoom-out" : "cursor-zoom-in",
          !imageLoaded && "bg-muted",
        )}
        onClick={toggleZoom}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        role="button"
        tabIndex={0}
        aria-label={isZoomed ? "Zoom out" : "Zoom in"}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src={currentImage || "/placeholder.svg"}
            alt={`${productName} - Image ${selectedImageIndex + 1}`}
            fill
            className={cn(
              "object-cover transition-transform duration-200",
              isZoomed ? "scale-150" : "scale-100",
              !imageLoaded && "opacity-0",
            )}
            style={
              isZoomed
                ? {
                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    objectPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  }
                : undefined
            }
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={selectedImageIndex === 0}
            placeholder="blur"
            blurDataURL={blurDataUrl}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              // Fallback to placeholder on error
              const target = e.target as HTMLImageElement
              target.src = "/placeholder.svg?height=800&width=800&text=Image+Not+Found"
              target.onerror = null // Prevent infinite error loop
              setImageLoaded(true)
            }}
          />
        </div>

        {/* Navigation buttons */}
        <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 hover:opacity-100 transition-opacity">
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full bg-background/80 backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation()
              navigateImage(-1)
            }}
            disabled={selectedImageIndex === 0}
            aria-label="Previous image"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full bg-background/80 backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation()
              navigateImage(1)
            }}
            disabled={selectedImageIndex === images.length - 1}
            aria-label="Next image"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-thin">
        {images.map((image, index) => (
          <button
            key={index}
            className={cn(
              "relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden border-2",
              selectedImageIndex === index ? "border-primary" : "border-transparent",
            )}
            onClick={() => setSelectedImageIndex(index)}
            aria-label={`View image ${index + 1}`}
            aria-current={selectedImageIndex === index ? "true" : "false"}
          >
            <Image
              src={image || "/placeholder.svg"}
              alt={`${productName} thumbnail ${index + 1}`}
              fill
              className="object-cover"
              sizes="80px"
              placeholder="blur"
              blurDataURL={blurDataUrl}
              onError={(e) => {
                // Fallback to placeholder on error
                const target = e.target as HTMLImageElement
                target.src = "/placeholder.svg?height=200&width=200&text=Thumbnail"
                target.onerror = null // Prevent infinite error loop
              }}
            />
          </button>
        ))}
      </div>
    </div>
  )
}
