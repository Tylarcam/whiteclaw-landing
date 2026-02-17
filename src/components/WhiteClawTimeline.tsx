import { motion } from 'framer-motion'
import { Calendar, Zap, Bot, ArrowRight } from 'lucide-react'

const timelineSteps = [
  {
    icon: Zap,
    title: 'Step 1: Get the Audit ($39)',
    description: 'Instant AI-powered workflow audit. You get a custom automation blueprint, prompt templates, and implementation roadmap—delivered in minutes. No wait.',
    color: 'cyan'
  },
  {
    icon: Calendar,
    title: 'Step 2: Strategy Call ($100/hr)',
    description: 'Book a 60-minute call when you want expert guidance. We walk through your blueprint and either help you DIY or build it for you.',
    color: 'purple'
  },
  {
    icon: Bot,
    title: 'Step 3: Automation Live',
    description: 'Implement your blueprint (DIY or done-for-you). Your AI workflows run on autopilot. Scale when ready.',
    color: 'cyan'
  }
]

export default function WhiteClawTimeline() {
  return (
    <section className="relative py-24 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/5 via-transparent to-transparent" />
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-cyan-400/10 rounded-full blur-[120px] -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] -translate-y-1/2" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            How does this work?
          </h2>
          <p className="text-xl text-cyan-400 font-medium mb-6">
            Audit first ($39). Strategy call when ready ($100/hr). Working AI either way.
          </p>
          <p className="text-slate-400 max-w-2xl mx-auto">
            The $39 audit gives you instant clarity. The strategy call gets it built. Both encourage you to lock in the automation.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-8 lg:space-y-12">
            {timelineSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className={`flex items-center gap-6 lg:gap-12 ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                    step.color === 'cyan' 
                      ? 'bg-gradient-to-br from-cyan-400/20 to-cyan-600/20 border border-cyan-400/30'
                      : 'bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30'
                  }`}>
                    <step.icon 
                      size={28} 
                      className={step.color === 'cyan' ? 'text-cyan-400' : 'text-purple-400'} 
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 glass-card rounded-2xl p-6 lg:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-sm font-medium px-3 py-1 rounded-full bg-white/5 text-slate-400">
                      Step {index + 1}
                    </span>
                    <h3 className="text-xl lg:text-2xl font-bold text-white">{step.title}</h3>
                  </div>
                  <p className="text-slate-400 leading-relaxed">{step.description}</p>
                </div>

                {/* Arrow for mobile */}
                {index < timelineSteps.length - 1 && (
                  <div className="lg:hidden flex justify-center">
                    <ArrowRight size={24} className="text-slate-600 rotate-90" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16"
        >
          <div className="glass-card rounded-3xl p-8 lg:p-12 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Bot size={32} className="text-cyan-400" />
              <h3 className="text-2xl lg:text-3xl font-bold text-white">
                Ready to get your AI workflow unstuck?
              </h3>
            </div>
            <p className="text-slate-400 mb-8 text-lg">
              Start with the $39 audit for instant clarity. Or book the $100/hr strategy call for done-for-you setup.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  const element = document.querySelector('#pricing')
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
                className="px-8 py-4 text-base font-semibold bg-cyan-400 text-slate-950 rounded-xl hover:bg-cyan-300 transition-all flex items-center justify-center gap-2 glow-cyan"
              >
                Get the Audit — $39
                <Bot size={18} />
              </button>
              <button
                onClick={() => {
                  const element = document.querySelector('#book')
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
                className="px-8 py-4 text-base font-semibold bg-white/5 text-white rounded-xl border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                Book Strategy Call — $100/hr
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Results preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <p className="text-slate-500 mb-4">Average client timeline:</p>
          <div className="flex justify-center items-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
              <span className="text-slate-400">Today: Audit delivered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span className="text-slate-400">This week: Strategy call</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
              <span className="text-slate-400">Next: Working AI</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}