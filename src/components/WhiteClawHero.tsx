import { motion } from 'framer-motion'
import { ArrowRight, Clock, Zap, Bot } from 'lucide-react'

export default function WhiteClawHero() {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 via-transparent to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-cyan-400/20 rounded-full blur-[120px] opacity-30" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-purple-500/20 rounded-full blur-[100px] opacity-20" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium bg-cyan-400/10 text-cyan-400 rounded-full border border-cyan-400/20">
            ⚡ Start today, scale tomorrow
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6"
        >
          <span className="text-white">Stop Building.</span>
          <br />
          <span className="gradient-text"> Start Automating.</span>
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-2xl md:text-3xl font-bold text-white mb-4"
        >
          Done-For-You AI That Works in 48 Hours.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg text-gray-300 mb-2"
        >
          Most agencies charge $5K+ and take 4 weeks. We deliver in 2 days for $1,997.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="max-w-2xl mx-auto text-base text-gray-400 mb-10 leading-relaxed"
        >
          We build your automation, handle the tech, and run it 24/7—so you don't have to touch Botpress, Voiceflow, or any code.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row justify-center gap-4 mb-8"
        >
          <div className="flex justify-center gap-8">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="text-cyan-400" size={20} />
                <span className="text-2xl font-bold text-cyan-400">60min</span>
              </div>
              <span className="text-slate-400 text-sm">We map your automation</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="text-purple-400" size={20} />
                <span className="text-2xl font-bold text-purple-400">48hrs</span>
              </div>
              <span className="text-slate-400 text-sm">We build and test it</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 mb-2">
                <Bot className="text-cyan-400" size={20} />
                <span className="text-2xl font-bold text-cyan-400">24/7</span>
              </div>
              <span className="text-slate-400 text-sm">Your AI runs on autopilot</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            onClick={() => scrollToSection('#book')}
            className="group w-full sm:w-auto px-8 py-4 text-base font-semibold bg-cyan-400 text-slate-950 rounded-xl hover:bg-cyan-300 transition-all flex items-center justify-center gap-2 glow-cyan"
          >
            Get Your Automation Built — $1,997
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-6 text-sm text-slate-500"
        >
          ✓ Includes deliverables & templates &nbsp;|&nbsp; ✓ Upgrade path included
        </motion.p>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-slate-600 rounded-full flex justify-center pt-2">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-cyan-400 rounded-full"
          />
        </div>
      </motion.div>
    </section>
  )
}