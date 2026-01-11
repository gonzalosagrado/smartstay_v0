# Smart Stay Bariloche - Product Instructions

## Product Overview
Smart Stay Bariloche is a B2B SaaS platform that provides intelligent link portals for hotels and tourist accommodations. It combines Linktree-style link management with real-time weather data and automated activity recommendations.

## Core Product Philosophy

### What We're Building
A weather-intelligent digital concierge that hotels can deploy via QR codes, giving guests:
- Real-time weather information
- Automated activity recommendations based on current conditions
- Quick access to hotel services and contact information
- Zero-friction experience (no app downloads, no login required)

### What Makes Us Different
Unlike generic link-in-bio tools, we solve a specific problem for tourism: **helping guests make better decisions based on current weather conditions** while providing hotels with a modern, maintainable alternative to printed materials.

## Technical Architecture

### Tech Stack
**Frontend:**
- Next.js 14 (App Router) for both dashboard and guest portals
- Tailwind CSS + shadcn/ui for UI components
- React Hook Form + Zod for form validation
- NextAuth.js for authentication

**Backend:**
- Next.js API Routes (serverless)
- Supabase (PostgreSQL + Auth + Storage)
- Vercel for hosting and cron jobs

**Third-Party Services:**
- OpenWeatherMap API for weather data
- Stripe for payments and subscriptions
- Resend/SendGrid for transactional emails

