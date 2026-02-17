import { motion } from 'framer-motion'
import { Calendar } from 'lucide-react'
import WhiteClawBookingForm from './WhiteClawBookingForm'

export default function WhiteClawBookingSection() {
  return (
    <section id="book" className="relative py-24 lg:py-32 bg-slate-900/50">
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/5 via-transparent to-transparent" />
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <Calendar size={32} className="text-cyan-400" />
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              Get the Audit ($39) or Book Strategy Call ($100/hr)
            </h2>
          </div>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Choose your path: WhiteClaw Audit ($39) for instant blueprint, or Strategy Call ($100/hr) for done-for-you setup. We'll confirm which option you want after you submit.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card rounded-3xl p-8 lg:p-12"
        >
          <WhiteClawBookingForm />
        </motion.div>
      </div>
    </section>
  )
}