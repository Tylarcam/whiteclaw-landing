# WhiteClaw Landing Page

Hybrid AI consulting + WhiteClaw automation service landing page built with React + TypeScript + Tailwind + Framer Motion.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd C:\Users\tylar\code\whiteclaw-landing-react
npm install
```

### 2. Development Server
```bash
npm run dev
```
Opens at `http://localhost:3000`

### 3. Build for Production
```bash
npm run build
```
Output in `dist/` folder

### 4. Preview Production Build
```bash
npm run preview
```

## 📁 Project Structure

```
whiteclaw-landing-react/
├── src/
│   ├── components/
│   │   ├── WhiteClawHero.tsx         # Hero section
│   │   ├── WhiteClawPricing.tsx      # Pricing tiers
│   │   ├── WhiteClawBookingForm.tsx  # Booking form
│   │   ├── WhiteClawTimeline.tsx     # Upgrade timeline
│   │   ├── WhiteClawDeliverables.tsx # What you get + testimonials
│   │   ├── WhiteClawBookingSection.tsx # Booking section
│   │   └── WhiteClawNavbar.tsx       # Navigation
│   ├── App.tsx                       # Main app
│   ├── main.tsx                      # Entry point
│   └── index.css                     # Global styles
├── index.html                        # HTML template
├── package.json                      # Dependencies
├── vite.config.ts                    # Vite config
├── tailwind.config.js                # Tailwind config
├── tsconfig.json                     # TypeScript config
└── README.md                         # This file
```

## 🎨 Design System

**Colors (matches HR AI design):**
- Background: `#0a0a0f` (slate-950)
- Primary: `#00d4ff` (cyan-400)
- Secondary: `#7b2cbf` (purple-500)
- Text: `#e4e4e7` (slate-100)
- Gradients: `linear-gradient(135deg, #00d4ff 0%, #7b2cbf 100%)`

**Components:**
- Glassmorphism cards with backdrop blur
- Gradient text and buttons
- Framer Motion animations
- Responsive design (mobile-first)

## 💰 Revenue Model

**Current Pricing:**
- Strategy Call: $150 (60 minutes + deliverables)
- WhiteClaw Pilot: $1,499/month (24/7 automation)

**Conversion Path:**
1. Landing page → Strategy call booking
2. Strategy call → WhiteClaw upgrade
3. Monthly recurring revenue from automation

**Metrics to Track:**
- Landing page conversion rate (target > 3%)
- Strategy call booking rate (target > 20%)
- Upgrade to WhiteClaw rate (target > 40%)

## 🛠 Customization

### Update Content
Edit component files in `src/components/`:
- `WhiteClawHero.tsx` - Main headline and value prop
- `WhiteClawPricing.tsx` - Pricing tiers and features
- `WhiteClawDeliverables.tsx` - What customers get
- `WhiteClawBookingForm.tsx` - Lead capture form

### Styling
- Global styles: `src/index.css`
- Component styles: Tailwind classes in each component
- Design tokens: `tailwind.config.js`

### Form Integration
Replace the simulated form submission in `WhiteClawBookingForm.tsx`:

```typescript
// Replace this section:
setTimeout(() => {
  setIsSubmitting(false)
  setIsSubmitted(true)
}, 1500)

// With actual API call:
const response = await fetch('/api/book-strategy-call', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData)
})
```

## 📊 Analytics Integration

### Google Analytics
Add to `index.html`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Conversion Tracking
Form submission already includes Google Ads conversion tracking:
```typescript
if (typeof gtag !== 'undefined') {
  gtag('event', 'conversion', {
    'send_to': 'AW-CONVERSION_ID/CONVERSION_LABEL',
    'value': 150.0,
    'currency': 'USD'
  })
}
```

## 🚢 Deployment

### View Railway build/deploy logs
- **Dashboard:** [Railway](https://railway.app/dashboard) → your project → **whiteclaw-landing** service → **Deployments** → open latest deployment → **View Logs** (Build + Deploy).
- **CLI (from this folder after linking):** `railway link` (select project/service once), then `railway logs` for deploy logs or open the build URL from `railway up`.

### Railway (Recommended)
1. Connect GitHub repo to Railway
2. Set build command: `npm run build`
3. Set start command: `npm run preview -- --port $PORT`
4. Deploy

### Vercel
1. Import from GitHub
2. Framework: Vite
3. Build command: `npm run build`
4. Output directory: `dist`

### Netlify
1. Connect repository
2. Build command: `npm run build`
3. Publish directory: `dist`

## 📱 Mobile Optimization

- Responsive design works on all screen sizes
- Touch-friendly buttons (44px minimum)
- Optimized images and performance
- Fast loading times

## 🔧 Performance

- Code splitting with Vite
- Lazy loading for below-fold content
- Optimized bundle size
- Cached static assets

## 🛡 Security

- HTTPS enforced on deployment
- Form validation (client + server side recommended)
- Rate limiting on form submissions
- No sensitive data in client code

## 📈 A/B Testing Ideas

1. **Hero headline variations:**
   - "Get AI Mastery, On Demand" (current)
   - "Stop Overthinking AI. Start Using It."
   - "Your AI Problem, Solved in 60 Minutes"

2. **Pricing presentation:**
   - Two-path (current) vs. single path
   - Anchor pricing vs. simplified
   - Different CTA text

3. **Social proof:**
   - Video testimonials vs. text
   - Case studies vs. quotes
   - Different testimonial copy

## 🆘 Troubleshooting

**Build errors:**
- Delete `node_modules` and run `npm install`
- Check Node.js version (16+)

**Styling issues:**
- Verify Tailwind is processing files in `tailwind.config.js`
- Check for CSS conflicts

**Form not working:**
- Replace simulated submission with real API endpoint
- Check browser console for errors

## 📞 Support

For technical issues:
1. Check browser console for errors
2. Verify all dependencies are installed
3. Test in incognito mode to avoid cache issues

For business questions:
- Check conversion metrics
- Review form analytics
- Monitor customer feedback

---

**Ready to launch!** 🚀

This landing page is optimized for conversions and follows proven UX patterns. The React structure makes it easy to iterate and improve based on data.