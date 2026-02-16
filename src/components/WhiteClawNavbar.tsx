import { motion } from 'framer-motion'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

interface NavbarProps {
  scrolled: boolean
}

export default function Navbar({ scrolled }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMenuOpen(false)
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-slate-950/95 backdrop-blur-lg border-b border-white/10 shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex-shrink-0 cursor-pointer"
            onClick={() => scrollToSection('#hero')}
          >
            <span className="text-xl lg:text-2xl font-bold">
              <span className="text-slate-100">No Brainer </span>
              <span className="gradient-text">AI</span>
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('#pricing')}
              className="text-slate-300 hover:text-cyan-400 transition-colors font-medium"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection('#whiteclaw')}
              className="text-slate-300 hover:text-cyan-400 transition-colors font-medium"
            >
              WhiteClaw
            </button>
            <button
              onClick={() => scrollToSection('#testimonials')}
              className="text-slate-300 hover:text-cyan-400 transition-colors font-medium"
            >
              Results
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection('#book')}
              className="px-6 py-2 bg-cyan-400 text-slate-950 font-semibold rounded-lg hover:bg-cyan-300 transition-colors glow-cyan"
            >
              Book Now
            </motion.button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-300 hover:text-white transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ 
            opacity: isMenuOpen ? 1 : 0, 
            height: isMenuOpen ? 'auto' : 0 
          }}
          className="md:hidden overflow-hidden"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 bg-slate-900/95 backdrop-blur-lg rounded-lg mt-2 border border-white/10">
            <button
              onClick={() => scrollToSection('#pricing')}
              className="block w-full text-left px-3 py-2 text-slate-300 hover:text-cyan-400 transition-colors font-medium"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection('#whiteclaw')}
              className="block w-full text-left px-3 py-2 text-slate-300 hover:text-cyan-400 transition-colors font-medium"
            >
              WhiteClaw
            </button>
            <button
              onClick={() => scrollToSection('#testimonials')}
              className="block w-full text-left px-3 py-2 text-slate-300 hover:text-cyan-400 transition-colors font-medium"
            >
              Results
            </button>
            <button
              onClick={() => scrollToSection('#book')}
              className="block w-full text-left px-3 py-2 bg-cyan-400 text-slate-950 font-semibold rounded-lg hover:bg-cyan-300 transition-colors mx-3 mt-2"
            >
              Book Now
            </button>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  )
}