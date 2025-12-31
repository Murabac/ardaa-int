'use client'

import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'
import styles from './Header.module.css'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    element?.scrollIntoView({ behavior: 'smooth' })
    setMobileMenuOpen(false)
  }

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Logo */}
          <motion.div
            className={styles.logoContainer}
            style={{ height: '4rem' }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Logo Background */}
            <div className={styles.logoBackground}>
              <div className={styles.logoBgMain} />
              <div className={styles.logoCornerAccent} />
              <div className={styles.logoBottomAccent} />
              <div className={styles.logoPattern} />
            </div>
            
            <div className={styles.logoImageWrapper}>
              <Image
                src="/images/logo.png"
                alt="Ardaa Interior Firm"
                width={160}
                height={96}
                className={styles.logoImage}
                priority
              />
            </div>
          </motion.div>
          
          {/* Desktop Menu */}
          <motion.div
            className={styles.desktopMenu}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Menu Background */}
            <div className={styles.menuBackground}>
              <div className={styles.menuBgMain} />
              <div className={styles.menuAccent} />
              <div className={styles.menuShine} />
            </div>
            
            <button onClick={() => scrollToSection('services')} className={styles.menuLink}>Services</button>
            <button onClick={() => scrollToSection('portfolio')} className={styles.menuLink}>Portfolio</button>
            <button onClick={() => scrollToSection('about')} className={styles.menuLink}>About</button>
            <button onClick={() => scrollToSection('contact')} className={styles.menuButton}>
              Get in Touch
            </button>
          </motion.div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={styles.mobileMenuButton}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            className={styles.mobileMenu}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className={styles.mobileMenuContent}>
              <button onClick={() => scrollToSection('services')} className={styles.mobileMenuLink}>Services</button>
              <button onClick={() => scrollToSection('portfolio')} className={styles.mobileMenuLink}>Portfolio</button>
              <button onClick={() => scrollToSection('about')} className={styles.mobileMenuLink}>About</button>
              <button onClick={() => scrollToSection('contact')} className={styles.mobileMenuButton}>
                Get in Touch
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  )
}
