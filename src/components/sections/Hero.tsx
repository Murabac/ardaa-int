'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Play, Award, CheckCircle2 } from 'lucide-react'
import { ImageWithFallback } from '../figma/ImageWithFallback'
import { Header } from '../layout/Header'

export function Hero() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="relative min-h-screen lg:h-screen bg-white overflow-hidden">
      {/* Header */}
      <Header />

      {/* Hero Content - Two Column Layout */}
      <div className="grid lg:grid-cols-2 min-h-[calc(100vh-4rem)] lg:min-h-screen">
        {/* Left Column - Content */}
        <div className="relative bg-gradient-to-br from-[#1F3A5F] via-[#2A4A6F] to-[#1F3A5F] flex items-center min-h-[50vh] lg:min-h-screen w-full overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute top-10 sm:top-20 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-[#E87842] rounded-full mix-blend-multiply filter blur-3xl opacity-20"
              animate={{
                scale: [1, 1.2, 1],
                x: [0, 50, 0],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <motion.div
              className="absolute bottom-10 sm:bottom-20 left-0 w-40 h-40 sm:w-80 sm:h-80 bg-[#E87842] rounded-full mix-blend-multiply filter blur-3xl opacity-20"
              animate={{
                scale: [1, 1.3, 1],
                x: [0, -50, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </div>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-24 sm:pt-12 md:pt-16 lg:pt-24 xl:pt-32 pb-8 sm:pb-12 md:pb-16 lg:pb-24 xl:pb-32 lg:pl-12 xl:pl-20">
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
                <span className="whitespace-nowrap text-[10px] sm:text-xs md:text-sm">Award-Winning Design Studio</span>
              </motion.span>
            </motion.div>

            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white mb-4 sm:mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Transform Your
              <span className="block text-[#E87842] mt-1 sm:mt-2">Vision Into Reality</span>
            </motion.h1>

            <motion.p
              className="text-sm sm:text-base md:text-lg lg:text-xl text-white/80 mb-6 sm:mb-8 max-w-xl leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              From residential homes to mosques, government buildings to corporate offices — we craft exceptional interior spaces that inspire and endure.
            </motion.p>

            {/* Features List */}
            <motion.div
              className="space-y-2 sm:space-y-3 mb-6 sm:mb-10"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              {['15+ Years of Excellence', 'Custom Design Solutions', '200+ Completed Projects'].map((item, idx) => (
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

            <motion.div
              className="flex flex-col sm:flex-row gap-3 sm:gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <button 
                onClick={() => scrollToSection('portfolio')}
                className="group px-6 sm:px-8 py-3 sm:py-4 bg-[#E87842] text-white rounded-full hover:bg-[#d66a35] transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                View Our Work
                <ArrowRight className="group-hover:translate-x-1 transition-transform w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button 
                className="group px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-sm border-2 border-white text-white rounded-full hover:bg-white hover:text-[#1F3A5F] transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <Play className="group-hover:scale-110 transition-transform w-4 h-4 sm:w-5 sm:h-5" />
                Watch Showreel
              </button>
            </motion.div>
          </div>
        </div>

        {/* Right Column - Image Gallery */}
        <div className="relative hidden lg:grid grid-cols-2 gap-4 p-4 bg-gray-100" style={{ height: '100vh' }}>
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
                  src="https://images.unsplash.com/photo-1581784878214-8d5596b98a01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBpbnRlcmlvciUyMGRlc2lnbnxlbnwxfHx8fDE3NjcwMTU3NTd8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Luxury Interior Design"
                  className="w-full h-full object-cover"
                  style={{ objectPosition: 'center top' }}
                />
              </div>
            </div>
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl">
              <span className="text-[#E87842] text-xs sm:text-sm mb-1 block">Featured Project</span>
              <h3 className="text-lg sm:text-xl md:text-2xl text-[#1F3A5F]">Modern Masjid Design</h3>
            </div>
          </motion.div>

          {/* Smaller Image 1 */}
          <motion.div
            className="relative overflow-hidden rounded-2xl shadow-lg"
            style={{ height: 'calc((100vh - 2rem - 1rem - 60px - 1rem) / 3)' }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="relative w-full h-full">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1671508191629-33e2e5a4732f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbnRlcmlvciUyMGRlc2lnbiUyMHNob3djYXNlfGVufDF8fHx8MTc2NzA4MjQyMHww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Interior Design Showcase"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#1F3A5F]/80 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <span className="text-white">Goverment Office Design</span>
            </div>
          </motion.div>

          {/* Smaller Image 2 */}
          <motion.div
            className="relative overflow-hidden rounded-2xl shadow-lg"
            style={{ height: 'calc((100vh - 2rem - 1rem - 60px - 1rem) / 3)' }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="relative w-full h-full">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1572457598110-2e060c4588ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcmNoaXRlY3R1cmUlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjcwMDgxNzh8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Modern Architecture Interior"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#1F3A5F]/80 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <span className="text-white">Commercial Space</span>
            </div>
          </motion.div>

          {/* Bottom Text Card */}
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
              onClick={() => scrollToSection('contact')}
              className="px-4 py-1.5 bg-white text-[#E87842] rounded-full hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl flex-shrink-0 text-sm font-medium"
            >
              Contact Us
            </button>
          </motion.div>
        </div>

        {/* Mobile Image Section */}
        <div className="lg:hidden space-y-4 px-4 py-6 bg-gray-100">
          {/* Featured Project Image */}
          <div className="relative h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden shadow-lg">
            <div className="relative w-full h-full">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1581784878214-8d5596b98a01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBpbnRlcmlvciUyMGRlc2lnbnxlbnwxfHx8fDE3NjcwMTU3NTd8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Luxury Interior Design"
                className="w-full h-full object-cover"
                style={{ objectPosition: 'center top' }}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#1F3A5F] to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl">
              <span className="text-[#E87842] text-xs sm:text-sm mb-1 block">Featured Project</span>
              <h3 className="text-lg sm:text-xl md:text-2xl text-[#1F3A5F]">Modern Masjid Design</h3>
            </div>
          </div>

          {/* Smaller Images Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Smaller Image 1 */}
            <div className="relative h-40 sm:h-48 md:h-56 rounded-xl overflow-hidden shadow-lg">
              <div className="relative w-full h-full">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1671508191629-33e2e5a4732f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbnRlcmlvciUyMGRlc2lnbiUyMHNob3djYXNlfGVufDF8fHx8MTc2NzA4MjQyMHww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Interior Design Showcase"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#1F3A5F]/80 to-transparent flex items-end p-3">
                <span className="text-white text-xs sm:text-sm">Government Office Design</span>
              </div>
            </div>

            {/* Smaller Image 2 */}
            <div className="relative h-40 sm:h-48 md:h-56 rounded-xl overflow-hidden shadow-lg">
              <div className="relative w-full h-full">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1572457598110-2e060c4588ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcmNoaXRlY3R1cmUlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjcwMDgxNzh8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Modern Architecture Interior"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#1F3A5F]/80 to-transparent flex items-end p-3">
                <span className="text-white text-xs sm:text-sm">Commercial Space</span>
              </div>
            </div>
          </div>

          {/* Ready to Start Card - Mobile */}
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
              onClick={() => scrollToSection('contact')}
              className="px-4 py-2 bg-white text-[#E87842] rounded-full hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl flex-shrink-0 text-sm font-medium"
            >
              Contact Us
            </button>
          </motion.div>
        </div>
      </div>

    </div>
  )
}
