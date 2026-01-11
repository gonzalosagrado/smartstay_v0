// Core dashboard types for Smart Stay Bariloche B2B platform

export interface Hotel {
  id: string
  name: string
  primaryColor: string
  logo: string | null
  address: string
  phone: string
  email: string
  description: string
  welcomeMessage: string
  createdAt: Date
  updatedAt: Date
}

export interface Link {
  id: string
  title: string
  url: string
  description?: string
  icon?: string
  category: "hotel" | "activities" | "contact"
  order: number
  isActive: boolean
  createdAt: Date
}

export interface Activity {
  id: string
  title: string
  description: string
  imageUrl: string
  weatherCondition: WeatherCondition
  priority: number
  isActive: boolean
  createdAt: Date
}

export type WeatherCondition = "sunny" | "cloudy" | "rainy" | "snowy"

export interface AnalyticsData {
  totalClicks: number
  uniqueVisitors: number
  topLinks: Array<{ linkId: string; title: string; clicks: number }>
  clicksByDay: Array<{ date: string; clicks: number }>
  clicksByWeather: Array<{ condition: WeatherCondition; clicks: number }>
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: "owner" | "manager" | "staff"
}

export interface DashboardStats {
  totalLinks: number
  activeLinks: number
  totalActivities: number
  weeklyClicks: number
  clickTrend: number
  visitorTrend: number
}
