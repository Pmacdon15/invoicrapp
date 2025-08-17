'use client'

import React from "react"
import { Card } from "@/components/ui/card"
import { FileText, Users, TrendingUp, Zap, Shield, Clock, Palette, Globe, BarChart3 } from "lucide-react"

interface Feature {
  icon: React.ReactNode
  title: string
  description: string
}

interface FeaturesProps {
  features?: Feature[]
}

const Features = ({ features }: FeaturesProps) => {
  const defaultFeatures = [
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Lightning Fast Creation ⚡",
      description: "Generate professional invoices in under 60 seconds with our intelligent templates and auto-fill technology.",
    },
    {
      icon: <Palette className="h-8 w-8" />,
      title: "Beautiful Templates 🎨",
      description: "Choose from 20+ stunning, professionally designed templates that make your invoices stand out.",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Bank-Level Security 🔒",
      description: "Your data is protected with enterprise-grade encryption and secure cloud storage.",
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Get Paid 3x Faster ⏰",
      description: "Automated reminders and one-click payment links help you get paid faster than ever.",
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Smart Analytics 📊",
      description: "Track payment trends, client behavior, and revenue insights with powerful reporting tools.",
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Global Ready 🌍",
      description: "Support for 150+ currencies, multiple languages, and international tax compliance.",
    },
  ]

  const featuresData = features || defaultFeatures

  return (
    <section id="features" className="py-20 sm:py-24 md:py-32 px-4 sm:px-6 bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
            ✨ Powerful Features
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mb-6">
            Everything You Need to 
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent block">Scale Your Business</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Powerful features designed to streamline your workflow and help you focus on what matters most - 
            <span className="font-semibold text-primary"> growing your business</span>.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresData.map((feature, index) => (
            <Card
              key={index}
              className="group p-8 bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 relative overflow-hidden"
            >
              {/* Gradient background on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                {/* Enhanced icon container */}
                <div className="mb-6 p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl w-fit group-hover:from-primary/20 group-hover:to-accent/20 transition-all duration-300 group-hover:scale-110">
                  <div className="text-primary group-hover:text-primary transition-colors">
                    {feature.icon}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">
                  {feature.description}
                </p>
              </div>

              {/* Subtle border animation */}
              <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-primary/20 transition-colors duration-300"></div>
            </Card>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <p className="text-lg text-muted-foreground mb-6">Ready to transform your invoicing workflow?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="px-8 py-4 bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              🚀 Start Free Trial
            </button>
            <button className="px-8 py-4 border-2 border-primary/30 text-primary font-semibold rounded-lg hover:bg-primary/5 transition-all duration-300">
              📞 Book a Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Features
