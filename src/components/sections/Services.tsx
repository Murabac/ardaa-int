'use client'

import { motion } from 'framer-motion'
import { Home, Building2, Landmark, Heart, LucideIcon } from 'lucide-react'
import { CoreValues } from './CoreValues'
import { useState, useEffect } from 'react'
import type { Service } from '@/lib/supabase/services'

// Icon mapping function
const getIcon = (iconName: string): LucideIcon => {
  const iconMap: Record<string, LucideIcon> = {
    Home,
    Building2,
    Landmark,
    Heart
  }
  return iconMap[iconName] || Home // Default to Home if icon not found
}

export function Services() {
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services')
        const result = await response.json()
        if (result.success && result.data) {
          setServices(result.data)
        } else {
          console.warn('Services data not available:', result.error || 'Unknown error')
        }
      } catch (error) {
        console.error('Error fetching services:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchServices()
  }, [])

  const handleServiceClick = (category: string) => {
    // Scroll to portfolio section
    const portfolioSection = document.getElementById('portfolio')
    if (portfolioSection) {
      portfolioSection.scrollIntoView({ behavior: 'smooth' })
      
      // Set the category in URL params
      const url = new URL(window.location.href)
      url.searchParams.set('category', category)
      window.history.pushState({}, '', url)
      
      // Dispatch custom event to update portfolio filter
      window.dispatchEvent(new CustomEvent('portfolioFilter', { detail: { category } }))
    }
  }
  return (
    <section id="services" className="pt-20 pb-0 md:pt-32 md:pb-0 bg-white">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-[#E87842] tracking-wider uppercase mb-2 block">Our Expertise</span>
          <h2 className="text-4xl md:text-6xl text-[#1d2856] mb-4">
            Comprehensive Interior Design Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We specialize in transforming diverse spaces, each with its unique requirements and character
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 animate-pulse"
              >
                <div className="w-16 h-16 bg-gray-200 rounded-2xl mb-6" />
                <div className="h-6 bg-gray-200 rounded mb-3" />
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => {
              const IconComponent = getIcon(service.icon)
              return (
                <motion.div
                  key={service.id}
                  className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  onClick={() => handleServiceClick(service.category)}
                >
                  {/* Gradient background on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  
                  <div className="relative z-10">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="text-white" size={32} />
                    </div>
                    
                    <h3 className="text-2xl text-[#1d2856] mb-3">
                      {service.title}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed">
                      {service.description}
                    </p>

                    <div className={`mt-6 w-12 h-1 bg-gradient-to-r ${service.color} rounded-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300`} />
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        <CoreValues />
      </div>
    </section>
  )
}
