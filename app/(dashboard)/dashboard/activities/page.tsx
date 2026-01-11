"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ActivityFormDialog } from "@/components/dashboard/activity-form-dialog"
import { ActivityCard } from "@/components/dashboard/activity-card"
import { useDashboard } from "@/contexts/dashboard-context"
import { Badge } from "@/components/ui/badge"
import { CloudRain, Sun, Cloud, CloudSnow } from "lucide-react"
import type { Activity, WeatherCondition } from "@/types/dashboard"

const weatherIcons = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  snowy: CloudSnow,
}

export default function ActivitiesPage() {
  const { activities } = useDashboard()
  const [activeTab, setActiveTab] = useState<WeatherCondition | "all">("all")
  const [editingActivity, setEditingActivity] = useState<Activity | undefined>()
  const [dialogOpen, setDialogOpen] = useState(false)

  const filteredActivities =
    activeTab === "all" ? activities : activities.filter((a) => a.weatherCondition === activeTab)

  const activitiesByWeather = {
    sunny: activities.filter((a) => a.weatherCondition === "sunny").length,
    cloudy: activities.filter((a) => a.weatherCondition === "cloudy").length,
    rainy: activities.filter((a) => a.weatherCondition === "rainy").length,
    snowy: activities.filter((a) => a.weatherCondition === "snowy").length,
  }

  const handleEdit = (activity: Activity) => {
    setEditingActivity(activity)
    setDialogOpen(true)
  }

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open)
    if (!open) {
      setEditingActivity(undefined)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Weather Activities</h2>
          <p className="text-muted-foreground">Configure activity recommendations based on weather conditions</p>
        </div>
        <ActivityFormDialog
          activity={editingActivity}
          open={dialogOpen}
          onOpenChange={handleDialogClose}
          trigger={!editingActivity ? undefined : null}
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Activity Library</CardTitle>
              <CardDescription>Manage activities shown to guests based on current weather</CardDescription>
            </div>
            <Badge variant="secondary">
              <CloudRain className="mr-1 h-3 w-3" />
              {activities.length} total
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All ({activities.length})</TabsTrigger>
              <TabsTrigger value="sunny">
                <Sun className="mr-1 h-3 w-3" />
                Sunny ({activitiesByWeather.sunny})
              </TabsTrigger>
              <TabsTrigger value="cloudy">
                <Cloud className="mr-1 h-3 w-3" />
                Cloudy ({activitiesByWeather.cloudy})
              </TabsTrigger>
              <TabsTrigger value="rainy">
                <CloudRain className="mr-1 h-3 w-3" />
                Rainy ({activitiesByWeather.rainy})
              </TabsTrigger>
              <TabsTrigger value="snowy">
                <CloudSnow className="mr-1 h-3 w-3" />
                Snowy ({activitiesByWeather.snowy})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {filteredActivities.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CloudRain className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No activities yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">Create your first activity recommendation</p>
                  <ActivityFormDialog />
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredActivities
                    .sort((a, b) => a.priority - b.priority)
                    .map((activity) => (
                      <ActivityCard key={activity.id} activity={activity} onEdit={handleEdit} />
                    ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
