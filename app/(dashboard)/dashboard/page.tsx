import { LinkIcon, Activity, MousePointerClick, TrendingUp, PlusCircle } from "lucide-react"
import { StatsCard } from "@/components/dashboard/stats-card"
import { QRGenerator } from "@/components/dashboard/qr-generator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Eye, ExternalLink } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const supabase = await createClient()

  // 1. Get User
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // 2. Get Hotel Data
  const { data: hotel } = await supabase.from("hotels").select("*").eq("user_id", user.id).single()

  // 3. Get Links (if hotel exists)
  const { data: links } = hotel
    ? await supabase.from("links").select("*").eq("hotel_id", hotel.id).order("order_index")
    : { data: [] }

  const activeLinksCount = links?.filter((l) => l.is_active).length || 0

  // Empty State: User has no hotel created yet
  if (!hotel) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center">
        <div className="p-4 rounded-full bg-blue-100">
          <Activity className="w-12 h-12 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Welcome, {user.email}</h2>
        <p className="text-muted-foreground max-w-md">
          You haven't created your hotel profile yet. Set up your property details to get started.
        </p>
        <Button size="lg" asChild>
          <Link href="/dashboard/settings">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Hotel Profile
          </Link>
        </Button>
      </div>
    )
  }

  // Real Data State
  const portalBaseUrl = process.env.NEXT_PUBLIC_PORTAL_URL || "https://smartstay-portal-b2c.vercel.app"
  const portalUrl = `${portalBaseUrl}/${hotel.id}`

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with {hotel.name}.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        <StatsCard
          title="Total Links"
          value={links?.length || 0}
          icon={LinkIcon}
          className="hover:shadow-lg transition-shadow"
        />
        <StatsCard
          title="Active Links"
          value={activeLinksCount}
          icon={Activity}
          className="hover:shadow-lg transition-shadow"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Portal Preview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Guest Portal Preview</CardTitle>
                <CardDescription>Your live guest-facing portal</CardDescription>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                Live
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border bg-muted/30 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold">{hotel.name}</h3>
                <Badge variant="outline">{activeLinksCount} links</Badge>
              </div>
              <p className="mb-4 text-sm text-muted-foreground">{hotel.welcome_message || "Welcome to our hotel"}</p>
              <div className="space-y-2">
                {links?.slice(0, 3).map((link) => (
                  <div
                    key={link.id}
                    className="flex items-center justify-between rounded-md border bg-background p-2 text-sm"
                  >
                    <span>{link.title}</span>
                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  </div>
                ))}
                {activeLinksCount > 3 && (
                  <p className="text-xs text-center text-muted-foreground pt-2">
                    +{activeLinksCount - 3} more links
                  </p>
                )}
                {activeLinksCount === 0 && (
                  <p className="text-xs text-center text-muted-foreground pt-2">No links added yet.</p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button asChild className="flex-1">
                <a href={portalUrl} target="_blank" rel="noopener noreferrer">
                  <Eye className="mr-2 h-4 w-4" />
                  Preview Portal
                </a>
              </Button>
              <Button variant="outline" asChild className="flex-1 bg-transparent">
                <Link href="/dashboard/links">Manage Links</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* QR Code */}
        <QRGenerator url={portalUrl} hotelName={hotel.name} />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks to manage your hotel portal</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            <Button variant="outline" asChild className="justify-start bg-transparent">
              <Link href="/dashboard/links">
                <LinkIcon className="mr-2 h-4 w-4" />
                Add New Link
              </Link>
            </Button>
            <Button variant="outline" asChild className="justify-start bg-transparent">
              <Link href="/dashboard/activities">
                <Activity className="mr-2 h-4 w-4" />
                Add Activity
              </Link>
            </Button>
            <Button variant="outline" asChild className="justify-start bg-transparent">
              <Link href="/dashboard/settings">
                <Eye className="mr-2 h-4 w-4" />
                Customize Design
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
