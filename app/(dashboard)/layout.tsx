import type React from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar"
import { DashboardProvider } from "@/contexts/dashboard-context"
import { Toaster } from "@/components/ui/toaster"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardProvider>
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
