'use client'

import { motion } from 'framer-motion'
import { Award, Users, Target, Sparkles, LucideIcon } from 'lucide-react'
import { useState, useEffect } from 'react'
import type { AboutSection } from '@/lib/supabase/about'

// Icon mapping function
const getIcon = (iconName: string): LucideIcon => {
  const iconMap: Record<string, LucideIcon> = {
    Award,
    Users,
    Target,
    Sparkles
  }
  return iconMap[iconName] || Award // Default to Award if icon not found
}

export function About() {
  const [aboutData, setAboutData] = useState<AboutSection | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await fetch('/api/about')
        const result = await response.json()
        if (result.success && result.data) {
          setAboutData(result.data)
        } else {
          console.warn('About data not available:', result.error || 'Unknown error')
        }
      } catch (error) {
        console.error('Error fetching about data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchAboutData()
  }, [])

  if (isLoading) {
    return (
      <section id="about" className="pt-20 pb-0 md:pt-32 md:pb-0 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-32 mb-4" />
              <div className="h-12 bg-gray-200 rounded w-3/4 mb-6" />
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded w-5/6" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-2xl animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (!aboutData) {
    return null
  }

  return (
    <section id="about" className="pt-20 pb-0 md:pt-32 md:pb-0 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#E87842] tracking-wider uppercase mb-2 block">
              {aboutData.badge_text || 'About Ardaa'}
            </span>
            <h2 className="text-4xl md:text-6xl text-[#1d2856] mb-6">
              {aboutData.main_heading}
            </h2>
            <div className="space-y-4 text-lg text-gray-600 leading-relaxed">
              {aboutData.description_paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4">
              {aboutData.stats.map((stat, index) => (
                <motion.div
                  key={`${stat.label}-${index}`}
                  className="group relative bg-gradient-to-br from-[#1d2856]/5 to-[#1d2856]/10 rounded-xl p-4 border border-[#1d2856]/10 hover:border-[#E87842]/30 transition-all duration-300 hover:shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{stat.icon}</span>
                    <motion.div
                      className="text-3xl font-bold bg-gradient-to-r from-[#E87842] to-[#d66a35] bg-clip-text text-transparent"
                      whileHover={{ scale: 1.1 }}
                    >
                      {stat.number}
                    </motion.div>
                  </div>
                  <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E87842] to-transparent rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Values Grid */}
          <motion.div
            className="grid grid-cols-2 gap-6"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {aboutData.values.map((value, index) => {
              const IconComponent = getIcon(value.icon)
              return (
                <motion.div
                  key={`${value.title}-${index}`}
                  className="bg-gradient-to-br from-[#1d2856] to-[#1d2856] p-8 rounded-2xl text-white hover:scale-105 transition-transform duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <div className="w-12 h-12 bg-[#E87842] rounded-xl flex items-center justify-center mb-4">
                    <IconComponent size={24} />
                  </div>
                  <h3 className="text-xl mb-2">{value.title}</h3>
                  <p className="text-white/80 text-sm leading-relaxed">{value.description}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
