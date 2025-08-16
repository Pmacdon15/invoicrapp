'use client'

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileText, Menu, X } from "lucide-react"
import { useRouter } from "next/navigation"

const Header = () => {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-foreground">Invoicr</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" className="font-medium" onClick={() => router.push("/auth")}>
              Sign In
            </Button>
            <Button className="font-medium" onClick={() => router.push("/auth")}>
              Get Started for Free
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3">
            <Button 
              variant="ghost" 
              className="w-full justify-start font-medium" 
              onClick={() => {
                router.push("/auth")
                setIsMobileMenuOpen(false)
              }}
            >
              Sign In
            </Button>
            <Button 
              className="w-full font-medium" 
              onClick={() => {
                router.push("/auth")
                setIsMobileMenuOpen(false)
              }}
            >
              Get Started for Free
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
