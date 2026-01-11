# Smart Stay Bariloche - B2B Dashboard

A complete Next.js 14 B2B SaaS dashboard for hotel managers to create and manage guest portals with weather-intelligent activity recommendations.

## Features

- **Dashboard Overview**: Real-time stats, portal preview, and QR code generator
- **Links Manager**: Drag & drop link organization with categories (hotel, activities, contact)
- **Weather Activities**: Configure activity recommendations based on weather conditions
- **Analytics**: Track clicks, visitors, and engagement metrics with charts
- **Branding**: Customize hotel appearance with colors, logos, and messaging
- **Settings**: Manage account preferences and notifications

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Forms**: React Hook Form + Zod validation
- **Drag & Drop**: @dnd-kit
- **Charts**: Recharts
- **State**: React Context API
- **Toast Notifications**: Sonner
- **QR Codes**: qrcode library

## Project Structure

```
app/
├── (dashboard)/           # Dashboard layout group
│   ├── layout.tsx        # Sidebar + topbar wrapper
│   └── dashboard/        # Dashboard pages
│       ├── page.tsx      # Home/overview
│       ├── links/        # Links manager
│       ├── activities/   # Weather activities
│       ├── analytics/    # Analytics & charts
│       ├── branding/     # Hotel customization
│       └── settings/     # Account settings
components/
├── dashboard/            # Dashboard-specific components
│   ├── dashboard-sidebar.tsx
│   ├── dashboard-topbar.tsx
│   ├── stats-card.tsx
│   ├── qr-generator.tsx
│   ├── sortable-link-item.tsx
│   ├── link-form-dialog.tsx
│   ├── activity-card.tsx
│   └── activity-form-dialog.tsx
└── ui/                   # shadcn/ui components
contexts/
└── dashboard-context.tsx # Global state management
lib/
├── validations.ts        # Zod schemas
├── mock-data.ts          # Sample data
└── utils.ts              # Utilities
types/
├── dashboard.ts          # TypeScript interfaces
└── qrcode.d.ts           # Type definitions
```

## Getting Started

### Prerequisites

- Node.js >= 18.17.0
- npm >= 9.0.0

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type check
npm run type-check
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Key Features Implementation

### Drag & Drop Links
Uses @dnd-kit for accessible, touch-friendly drag and drop reordering of links within categories.

### Weather-Based Activities
Activities are tagged with weather conditions (sunny, cloudy, rainy, snowy) and automatically shown to guests based on current weather.

### Real-time Analytics
Track portal engagement with:
- Total clicks and unique visitors
- Click trends over time
- Top performing links
- Weather-based activity engagement

### Customizable Branding
Hotel managers can customize:
- Primary brand color
- Logo and welcome message
- Contact information
- Portal description

### Form Validation
All forms use React Hook Form with Zod schemas for:
- Type-safe validation
- Real-time error messages
- Accessibility support

## Design System

- **Color Palette**: Professional blue-gray scheme for B2B applications
- **Typography**: Inter font family with Geist Sans fallback
- **Components**: shadcn/ui component library
- **Responsive**: Mobile-first design (375px+)
- **Accessibility**: WCAG compliant with proper ARIA labels

## State Management

Uses React Context API for global state:
- Hotel settings and branding
- User profile information
- Links and activities data
- CRUD operations with optimistic updates

## Development Notes

- TypeScript strict mode enabled
- All components are fully typed
- Server components by default, client components only when needed
- Mock data provided for development (replace with API calls)
- Toast notifications for user feedback
- Loading states and error handling implemented

## Future Enhancements

- [ ] Connect to real backend API
- [ ] Implement authentication (Supabase/Auth.js)
- [ ] Real-time weather API integration
- [ ] Export analytics reports
- [ ] Multi-language support
- [ ] Custom domain for guest portals
- [ ] Advanced role-based permissions

## License

Private - Smart Stay Bariloche

## Support

For questions or support, contact: info@smartstaybariloche.com
