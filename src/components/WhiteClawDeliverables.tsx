import { motion } from 'framer-motion'
import { FileText, Zap, Target, BarChart3 } from 'lucide-react'

const deliverables = [
  {
    icon: FileText,
    title: 'Custom Playbook',
    description: 'Done-for-you automation blueprint for your specific workflow. We map it, build it, and hand you the working system.',
    color: 'cyan'
  },
  {
    icon: Zap,
    title: 'Prompt Library',
    description: 'Battle-tested prompt templates that work in real businesses. Just approve and deploy—we handle the customization.',
    color: 'purple'
  },
  {
    icon: Target,
    title: 'Quick Win Strategy',
    description: 'We identify your highest-ROI opportunity and build it live within 48 hours. You see results before you commit to more.',
    color: 'cyan'
  },
  {
    icon: BarChart3,
    title: 'Success Metrics',
    description: 'Clear benchmarks and tracking methods so you know exactly what success looks like and when you\'ve achieved it.',
    color: 'purple'
  }
]

const testimonials = [
  {
    quote: "Went from AI-curious to having 3 automated workflows running in 2 weeks. The playbook was spot-on.",
    author: "Sarah M.",
    role: "Marketing Director, SaaS Startup"
  },
  {
    quote: "Saved 12 hours/week with just the strategy call. When we upgraded to WhiteClaw, it became 24/7 execution.",
    author: "David L.",
    role: "Operations Manager, E-commerce"
  },
  {
    quote: "Spent 2 weeks stuck on OpenClaw setup and security. One session fixed my gateway issues and got my first workflow live. Worth every penny.",
    author: "Mike T.",
    role: "DevOps Lead, Fintech"
  },
  {
    quote: "I tried Botpress for 3 weeks and got nowhere. No Brainer AI had my customer intake bot live in 2 days—I didn't write a single line of code.",
    author: "Alex R.",
    role: "Agency Owner"
  }
]

export default function WhiteClawDeliverables() {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-transparent to-transparent" />
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Deliverables Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            What We Build For You
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Concrete, working automations you can use immediately—no setup required.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-20">
          {deliverables.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card rounded-2xl p-6 lg:p-8 text-center hover:scale-105 transition-transform duration-300"
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 ${
                item.color === 'cyan'
                  ? 'bg-gradient-to-br from-cyan-400/20 to-cyan-600/20 border border-cyan-400/30'
                  : 'bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30'
              }`}>
                <item.icon size={32} className={item.color === 'cyan' ? 'text-cyan-400' : 'text-purple-400'} />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
              <p className="text-slate-400 leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Testimonials Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-16">
            Results from our approach
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card rounded-2xl p-8 lg:p-10"
            >
              <blockquote className="text-lg lg:text-xl text-slate-300 mb-6 italic leading-relaxed">
                "{testimonial.quote}"
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {testimonial.author.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-white">{testimonial.author}</div>
                  <div className="text-sm text-slate-400">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Booking CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-20"
        >
          <div className="glass-card rounded-3xl p-8 lg:p-12 max-w-3xl mx-auto">
            <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
              Ready to get unstuck with AI?
            </h3>
            <p className="text-slate-400 mb-8 text-lg">
              Get the $39 audit for instant clarity. Or book the $100/hr strategy call for done-for-you setup.
            </p>
            <button
              onClick={() => {
                const element = document.querySelector('#pricing')
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' })
                }
              }}
              className="px-8 py-4 text-base font-semibold bg-cyan-400 text-slate-950 rounded-xl hover:bg-cyan-300 transition-all flex items-center justify-center gap-2 mx-auto glow-cyan"
            >
              Get the Audit — $39
              <Target size={18} />
            </button>
            <p className="text-sm text-slate-500 mt-4">
              100% satisfaction guarantee • No risk, all reward
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}