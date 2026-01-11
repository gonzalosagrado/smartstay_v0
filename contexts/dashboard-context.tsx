"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import type { Hotel, Link, Activity, User } from "@/types/dashboard"
import { mockHotel, mockLinks, mockActivities, mockUser } from "@/lib/mock-data"

interface DashboardContextType {
  hotel: Hotel
  user: User
  links: Link[]
  activities: Activity[]
  updateHotel: (hotel: Partial<Hotel>) => void
  addLink: (link: Omit<Link, "id" | "createdAt" | "order">) => void
  updateLink: (id: string, link: Partial<Link>) => void
  deleteLink: (id: string) => void
  reorderLinks: (links: Link[]) => void
  addActivity: (activity: Omit<Activity, "id" | "createdAt">) => void
  updateActivity: (id: string, activity: Partial<Activity>) => void
  deleteActivity: (id: string) => void
  updateUser: (user: Partial<User>) => void
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [hotel, setHotel] = useState<Hotel>(mockHotel)
  const [user, setUser] = useState<User>(mockUser)
  const [links, setLinks] = useState<Link[]>(mockLinks)
  const [activities, setActivities] = useState<Activity[]>(mockActivities)

  const updateHotel = useCallback((updates: Partial<Hotel>) => {
    setHotel((prev) => ({ ...prev, ...updates, updatedAt: new Date() }))
  }, [])

  const addLink = useCallback((newLink: Omit<Link, "id" | "createdAt" | "order">) => {
    setLinks((prev) => {
      const maxOrder = Math.max(...prev.map((l) => l.order), 0)
      return [
        ...prev,
        {
          ...newLink,
          id: `${Date.now()}`,
          order: maxOrder + 1,
          createdAt: new Date(),
        },
      ]
    })
  }, [])

  const updateLink = useCallback((id: string, updates: Partial<Link>) => {
    setLinks((prev) => prev.map((link) => (link.id === id ? { ...link, ...updates } : link)))
  }, [])

  const deleteLink = useCallback((id: string) => {
    setLinks((prev) => prev.filter((link) => link.id !== id))
  }, [])

  const reorderLinks = useCallback((newLinks: Link[]) => {
    const reordered = newLinks.map((link, index) => ({ ...link, order: index + 1 }))
    setLinks(reordered)
  }, [])

  const addActivity = useCallback((newActivity: Omit<Activity, "id" | "createdAt">) => {
    setActivities((prev) => [
      ...prev,
      {
        ...newActivity,
        id: `${Date.now()}`,
        createdAt: new Date(),
      },
    ])
  }, [])

  const updateActivity = useCallback((id: string, updates: Partial<Activity>) => {
    setActivities((prev) => prev.map((activity) => (activity.id === id ? { ...activity, ...updates } : activity)))
  }, [])

  const deleteActivity = useCallback((id: string) => {
    setActivities((prev) => prev.filter((activity) => activity.id !== id))
  }, [])

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser((prev) => ({ ...prev, ...updates }))
  }, [])

  return (
    <DashboardContext.Provider
      value={{
        hotel,
        user,
        links,
        activities,
        updateHotel,
        addLink,
        updateLink,
        deleteLink,
        reorderLinks,
        addActivity,
        updateActivity,
        deleteActivity,
        updateUser,
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (!context) {
    throw new Error("useDashboard must be used within DashboardProvider")
  }
  return context
}
