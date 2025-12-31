'use client'

import { motion } from 'framer-motion'
import { Facebook, Instagram, Twitter } from 'lucide-react'
import Image from 'next/image'
import styles from './Header.module.css'

// TikTok Icon Component
const TikTokIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
)

export function Footer() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    element?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="bg-[#1d2856] text-white pt-16 pb-8 border-t border-white/20">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div style={{ position: 'relative', zIndex: 10 }}>
              <motion.div
                className={styles.logoContainer}
                style={{ height: 'clamp(3rem, 4rem, 6rem)', marginTop: 0, marginBottom: '1rem', position: 'relative' }}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                {/* Logo Background */}
                <div className={styles.logoBackground} style={{ zIndex: 1 }}>
                  <div className={styles.logoBgMain} />
                  <div className={styles.logoCornerAccent} />
                  <div className={styles.logoBottomAccent} />
                  <div className={styles.logoPattern} />
                </div>
                
                <div className={styles.logoImageWrapper} style={{ zIndex: 2, position: 'relative' }}>
                  <Image
                    src="/images/logo.png"
                    alt="Ardaa Interior Firm"
                    width={160}
                    height={96}
                    className={styles.logoImage}
                  />
                </div>
              </motion.div>
            </div>
            <p className="text-white/70 leading-relaxed mt-4">
              Transforming spaces into masterpieces since 2010. Excellence in every design, passion in every project.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl mb-4">Quick Links</h4>
            <div className="space-y-2">
              <button onClick={() => scrollToSection('services')} className="block text-white/70 hover:text-[#E87842] transition-colors">
                Our Services
              </button>
              <button onClick={() => scrollToSection('portfolio')} className="block text-white/70 hover:text-[#E87842] transition-colors">
                Portfolio
              </button>
              <button onClick={() => scrollToSection('about')} className="block text-white/70 hover:text-[#E87842] transition-colors">
                About Us
              </button>
              <button onClick={() => scrollToSection('contact')} className="block text-white/70 hover:text-[#E87842] transition-colors">
                Contact
              </button>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xl mb-4">Our Services</h4>
            <div className="space-y-2 text-white/70">
              <div>Residential Homes</div>
              <div>Business Offices</div>
              <div>Government Buildings</div>
              <div>Mosques</div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xl mb-4">Stay Updated</h4>
            <p className="text-white/70 mb-4">Subscribe to our newsletter for design tips and updates</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#E87842] text-white placeholder:text-white/50"
              />
              <button className="px-4 py-2 bg-[#E87842] rounded-lg hover:bg-[#d66a35] transition-colors">
                →
              </button>
            </div>
          </div>
        </div>

        {/* Social Links & Copyright */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-white/60">
              © 2024 Ardaa Interior Firm. All rights reserved.
            </div>
            <div className="flex gap-4">
              <motion.a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#E87842] transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Facebook size={20} />
              </motion.a>
              <motion.a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#E87842] transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Instagram size={20} />
              </motion.a>
              <motion.a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#E87842] transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Twitter size={20} />
              </motion.a>
              <motion.a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#E87842] transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <TikTokIcon size={20} />
              </motion.a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
