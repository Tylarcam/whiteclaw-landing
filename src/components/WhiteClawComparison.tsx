import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

export default function WhiteClawComparison() {
  return (
    <section className="relative py-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-center text-white mb-4"
        >
          Why Done-For-You Beats DIY
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-slate-400 text-center mb-12"
        >
          Stop wrestling with complex platforms. Get working automation in 48 hours.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="overflow-x-auto rounded-xl border border-white/10 bg-white/5"
        >
          <table className="w-full min-w-[700px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 sm:px-6 text-slate-300 font-semibold">What You Get</th>
                <th className="text-left py-3 px-4 sm:px-6 text-slate-400 font-semibold">
                  DIY Platforms
                  <span className="block text-xs font-normal text-slate-500 mt-1">(Botpress, Voiceflow)</span>
                </th>
                <th className="text-left py-3 px-4 sm:px-6 text-slate-400 font-semibold">
                  Freelancers
                  <span className="block text-xs font-normal text-slate-500 mt-1">(typical agency)</span>
                </th>
                <th className="text-left py-3 px-4 sm:px-6 bg-cyan-400/10 border-l-2 border-cyan-400/50 font-semibold text-white">
                  No Brainer AI
                  <span className="block text-xs font-normal text-cyan-400 mt-1">(Done-For-You)</span>
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-white/5">
                <td className="py-3 px-4 sm:px-6 text-slate-300">Setup time</td>
                <td className="py-3 px-4 sm:px-6 text-slate-400">
                  2–4 weeks
                  <span className="block text-xs text-slate-500">(you build)</span>
                </td>
                <td className="py-3 px-4 sm:px-6 text-slate-400">
                  2–4 weeks
                  <span className="block text-xs text-slate-500">(they build, slow turnaround)</span>
                </td>
                <td className="py-3 px-4 sm:px-6 bg-cyan-400/5 border-l-2 border-cyan-400/50">
                  <span className="flex items-center gap-2 text-white font-semibold">
                    <Check size={16} className="text-cyan-400 flex-shrink-0" />
                    48 hours
                  </span>
                  <span className="block text-xs text-cyan-400">(we build)</span>
                </td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-3 px-4 sm:px-6 text-slate-300">Typical cost</td>
                <td className="py-3 px-4 sm:px-6 text-slate-400">
                  $60–$495/mo
                  <span className="block text-xs text-slate-500">+ credit burn & overages</span>
                </td>
                <td className="py-3 px-4 sm:px-6 text-slate-400">
                  $1,500–$7,500 setup
                  <span className="block text-xs text-slate-500">+ $3K–$8K/mo managed</span>
                </td>
                <td className="py-3 px-4 sm:px-6 bg-cyan-400/5 border-l-2 border-cyan-400/50">
                  <span className="flex items-center gap-2 text-white font-semibold">
                    <Check size={16} className="text-cyan-400 flex-shrink-0" />
                    $150 audit · $1,997 build · $1,499/mo
                  </span>
                  <span className="block text-xs text-cyan-400">all-inclusive</span>
                </td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-3 px-4 sm:px-6 text-slate-300">Technical skill required</td>
                <td className="py-3 px-4 sm:px-6 text-slate-400">
                  High
                  <span className="block text-xs text-slate-500">(prompts, flows, integrations)</span>
                </td>
                <td className="py-3 px-4 sm:px-6 text-slate-400">
                  Low (they build)
                  <span className="block text-xs text-slate-500">(but slow & expensive)</span>
                </td>
                <td className="py-3 px-4 sm:px-6 bg-cyan-400/5 border-l-2 border-cyan-400/50">
                  <span className="flex items-center gap-2 text-white font-semibold">
                    <Check size={16} className="text-cyan-400 flex-shrink-0" />
                    None
                  </span>
                  <span className="block text-xs text-cyan-400">(we handle everything)</span>
                </td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-3 px-4 sm:px-6 text-slate-300">Maintenance & updates</td>
                <td className="py-3 px-4 sm:px-6 text-slate-400">
                  You fix errors
                  <span className="block text-xs text-slate-500">and update workflows</span>
                </td>
                <td className="py-3 px-4 sm:px-6 text-slate-400">
                  Often extra fees
                  <span className="block text-xs text-slate-500">or you're stuck</span>
                </td>
                <td className="py-3 px-4 sm:px-6 bg-cyan-400/5 border-l-2 border-cyan-400/50">
                  <span className="flex items-center gap-2 text-white font-semibold">
                    <Check size={16} className="text-cyan-400 flex-shrink-0" />
                    We monitor 24/7
                  </span>
                  <span className="block text-xs text-cyan-400">and optimize continuously</span>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 sm:px-6 text-slate-300">Support</td>
                <td className="py-3 px-4 sm:px-6 text-slate-400">
                  Community forums,
                  <span className="block text-xs text-slate-500">documentation</span>
                </td>
                <td className="py-3 px-4 sm:px-6 text-slate-400">
                  Depends on freelancer
                  <span className="block text-xs text-slate-500">(availability varies)</span>
                </td>
                <td className="py-3 px-4 sm:px-6 bg-cyan-400/5 border-l-2 border-cyan-400/50">
                  <span className="flex items-center gap-2 text-white font-semibold">
                    <Check size={16} className="text-cyan-400 flex-shrink-0" />
                    Dedicated handler
                  </span>
                  <span className="block text-xs text-cyan-400">+ priority support</span>
                </td>
              </tr>
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  )
}
