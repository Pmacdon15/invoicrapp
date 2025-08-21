'use client'

import React from "react"
import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"

interface Testimonial {
  name: string
  role: string
  content: string
  rating: number
  avatar: string
}

interface TestimonialsProps {
  testimonials?: Testimonial[]
}

const Testimonials = ({ testimonials }: TestimonialsProps) => {
  const defaultTestimonials = [
    {
      name: "Sarah Johnson",
      role: "Freelance Designer",
      content:
        "Invoicr transformed my workflow completely. I've saved 10+ hours per week and my clients love the professional look.",
      rating: 5,
      avatar: "/professional-woman-diverse.png",
    },
    {
      name: "Mike Chen",
      role: "Agency Owner",
      content:
        "The real-time collaboration features are game-changing. Our team can work together seamlessly on client projects.",
      rating: 5,
      avatar: "/professional-man.png",
    },
    {
      name: "Emily Rodriguez",
      role: "Consultant",
      content:
        "The analytics insights helped me optimize my pricing strategy. Revenue increased by 40% in just 3 months.",
      rating: 5,
      avatar: "/professional-woman-consultant.png",
    },
  ]

  const testimonialsData = testimonials || defaultTestimonials

  return (
    <section data-section="testimonials" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-gradient-to-br from-white via-emerald-50/50 to-teal-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-10 right-10 w-24 h-24 bg-gradient-to-br from-teal-200/30 to-emerald-200/30 rounded-full blur-2xl"></div>
      <div className="absolute bottom-10 left-10 w-32 h-32 bg-gradient-to-br from-emerald-200/30 to-teal-200/30 rounded-full blur-2xl"></div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold mb-4">
            ⭐ Customer Stories
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            What Our Users 
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent block">Are Saying</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Join thousands of professionals who have transformed their invoicing process with Invoicr.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonialsData.map((testimonial, index) => (
            <Card 
              key={index} 
              className="group p-8 bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 relative overflow-hidden"
            >
              {/* Background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="flex mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-emerald-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic leading-relaxed group-hover:text-gray-800 transition-colors">"{testimonial.content}"</p>
                <div className="flex items-center">
                  {/* <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  /> */}
                  <div>
                    <p className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
              
              {/* Subtle border animation */}
              <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-emerald-200 transition-colors duration-300"></div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
