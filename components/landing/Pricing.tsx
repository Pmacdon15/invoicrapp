'use client'

import React from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Star, Crown, Zap } from "lucide-react"

interface PricingPlan {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  popular: boolean
}

interface PricingProps {
  pricingPlans?: PricingPlan[]
}

const Pricing = ({ pricingPlans }: PricingProps) => {
  const defaultPricingPlans = [
    {
      name: "Free",
      price: "$0",
      period: "/month",
      description: "Perfect for freelancers getting started",
      features: [
        "Up to 8 invoices per month", 
        "6 beautiful invoice themes", 
        "Client management", 
        "Basic invoice customization",
        "Email support",
        "Mobile responsive design",
        "PDF export"
      ],
      popular: false,
    },
    {
      name: "Pro",
      price: "$5",
      period: "/month",
      description: "Unlimited invoicing for growing businesses",
      features: [
        "Unlimited invoices",
        "All invoice themes",
        "Advanced customization",
        "Custom fields & branding",
        "Invoice analytics",
        "Payment tracking",
        "Priority support",
        "Advanced PDF options"
      ],
      popular: true,
    },
  ]

  const plansData = pricingPlans || defaultPricingPlans

  const getPlanIcon = (planName: string) => {
    switch (planName) {
      case "Free":
        return <Zap className="h-6 w-6" />
      case "Pro":
        return <Crown className="h-6 w-6" />
      default:
        return <Zap className="h-6 w-6" />
    }
  }

  return (
    <section data-section="pricing" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-gradient-to-br from-secondary/30 via-background to-primary/5 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            💰 Simple Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Choose the Plan That 
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent block">Fits Your Needs</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Start free and scale as you grow. All plans include our core features with 
            <span className="font-semibold text-primary"> 14-day money-back guarantee</span>.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plansData.map((plan, index) => (
            <Card
              key={index}
              className={`group relative p-6 bg-card border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
                plan.popular 
                  ? "ring-2 ring-primary/20 scale-105" 
                  : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <span className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                    ⭐ Most Popular
                  </span>
                </div>
              )}

              {/* Gradient background on hover */}
              <div className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                plan.popular 
                  ? "bg-gradient-to-br from-primary/5 to-accent/5" 
                  : "bg-gradient-to-br from-secondary/50 to-primary/5"
              }`}></div>
              
              <div className="relative z-10">
                {/* Plan header */}
                <div className="text-center mb-6">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3 ${
                    plan.popular 
                      ? "bg-gradient-to-br from-primary/10 to-accent/10 text-primary" 
                      : "bg-gradient-to-br from-muted to-primary/10 text-muted-foreground"
                  } group-hover:scale-110 transition-transform duration-300`}>
                    {getPlanIcon(plan.name)}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                  
                  {/* Price */}
                  <div className="flex items-baseline justify-center mb-2">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground ml-2">{plan.period}</span>
                  </div>
                  {plan.name === "Free" && (
                    <p className="text-xs text-primary font-semibold">Forever free • No credit card required</p>
                  )}
                  {plan.name === "Pro" && (
                    <p className="text-xs text-green-600 font-semibold">Save $12 with annual billing</p>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <CheckCircle className={`h-4 w-4 mr-2 flex-shrink-0 mt-0.5 ${
                        plan.popular ? "text-primary" : "text-accent"
                      }`} />
                      <span className="text-sm text-foreground leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button 
                  className={`w-full py-3 font-semibold transition-all duration-300 transform hover:scale-105 ${
                    plan.popular 
                      ? "bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-lg hover:shadow-xl" 
                      : "border-2 border-primary/30 text-primary hover:bg-primary/5 hover:border-primary/50 bg-card"
                  }`}
                >
                  {plan.name === "Free" ? "🚀 Start Free" : "✨ Upgrade to Pro"}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Additional info */}
        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground mb-4">
            All plans include <span className="font-semibold text-primary">unlimited support</span> and <span className="font-semibold text-primary">99.9% uptime guarantee</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <button className="px-4 py-2 text-sm text-primary font-semibold hover:text-primary/80 transition-colors">
              📊 Compare all features
            </button>
            <button className="px-4 py-2 text-sm text-primary font-semibold hover:text-primary/80 transition-colors">
              💬 Talk to our team
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Pricing
