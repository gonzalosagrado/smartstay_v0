import type { Hotel, Link, Activity, AnalyticsData, DashboardStats, User } from "@/types/dashboard"

// Mock hotel data
export const mockHotel: Hotel = {
  id: "1",
  name: "Smart Stay Bariloche",
  primaryColor: "#3B82F6",
  logo: null,
  address: "Av. Bustillo Km 10, Bariloche, Argentina",
  phone: "+54 294 123 4567",
  email: "info@smartstaybariloche.com",
  description: "Premium lakeside hotel in the heart of Patagonia",
  welcomeMessage: "Welcome to Smart Stay Bariloche! Discover the best of Patagonia.",
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date(),
}

// Mock user data
export const mockUser: User = {
  id: "1",
  name: "Carlos Rodriguez",
  email: "carlos@smartstaybariloche.com",
  avatar: "/placeholder.svg?height=40&width=40",
  role: "owner",
}

// Mock links data
export const mockLinks: Link[] = [
  {
    id: "1",
    title: "WiFi Password",
    url: "https://smartstay.com/wifi",
    description: "Get your room WiFi credentials",
    icon: "Wifi",
    category: "hotel",
    order: 1,
    isActive: true,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    title: "Room Service Menu",
    url: "https://smartstay.com/menu",
    description: "Order food to your room 24/7",
    icon: "UtensilsCrossed",
    category: "hotel",
    order: 2,
    isActive: true,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "3",
    title: "Spa & Wellness",
    url: "https://smartstay.com/spa",
    description: "Book spa treatments and massages",
    icon: "Sparkles",
    category: "hotel",
    order: 3,
    isActive: true,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "4",
    title: "Ski Rentals",
    url: "https://smartstay.com/ski-rentals",
    description: "Rent equipment for winter sports",
    icon: "Mountain",
    category: "activities",
    order: 4,
    isActive: true,
    createdAt: new Date("2024-01-16"),
  },
  {
    id: "5",
    title: "Hiking Trails",
    url: "https://smartstay.com/hiking",
    description: "Explore nearby trails and paths",
    icon: "Trees",
    category: "activities",
    order: 5,
    isActive: true,
    createdAt: new Date("2024-01-16"),
  },
  {
    id: "6",
    title: "Lake Tours",
    url: "https://smartstay.com/lake-tours",
    description: "Boat tours on Nahuel Huapi Lake",
    icon: "Ship",
    category: "activities",
    order: 6,
    isActive: true,
    createdAt: new Date("2024-01-16"),
  },
  {
    id: "7",
    title: "Emergency Contact",
    url: "tel:+542941234567",
    description: "24/7 emergency assistance",
    icon: "Phone",
    category: "contact",
    order: 7,
    isActive: true,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "8",
    title: "Concierge",
    url: "https://smartstay.com/concierge",
    description: "Chat with our concierge team",
    icon: "MessageCircle",
    category: "contact",
    order: 8,
    isActive: true,
    createdAt: new Date("2024-01-15"),
  },
]

// Mock activities data
export const mockActivities: Activity[] = [
  {
    id: "1",
    title: "Cerro Catedral Skiing",
    description: "World-class skiing at South America's premier ski resort",
    imageUrl: "/placeholder.svg?height=200&width=300",
    weatherCondition: "snowy",
    priority: 1,
    isActive: true,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    title: "Lake Nahuel Huapi Kayaking",
    description: "Explore crystal-clear waters surrounded by mountains",
    imageUrl: "/placeholder.svg?height=200&width=300",
    weatherCondition: "sunny",
    priority: 1,
    isActive: true,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "3",
    title: "Patagonian Trekking",
    description: "Guided hikes through stunning mountain landscapes",
    imageUrl: "/placeholder.svg?height=200&width=300",
    weatherCondition: "cloudy",
    priority: 2,
    isActive: true,
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "4",
    title: "Indoor Wine Tasting",
    description: "Sample the finest Patagonian wines in our wine cellar",
    imageUrl: "/placeholder.svg?height=200&width=300",
    weatherCondition: "rainy",
    priority: 1,
    isActive: true,
    createdAt: new Date("2024-01-15"),
  },
]

// Mock dashboard stats
export const mockDashboardStats: DashboardStats = {
  totalLinks: 8,
  activeLinks: 8,
  totalActivities: 4,
  weeklyClicks: 1247,
  clickTrend: 12.5,
  visitorTrend: 8.3,
}

// Mock analytics data
export const mockAnalyticsData: AnalyticsData = {
  totalClicks: 5432,
  uniqueVisitors: 1823,
  topLinks: [
    { linkId: "1", title: "WiFi Password", clicks: 856 },
    { linkId: "2", title: "Room Service Menu", clicks: 743 },
    { linkId: "4", title: "Ski Rentals", clicks: 621 },
    { linkId: "5", title: "Hiking Trails", clicks: 512 },
    { linkId: "3", title: "Spa & Wellness", clicks: 498 },
  ],
  clicksByDay: [
    { date: "2024-01-01", clicks: 145 },
    { date: "2024-01-02", clicks: 178 },
    { date: "2024-01-03", clicks: 203 },
    { date: "2024-01-04", clicks: 187 },
    { date: "2024-01-05", clicks: 210 },
    { date: "2024-01-06", clicks: 234 },
    { date: "2024-01-07", clicks: 198 },
  ],
  clicksByWeather: [
    { condition: "sunny", clicks: 1876 },
    { condition: "snowy", clicks: 1543 },
    { condition: "cloudy", clicks: 1234 },
    { condition: "rainy", clicks: 779 },
  ],
}
