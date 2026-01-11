# Smart Stay Bariloche - Guest Portal (B2C)

## Project Overview
Create a mobile-first guest portal for hotels - a smart link-in-bio page with live weather and activity recommendations. This is what guests see when they scan a QR code in their hotel room.

---

## ⚠️ CRITICAL TECHNICAL REQUIREMENTS

### Next.js Configuration
- Use Next.js 14+ with App Router
- Dynamic route: `app/[hotelSlug]/page.tsx`
- Enable ISR with 30-minute revalidation:
\`\`\`typescript
export const revalidate = 1800 // 30 minutes
\`\`\`

### TypeScript Setup
All components must have explicit types. Define interfaces upfront:

\`\`\`typescript
// types/portal.ts
export interface Hotel {
  name: string
  slug: string
  logoUrl: string | null
  primaryColor: string
  locationLat: number
  locationLon: number
  city: string
}

export interface WeatherData {
  temp: number
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy'
  icon: string
  description: string
  updatedAt: string
}

export interface Link {
  id: string
  title: string
  description?: string
  url: string
  icon: string
  category: 'hotel' | 'activities' | 'contact'
}

export interface Activity {
  id: string
  title: string
  description: string
  url: string
  icon: string
  weatherCondition: 'sunny' | 'cloudy' | 'rainy' | 'snowy'
  priority: number
}
\`\`\`

### Performance Requirements
- Target: Lighthouse score 95+ on mobile
- Load time: <2 seconds on 3G
- Bundle size: Keep under 200KB
- Use Server Components by default
- Only use "use client" for: animations, form interactions

### Mobile-First Design
- Design for 375px width first (iPhone SE)
- Touch targets minimum 44x44px
- No horizontal scroll
- Test breakpoints: 375px, 768px, 1024px

### Image Optimization
ALL images must use Next.js Image component:
\`\`\`tsx
import Image from 'next/image'

<Image 
  src={hotel.logoUrl || '/placeholder-logo.png'} 
  alt={`${hotel.name} logo`}
  width={120}
  height={120}
  className="mx-auto rounded-full"
  priority
/>
\`\`\`

### Error Handling
Include proper error boundaries and fallbacks:
\`\`\`tsx
// app/[hotelSlug]/error.tsx
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Algo salió mal</h2>
        <button onClick={reset} className="px-4 py-2 bg-blue-500 text-white rounded">
          Intentar nuevamente
        </button>
      </div>
    </div>
  )
}
\`\`\`

---

## 🎨 Design Requirements

### Aesthetic Direction
- **Tone**: Clean, friendly, effortless (Linktree meets Apple Weather)
- **Typography**: Inter font (use next/font)
  - Hotel name: text-2xl font-semibold
  - Section headers: text-lg font-medium
  - Links: text-base
  - Weather temp: text-4xl font-bold
- **Colors**: Dynamic based on hotel's primary color
  - Background: gradient from gray-50 to white
  - Cards: white with subtle shadows
  - Weather widget: dynamic gradient based on condition

### Layout Structure
\`\`\`
┌─────────────────────────────┐
│   [HOTEL LOGO - centered]   │
│   Hotel Vista Lago          │  
├─────────────────────────────┤
│ 🌤️ CLIMA AHORA             │  
│ 18°C - Parcialmente nublado│
│ Actualizado: 14:30          │
├─────────────────────────────┤
│ 📍 RECOMENDADO HOY          │  
│ Badge: "Ideal para hoy"     │
├─────────────────────────────┤
│ [🚶 City Tour Centro]       │  
│ [🍽️ Restaurante Vista]      │
│ [🏛️ Museo Patagonia]        │
├─────────────────────────────┤
│ 🏨 SERVICIOS DEL HOTEL      │  
├─────────────────────────────┤
│ [📶 WiFi: vista2024]        │  
│ [🍴 Menú Restaurant]        │
│ [💆 Reservar Spa]           │
├─────────────────────────────┤
│ 📱 CONTACTO                 │  
├─────────────────────────────┤
│ [💬 WhatsApp Hotel]         │  
│ [📧 Email]                  │
│ [📸 Instagram]              │
├─────────────────────────────┤
│ Powered by Smart Stay       │
└─────────────────────────────┘
\`\`\`

---

## 🧩 Component Architecture

### Main Page Structure
\`\`\`tsx
// app/[hotelSlug]/page.tsx
import { Suspense } from 'react'
import Image from 'next/image'
import { HotelHeader } from '@/components/portal/hotel-header'
import { WeatherWidget } from '@/components/portal/weather-widget'
import { WeatherSkeleton } from '@/components/portal/weather-skeleton'
import { RecommendedSection } from '@/components/portal/recommended-section'
import { LinksSection } from '@/components/portal/links-section'
import { Footer } from '@/components/portal/footer'

export const revalidate = 1800 // 30 minutes

// Mock data fetching functions (replace with real API calls later)
async function getHotel(slug: string): Promise<Hotel> {
  // This will be replaced with Supabase call
  return {
    name: 'Hotel Vista Lago',
    slug: 'vista-lago',
    logoUrl: null,
    primaryColor: '#3B82F6',
    locationLat: -41.1335,
    locationLon: -71.3103,
    city: 'Bariloche',
  }
}

async function getWeather(lat: number, lon: number): Promise<WeatherData | null> {
  try {
    // Simulate API call - replace with OpenWeatherMap later
    return {
      temp: 18,
      condition: 'cloudy',
      icon: '04d',
      description: 'Parcialmente nublado',
      updatedAt: new Date().toISOString(),
    }
  } catch (error) {
    console.error('Weather fetch failed:', error)
    return null
  }
}

async function getRecommendedActivities(weather: WeatherData | null): Promise<Activity[]> {
  const allActivities: Activity[] = [
    {
      id: '1',
      title: 'City Tour Centro Cívico',
      description: 'Recorrido guiado por el centro histórico',
      url: 'https://example.com/city-tour',
      icon: '🚶',
      weatherCondition: 'cloudy',
      priority: 1,
    },
    {
      id: '2',
      title: 'Almorzar en Restaurante Vista',
      description: 'Cocina patagónica con vista al lago',
      url: 'https://example.com/restaurant',
      icon: '🍽️',
      weatherCondition: 'cloudy',
      priority: 2,
    },
    {
      id: '3',
      title: 'Museo de la Patagonia',
      description: 'Historia y cultura regional',
      url: 'https://example.com/museum',
      icon: '🏛️',
      weatherCondition: 'cloudy',
      priority: 3,
    },
    {
      id: '4',
      title: 'Trekking Cerro Campanario',
      description: 'Vista panorámica 360° de la región',
      url: 'https://example.com/trekking',
      icon: '🥾',
      weatherCondition: 'sunny',
      priority: 1,
    },
    {
      id: '5',
      title: 'Playa Bonita',
      description: 'Relax junto al lago Nahuel Huapi',
      url: 'https://example.com/beach',
      icon: '🏖️',
      weatherCondition: 'sunny',
      priority: 2,
    },
    {
      id: '6',
      title: 'Spa & Wellness',
      description: 'Masajes y tratamientos relajantes',
      url: 'https://example.com/spa',
      icon: '💆',
      weatherCondition: 'rainy',
      priority: 1,
    },
    {
      id: '7',
      title: 'Tour de Cervecerías',
      description: 'Degustación de cervezas artesanales',
      url: 'https://example.com/beer-tour',
      icon: '🍺',
      weatherCondition: 'rainy',
      priority: 2,
    },
    {
      id: '8',
      title: 'Esquí Cerro Catedral',
      description: 'Temporada de nieve en el mejor centro',
      url: 'https://example.com/ski',
      icon: '⛷️',
      weatherCondition: 'snowy',
      priority: 1,
    },
  ]

  if (!weather) return allActivities.slice(0, 3)

  return allActivities
    .filter(a => a.weatherCondition === weather.condition)
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 3)
}

async function getHotelLinks(): Promise<Link[]> {
  return [
    {
      id: '1',
      title: 'WiFi Password',
      description: 'Red: VistLago_Guests | Clave: vista2024',
      url: '#',
      icon: '📶',
      category: 'hotel',
    },
    {
      id: '2',
      title: 'Menú del Restaurant',
      description: 'Ver carta completa',
      url: 'https://example.com/menu',
      icon: '🍴',
      category: 'hotel',
    },
    {
      id: '3',
      title: 'Reservar Spa',
      description: 'Turnos disponibles',
      url: 'https://example.com/spa-booking',
      icon: '💆',
      category: 'hotel',
    },
  ]
}

async function getContactLinks(): Promise<Link[]> {
  return [
    {
      id: '1',
      title: 'WhatsApp Hotel',
      description: '+54 294 1234567',
      url: 'https://wa.me/5492941234567',
      icon: '💬',
      category: 'contact',
    },
    {
      id: '2',
      title: 'Email',
      description: 'info@vistlago.com.ar',
      url: 'mailto:info@vistlago.com.ar',
      icon: '📧',
      category: 'contact',
    },
    {
      id: '3',
      title: 'Instagram',
      description: '@hotelvistlago',
      url: 'https://instagram.com/hotelvistlago',
      icon: '📸',
      category: 'contact',
    },
  ]
}

export default async function PortalPage({ 
  params 
}: { 
  params: { hotelSlug: string } 
}) {
  const hotel = await getHotel(params.hotelSlug)
  const weather = await getWeather(hotel.locationLat, hotel.locationLon)
  const activities = await getRecommendedActivities(weather)
  const hotelLinks = await getHotelLinks()
  const contactLinks = await getContactLinks()

  return (
    <main 
      className="min-h-screen bg-gradient-to-b from-gray-50 to-white"
      style={{ 
        '--primary-color': hotel.primaryColor 
      } as React.CSSProperties}
    >
      <div className="max-w-md mx-auto px-4 py-8 space-y-6">
        {/* Hotel Header */}
        <HotelHeader hotel={hotel} />
        
        {/* Weather Widget */}
        <Suspense fallback={<WeatherSkeleton />}>
          {weather && <WeatherWidget weather={weather} />}
        </Suspense>
        
        {/* Recommended Activities */}
        {activities.length > 0 && (
          <RecommendedSection activities={activities} />
        )}
        
        {/* Hotel Services */}
        <LinksSection 
          title="🏨 Servicios del Hotel" 
          links={hotelLinks}
        />
        
        {/* Contact */}
        <LinksSection 
          title="📱 Contacto" 
          links={contactLinks}
        />
        
        {/* Footer */}
        <Footer />
      </div>
    </main>
  )
}

// Generate static params for known hotels (empty for now, will be populated)
export async function generateStaticParams() {
  return [
    { hotelSlug: 'vista-lago' },
  ]
}

// Metadata
export async function generateMetadata({ 
  params 
}: { 
  params: { hotelSlug: string } 
}) {
  const hotel = await getHotel(params.hotelSlug)
  
  return {
    title: `${hotel.name} - Guest Portal`,
    description: `${hotel.name} smart guest portal with weather and personalized recommendations`,
    openGraph: {
      title: hotel.name,
      description: 'Your digital concierge',
      images: [hotel.logoUrl || '/og-image.png'],
    },
  }
}
\`\`\`

### Individual Components

#### 1. HotelHeader Component
\`\`\`tsx
// components/portal/hotel-header.tsx
import Image from 'next/image'
import { Hotel } from '@/types/portal'

export function HotelHeader({ hotel }: { hotel: Hotel }) {
  return (
    <header className="text-center space-y-4">
      {hotel.logoUrl ? (
        <Image
          src={hotel.logoUrl}
          alt={`${hotel.name} logo`}
          width={120}
          height={120}
          className="mx-auto rounded-full object-cover"
          priority
        />
      ) : (
        <div className="w-30 h-30 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
          <span className="text-4xl font-bold text-white">
            {hotel.name.charAt(0)}
          </span>
        </div>
      )}
      <h1 className="text-2xl font-semibold text-gray-900">
        {hotel.name}
      </h1>
    </header>
  )
}
\`\`\`

#### 2. WeatherWidget Component
\`\`\`tsx
// components/portal/weather-widget.tsx
'use client'

import { motion } from 'framer-motion'
import { Cloud, Sun, CloudRain, Snowflake } from 'lucide-react'
import { WeatherData } from '@/types/portal'

const weatherIcons = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  snowy: Snowflake,
}

const weatherGradients = {
  sunny: 'bg-gradient-to-br from-orange-400 to-yellow-300',
  cloudy: 'bg-gradient-to-br from-gray-400 to-gray-300',
  rainy: 'bg-gradient-to-br from-blue-500 to-blue-400',
  snowy: 'bg-gradient-to-br from-blue-200 to-white',
}

export function WeatherWidget({ weather }: { weather: WeatherData }) {
  const Icon = weatherIcons[weather.condition]
  const gradient = weatherGradients[weather.condition]
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`rounded-2xl p-6 ${gradient} shadow-lg`}
    >
      <div className="flex items-center justify-between text-white">
        <div>
          <p className="text-sm font-medium opacity-90">Clima Ahora</p>
          <p className="text-4xl font-bold mt-1">
            {Math.round(weather.temp)}°C
          </p>
          <p className="text-sm mt-1 opacity-90">
            {weather.description}
          </p>
        </div>
        <Icon className="w-16 h-16 opacity-80" strokeWidth={1.5} />
      </div>
      <p className="text-xs text-white/70 mt-4">
        Actualizado: {new Date(weather.updatedAt).toLocaleTimeString('es-AR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })}
      </p>
    </motion.div>
  )
}
\`\`\`

#### 3. WeatherSkeleton Component
\`\`\`tsx
// components/portal/weather-skeleton.tsx
export function WeatherSkeleton() {
  return (
    <div className="rounded-2xl p-6 bg-gray-200 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-3">
          <div className="h-4 w-24 bg-gray-300 rounded" />
          <div className="h-10 w-20 bg-gray-300 rounded" />
          <div className="h-4 w-32 bg-gray-300 rounded" />
        </div>
        <div className="w-16 h-16 bg-gray-300 rounded-full" />
      </div>
    </div>
  )
}
\`\`\`

#### 4. RecommendedSection Component
\`\`\`tsx
// components/portal/recommended-section.tsx
'use client'

import { motion } from 'framer-motion'
import { Activity } from '@/types/portal'
import { LinkCard } from './link-card'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export function RecommendedSection({ activities }: { activities: Activity[] }) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">
          📍 Recomendado Hoy
        </h2>
        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
          Ideal para hoy
        </span>
      </div>
      
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-3"
      >
        {activities.map((activity) => (
          <motion.div key={activity.id} variants={item}>
            <LinkCard
              link={{
                id: activity.id,
                title: activity.title,
                description: activity.description,
                url: activity.url,
                icon: activity.icon,
                category: 'activities',
              }}
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
\`\`\`

#### 5. LinksSection Component
\`\`\`tsx
// components/portal/links-section.tsx
'use client'

import { motion } from 'framer-motion'
import { Link } from '@/types/portal'
import { LinkCard } from './link-card'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export function LinksSection({ 
  title, 
  links 
}: { 
  title: string
  links: Link[] 
}) {
  return (
    <section>
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        {title}
      </h2>
      
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-3"
      >
        {links.map((link) => (
          <motion.div key={link.id} variants={item}>
            <LinkCard link={link} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
\`\`\`

#### 6. LinkCard Component
\`\`\`tsx
// components/portal/link-card.tsx
'use client'

import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { Link } from '@/types/portal'

export function LinkCard({ link }: { link: Link }) {
  const isExternal = link.url.startsWith('http')
  
  return (
    <motion.a
      href={link.url}
      target={isExternal ? '_blank' : '_self'}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow min-h-[44px]"
    >
      <div className="flex items-center gap-3 flex-1">
        <span className="text-2xl flex-shrink-0" aria-hidden="true">
          {link.icon}
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 truncate">
            {link.title}
          </p>
          {link.description && (
            <p className="text-sm text-gray-500 truncate">
              {link.description}
            </p>
          )}
        </div>
      </div>
      {isExternal && (
        <ExternalLink 
          className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" 
          aria-label="Opens in new tab"
        />
      )}
    </motion.a>
  )
}
\`\`\`

#### 7. Footer Component
\`\`\`tsx
// components/portal/footer.tsx
export function Footer() {
  return (
    <footer className="text-center py-6 text-sm text-gray-500">
      <p>Powered by <span className="font-medium text-gray-700">Smart Stay</span></p>
    </footer>
  )
}
\`\`\`

---

## 📦 Required Dependencies

\`\`\`json
{
  "dependencies": {
    "next": "^14.1.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "framer-motion": "^11.0.3",
    "lucide-react": "^0.323.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.1"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10.0.1",
    "postcss": "^8",
    "tailwindcss": "^3.4.0",
    "typescript": "^5"
  }
}
\`\`\`

---

## 🎯 Loading & Error States

### Loading State
\`\`\`tsx
// app/[hotelSlug]/loading.tsx
export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-md mx-auto px-4 py-8 space-y-6">
        {/* Header skeleton */}
        <div className="text-center space-y-4">
          <div className="w-30 h-30 mx-auto rounded-full bg-gray-200 animate-pulse" />
          <div className="h-8 w-48 mx-auto bg-gray-200 rounded animate-pulse" />
        </div>
        
        {/* Weather skeleton */}
        <div className="rounded-2xl p-6 bg-gray-200 animate-pulse h-32" />
        
        {/* Links skeleton */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-gray-200 rounded-xl animate-pulse" />
        ))}
      </div>
    </div>
  )
}
\`\`\`

---

## ✅ Final Checklist

Before considering this complete, verify:

- [ ] All TypeScript interfaces defined in `/types/portal.ts`
- [ ] ISR revalidation set to 1800 seconds
- [ ] All images use Next.js `<Image>` component
- [ ] Weather widget has gradient based on condition
- [ ] All touch targets are minimum 44x44px
- [ ] External links have `rel="noopener noreferrer"`
- [ ] Framer Motion animations don't block initial render
- [ ] Loading skeleton matches final layout
- [ ] Error boundary handles failures gracefully
- [ ] Mobile responsive (375px minimum)
- [ ] No console errors in browser
- [ ] Metadata exports present for SEO

---

## 🚀 Expected Output

Generate a complete, production-ready guest portal that:
1. Loads in under 2 seconds
2. Works perfectly on iPhone 13 (375px width)
3. Has smooth, delightful animations
4. Handles errors gracefully
5. Shows proper loading states
6. Uses TypeScript with no errors
7. Follows all accessibility guidelines (WCAG AA)
8. Can be deployed to Vercel without modifications

The portal should feel native, fast, and professional - exactly what a boutique hotel guest would expect from a modern digital experience.
