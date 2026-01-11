# Smart Stay Bariloche - Hotel Dashboard (B2B)

## Project Overview
Create a modern B2B SaaS dashboard for hotel managers to create and manage their guest portals. Think Linktree admin meets Notion's simplicity with Stripe's reliability.

---

## ⚠️ CRITICAL TECHNICAL REQUIREMENTS

### Next.js Configuration
- Use Next.js 14+ with App Router
- File structure: `app/(dashboard)/[page]/page.tsx`
- Use layout groups for consistent navigation
- Server Components by default, "use client" only when necessary

### TypeScript Setup
All components must have explicit types:

\`\`\`typescript
// types/dashboard.ts
export interface Hotel {
  id: string
  userId: string
  name: string
  slug: string
  logoUrl: string | null
  primaryColor: string
  locationLat: number
  locationLon: number
  city: string
  subscriptionStatus: 'trial' | 'active' | 'cancelled'
  trialEndsAt: string | null
  createdAt: string
}

export interface Link {
  id: string
  hotelId: string
  title: string
  url: string
  icon: string
  category: 'hotel' | 'activities' | 'contact'
  orderPosition: number
  isActive: boolean
}

export interface WeatherActivity {
  id: string
  hotelId: string
  title: string
  description: string
  url: string
  icon: string
  weatherCondition: 'sunny' | 'cloudy' | 'rainy' | 'snowy'
  priority: number
  isDefault: boolean
}

export interface AnalyticsData {
  totalClicksToday: number
  totalClicksWeek: number
  mostClickedLink: {
    title: string
    clicks: number
  } | null
  activeLinksCount: number
  clicksByHour: { hour: number; clicks: number }[]
}
\`\`\`

### Form Validation
Use React Hook Form + Zod for all forms:

\`\`\`typescript
// lib/validations.ts
import * as z from 'zod'

export const linkSchema = z.object({
  title: z.string().min(1, 'El título es requerido').max(50, 'Máximo 50 caracteres'),
  url: z.string().url('URL inválida').or(z.literal('#')),
  icon: z.string().min(1, 'Selecciona un ícono'),
  category: z.enum(['hotel', 'activities', 'contact']),
  isActive: z.boolean().default(true),
})

export const activitySchema = z.object({
  title: z.string().min(1, 'El título es requerido').max(80, 'Máximo 80 caracteres'),
  description: z.string().max(120, 'Máximo 120 caracteres').optional(),
  url: z.string().url('URL inválida'),
  icon: z.string().min(1, 'Selecciona un ícono'),
  weatherCondition: z.enum(['sunny', 'cloudy', 'rainy', 'snowy']),
  priority: z.number().min(1).max(10),
})

export const brandingSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(50),
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Color hexadecimal inválido'),
  city: z.string().min(1, 'Selecciona una ciudad'),
})

export type LinkFormData = z.infer<typeof linkSchema>
export type ActivityFormData = z.infer<typeof activitySchema>
export type BrandingFormData = z.infer<typeof brandingSchema>
\`\`\`

### State Management
Use React Context for global dashboard state:

\`\`\`typescript
// contexts/dashboard-context.tsx
'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { Hotel } from '@/types/dashboard'

interface DashboardContextType {
  hotel: Hotel | null
  setHotel: (hotel: Hotel) => void
  isSaving: boolean
  setIsSaving: (saving: boolean) => void
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export function DashboardProvider({ children, initialHotel }: { 
  children: ReactNode
  initialHotel: Hotel | null 
}) {
  const [hotel, setHotel] = useState<Hotel | null>(initialHotel)
  const [isSaving, setIsSaving] = useState(false)

  return (
    <DashboardContext.Provider value={{ hotel, setHotel, isSaving, setIsSaving }}>
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider')
  }
  return context
}
\`\`\`

### Drag & Drop Setup
Use @dnd-kit for link reordering:

\`\`\`typescript
// components/dashboard/sortable-link-list.tsx
'use client'

import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import { useState } from 'react'
import { Link } from '@/types/dashboard'

export function SortableLinkList({ 
  links, 
  onReorder 
}: { 
  links: Link[]
  onReorder: (links: Link[]) => void 
}) {
  const [items, setItems] = useState(links)
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function handleDragEnd(event: any) {
    const { active, over } = event

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id)
        const newIndex = items.findIndex((i) => i.id === over.id)
        const newItems = arrayMove(items, oldIndex, newIndex)
        onReorder(newItems)
        return newItems
      })
    }
  }

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext 
        items={items.map(i => i.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {items.map((link) => (
            <SortableLinkItem key={link.id} link={link} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}

function SortableLinkItem({ link }: { link: Link }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: link.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200"
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing touch-none"
      >
        <GripVertical className="w-5 h-5 text-gray-400" />
      </button>
      {/* Rest of link item UI */}
      <span className="text-xl">{link.icon}</span>
      <div className="flex-1">
        <p className="font-medium">{link.title}</p>
        <p className="text-sm text-gray-500 truncate">{link.url}</p>
      </div>
    </div>
  )
}
\`\`\`

---

## 🎨 Design Requirements

### Aesthetic Direction
- **Tone**: Professional, trustworthy, efficient
- **Inspiration**: Stripe dashboard + Notion simplicity
- **Typography**: Inter font family
  - Headers: text-2xl font-semibold
  - Subheaders: text-lg font-medium
  - Body: text-base
  - Small text: text-sm text-gray-600
- **Colors**: 
  \`\`\`css
  :root {
    --primary: 217 91% 60%;          /* #3B82F6 */
    --primary-foreground: 0 0% 100%;
    --secondary: 215 25% 27%;        /* #2D3748 */
    --muted: 220 13% 91%;            /* #E5E7EB */
    --border: 214 32% 91%;           /* #E5E7EB */
    --success: 142 71% 45%;          /* #10B981 */
    --destructive: 0 72% 51%;        /* #EF4444 */
  }
  \`\`\`

### Layout Structure

#### Desktop Layout (>768px)
\`\`\`
┌────────────────────────────────────────────────────┐
│ Sidebar (64) │  Top Bar                            │
│              ├─────────────────────────────────────┤
│ Dashboard    │                                     │
│ Links        │  Main Content Area                  │
│ Activities   │                                     │
│ Analytics    │                                     │
│ Branding     │                                     │
│ Settings     │                                     │
│              │                                     │
└──────────────┴─────────────────────────────────────┘
\`\`\`

#### Mobile Layout (<768px)
\`\`\`
┌────────────────────────────┐
│ Top Bar with Menu Button   │
├────────────────────────────┤
│                            │
│   Main Content Area        │
│                            │
│                            │
├────────────────────────────┤
│ Bottom Navigation Bar      │
└────────────────────────────┘
\`\`\`

---

## 📂 File Structure

\`\`\`
app/
├── (auth)/
│   ├── login/
│   │   └── page.tsx
│   └── layout.tsx
├── (dashboard)/
│   ├── layout.tsx (sidebar + topbar)
│   ├── dashboard/
│   │   └── page.tsx
│   ├── links/
│   │   └── page.tsx
│   ├── activities/
│   │   └── page.tsx
│   ├── analytics/
│   │   └── page.tsx
│   ├── branding/
│   │   └── page.tsx
│   └── settings/
│       └── page.tsx
├── api/
│   ├── links/
│   │   └── route.ts
│   └── activities/
│       └── route.ts
components/
├── dashboard/
│   ├── sidebar.tsx
│   ├── topbar.tsx
│   ├── stats-card.tsx
│   ├── link-form.tsx
│   ├── link-item.tsx
│   ├── sortable-link-list.tsx
│   ├── activity-form.tsx
│   ├── qr-generator.tsx
│   └── portal-preview.tsx
├── ui/ (shadcn components)
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── select.tsx
│   ├── switch.tsx
│   ├── dialog.tsx
│   ├── tabs.tsx
│   └── ...
contexts/
├── dashboard-context.tsx
lib/
├── utils.ts
├── validations.ts
types/
├── dashboard.ts
\`\`\`

---

## 🧩 Component Implementation

### Dashboard Layout
\`\`\`tsx
// app/(dashboard)/layout.tsx
import { Sidebar } from '@/components/dashboard/sidebar'
import { Topbar } from '@/components/dashboard/topbar'
import { DashboardProvider } from '@/contexts/dashboard-context'

// Mock data fetching
async function getHotel() {
  return {
    id: '1',
    userId: '1',
    name: 'Hotel Vista Lago',
    slug: 'vista-lago',
    logoUrl: null,
    primaryColor: '#3B82F6',
    locationLat: -41.1335,
    locationLon: -71.3103,
    city: 'Bariloche',
    subscriptionStatus: 'trial' as const,
    trialEndsAt: '2026-01-25T00:00:00Z',
    createdAt: '2026-01-11T00:00:00Z',
  }
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const hotel = await getHotel()

  return (
    <DashboardProvider initialHotel={hotel}>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar - Hidden on mobile */}
        <aside className="hidden md:flex md:w-64 md:flex-col">
          <Sidebar />
        </aside>

        {/* Main Content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-y-auto">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </DashboardProvider>
  )
}
\`\`\`

### Sidebar Component
\`\`\`tsx
// components/dashboard/sidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Link2, 
  CloudSun, 
  BarChart3, 
  Palette, 
  Settings 
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/links', label: 'Links', icon: Link2 },
  { href: '/activities', label: 'Actividades', icon: CloudSun },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/branding', label: 'Branding', icon: Palette },
  { href: '/settings', label: 'Configuración', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full bg-secondary text-white">
      {/* Logo */}
      <div className="p-6">
        <h1 className="text-xl font-bold">Smart Stay</h1>
        <p className="text-sm text-gray-400 mt-1">Hotel Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                isActive 
                  ? 'bg-primary text-white' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <p className="text-xs text-gray-400">v1.0.0</p>
      </div>
    </div>
  )
}
\`\`\`

### Topbar Component
\`\`\`tsx
// components/dashboard/topbar.tsx
'use client'

import { Menu, Bell, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useDashboard } from '@/contexts/dashboard-context'

export function Topbar() {
  const { hotel } = useDashboard()

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="flex h-16 items-center justify-between px-4">
        {/* Left side */}
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>

          {/* Hotel name */}
          <div>
            <h2 className="font-semibold text-gray-900">{hotel?.name}</h2>
            <p className="text-xs text-gray-500">
              {hotel?.subscriptionStatus === 'trial' ? '14 días de prueba' : 'Plan Pro'}
            </p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Perfil</DropdownMenuItem>
              <DropdownMenuItem>Facturación</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Cerrar sesión</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
\`\`\`

### Dashboard Page (Home)
\`\`\`tsx
// app/(dashboard)/dashboard/page.tsx
import { Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart, ExternalLink, QrCode, TrendingUp } from 'lucide-react'
import { StatsCard } from '@/components/dashboard/stats-card'
import { PortalPreview } from '@/components/dashboard/portal-preview'
import { QRGenerator } from '@/components/dashboard/qr-generator'

async function getAnalytics() {
  // Mock data
  return {
    totalClicksToday: 247,
    totalClicksWeek: 1834,
    mostClickedLink: {
      title: 'WiFi Password',
      clicks: 89,
    },
    activeLinksCount: 12,
  }
}

export default async function DashboardPage() {
  const analytics = await getAnalytics()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Resumen de tu portal de huéspedes
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Clicks Hoy"
          value={analytics.totalClicksToday.toString()}
          description="+12% vs. ayer"
          icon={BarChart}
        />
        <StatsCard
          title="Clicks Semana"
          value={analytics.totalClicksWeek.toString()}
          description="+28% vs. semana pasada"
          icon={TrendingUp}
        />
        <StatsCard
          title="Link Más Clickeado"
          value={analytics.mostClickedLink?.title || 'N/A'}
          description={`${analytics.mostClickedLink?.clicks || 0} clicks`}
          icon={ExternalLink}
        />
        <StatsCard
          title="Links Activos"
          value={analytics.activeLinksCount.toString()}
          description="De 15 totales"
          icon={QrCode}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Portal Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Vista Previa del Portal</CardTitle>
            <CardDescription>
              Así verán tu portal tus huéspedes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PortalPreview />
            <Button className="w-full mt-4" variant="outline">
              <ExternalLink className="w-4 h-4 mr-2" />
              Ver Portal en Vivo
            </Button>
          </CardContent>
        </Card>

        {/* QR Generator */}
        <Card>
          <CardHeader>
            <CardTitle>Código QR</CardTitle>
            <CardDescription>
              Descarga tu QR para imprimir en las habitaciones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <QRGenerator url="https://smartstay.app/vista-lago" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
\`\`\`

### Links Manager Page
\`\`\`tsx
// app/(dashboard)/links/page.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Save } from 'lucide-react'
import { SortableLinkList } from '@/components/dashboard/sortable-link-list'
import { LinkForm } from '@/components/dashboard/link-form'
import { Link } from '@/types/dashboard'
import { useDashboard } from '@/contexts/dashboard-context'
import { toast } from 'sonner'

const mockLinks: Link[] = [
  {
    id: '1',
    hotelId: '1',
    title: 'WiFi Password: vista2024',
    url: '#',
    icon: '📶',
    category: 'hotel',
    orderPosition: 0,
    isActive: true,
  },
  {
    id: '2',
    hotelId: '1',
    title: 'Menú del Restaurant',
    url: 'https://example.com/menu',
    icon: '🍴',
    category: 'hotel',
    orderPosition: 1,
    isActive: true,
  },
  {
    id: '3',
    hotelId: '1',
    title: 'WhatsApp Hotel',
    url: 'https://wa.me/5492941234567',
    icon: '💬',
    category: 'contact',
    orderPosition: 0,
    isActive: true,
  },
]

export default function LinksPage() {
  const [links, setLinks] = useState(mockLinks)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const { isSaving, setIsSaving } = useDashboard()

  const hotelLinks = links.filter(l => l.category === 'hotel')
  const activityLinks = links.filter(l => l.category === 'activities')
  const contactLinks = links.filter(l => l.category === 'contact')

  function handleReorder(category: string, reorderedLinks: Link[]) {
    const otherLinks = links.filter(l => l.category !== category)
    setLinks([...otherLinks, ...reorderedLinks])
  }

  async function handleSave() {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    toast.success('Links guardados correctamente')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Links</h1>
          <p className="text-muted-foreground mt-2">
            Organiza los enlaces que verán tus huéspedes
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Link
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="hotel" className="space-y-6">
        <TabsList>
          <TabsTrigger value="hotel">🏨 Hotel ({hotelLinks.length})</TabsTrigger>
          <TabsTrigger value="activities">🎯 Actividades ({activityLinks.length})</TabsTrigger>
          <TabsTrigger value="contact">📱 Contacto ({contactLinks.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="hotel" className="space-y-4">
          <SortableLinkList 
            links={hotelLinks}
            onReorder={(links) => handleReorder('hotel', links)}
          />
        </TabsContent>

        <TabsContent value="activities" className="space-y-4">
          <SortableLinkList 
            links={activityLinks}
            onReorder={(links) => handleReorder('activities', links)}
          />
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <SortableLinkList 
            links={contactLinks}
            onReorder={(links) => handleReorder('contact', links)}
          />
        </TabsContent>
      </Tabs>

      {/* Floating Save Button */}
      <div className="fixed bottom-6 right-6">
        <Button size="lg" onClick={handleSave} disabled={isSaving}>
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>

      {/* Link Form Dialog */}
      <LinkForm 
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={(data) => {
          console.log('New link:', data)
          setIsFormOpen(false)
          toast.success('Link creado')
        }}
      />
    </div>
  )
}
\`\`\`

### Weather Activities Page
\`\`\`tsx
// app/(dashboard)/activities/page.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus } from 'lucide-react'
import { WeatherActivity } from '@/types/dashboard'

const weatherConditions = [
  { value: 'sunny', label: 'Soleado', emoji: '☀️' },
  { value: 'cloudy', label: 'Nublado', emoji: '☁️' },
  { value: 'rainy', label: 'Lluvia', emoji: '🌧️' },
  { value: 'snowy', label: 'Nieve', emoji: '❄️' },
] as const

const mockActivities: WeatherActivity[] = [
  {
    id: '1',
    hotelId: '1',
    title: 'Trekking Cerro Campanario',
    description: 'Vista panorámica 360°',
    url: 'https://example.com/trekking',
    icon: '🥾',
    weatherCondition: 'sunny',
    priority: 1,
    isDefault: true,
  },
  {
    id: '2',
    hotelId: '1',
    title: 'City Tour Centro Cívico',
    description: 'Recorrido guiado',
    url: 'https://example.com/tour',
    icon: '🚶',
    weatherCondition: 'cloudy',
    priority: 1,
    isDefault: true,
  },
]

export default function ActivitiesPage() {
  const [selectedCondition, setSelectedCondition] = useState<string>('sunny')
  const [activities] = useState(mockActivities)

  const filteredActivities = activities.filter(
    a => a.weatherCondition === selectedCondition
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Actividades por Clima</h1>
        <p className="text-muted-foreground mt-2">
          Configura recomendaciones automáticas según el clima
        </p>
      </div>

      {/* Weather Condition Selector */}
      <div className="flex gap-2 flex-wrap">
        {weatherConditions.map((condition) => (
          <Button
            key={condition.value}
            variant={selectedCondition === condition.value ? 'default' : 'outline'}
            onClick={() => setSelectedCondition(condition.value)}
          >
            <span className="mr-2">{condition.emoji}</span>
            {condition.label}
          </Button>
        ))}
      </div>

      {/* Activities List */}
      <div className="space-y-4">
        {filteredActivities.length > 0 ? (
          filteredActivities.map((activity) => (
            <Card key={activity.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <span className="text-2xl">{activity.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{activity.title}</h3>
                      {activity.isDefault && (
                        <Badge variant="secondary" className="text-xs">
                          Por Defecto
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        Prioridad {activity.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.url}
                    </p>
                  </div>
                </div>
                {!activity.isDefault && (
                  <Button variant="ghost" size="sm">
                    Editar
                  </Button>
                )}
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">
              No hay actividades configuradas para {weatherConditions.find(c => c.value === selectedCondition)?.label}
            </p>
            <Button className="mt-4">
              <Plus className="w-4 h-4 mr-2" />
              Agregar Primera Actividad
            </Button>
          </Card>
        )}
      </div>

      {/* Add Button */}
      {filteredActivities.length > 0 && (
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Agregar Actividad
        </Button>
      )}
    </div>
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
    "@radix-ui/react-accordion": "^1.1.2",
    "@radix-ui/react-avatar": "^1.0.4",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-switch": "^1.0.3",
    "@radix-ui/react-tabs": "^1.0.4",
    "@dnd-kit/core": "^6.1.0",
    "@dnd-kit/sortable": "^8.0.0",
    "@dnd-kit/utilities": "^3.2.2",
    "react-hook-form": "^7.50.1",
    "@hookform/resolvers": "^3.3.4",
    "zod": "^3.22.4",
    "lucide-react": "^0.323.0",
    "sonner": "^1.3.1",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.1",
    "tailwindcss-animate": "^1.0.7"
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

## ✅ Final Checklist

- [ ] All TypeScript interfaces in `/types/dashboard.ts`
- [ ] Form validation with Zod schemas
- [ ] Drag & drop working with @dnd-kit
- [ ] Context API for global state
- [ ] All shadcn/ui components installed
- [ ] Mobile responsive sidebar (collapsible)
- [ ] Loading states for async operations
- [ ] Toast notifications with Sonner
- [ ] Error boundaries present
- [ ] No console errors
- [ ] TypeScript strict mode passes

---

## 🚀 Expected Output

Generate a complete, production-ready dashboard that hotel managers can use to configure their guest portals. The interface should be intuitive, professional, and handle all edge cases gracefully.
