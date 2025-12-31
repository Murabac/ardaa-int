'use client'

import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import { useState } from 'react'

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    alert('Thank you for your interest! We will contact you soon.')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <section id="contact" className="py-20 md:py-32 bg-gradient-to-br from-[#1d2856] via-[#1d2856] to-[#1d2856] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#E87842] rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#E87842] rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-[#E87842] tracking-wider uppercase mb-2 block">Get in Touch</span>
          <h2 className="text-4xl md:text-6xl text-white mb-4">
            Let&apos;s Create Something Amazing Together
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Ready to transform your space? Reach out to us and let&apos;s start your design journey
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 h-full">
              <h3 className="text-3xl text-white mb-8">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#E87842] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone size={20} className="text-white" />
                  </div>
                  <div>
                    <div className="text-white/60 mb-1">Phone</div>
                    <div className="text-white text-lg">+252 63 47492747</div>
                    <div className="text-white text-lg">+252 63 4289558</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#E87842] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail size={20} className="text-white" />
                  </div>
                  <div>
                    <div className="text-white/60 mb-1">Email</div>
                    <div className="text-white text-lg">info@ardaainterior.com</div>
                    <div className="text-white text-lg">contact@ardaainterior.com</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#E87842] rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin size={20} className="text-white" />
                  </div>
                  <div>
                    <div className="text-white/60 mb-1">Office</div>
                    <div className="text-white text-lg">Burj Omaar, 6th floor</div>
                    <div className="text-white text-lg">26 June District</div>
                    <div className="text-white text-lg">Hargeisa, Somalia</div>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="mt-10 pt-8 border-t border-white/20">
                <h4 className="text-xl text-white mb-4">Business Hours</h4>
                <div className="space-y-2 text-white/80">
                  <div className="flex justify-between">
                    <span>Saturday - Thursday</span>
                    <span>8:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Friday</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-2xl">
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-[#1d2856] mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E87842] focus:border-transparent"
                    placeholder="Magacaaga"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-[#1d2856] mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E87842] focus:border-transparent"
                    placeholder="emailkaaga@tusaale.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-[#1d2856] mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E87842] focus:border-transparent"
                    placeholder="+252 XX XXX XXXX"
                  />
                </div>

                <div>
                  <label htmlFor="service" className="block text-[#1d2856] mb-2">
                    Service Interested In *
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E87842] focus:border-transparent text-[#1d2856]"
                  >
                    <option value="">Select a service</option>
                    <option value="residential">Residential Homes</option>
                    <option value="office">Business Offices</option>
                    <option value="government">Government Buildings</option>
                    <option value="mosque">Mosques</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-[#1d2856] mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E87842] focus:border-transparent resize-none"
                    placeholder="Nagu sheeg barnaamijkaaga..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full px-8 py-4 bg-[#E87842] text-white rounded-lg hover:bg-[#d66a35] transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
                >
                  Send Message
                  <Send size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
