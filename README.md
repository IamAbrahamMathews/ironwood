# 🛡️ Ironwood — Agentic AI Cybersecurity Platform (Final Edition)

A complete multi-page cybersecurity website with AI chatbot, case studies, client reviews, and a revenue analytics dashboard — Vercel-ready in minutes.

---

## 📁 File Structure

```
ironwood/
├── public/
│   ├── index.html          ← Home page (hero, coverage, pricing, systems)
│   ├── case-studies.html   ← 6 detailed AI defence case studies + timeline
│   ├── reviews.html        ← 9 company reviews + rating breakdown charts
│   ├── analytics.html      ← Revenue, sales & market analytics (7 charts)
│   ├── ironwood.css        ← Shared design system (all pages)
│   └── ironwood.js         ← Shared JS (cursor, chatbot, reveal, nav, ticker)
├── api/
│   └── chat.js             ← Serverless function — Anthropic Claude proxy
├── vercel.json             ← Routing for all pages + API
├── package.json
├── .env.example
└── README.md
```

---

## 🚀 Deploy to Vercel — 3 Ways

### A) Vercel CLI (Fastest)
```bash
npm install -g vercel
cd ironwood
npm install
vercel                          # follow prompts, deploy preview
vercel env add ANTHROPIC_API_KEY   # paste your sk-ant-... key
vercel --prod                   # deploy to production
```

### B) GitHub → Vercel Dashboard
1. Push this folder to GitHub
2. Go to [vercel.com/new](https://vercel.com/new) → Import repo
3. **Environment Variables** → Add `ANTHROPIC_API_KEY` = `sk-ant-your-key`
4. Click **Deploy** ✓

### C) Local Dev
```bash
npm install
cp .env.example .env.local
# Add ANTHROPIC_API_KEY to .env.local
npx vercel dev
# → http://localhost:3000
```

---

## 🗺️ Pages

| URL | File | Description |
|-----|------|-------------|
| `/` | `index.html` | Hero, Platform, Coverage, Growth, Systems, Pricing |
| `/case-studies` | `case-studies.html` | 6 case studies + response timeline |
| `/reviews` | `reviews.html` | 9 enterprise reviews + rating bars + aggregate scores |
| `/analytics` | `analytics.html` | 7 interactive charts: ARR, sales by plan, acquisition, market |

---

## 🤖 AI Chatbot
- Powered by **Claude claude-sonnet-4-20250514** via `/api/chat`
- Knows about Ironwood's plans (₹4,999 → ₹39,999 → Custom)
- Answers any cybersecurity question
- Requires `ANTHROPIC_API_KEY` env variable
- Appears on every page (bottom-right 🛡️ button)

---

## 🎨 Design System
- **Fonts**: Playfair Display (headings) · Outfit (body) · Fira Code (mono)
- **Colors**: Indigo `#4F46FF` · Coral `#FF4F6A` · Lime `#B8FF35` · Cyan `#00E5FF` · Violet `#BF5FFF` · Gold `#FFB830`
- **Shared CSS/JS**: `ironwood.css` + `ironwood.js` used by all pages

---

## 💰 Pricing Plans
| Plan | Monthly | Annual | Endpoints |
|---|---|---|---|
| Sentinel | ₹4,999 | ₹47,990 | 25 |
| Fortress | ₹14,999 | ₹1,43,990 | 100 |
| Citadel | ₹39,999 | ₹3,83,990 | 500 |
| Enterprise | Custom | Custom | Unlimited |

*All prices INR · Exclusive of 18% GST*

---

*Built for India · CERT-In · DPDP Act 2023 · SEBI · RBI compliance ready*
