'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import type { TeamSection } from '@/lib/supabase/team'

export function Team() {
  const [teamData, setTeamData] = useState<TeamSection | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const response = await fetch('/api/team')
        const result = await response.json()
        if (result.success && result.data) {
          setTeamData(result.data)
        } else {
          console.warn('Team data not available:', result.error || 'Unknown error')
        }
      } catch (error) {
        console.error('Error fetching team data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchTeamData()
  }, [])

  if (isLoading) {
    return (
      <section id="team" className="pt-20 pb-0 md:pt-32 md:pb-0 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-32 mx-auto mb-4" />
            <div className="h-12 bg-gray-200 rounded w-64 mx-auto mb-4" />
            <div className="h-6 bg-gray-200 rounded w-96 mx-auto" />
          </div>
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-80 bg-gray-200" />
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
                  <div className="h-4 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (!teamData) {
    return null
  }

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
          <span className="text-[#E87842] tracking-wider uppercase mb-2 block">
            {teamData.badge_text || 'Our Team'}
          </span>
          <h2 className="text-4xl md:text-6xl text-[#1d2856] mb-4">
            {teamData.heading}
          </h2>
          {teamData.description && (
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {teamData.description}
            </p>
          )}
        </motion.div>

        {teamData.team_members.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No team members found.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {teamData.team_members.map((member, index) => (
              <motion.div
                key={`${member.name}-${index}`}
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
        )}
      </div>
    </section>
  )
}

