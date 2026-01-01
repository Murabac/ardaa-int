'use client'

import { motion } from 'framer-motion'
import { Award, CheckCircle2 } from 'lucide-react'
import { ImageWithFallback } from '../figma/ImageWithFallback'
import { Header } from '../layout/Header'
import { useState, useEffect } from 'react'
import type { HeroSection } from '@/lib/supabase/hero'
import { useLoading } from '@/contexts/LoadingContext'
import { ShowreelCarousel } from '../common/ShowreelCarousel'

export function Hero() {
  const [heroData, setHeroData] = useState<HeroSection | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showShowreel, setShowShowreel] = useState(false)
  const { registerLoader, unregisterLoader } = useLoading()

  useEffect(() => {
    // Register this component as a loader
    const loaderId = 'hero'
    registerLoader(loaderId)

    const fetchHeroData = async () => {
      try {
        const response = await fetch('/api/hero')
        const result = await response.json()
        if (result.success && result.data) {
          setHeroData(result.data)
        } else {
          // Even if there's no data, we should still unregister
          console.warn('Hero data not available:', result.error || 'Unknown error')
        }
      } catch (error) {
        console.error('Error fetching hero data:', error)
      } finally {
        setIsLoading(false)
        // Always unregister when fetch completes (success or error)
        unregisterLoader(loaderId)
      }
    }

    fetchHeroData()

    // Cleanup function to unregister if component unmounts
    return () => {
      unregisterLoader(loaderId)
    }
  }, [registerLoader, unregisterLoader]) // Include dependencies


  // Get featured projects from individual columns
  const featuredProject1 = (heroData?.featured_project_1_title || heroData?.featured_project_1_image_url) ? {
    title: heroData.featured_project_1_title || 'Featured Project',
    image_url: heroData.featured_project_1_image_url || heroData.featured_image_url || '/images/feature-1.jpg',
    category: heroData.featured_project_1_category || ''
  } : null

  const featuredProject2 = (heroData?.featured_project_2_title || heroData?.featured_project_2_image_url) ? {
    title: heroData.featured_project_2_title || 'Project 2',
    image_url: heroData.featured_project_2_image_url || '/images/feature-5.jpg',
    category: heroData.featured_project_2_category || ''
  } : null

  const featuredProject3 = (heroData?.featured_project_3_title || heroData?.featured_project_3_image_url) ? {
    title: heroData.featured_project_3_title || 'Project 3',
    image_url: heroData.featured_project_3_image_url || '/images/feature-2.jpg',
    category: heroData.featured_project_3_category || ''
  } : null

  // Show loading state or fallback if no data
  if (isLoading) {
    return (
      <div className="relative min-h-screen lg:h-screen bg-white overflow-hidden pb-0">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    )
  }

  if (!heroData) {
    return (
      <div className="relative min-h-screen lg:h-screen bg-white overflow-hidden pb-0">
        <Header />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-gray-500">No hero content available</div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen lg:h-screen bg-white overflow-hidden pb-0 overflow-x-hidden w-full max-w-full">
      {/* Header */}
      <Header />

      {/* Hero Content - Two Column Layout */}
      <div className="grid lg:grid-cols-2 min-h-[calc(100vh-4rem)] lg:min-h-screen overflow-x-hidden w-full max-w-full">
        {/* Left Column - Content */}
        <div className="relative bg-gradient-to-br from-[#1d2856] via-[#1d2856] to-[#1d2856] flex items-center min-h-[50vh] lg:min-h-screen w-full overflow-hidden max-w-full">
          {/* Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden max-w-full">
            <motion.div
              className="absolute top-10 sm:top-20 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-[#E87842] rounded-full mix-blend-multiply filter blur-3xl opacity-20"
              animate={{
                scale: [1, 1.2, 1],
                x: [0, 30, 0],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{ maxWidth: '100%' }}
            />
            <motion.div
              className="absolute bottom-10 sm:bottom-20 left-0 w-40 h-40 sm:w-80 sm:h-80 bg-[#E87842] rounded-full mix-blend-multiply filter blur-3xl opacity-20"
              animate={{
                scale: [1, 1.3, 1],
                x: [0, -30, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{ maxWidth: '100%' }}
            />
          </div>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-24 sm:pt-12 md:pt-16 lg:pt-24 xl:pt-32 pb-8 sm:pb-12 md:pb-16 lg:pb-24 xl:pb-32 lg:pl-6 xl:pl-12 overflow-x-hidden">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.span 
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white mb-4 sm:mb-6 text-xs sm:text-sm"
                whileHover={{ scale: 1.05 }}
              >
                <Award size={14} className="sm:w-4 sm:h-4 text-[#E87842] flex-shrink-0" />
                <span className="whitespace-nowrap text-[10px] sm:text-xs md:text-sm">{heroData.badge_text || 'Award-Winning Design Studio'}</span>
              </motion.span>
            </motion.div>

            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white mb-4 sm:mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {heroData.title_line1}
            </motion.h1>

            <motion.p
              className="text-sm sm:text-base md:text-lg lg:text-xl text-white/80 mb-6 sm:mb-8 max-w-xl leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {heroData.description}
            </motion.p>

            {/* Features List */}
            <motion.div
              className="space-y-2 sm:space-y-3 mb-6 sm:mb-10"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              {(heroData.features || []).map((item, idx) => (
                <motion.div
                  key={item}
                  className="flex items-center gap-2 sm:gap-3 text-white/90 text-sm sm:text-base"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + idx * 0.1 }}
                >
                  <CheckCircle2 size={18} className="sm:w-5 sm:h-5 text-[#E87842] flex-shrink-0" />
                  <span>{item}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Buttons - Static Content */}
            <motion.div
              className="flex flex-col sm:flex-row gap-3 sm:gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <button 
                onClick={() => {
                  const element = document.getElementById('portfolio')
                  element?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="group px-6 sm:px-8 py-3 sm:py-4 bg-[#E87842] text-white rounded-full hover:bg-[#d66a35] transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                View Our Work
                <motion.span
                  className="inline-block"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  →
                </motion.span>
              </button>
              <button 
                onClick={() => setShowShowreel(true)}
                className="group px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-sm border-2 border-white text-white rounded-full hover:bg-white hover:text-[#1d2856] transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <span className="text-lg">▶</span>
                Watch Showreel
              </button>
            </motion.div>

          </div>
        </div>

        {/* Right Column - Image Gallery */}
        <div className="relative hidden lg:grid grid-cols-2 gap-4 p-4 bg-gray-100 overflow-x-hidden" style={{ height: '100vh', maxWidth: '100%' }}>
          {/* Large Featured Image */}
          <motion.div
            className="col-span-2 row-span-1 relative overflow-hidden rounded-3xl shadow-2xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative w-full overflow-hidden" style={{ height: 'calc((100vh - 2rem - 1rem - 60px - 1rem) / 3 * 2)' }}>
              <div className="absolute top-0 left-0 w-full" style={{ height: 'calc(((100vh - 2rem - 1rem - 60px - 1rem) / 3 * 2) * 2)' }}>
                <ImageWithFallback
                  src={featuredProject1?.image_url || heroData.featured_image_url || '/images/feature-1.jpg'}
                  alt={featuredProject1?.title || heroData.featured_project_title || 'Featured Project'}
                  className="w-full h-full object-cover"
                  style={{ objectPosition: 'center top' }}
                />
              </div>
            </div>
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl">
              <span className="text-[#E87842] text-xs sm:text-sm mb-1 block">Featured Project</span>
              <h3 className="text-lg sm:text-xl md:text-2xl text-[#1d2856]">{featuredProject1?.title || heroData.featured_project_title || 'Featured Project'}</h3>
            </div>
          </motion.div>

          {/* Smaller Image 1 - Featured Project 2 */}
          <motion.div
            className="relative overflow-hidden rounded-2xl shadow-lg"
            style={{ height: 'calc((100vh - 2rem - 1rem - 60px - 1rem) / 3)' }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="relative w-full h-full">
              <ImageWithFallback
                src={featuredProject2?.image_url || '/images/feature-5.jpg'}
                alt={featuredProject2?.title || 'Interior Design Showcase'}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#1d2856]/80 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <span className="text-white">{featuredProject2?.title || 'Government Office Design'}</span>
            </div>
          </motion.div>

          {/* Smaller Image 2 - Featured Project 3 */}
          <motion.div
            className="relative overflow-hidden rounded-2xl shadow-lg"
            style={{ height: 'calc((100vh - 2rem - 1rem - 60px - 1rem) / 3)' }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="relative w-full h-full">
              <ImageWithFallback
                src={featuredProject3?.image_url || '/images/feature-2.jpg'}
                alt={featuredProject3?.title || 'Modern Architecture Interior'}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#1d2856]/80 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <span className="text-white">{featuredProject3?.title || 'Commercial Space'}</span>
            </div>
          </motion.div>

          {/* Ready to Start Section - Static Content */}
          <motion.div
            className="col-span-2 bg-gradient-to-r from-[#E87842] to-[#d66a35] rounded-2xl shadow-lg flex items-center justify-between"
            style={{ height: '60px', padding: '0 1.5rem' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <div className="text-white">
              <div className="text-lg font-semibold">Ready to Start?</div>
            </div>
            <button 
              onClick={() => {
                const element = document.getElementById('contact')
                element?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="px-4 py-1.5 bg-white text-[#E87842] rounded-full hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl flex-shrink-0 text-sm font-medium"
            >
              Contact Us
            </button>
          </motion.div>

        </div>

        {/* Mobile Image Section */}
        <div className="lg:hidden space-y-4 px-4 py-6 bg-gray-100 overflow-x-hidden max-w-full">
          {/* Featured Project Image */}
          <div className="relative h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden shadow-lg">
            <div className="relative w-full h-full">
              <ImageWithFallback
                src={featuredProject1?.image_url || heroData.featured_image_url || '/images/feature-1.jpg'}
                alt={featuredProject1?.title || heroData.featured_project_title || 'Featured Project'}
                className="w-full h-full object-cover"
                style={{ objectPosition: 'center top' }}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#1d2856] to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl">
              <span className="text-[#E87842] text-xs sm:text-sm mb-1 block">Featured Project</span>
              <h3 className="text-lg sm:text-xl md:text-2xl text-[#1d2856]">{featuredProject1?.title || heroData.featured_project_title || 'Featured Project'}</h3>
            </div>
          </div>

          {/* Smaller Images Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Featured Project 2 */}
            <div className="relative h-40 sm:h-48 md:h-56 rounded-xl overflow-hidden shadow-lg">
              <div className="relative w-full h-full">
                <ImageWithFallback
                  src={featuredProject2?.image_url || '/images/feature-5.jpg'}
                  alt={featuredProject2?.title || 'Interior Design Showcase'}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#1d2856]/80 to-transparent flex items-end p-3">
                <span className="text-white text-xs sm:text-sm">{featuredProject2?.title || 'Government Office Design'}</span>
              </div>
            </div>

            {/* Featured Project 3 */}
            <div className="relative h-40 sm:h-48 md:h-56 rounded-xl overflow-hidden shadow-lg">
              <div className="relative w-full h-full">
                <ImageWithFallback
                  src={featuredProject3?.image_url || '/images/feature-2.jpg'}
                  alt={featuredProject3?.title || 'Modern Architecture Interior'}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#1d2856]/80 to-transparent flex items-end p-3">
                <span className="text-white text-xs sm:text-sm">{featuredProject3?.title || 'Commercial Space'}</span>
              </div>
            </div>
          </div>

          {/* Ready to Start Card - Mobile - Static Content */}
          <motion.div
            className="bg-gradient-to-r from-[#E87842] to-[#d66a35] rounded-xl shadow-lg flex items-center justify-between p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <div className="text-white">
              <div className="text-base sm:text-lg font-semibold">Ready to Start?</div>
            </div>
            <button 
              onClick={() => {
                const element = document.getElementById('contact')
                element?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="px-4 py-2 bg-white text-[#E87842] rounded-full hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl flex-shrink-0 text-sm font-medium"
            >
              Contact Us
            </button>
          </motion.div>

        </div>
      </div>

      {/* Showreel Carousel Modal */}
      <ShowreelCarousel isOpen={showShowreel} onClose={() => setShowShowreel(false)} />

    </div>
  )
}
