'use client'

import { motion } from 'framer-motion'

const processSteps = [
  { step: '01', title: 'Consultation', desc: 'Understanding your vision and requirements' },
  { step: '02', title: 'Design', desc: 'Creating detailed plans and 3D visualizations' },
  { step: '03', title: 'Execution', desc: 'Bringing the design to life with precision' },
  { step: '04', title: 'Delivery', desc: 'Final touches and handover of your dream space' }
]

export function DesignProcess() {
  return (
    <motion.div
      className="pt-24 pb-0"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center mb-12">
        <h3 className="text-3xl md:text-5xl text-[#1d2856] mb-4">Our Design Process</h3>
        <p className="text-xl text-gray-600">A streamlined approach from concept to completion</p>
      </div>

      <div className="grid md:grid-cols-4 gap-8">
        {processSteps.map((item, index) => (
          <motion.div
            key={item.step}
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <div className="text-7xl text-[#E87842]/20 mb-4">{item.step}</div>
            <h4 className="text-2xl text-[#1d2856] mb-2">{item.title}</h4>
            <p className="text-gray-600">{item.desc}</p>
            {index < 3 && (
              <div className="hidden md:block absolute top-12 -right-4 w-8 h-0.5 bg-[#E87842]/30" />
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

