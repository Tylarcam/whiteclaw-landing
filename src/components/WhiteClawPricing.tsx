import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const scrollToBook = () => {
  const element = document.querySelector('#book')
  if (element) element.scrollIntoView({ behavior: 'smooth' })
}

export default function WhiteClawPricing() {
  return (
    <section id="pricing" className="relative py-24 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-transparent to-transparent" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Three Paths to AI Automation
          </h2>
          <p className="text-slate-400 text-center max-w-2xl mx-auto">
            Choose your speed. Get results fast. Scale when ready.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {/* TIER 1: Strategy Audit */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="relative rounded-2xl p-6 lg:p-8 flex flex-col border-2 border-white/10 bg-slate-900/50"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🛠️</span>
              <h3 className="text-xl lg:text-2xl font-bold text-white">Strategy Audit</h3>
            </div>
            <div className="mb-6">
              <span className="text-4xl lg:text-5xl font-bold text-white">$150</span>
              <span className="text-slate-400 ml-2">one-time</span>
            </div>
            <p className="text-cyan-400 font-semibold mb-6">Perfect if you want to DIY</p>
            <p className="text-slate-300 text-sm mb-6">
              We diagnose your workflow and hand you the blueprint. You build it yourself with our guidance.
            </p>
            <ul className="space-y-3 mb-8 flex-grow">
              {[
                '60-minute workflow audit',
                'Custom implementation blueprint',
                'Ready-to-use prompt templates',
                'DIY implementation guide',
                '7-day email support',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="text-cyan-400 mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">You get:</p>
              <ul className="space-y-1 text-xs text-slate-300">
                <li>📋 Custom Automation Blueprint</li>
                <li>⚡ Prompt Template Library</li>
                <li>📅 Implementation Roadmap</li>
              </ul>
            </div>
            <button
              onClick={scrollToBook}
              className="w-full py-3 px-6 bg-white/10 hover:bg-white/15 text-white rounded-xl font-semibold transition flex items-center justify-center gap-2 border border-white/10"
            >
              Get Your Blueprint
              <ArrowRight size={16} />
            </button>
            <p className="text-xs text-slate-500 text-center mt-4">
              Upgrade to 48-Hour Build for $1,847
            </p>
          </motion.div>

          {/* TIER 2: 48-Hour Build (HERO) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative rounded-2xl p-6 lg:p-8 flex flex-col border-4 border-cyan-400/60 bg-gradient-to-br from-cyan-900/20 to-blue-900/20 transform md:scale-105 z-10 shadow-2xl shadow-cyan-500/10"
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-cyan-400 text-slate-950 px-4 py-1 rounded-full text-sm font-bold">
              MOST POPULAR
            </div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🚀</span>
              <h3 className="text-xl lg:text-2xl font-bold text-white">48-Hour Build</h3>
            </div>
            <div className="mb-6">
              <span className="text-4xl lg:text-5xl font-bold text-white">$1,997</span>
              <span className="text-slate-400 ml-2">one-time</span>
            </div>
            <p className="text-cyan-400 font-semibold mb-6">We build it. You use it. Fast.</p>
            <p className="text-slate-300 text-sm mb-6">
              One complete workflow built, tested, and deployed in 48 hours. No setup on your end. Just working automation.
            </p>
            <ul className="space-y-3 mb-8 flex-grow">
              <li className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-cyan-400 mt-0.5">✓</span>
                <span><strong className="text-white">Everything from Strategy Audit</strong></span>
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-cyan-400 mt-0.5">✓</span>
                <span><strong className="text-white">We build + deploy your automation</strong> (no code required)</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-cyan-400 mt-0.5">✓</span>
                <span><strong className="text-white">Live in 48 hours</strong> (guaranteed delivery)</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-cyan-400 mt-0.5">✓</span>
                <span>Email, calendar, CRM, or custom workflow</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-cyan-400 mt-0.5">✓</span>
                <span>14 days of tweaks + optimization</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-cyan-400 mt-0.5">✓</span>
                <span>Upgrade to managed anytime</span>
              </li>
            </ul>
            <div className="bg-cyan-900/30 border border-cyan-400/30 rounded-lg p-4 mb-6">
              <p className="text-xs text-cyan-400 font-semibold uppercase tracking-wider mb-2">You get:</p>
              <ul className="space-y-1 text-xs text-slate-300">
                <li>🤖 One Working Automation (Deployed)</li>
                <li>📊 Performance Dashboard</li>
                <li>🔧 14-Day Support Window</li>
              </ul>
            </div>
            <button
              onClick={scrollToBook}
              className="w-full py-4 px-6 bg-cyan-400 hover:bg-cyan-300 text-slate-950 rounded-xl font-bold text-lg transition flex items-center justify-center gap-2 glow-cyan"
            >
              Get Your Automation Built
              <ArrowRight size={18} />
            </button>
            <p className="text-xs text-cyan-300 text-center mt-4 font-semibold">
              💰 Save $3K+ vs. typical agency pricing
            </p>
          </motion.div>

          {/* TIER 3: WhiteClaw Managed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="relative rounded-2xl p-6 lg:p-8 flex flex-col border-2 border-white/10 bg-slate-900/50"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🤖</span>
              <h3 className="text-xl lg:text-2xl font-bold text-white">WhiteClaw Managed</h3>
            </div>
            <div className="mb-6">
              <span className="text-4xl lg:text-5xl font-bold text-white">$1,499</span>
              <span className="text-slate-400 ml-2">/month</span>
            </div>
            <p className="text-purple-400 font-semibold mb-6">For teams that need scale</p>
            <p className="text-slate-300 text-sm mb-6">
              Unlimited workflows. 24/7 monitoring. Your personal AI team handles everything while you focus on growth.
            </p>
            <ul className="space-y-3 mb-8 flex-grow">
              <li className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-purple-400 mt-0.5">✓</span>
                <span><strong className="text-white">Everything from 48-Hour Build</strong></span>
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-purple-400 mt-0.5">✓</span>
                <span><strong className="text-white">Unlimited automations</strong> (no per-workflow fees)</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-purple-400 mt-0.5">✓</span>
                <span>24/7 monitoring + optimization</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-purple-400 mt-0.5">✓</span>
                <span>Weekly performance reports</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-purple-400 mt-0.5">✓</span>
                <span>Priority support + dedicated handler</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-purple-400 mt-0.5">✓</span>
                <span>Custom integrations (Slack, CRM, email)</span>
              </li>
            </ul>
            <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4 mb-6">
              <p className="text-xs text-purple-400 font-semibold uppercase tracking-wider mb-2">You get:</p>
              <ul className="space-y-1 text-xs text-slate-300">
                <li>🔄 Managed Automation Library</li>
                <li>📈 Performance Dashboard</li>
                <li>👤 Dedicated Account Handler</li>
              </ul>
            </div>
            <button
              onClick={scrollToBook}
              className="w-full py-3 px-6 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-semibold transition flex items-center justify-center gap-2"
            >
              Start WhiteClaw Pilot
              <ArrowRight size={16} />
            </button>
            <p className="text-xs text-slate-500 text-center mt-4">
              One workflow = $1,997 | Unlimited = $1,499/mo
            </p>
          </motion.div>
        </div>

        {/* Smart path callout */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 p-6 bg-gradient-to-r from-cyan-900/20 to-purple-900/20 border border-cyan-400/30 rounded-2xl text-center max-w-4xl mx-auto"
        >
          <p className="text-cyan-400 font-semibold mb-2">💡 Smart path:</p>
          <p className="text-slate-300">
            Start with <strong className="text-white">Strategy Audit</strong> ($150) to test the waters → Upgrade to <strong className="text-white">48-Hour Build</strong> ($1,997) when you're ready to launch → Scale with <strong className="text-white">WhiteClaw</strong> ($1,499/mo) for unlimited automation
          </p>
        </motion.div>
      </div>
    </section>
  )
}