### Database Schema
\`\`\`sql
-- Core tables
hotels (id, user_id, name, slug, logo_url, primary_color, location, subscription_status)
links (id, hotel_id, title, url, icon, category, order_position, is_active)
weather_activities (id, hotel_id, title, url, weather_condition, priority)
click_events (id, hotel_id, link_id, clicked_at, weather_at_click)
\`\`\`

## User Personas

### Hotel Owner/Manager (B2B)
- Age: 35-55, owns/manages boutique hotel (10-50 rooms)
- Technical level: basic to intermediate
- Needs: Simple solution to provide guest info without printing materials
- Pain: Apps are expensive, printed materials outdated, doesn't know what to recommend when weather changes

### Tourist Guest (B2C)
- Age: 25-60, staying 2-7 days in Bariloche
- Needs: Quick decisions on what to do based on current weather
- Pain: Static brochures don't help with real-time decisions, lost WiFi card

## Product Features

### B2B Dashboard (Hotel Admin)
1. **Setup Wizard** (5 steps):
   - Branding (logo, colors, name)
   - Location (for weather data)
   - Basic links (WiFi, menu, WhatsApp)
   - Activity recommendations
   - Preview & activate

2. **Link Management:**
   - Drag & drop reordering
   - Categories: Hotel Services / Activities / Contact
   - Icon library (50+ options)
   - Add/edit/delete custom links

3. **Weather Recommendations Engine:**
   - Pre-loaded activities with weather triggers:
     - ☀️ Sunny → trekking, beach, water sports
     - ☁️ Cloudy → museums, city tours, shopping
     - 🌧️ Rain → spa, cinema, indoor restaurants
     - ❄️ Snow → skiing, snowboarding, snow landscapes
   - Hotel can customize and add activities
   - System shows top 3 recommendations

4. **Analytics:**
   - Total clicks
   - Most clicked links
   - Peak traffic hours
   - Weather vs. activities correlation

5. **QR Code Generator:**
   - For room cards
   - Print-ready format

### B2C Portal (Guest Experience)
**Layout Structure:**
\`\`\`
┌─────────────────────────┐
│   [HOTEL LOGO]          │
│   Hotel Name            │
├─────────────────────────┤
│ 🌤️ CURRENT WEATHER     │
│ 18°C - Partly Cloudy    │
├─────────────────────────┤
│ 📍 RECOMMENDED TODAY    │
│ [Activity 1]            │
│ [Activity 2]            │
│ [Activity 3]            │
├─────────────────────────┤
│ 🏨 HOTEL SERVICES       │
│ [WiFi Info]             │
│ [Restaurant Menu]       │
│ [Spa Booking]           │
├─────────────────────────┤
│ 📱 CONTACT              │
│ [WhatsApp]              │
│ [Email]                 │
│ [Instagram]             │
└─────────────────────────┘
\`\`\`

**UX Principles:**
- Mobile-first (90% mobile traffic expected)
- One-tap actions (direct app/page opening)
- Zero friction (no login, no downloads)
- Fast loading (<2 seconds)

## MVP Scope (Phase 1)

### Included in MVP:
✅ Basic dashboard (setup wizard + simple editor)
✅ Guest portal with weather + 3 link sections
✅ OpenWeatherMap integration (current weather)
✅ 8 pre-loaded activities with weather matching
✅ Stripe subscription checkout
✅ QR code generator
✅ Basic analytics (total clicks)

### NOT in MVP:
❌ Google OAuth (email/password only)
❌ Custom domains
❌ Advanced analytics
❌ Multiple users per hotel
❌ Public API

## Business Model

### Pricing
- **Single Plan:** $11.90 USD/month per hotel
- 14-day free trial (no credit card required)
- Monthly billing via Stripe
- Includes: 1 portal + unlimited clicks + unlimited updates

### Target Market
- **Primary:** Boutique hotels in Bariloche (10-50 rooms)
- **Secondary:** Cabins, apart-hotels, premium hostels
- **Goal:** 10 paying customers in first 90 days

## Design Principles

### Brand Personality
- **Helpful:** Solves real problems, not tech for tech's sake
- **Local:** Understands Bariloche tourism ecosystem
- **Effortless:** Setup in <10 minutes
- **Trustworthy:** Real-time data, not generic info

### UI Guidelines

**Dashboard:**
- Inspiration: Notion (simplicity) + Stripe (reliability)
- Colors: Blues/grays for professionalism
- Immediate feedback on every action
- Empty states guide next steps

**Guest Portal:**
- Inspiration: Linktree + Apple Weather (clarity)
- Typography: Inter or system fonts (fast loading)
- Generous spacing (mobile-friendly)
- WCAG AA minimum contrast

## Development Phases

### Sprint 0 (Weeks 1-2): Research & Design
- Interview 5 hotel owners in Bariloche
- Create wireframes and clickable prototype
- Define 20 essential activities for Bariloche
- Setup technical infrastructure

### Phase 1 (Weeks 3-8): MVP Development
- Sprint 1: Auth + basic dashboard
- Sprint 2: Portal builder + preview
- Sprint 3: Weather integration + recommendations
- Sprint 4: Polish + QR generator + basic analytics

### Phase 2 (Months 3-5): Growth Features
- Advanced analytics
- WhatsApp Business API integration
- Expanded activity library (100+ activities)
- Multi-language (EN/ES)

### Phase 3 (6+ months): Platform Expansion
- Mobile app for hotel managers
- PMS integrations
- Activity marketplace (commissions)
- Expansion to other tourist cities

## Key Metrics

### Product Success (First 90 Days)
- 10 paying hotels (ARR: ~$1,400 USD)
- 70% active hotels (edited portal in last 30 days)
- 15 average clicks per hotel/day
- NPS 40+ (initial product-market fit indicator)

### Technical Performance
- Portal load time: <2 seconds
- Weather API uptime: 99%+
- Zero data loss incidents

## Go-to-Market Strategy

### Launch Approach (Bariloche)
1. **Week 1-2: Warm Outreach**
   - List of 30 boutique hotels
   - Personalized email to managers/owners
   - Offer: "First 10 hotels → 3 months for price of 1"

2. **Demo Package:**
   - Interactive demo (fictional hotel)
   - 90-second video showing setup + results
   - Simulated case study

3. **Objection Handling:**
   - "I already have Instagram" → This complements, doesn't replace
   - "Too expensive" → ROI calculator: 1 spa booking/month = year paid
   - "My guests are older" → QR codes normalized since pandemic

## Critical Decisions Made

1. **Single paid plan only** (no freemium) → Focus on serious customers
2. **Hotels only for now** (not tourism agencies) → Validate first, expand later
3. **3 template options + custom** → Balance speed with flexibility
4. **Weather-first positioning** → Clear differentiation from generic tools

## Risk Mitigation

### Technical Risks
- Weather API failure → Fallback to last known data + timestamp message
- Free tier limit exceeded → Monitoring + upgrade if >500 calls/day
- Slow loading → CDN + lazy loading + image optimization

### Business Risks
- Hotels don't see value → Long trial (14 days) + personalized onboarding
- High churn post-trial → Email drip with usage tips + success stories
- Competitor copies → Execution speed + local relationships

## Communication Guidelines

### When Working on This Project
- **Focus on revenue generation:** Every decision should tie back to creating sustainable income
- **Prioritize shipping:** MVP over perfection, iterate based on real feedback
- **Think local-first:** Leverage Bariloche market knowledge and access
- **Business before tech:** Evaluate technical feasibility through revenue lens
- **Demo-driven development:** Create complete packages (product + sales materials)

### Code Style & Standards
- TypeScript strict mode
- Component-driven architecture
- Mobile-first responsive design
- Accessibility (WCAG AA minimum)
- Performance budget: <2s initial load

## Open Questions for Future Resolution

1. Should we include interactive map of activities? (Phase 2 candidate)
2. White-label option for premium tier? (Evaluate after 50 customers)
3. Integration with booking systems? (Depends on PMS partnerships)
4. Expand to tourism agencies? (After hotel validation)

---

## Next Action Items

When starting work on this project:
1. Review this document thoroughly
2. Confirm current development phase
3. Check for any blocking decisions needed
4. Align on immediate sprint goals
5. Validate assumptions with real user data when available

---

**Last Updated:** January 2026
**Project Status:** Pre-MVP / Planning Phase
**Current Focus:** Validation & Technical Setup
