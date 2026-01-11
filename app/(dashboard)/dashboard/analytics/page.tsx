"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from "recharts"
import { mockAnalyticsData } from "@/lib/mock-data"
import { TrendingUp, MousePointerClick, Users } from "lucide-react"
import { StatsCard } from "@/components/dashboard/stats-card"

const weatherColors = {
  sunny: "#f59e0b",
  cloudy: "#6b7280",
  rainy: "#3b82f6",
  snowy: "#06b6d4",
}

export default function AnalyticsPage() {
  const data = mockAnalyticsData

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <p className="text-muted-foreground">Track engagement and usage metrics for your guest portal</p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Total Clicks"
          value={data.totalClicks.toLocaleString()}
          icon={MousePointerClick}
          className="hover:shadow-lg transition-shadow"
        />
        <StatsCard
          title="Unique Visitors"
          value={data.uniqueVisitors.toLocaleString()}
          icon={Users}
          className="hover:shadow-lg transition-shadow"
        />
        <StatsCard
          title="Avg. Click Rate"
          value={`${((data.totalClicks / data.uniqueVisitors) * 100).toFixed(1)}%`}
          icon={TrendingUp}
          trend={15.3}
          trendLabel="vs last month"
          className="hover:shadow-lg transition-shadow"
        />
      </div>

      {/* Clicks Over Time */}
      <Card>
        <CardHeader>
          <CardTitle>Clicks Over Time</CardTitle>
          <CardDescription>Daily click activity for the past week</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              clicks: {
                label: "Clicks",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.clicksByDay} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="clicks"
                  stroke="var(--color-clicks)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-clicks)", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Links */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Links</CardTitle>
            <CardDescription>Most clicked links this month</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                clicks: {
                  label: "Clicks",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.topLinks} layout="vertical" margin={{ left: 0, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" className="text-xs" />
                  <YAxis dataKey="title" type="category" width={120} className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="clicks" fill="var(--color-clicks)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Clicks by Weather */}
        <Card>
          <CardHeader>
            <CardTitle>Clicks by Weather</CardTitle>
            <CardDescription>Activity engagement by weather condition</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                clicks: {
                  label: "Clicks",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.clicksByWeather} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="condition" className="text-xs capitalize" />
                  <YAxis className="text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="clicks" radius={[4, 4, 0, 0]}>
                    {data.clicksByWeather.map((entry) => (
                      <Cell key={entry.condition} fill={weatherColors[entry.condition]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
