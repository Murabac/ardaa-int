'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { ImageWithFallback } from '../figma/ImageWithFallback'

const projects = [
  {
    category: 'Residential',
    title: 'Modern Living Room',
    image: 'https://images.unsplash.com/photo-1705321963943-de94bb3f0dd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBpbnRlcmlvciUyMGRlc2lnbiUyMGxpdmluZyUyMHJvb218ZW58MXx8fHwxNzY2OTkwOTU1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Contemporary design with warm aesthetics'
  },
  {
    category: 'Office',
    title: 'Executive Office Suite',
    image: 'https://images.unsplash.com/photo-1641998148499-cb6b55a3c0d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBvZmZpY2UlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjcwMDk4ODN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Luxury workspace for productivity'
  },
  {
    category: 'Mosque',
    title: 'Prayer Hall Interior',
    image: 'https://images.unsplash.com/photo-1696332598213-a1f16c5e54e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3NxdWUlMjBpbnRlcmlvciUyMGRlc2lnbnxlbnwxfHx8fDE3NjcwODE3Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Sacred space with elegant details'
  },
  {
    category: 'Residential',
    title: 'Elegant Home Interior',
    image: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob21lJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzY2OTc1OTMzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Minimalist sophistication'
  },
  {
    category: 'Government',
    title: 'Government Hall',
    image: 'https://images.unsplash.com/photo-1764136105889-c900461a874c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3Zlcm5tZW50JTIwYnVpbGRpbmclMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjcwODE3Nzh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Professional and dignified spaces'
  },
  {
    category: 'Residential',
    title: 'Contemporary Bedroom',
    image: 'https://images.unsplash.com/photo-1704428382583-c9c7c1e55d94?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBiZWRyb29tJTIwZGVzaWdufGVufDF8fHx8MTc2NzAzMTkzNXww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Serene and stylish retreat'
  }
]

const categories = ['All', 'Residential', 'Office', 'Government', 'Mosque']

export function Portfolio() {
  const [activeCategory, setActiveCategory] = useState('All')

  // Listen for filter events from Services component
  useEffect(() => {
    const handleFilterChange = (event: CustomEvent) => {
      const category = event.detail.category
      if (categories.includes(category)) {
        setActiveCategory(category)
      }
    }

    // Check URL params on mount
    const urlParams = new URLSearchParams(window.location.search)
    const categoryParam = urlParams.get('category')
    if (categoryParam && categories.includes(categoryParam)) {
      setActiveCategory(categoryParam)
    }

    window.addEventListener('portfolioFilter', handleFilterChange as EventListener)
    
    return () => {
      window.removeEventListener('portfolioFilter', handleFilterChange as EventListener)
    }
  }, [])

  const filteredProjects = activeCategory === 'All' 
    ? projects 
    : projects.filter(project => project.category === activeCategory)

  return (
    <section id="portfolio" className="pt-12 pb-0 md:pt-16 md:pb-0 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-[#E87842] tracking-wider uppercase mb-2 block">Our Work</span>
          <h2 className="text-4xl md:text-6xl text-[#1d2856] mb-4">
            Featured Projects
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our portfolio of stunning transformations across various sectors
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 rounded-full transition-all ${
                activeCategory === category
                  ? 'bg-[#E87842] text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={`${project.title}-${index}`}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <ImageWithFallback
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1d2856] via-[#1d2856]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <span className="inline-block px-3 py-1 bg-[#E87842] rounded-full text-sm mb-3">
                    {project.category}
                  </span>
                  <h3 className="text-2xl mb-2">{project.title}</h3>
                  <p className="text-white/80">{project.description}</p>
                </div>
              </div>

              {/* Category Badge (visible when not hovering) */}
              <div className="absolute top-4 left-4 opacity-100 group-hover:opacity-0 transition-opacity duration-300">
                <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[#1d2856] rounded-full text-sm">
                  {project.category}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <button className="px-8 py-4 bg-[#1d2856] text-white rounded-full hover:bg-[#1d2856]/90 transition-all shadow-lg hover:shadow-xl">
            View All Projects
          </button>
        </motion.div>
      </div>
    </section>
  )
}
