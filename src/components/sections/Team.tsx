'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const teamMembers = [
  {
    name: 'Ahmed Al-Mansoori',
    role: 'Lead Interior Designer',
    image: '/images/Person 1.jpg',
    bio: '15+ years of experience in luxury residential and commercial design'
  },
  {
    name: 'Fatima Al-Zahra',
    role: 'Senior Architect',
    image: '/images/Person 2.jpg',
    bio: 'Specialist in modern Islamic architecture and mosque design'
  },
  {
    name: 'Omar Hassan',
    role: 'Project Director',
    image: '/images/Person 3.jpg',
    bio: 'Expert in large-scale government and institutional projects'
  }
]

export function Team() {
  return (
    <section id="team" className="pt-20 pb-0 md:pt-32 md:pb-0 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-[#E87842] tracking-wider uppercase mb-2 block">Our Team</span>
          <h2 className="text-4xl md:text-6xl text-[#1d2856] mb-4">
            Meet the Experts
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Talented professionals dedicated to bringing your vision to life
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              className="group relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                {/* Image Container */}
                <div className="relative h-80 overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* Gradient Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1d2856] via-transparent to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl text-[#1d2856] mb-2 font-semibold">
                    {member.name}
                  </h3>
                  <p className="text-[#E87842] mb-3 font-medium">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {member.bio}
                  </p>
                  
                  {/* Decorative Line */}
                  <div className="mt-4 w-12 h-1 bg-gradient-to-r from-[#E87842] to-transparent rounded-full transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

