import { LinkIcon, Activity, MousePointerClick, TrendingUp } from "lucide-react"
import { StatsCard } from "@/components/dashboard/stats-card"
import { QRGenerator } from "@/components/dashboard/qr-generator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { mockDashboardStats, mockHotel, mockLinks } from "@/lib/mock-data"
import Link from "next/link"
import { Eye, ExternalLink } from "lucide-react"

export default function DashboardPage() {
  const stats = mockDashboardStats
  const portalUrl = `https://smartstay.app/${mockHotel.id}`

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with your hotel.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Links"
          value={stats.totalLinks}
          icon={LinkIcon}
          className="hover:shadow-lg transition-shadow"
        />
        <StatsCard
          title="Active Links"
          value={stats.activeLinks}
          icon={Activity}
          className="hover:shadow-lg transition-shadow"
        />
        <StatsCard
          title="Weekly Clicks"
          value={stats.weeklyClicks}
          icon={MousePointerClick}
          trend={stats.clickTrend}
          trendLabel="vs last week"
          className="hover:shadow-lg transition-shadow"
        />
        <StatsCard
          title="Total Activities"
          value={stats.totalActivities}
          icon={TrendingUp}
          trend={stats.visitorTrend}
          trendLabel="visitor growth"
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
                <h3 className="font-semibold">{mockHotel.name}</h3>
                <Badge variant="outline">{stats.activeLinks} links</Badge>
              </div>
              <p className="mb-4 text-sm text-muted-foreground">{mockHotel.welcomeMessage}</p>
              <div className="space-y-2">
                {mockLinks.slice(0, 3).map((link) => (
                  <div
                    key={link.id}
                    className="flex items-center justify-between rounded-md border bg-background p-2 text-sm"
                  >
                    <span>{link.title}</span>
                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  </div>
                ))}
                <p className="text-xs text-center text-muted-foreground pt-2">+{stats.activeLinks - 3} more links</p>
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
        <QRGenerator url={portalUrl} hotelName={mockHotel.name} />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks to manage your hotel portal</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
              <Link href="/dashboard/analytics">
                <TrendingUp className="mr-2 h-4 w-4" />
                View Analytics
              </Link>
            </Button>
            <Button variant="outline" asChild className="justify-start bg-transparent">
              <Link href="/dashboard/branding">
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
