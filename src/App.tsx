import { useState, useEffect } from 'react'
import WhiteClawNavbar from './components/WhiteClawNavbar'
import WhiteClawHero from './components/WhiteClawHero'
import WhiteClawPricing from './components/WhiteClawPricing'
import WhiteClawComparison from './components/WhiteClawComparison'
import WhiteClawDeliverables from './components/WhiteClawDeliverables'
import WhiteClawBookingSection from './components/WhiteClawBookingSection'
import WhiteClawTimeline from './components/WhiteClawTimeline'

function App() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden">
      <WhiteClawNavbar scrolled={scrolled} />
      <main id="hero">
        <WhiteClawHero />
        <WhiteClawPricing />
        <WhiteClawComparison />
        <WhiteClawDeliverables />
        <WhiteClawTimeline />
        <WhiteClawBookingSection />
      </main>
      <footer className="bg-slate-950 border-t border-white/10 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-xl font-bold">
                <span className="text-slate-100">No Brainer </span>
                <span className="gradient-text">AI</span>
              </span>
            </div>
            <p className="text-slate-400 mb-4">Done-for-you AI automation. No code. No confusion. Just results.</p>
            <div className="flex justify-center space-x-6 text-sm">
              <a href="mailto:hello@nobrainerai.com" className="text-slate-400 hover:text-cyan-400 transition-colors">
                hello@nobrainerai.com
              </a>
            </div>
            <div className="mt-8 pt-8 border-t border-white/10">
              <p className="text-slate-500 text-sm">
                &copy; 2026 No Brainer Consulting. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App