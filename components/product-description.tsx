"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProductDescriptionProps {
  description: string
  features: string[]
  care: string
}

export default function ProductDescription({ description, features, care }: ProductDescriptionProps) {
  const [expandedSections, setExpandedSections] = useState({
    description: true,
    features: false,
    care: false,
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  return (
    <div className="border rounded-lg divide-y">
      {/* Description Section */}
      <div className="p-4">
        <button
          className="flex w-full items-center justify-between text-left"
          onClick={() => toggleSection("description")}
          aria-expanded={expandedSections.description}
          aria-controls="description-content"
        >
          <h2 className="text-xl font-semibold">Product Description</h2>
          {expandedSections.description ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
        <div
          id="description-content"
          className={cn(
            "mt-2 text-muted-foreground transition-all duration-300 overflow-hidden",
            expandedSections.description ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
          )}
          aria-hidden={!expandedSections.description}
        >
          <p>{description}</p>
        </div>
      </div>

      {/* Features Section */}
      <div className="p-4">
        <button
          className="flex w-full items-center justify-between text-left"
          onClick={() => toggleSection("features")}
          aria-expanded={expandedSections.features}
          aria-controls="features-content"
        >
          <h2 className="text-xl font-semibold">Features</h2>
          {expandedSections.features ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
        <div
          id="features-content"
          className={cn(
            "mt-2 text-muted-foreground transition-all duration-300 overflow-hidden",
            expandedSections.features ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
          )}
          aria-hidden={!expandedSections.features}
        >
          <ul className="list-disc pl-5 space-y-1">
            {features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Care Section */}
      <div className="p-4">
        <button
          className="flex w-full items-center justify-between text-left"
          onClick={() => toggleSection("care")}
          aria-expanded={expandedSections.care}
          aria-controls="care-content"
        >
          <h2 className="text-xl font-semibold">Care Instructions</h2>
          {expandedSections.care ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
        <div
          id="care-content"
          className={cn(
            "mt-2 text-muted-foreground transition-all duration-300 overflow-hidden",
            expandedSections.care ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
          )}
          aria-hidden={!expandedSections.care}
        >
          <p>{care}</p>
        </div>
      </div>
    </div>
  )
}
