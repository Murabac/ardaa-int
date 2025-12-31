'use client'

import { motion } from 'framer-motion'
import { Award, Users, Target, Sparkles } from 'lucide-react'

const values = [
  {
    icon: Award,
    title: 'Excellence',
    description: 'Committed to delivering the highest quality in every project'
  },
  {
    icon: Users,
    title: 'Collaboration',
    description: 'Working closely with clients to bring their vision to life'
  },
  {
    icon: Target,
    title: 'Innovation',
    description: 'Pushing boundaries with creative and modern design solutions'
  },
  {
    icon: Sparkles,
    title: 'Attention to Detail',
    description: 'Every element carefully crafted for perfection'
  }
]

export function About() {
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
            <span className="text-[#E87842] tracking-wider uppercase mb-2 block">About Ardaa</span>
            <h2 className="text-4xl md:text-6xl text-[#1d2856] mb-6">
              Designing Dreams Since 2010
            </h2>
            <div className="space-y-4 text-lg text-gray-600 leading-relaxed">
              <p>
                Ardaa Interior Firm is a leading design studio specializing in creating exceptional interior spaces that inspire and delight. With over 15 years of experience, we've transformed hundreds of spaces across residential, commercial, government, and religious sectors.
              </p>
              <p>
                Our team of talented designers and architects work tirelessly to understand your unique needs and deliver solutions that exceed expectations. We believe that great design is a perfect blend of aesthetics, functionality, and emotional connection.
              </p>
              <p>
                From intimate home makeovers to large-scale institutional projects, we approach each assignment with the same level of dedication and creativity. Our portfolio speaks to our versatility and commitment to excellence.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { number: '15+', label: 'Years of Excellence', icon: '📅' },
                { number: '30+', label: 'Expert Designers', icon: '👥' },
                { number: '98%', label: 'Client Satisfaction', icon: '⭐' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
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
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                className="bg-gradient-to-br from-[#1d2856] to-[#1d2856] p-8 rounded-2xl text-white hover:scale-105 transition-transform duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <div className="w-12 h-12 bg-[#E87842] rounded-xl flex items-center justify-center mb-4">
                  <value.icon size={24} />
                </div>
                <h3 className="text-xl mb-2">{value.title}</h3>
                <p className="text-white/80 text-sm leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
