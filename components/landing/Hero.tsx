'use client'

import React from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Award, LayoutDashboard } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

interface CompanyLogo {
  name: string
  logo: string
}

interface HeroProps {
  companyLogos?: CompanyLogo[]
}

const Hero = ({ companyLogos = [] }: HeroProps) => {
  const router = useRouter()
    const { user } = useAuth()

  return (
    <section className="relative py-16 sm:py-20 md:py-32 px-4 sm:px-6 overflow-hidden">
      {/* Background with enhanced gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-accent/10"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-background/50"></div>
      
      {/* Animated background elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="container mx-auto text-center max-w-6xl relative z-10">
        {/* Trust badge with enhanced styling */}
        <div className="mb-8 animate-fade-in">
          <span className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 text-primary text-sm font-semibold border border-primary/20 shadow-lg backdrop-blur-sm">
            <Award className="w-4 h-4 mr-2 text-primary" />
            ✨ Trusted by 50,000+ professionals worldwide
          </span>
        </div>

        {/* Enhanced heading with better typography */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-8 leading-tight tracking-tight">
          <span className="text-foreground block mb-2">Transform Your</span>
          <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent block animate-gradient">
            Invoicing Workflow ✨
          </span>
        </h1>

        {/* Enhanced description */}
        <p className="text-xl sm:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed font-medium">
          Create stunning professional invoices in minutes, not hours. 
          <span className="text-primary font-semibold"> Get paid 3x faster</span> with our intelligent automation and beautiful templates.
        </p>

        {/* Enhanced CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
          {user ? (
            <Button 
              size="lg" 
              className="group text-lg px-10 py-5 h-auto bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-2xl hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105 border-0 font-semibold" 
              onClick={() => router.push("/dashboard")}
            >
              <LayoutDashboard className="w-5 h-5 mr-2" />
              Go to Dashboard
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          ) : (
            <>
              <Button 
                size="lg" 
                className="group text-lg px-10 py-5 h-auto bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-2xl hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105 border-0 font-semibold" 
                onClick={() => router.push("/auth")}
              >
                🚀 Get Started for Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline"
                size="lg" 
                className="group text-lg px-8 py-5 h-auto border-2 border-primary/30 text-primary hover:bg-primary/5 hover:border-primary/50 transition-all duration-300 font-semibold" 
                onClick={() => {
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                📋 See How It Works
              </Button>
            </>
          )}
        </div>

        {/* Company Logos */}
        {companyLogos.length > 0 && (
          <div className="border-t border-border pt-12">
            <p className="text-sm text-muted-foreground mb-8">Trusted by leading companies</p>
            <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 md:gap-12 opacity-60">
              {companyLogos.map((company, index) => (
                <img
                  key={index}
                  src={company.logo || "/placeholder.svg"}
                  alt={company.name}
                  className="h-8 grayscale hover:grayscale-0 transition-all"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default Hero
