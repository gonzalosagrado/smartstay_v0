"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import type { Hotel, Link, Activity, User } from "@/types/dashboard"
import { mockHotel, mockLinks, mockActivities } from "@/lib/mock-data"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

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

export function DashboardProvider({
  children,
  initialUser,
  initialHotel,
  initialLinks,
  initialActivities,
}: {
  children: React.ReactNode
  initialUser: User
  initialHotel: Hotel | null
  initialLinks: Link[]
  initialActivities: Activity[]
}) {
  const [hotel, setHotel] = useState<Hotel>(initialHotel || mockHotel)
  const [user, setUser] = useState<User>(initialUser)
  const [links, setLinks] = useState<Link[]>(initialLinks)
  const [activities, setActivities] = useState<Activity[]>(initialActivities)
  const supabase = createClient()

  const updateHotel = useCallback((updates: Partial<Hotel>) => {
    // In a real app we would persist this too
    setHotel((prev) => ({ ...prev, ...updates, updatedAt: new Date() }))
  }, [])

  const addLink = useCallback(async (newLink: Omit<Link, "id" | "createdAt" | "order">) => {
    // 1. Optimistic Update
    const tempId = `temp-${Date.now()}`
    const maxOrder = Math.max(...links.map((l) => l.order || 0), 0)
    const optimisticLink = { ...newLink, id: tempId, order: maxOrder + 1, createdAt: new Date() }

    setLinks((prev) => [...prev, optimisticLink])

    // 2. Real Update
    if (!hotel?.id) {
      toast.error("Please create a hotel first")
      return
    }

    const { data, error } = await supabase.from('links').insert({
      hotel_id: hotel.id,
      title: newLink.title,
      url: newLink.url,
      description: newLink.description,
      icon: newLink.icon,
      category: newLink.category,
      order_index: maxOrder + 1,
      is_active: true
    }).select().single()

    if (error) {
      setLinks(prev => prev.filter(l => l.id !== tempId))
      toast.error("Failed to add link")
      console.error(error)
      return
    }

    // Replace optimistic ID with real ID
    setLinks(prev => prev.map(l => l.id === tempId ? { ...l, id: data.id } : l))
    toast.success("Link added successfully")

  }, [links, hotel?.id, supabase])

  const updateLink = useCallback(async (id: string, updates: Partial<Link>) => {
    // Optimistic
    setLinks((prev) => prev.map((link) => (link.id === id ? { ...link, ...updates } : link)))

    const { error } = await supabase.from('links').update({
      title: updates.title,
      url: updates.url,
      description: updates.description,
      icon: updates.icon,
      category: updates.category,
      is_active: updates.isActive
    }).eq('id', id)

    if (error) {
      toast.error("Failed to update link")
    }
  }, [supabase])

  const deleteLink = useCallback(async (id: string) => {
    // Optimistic
    const previousLinks = links;
    setLinks((prev) => prev.filter((link) => link.id !== id))

    const { error } = await supabase.from('links').delete().eq('id', id)

    if (error) {
      setLinks(previousLinks)
      toast.error("Failed to delete link")
    } else {
      toast.success("Link deleted")
    }
  }, [links, supabase])

  const reorderLinks = useCallback(async (newLinks: Link[]) => {
    // Optimistic
    const reordered = newLinks.map((link, index) => ({ ...link, order: index + 1 }))
    setLinks(reordered)

    for (const link of reordered) {
      await supabase.from('links').update({ order_index: link.order }).eq('id', link.id)
    }
  }, [supabase])

  // Mock implementation for activities for now, to avoid scope creep, but using local state
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
