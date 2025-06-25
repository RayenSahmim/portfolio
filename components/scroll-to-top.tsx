"use client"

import { useState, useEffect } from "react"
import { ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility)
    return () => {
      window.removeEventListener("scroll", toggleVisibility)
    }
  }, [])

  return (
    <>
      {isVisible && (
        <div className="fixed bottom-8 right-8 z-50">
          <Button
            onClick={scrollToTop}
            className="professional-button-primary w-12 h-12 rounded-full p-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
            aria-label="Scroll to top"
          >
            <ChevronUp className="h-6 w-6" />
          </Button>
        </div>
      )}
    </>
  )
}
