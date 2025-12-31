'use client'

import { motion } from 'framer-motion'
import { Home, Building2, Landmark, Heart } from 'lucide-react'
import { CoreValues } from './CoreValues'

const services = [
  {
    icon: Home,
    title: 'Residential Homes',
    description: 'Create your dream home with custom interior designs that reflect your personality and lifestyle.',
    color: 'from-orange-500 to-red-500',
    category: 'Residential'
  },
  {
    icon: Building2,
    title: 'Business Offices',
    description: 'Boost productivity with modern, functional office spaces designed for success and collaboration.',
    color: 'from-blue-500 to-indigo-500',
    category: 'Office'
  },
  {
    icon: Landmark,
    title: 'Government Buildings',
    description: 'Professional and dignified interiors that serve the public with style and functionality.',
    color: 'from-purple-500 to-pink-500',
    category: 'Government'
  },
  {
    icon: Heart,
    title: 'Mosques',
    description: 'Sacred spaces designed with reverence, combining traditional aesthetics with modern comfort.',
    color: 'from-emerald-500 to-teal-500',
    category: 'Mosque'
  }
]

export function Services() {
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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
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
                  <service.icon className="text-white" size={32} />
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
          ))}
        </div>

        <CoreValues />
      </div>
    </section>
  )
}
