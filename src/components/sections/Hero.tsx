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
    <div className="relative h-screen bg-white overflow-hidden">
      {/* Header */}
      <Header />

      {/* Hero Content - Two Column Layout */}
      <div className="grid lg:grid-cols-2 h-screen">
        {/* Left Column - Content */}
        <div className="relative bg-gradient-to-br from-[#1F3A5F] via-[#2A4A6F] to-[#1F3A5F] flex items-center">
          {/* Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute top-20 right-0 w-64 h-64 bg-[#E87842] rounded-full mix-blend-multiply filter blur-3xl opacity-20"
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
              className="absolute bottom-20 left-0 w-80 h-80 bg-[#E87842] rounded-full mix-blend-multiply filter blur-3xl opacity-20"
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

          <div className="relative z-10 container mx-auto px-6 py-24 md:py-32 lg:pl-12 xl:pl-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.span 
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white mb-6"
                whileHover={{ scale: 1.05 }}
              >
                <Award size={16} className="text-[#E87842]" />
                Award-Winning Design Studio
              </motion.span>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-6xl xl:text-7xl text-white mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Transform Your
              <span className="block text-[#E87842] mt-2">Vision Into Reality</span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-white/80 mb-8 max-w-xl leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              From residential homes to mosques, government buildings to corporate offices — we craft exceptional interior spaces that inspire and endure.
            </motion.p>

            {/* Features List */}
            <motion.div
              className="space-y-3 mb-10"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              {['15+ Years of Excellence', 'Custom Design Solutions', '200+ Completed Projects'].map((item, idx) => (
                <motion.div
                  key={item}
                  className="flex items-center gap-3 text-white/90"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + idx * 0.1 }}
                >
                  <CheckCircle2 size={20} className="text-[#E87842] flex-shrink-0" />
                  <span>{item}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <button 
                onClick={() => scrollToSection('portfolio')}
                className="group px-8 py-4 bg-[#E87842] text-white rounded-full hover:bg-[#d66a35] transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                View Our Work
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </button>
              <button 
                className="group px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white text-white rounded-full hover:bg-white hover:text-[#1F3A5F] transition-all flex items-center justify-center gap-2"
              >
                <Play size={20} className="group-hover:scale-110 transition-transform" />
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
            <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
              <span className="text-[#E87842] text-sm mb-1 block">Featured Project</span>
              <h3 className="text-2xl text-[#1F3A5F]">Modern Masjid Design</h3>
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
        <div className="lg:hidden relative h-80 sm:h-96">
          <div className="relative w-full h-full">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1581784878214-8d5596b98a01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBpbnRlcmlvciUyMGRlc2lnbnxlbnwxfHx8fDE3NjcwMTU3NTd8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Luxury Interior Design"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#1F3A5F] to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <span className="text-[#E87842] text-sm mb-1 block">Featured Project</span>
            <h3 className="text-2xl">Modern Residential Design</h3>
          </div>
        </div>
      </div>

    </div>
  )
}
