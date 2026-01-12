import type React from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar"
import { DashboardProvider } from "@/contexts/dashboard-context"
import { Toaster } from "@/components/ui/toaster"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  if (!authUser) {
    redirect("/login")
  }

  // Fetch hotel data
  const { data: hotelData } = await supabase.from("hotels").select("*").eq("user_id", authUser.id).single()

  // Map to Dashboard User type
  const dashboardUser = {
    id: authUser.id,
    name: authUser.user_metadata?.full_name || authUser.email?.split("@")[0] || "User",
    email: authUser.email!,
    role: "owner" as const,
    avatar: authUser.user_metadata?.avatar_url,
  }

  // Map to Dashboard Hotel type (if exists)
  const dashboardHotel = hotelData
    ? {
      id: hotelData.id,
      name: hotelData.name,
      primaryColor: hotelData.primary_color,
      logo: hotelData.logo,
      address: hotelData.address || "",
      phone: hotelData.phone || "",
      email: hotelData.email || "",
      description: hotelData.description || "",
      welcomeMessage: hotelData.welcome_message || "",
      createdAt: new Date(hotelData.created_at),
      updatedAt: new Date(hotelData.updated_at),
    }
    : null

  return (
    <DashboardProvider initialUser={dashboardUser} initialHotel={dashboardHotel}>
      <SidebarProvider defaultOpen>
        <DashboardSidebar />
        <SidebarInset>
          <DashboardTopbar />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
      <Toaster />
    </DashboardProvider>
  )
}
