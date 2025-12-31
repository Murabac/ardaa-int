'use client'

import { motion } from 'framer-motion'

const coreValues = [
  {
    emoji: '🎨',
    title: 'Custom Design',
    gradient: 'from-orange-500 to-red-500'
  },
  {
    emoji: '⚡',
    title: 'Fast Delivery',
    gradient: 'from-blue-500 to-indigo-500'
  },
  {
    emoji: '💎',
    title: 'Premium Quality',
    gradient: 'from-purple-500 to-pink-500'
  }
]

export function CoreValues() {
  return (
    <motion.div
      className="mt-8 mb-0 flex flex-wrap justify-center gap-4 md:gap-6"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {coreValues.map((value, index) => (
        <motion.div
          key={value.title}
          className="group relative"
          initial={{ 
            opacity: 0, 
            scale: 0,
            rotate: -180,
            y: 50
          }}
          whileInView={{ 
            opacity: 1, 
            scale: 1,
            rotate: 0,
            y: 0
          }}
          viewport={{ once: true }}
          whileHover={{ 
            scale: 1.1,
            rotate: [0, -5, 5, -5, 0],
            y: -8
          }}
          animate={{
            y: [0, -10, 0],
          }}
          transition={{ 
            type: "spring",
            stiffness: 200,
            damping: 20,
            delay: index * 0.15,
            y: {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.5
            }
          }}
        >
          <div className={`relative bg-gradient-to-br ${value.gradient} rounded-2xl px-6 py-4 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden`}>
            {/* Animated shine effect */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              initial={{ x: '-100%' }}
              whileHover={{ x: '200%' }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />
            
            {/* Pulsing glow effect */}
            <motion.div
              className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-0 rounded-2xl blur-xl`}
              animate={{
                opacity: [0, 0.5, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.3
              }}
            />
            
            <div className="relative flex items-center gap-3 z-10">
              <motion.div 
                className="text-3xl md:text-4xl"
                animate={{
                  rotate: [0, 10, -10, 10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.4
                }}
              >
                {value.emoji}
              </motion.div>
              <motion.h4 
                className="text-base md:text-lg font-semibold text-white whitespace-nowrap"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 + 0.3 }}
              >
                {value.title}
              </motion.h4>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}

