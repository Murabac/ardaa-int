'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useLoading } from '@/contexts/LoadingContext'

export function LoadingScreen() {
  const { isLoading: contextLoading } = useLoading()
  const [isLoading, setIsLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Wait for context to indicate all data is loaded
    if (!contextLoading) {
      // Add a minimum display time and smooth fade out
      setTimeout(() => {
        setIsLoading(false)
        // Wait for fade out animation before removing from DOM
        setTimeout(() => {
          setIsVisible(false)
        }, 500)
      }, 800) // Minimum 800ms display time for smooth UX
    }
  }, [contextLoading])

  if (!isVisible) return null

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-white flex items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Animated Logo */}
          <motion.div
            className="relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: [0.8, 1, 0.95, 1],
              opacity: 1,
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              scale: {
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              },
              rotate: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              },
              opacity: {
                duration: 0.5
              }
            }}
          >
            <Image
              src="/images/logo.png"
              alt="Ardaa Interior Firm"
              width={200}
              height={120}
              className="object-contain"
              priority
            />
          </motion.div>

          {/* Loading Spinner Ring */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              className="w-[200px] h-[200px] border-4 border-[#1d2856]/20 border-t-[#E87842] rounded-full"
              animate={{ rotate: 360 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </motion.div>

          {/* Pulsing Background Circles */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="w-96 h-96 bg-[#E87842] rounded-full opacity-10 blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.15, 0.1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

