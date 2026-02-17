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
            Start Here. Scale When Ready.
          </h2>
          <p className="text-slate-400 text-center max-w-2xl mx-auto">
            The audit is instant. The strategy call unlocks done-for-you. Both point to automation.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {/* TIER 1: WhiteClaw Audit — $39 (IMPULSE BUY) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="relative rounded-2xl p-6 lg:p-8 flex flex-col border-4 border-cyan-400/60 bg-gradient-to-br from-cyan-900/20 to-blue-900/20 transform md:scale-105 z-10 shadow-2xl shadow-cyan-500/10"
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-cyan-400 text-slate-950 px-4 py-1 rounded-full text-sm font-bold">
              INSTANT — FLIES OFF SHELVES
            </div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🤖</span>
              <h3 className="text-xl lg:text-2xl font-bold text-white">WhiteClaw Audit</h3>
            </div>
            <div className="mb-6">
              <span className="text-4xl lg:text-5xl font-bold text-white">$39</span>
              <span className="text-slate-400 ml-2">one-time</span>
            </div>
            <p className="text-cyan-400 font-semibold mb-6">Automated. Delivered in minutes.</p>
            <p className="text-slate-300 text-sm mb-6">
              AI-powered workflow audit + custom automation blueprint. Claude skill runs the analysis—you get a ready-to-implement plan.
            </p>
            <ul className="space-y-3 mb-8 flex-grow">
              {[
                'AI-powered workflow audit (Claude skill)',
                'Custom automation blueprint',
                'Prompt templates & implementation guide',
                'Instant delivery—no wait',
                'Email support',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="text-cyan-400 mt-0.5">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="bg-cyan-900/30 border border-cyan-400/30 rounded-lg p-4 mb-6">
              <p className="text-xs text-cyan-400 font-semibold uppercase tracking-wider mb-2">You get:</p>
              <ul className="space-y-1 text-xs text-slate-300">
                <li>📋 Automation Blueprint</li>
                <li>⚡ Prompt Library</li>
                <li>📅 Implementation Roadmap</li>
              </ul>
            </div>
            <button
              onClick={scrollToBook}
              className="w-full py-4 px-6 bg-cyan-400 hover:bg-cyan-300 text-slate-950 rounded-xl font-bold text-lg transition flex items-center justify-center gap-2 glow-cyan"
            >
              Get the Audit — $39
              <ArrowRight size={18} />
            </button>
            <p className="text-xs text-cyan-300 text-center mt-4 font-semibold">
              💡 Then book a $100/hr call to get it built for you
            </p>
          </motion.div>

          {/* TIER 2: Strategy Call — $100/hr */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative rounded-2xl p-6 lg:p-8 flex flex-col border-2 border-white/10 bg-slate-900/50"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🎯</span>
              <h3 className="text-xl lg:text-2xl font-bold text-white">Strategy Call</h3>
            </div>
            <div className="mb-6">
              <span className="text-4xl lg:text-5xl font-bold text-white">$100</span>
              <span className="text-slate-400 ml-2">/hour</span>
            </div>
            <p className="text-purple-400 font-semibold mb-6">Expert guidance + done-for-you setup</p>
            <p className="text-slate-300 text-sm mb-6">
              60-minute strategy call. We map your workflow, prioritize your automation, and either hand you the blueprint or build it for you.
            </p>
            <ul className="space-y-3 mb-8 flex-grow">
              <li className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-purple-400 mt-0.5">✓</span>
                <span><strong className="text-white">60 min strategy call</strong></span>
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-purple-400 mt-0.5">✓</span>
                <span>Custom automation blueprint</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-purple-400 mt-0.5">✓</span>
                <span>Prompt templates & roadmap</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-purple-400 mt-0.5">✓</span>
                <span>Done-for-you build available (add hours)</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-purple-400 mt-0.5">✓</span>
                <span>7-day email support</span>
              </li>
            </ul>
            <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">Why $100/hr:</p>
              <p className="text-xs text-slate-300">Value of expert time. No fluff. Direct path to working AI.</p>
            </div>
            <button
              onClick={scrollToBook}
              className="w-full py-3 px-6 bg-white/10 hover:bg-white/15 text-white rounded-xl font-semibold transition flex items-center justify-center gap-2 border border-white/10"
            >
              Book Strategy Call
              <ArrowRight size={16} />
            </button>
            <p className="text-xs text-slate-500 text-center mt-4">
              Encourages purchase of the $39 audit for DIY
            </p>
          </motion.div>

          {/* TIER 3: Audit + Call Bundle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="relative rounded-2xl p-6 lg:p-8 flex flex-col border-2 border-white/10 bg-slate-900/50"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🚀</span>
              <h3 className="text-xl lg:text-2xl font-bold text-white">Audit + Call</h3>
            </div>
            <div className="mb-6">
              <span className="text-4xl lg:text-5xl font-bold text-white">$139</span>
              <span className="text-slate-400 ml-2">bundle</span>
            </div>
            <p className="text-purple-400 font-semibold mb-6">Best value—full unlock</p>
            <p className="text-slate-300 text-sm mb-6">
              Get the audit ($39) + 1-hour strategy call ($100). Audit first, then we walk through your blueprint and build it together.
            </p>
            <ul className="space-y-3 mb-8 flex-grow">
              <li className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-purple-400 mt-0.5">✓</span>
                <span><strong className="text-white">WhiteClaw Audit</strong> (instant)</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-purple-400 mt-0.5">✓</span>
                <span><strong className="text-white">60 min strategy call</strong></span>
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-purple-400 mt-0.5">✓</span>
                <span>Blueprint walkthrough + done-for-you path</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-purple-400 mt-0.5">✓</span>
                <span>7-day support</span>
              </li>
            </ul>
            <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4 mb-6">
              <p className="text-xs text-purple-400 font-semibold uppercase tracking-wider mb-2">Save vs buying separately:</p>
              <p className="text-xs text-slate-300">$39 + $100 = $139 (no extra charge for the bundle)</p>
            </div>
            <button
              onClick={scrollToBook}
              className="w-full py-3 px-6 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-semibold transition flex items-center justify-center gap-2"
            >
              Get Audit + Book Call
              <ArrowRight size={16} />
            </button>
            <p className="text-xs text-slate-500 text-center mt-4">
              Automation ($39) → Call ($100/hr) → Working AI
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
            Buy the <strong className="text-white">WhiteClaw Audit</strong> ($39) for instant clarity → Book a <strong className="text-white">Strategy Call</strong> ($100/hr) when you want it built for you → Or DIY with the blueprint. Either way, you win.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
