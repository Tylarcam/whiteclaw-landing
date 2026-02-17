import { useState } from 'react'

declare const gtag: (...args: any[]) => void;
import { motion } from 'framer-motion'
import { Calendar, User, Building, Mail, Clock, CheckCircle } from 'lucide-react'

interface FormData {
  name: string
  email: string
  company: string
  role: string
  problem: string
  timeline: string
  consent: boolean
}

export default function WhiteClawBookingForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    role: '',
    problem: '',
    timeline: '',
    consent: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Basic validation
    if (!formData.name || !formData.email || !formData.company || !formData.role || 
        !formData.problem || !formData.timeline || !formData.consent) {
      alert('Please fill in all required fields.')
      setIsSubmitting(false)
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address.')
      setIsSubmitting(false)
      return
    }

    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      
      // Track conversion
      if (typeof gtag !== 'undefined') {
        gtag('event', 'conversion', {
          'send_to': 'AW-CONVERSION_ID/CONVERSION_LABEL',
          'value': 39.0,
          'currency': 'USD'
        })
      }
      
      console.log('Strategy call booking submitted:', formData)
    }, 1500)
  }

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-green-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Check your email!</h3>
        <p className="text-slate-400 mb-4">
          You'll receive booking links and preparation materials shortly.
        </p>
        <p className="text-sm text-slate-500">
          We typically respond within 2 hours during business hours.
        </p>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
            <User size={16} />
            Your name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none transition-colors"
            placeholder="Enter your name"
          />
        </div>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
            <Mail size={16} />
            Work email *
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none transition-colors"
            placeholder="your@company.com"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
            <Building size={16} />
            Company *
          </label>
          <input
            type="text"
            required
            value={formData.company}
            onChange={(e) => handleInputChange('company', e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none transition-colors"
            placeholder="Your company name"
          />
        </div>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
            <User size={16} />
            Your role *
          </label>
          <input
            type="text"
            required
            value={formData.role}
            onChange={(e) => handleInputChange('role', e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:border-cyan-400 focus:outline-none transition-colors"
            placeholder="Marketing Manager, CEO, etc."
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
            <Clock size={16} />
            What AI challenge are you facing? *
          </label>
          <select
            required
            value={formData.problem}
            onChange={(e) => handleInputChange('problem', e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-cyan-400 focus:outline-none transition-colors"
          >
            <option value="">Select your main challenge</option>
            <option value="content">Content creation & marketing</option>
            <option value="operations">Operations & workflow automation</option>
            <option value="customer">Customer service & support</option>
            <option value="sales">Sales & lead generation</option>
            <option value="dfy">Done-for-you bot or workflow (I don't want to DIY)</option>
            <option value="research">Research & data analysis</option>
            <option value="openclaw">OpenClaw / agent setup & security</option>
            <option value="other">Other (we'll discuss)</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
            <Calendar size={16} />
            When do you need this working? *
          </label>
          <select
            required
            value={formData.timeline}
            onChange={(e) => handleInputChange('timeline', e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-cyan-400 focus:outline-none transition-colors"
          >
            <option value="">Select your timeline</option>
            <option value="asap">ASAP (this week)</option>
            <option value="month">Within a month</option>
            <option value="quarter">This quarter</option>
            <option value="planning">Just planning ahead</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            required
            checked={formData.consent}
            onChange={(e) => handleInputChange('consent', e.target.checked)}
            className="mt-1 w-4 h-4 text-cyan-400 bg-white/5 border-white/20 rounded focus:ring-cyan-400 focus:ring-2"
          />
          <span className="text-sm text-slate-400">
            I consent to follow-up emails about my AI implementation journey and strategy call details.
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 text-base font-semibold bg-cyan-400 text-slate-950 rounded-xl hover:bg-cyan-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 glow-cyan"
      >
        {isSubmitting ? (
          <>
            <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            Processing...
          </>
        ) : (
        <>
          Get My Audit or Book Call
          <Calendar size={16} />
        </>
        )}
      </button>

      <p className="text-center text-sm text-slate-500">
        You'll receive calendar links immediately after payment confirmation.
      </p>
    </form>
  )
}