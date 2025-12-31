import { Hero } from '@/components/sections/Hero'
import { Services } from '@/components/sections/Services'
import { Portfolio } from '@/components/sections/Portfolio'
import { About } from '@/components/sections/About'
import { DesignProcess } from '@/components/sections/DesignProcess'
import { Team } from '@/components/sections/Team'
import { Contact } from '@/components/sections/Contact'
import { Footer } from '@/components/layout/Footer'

export default function Home() {
  return (
    <main>
      <Hero />
      <Services />
      <Portfolio />
      <About />
      <section className="pt-0 pb-0 bg-white">
        <div className="container mx-auto px-6">
          <DesignProcess />
        </div>
      </section>
      <Team />
      <Contact />
      <Footer />
    </main>
  )
}

