"use client"

import { Pencil, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Activity } from "@/types/dashboard"
import Image from "next/image"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useDashboard } from "@/contexts/dashboard-context"
import { toast } from "sonner"

interface ActivityCardProps {
  activity: Activity
  onEdit: (activity: Activity) => void
}

const weatherLabels = {
  sunny: "Sunny",
  cloudy: "Cloudy",
  rainy: "Rainy",
  snowy: "Snowy",
}

const weatherColors = {
  sunny: "bg-yellow-100 text-yellow-700",
  cloudy: "bg-gray-100 text-gray-700",
  rainy: "bg-blue-100 text-blue-700",
  snowy: "bg-cyan-100 text-cyan-700",
}

export function ActivityCard({ activity, onEdit }: ActivityCardProps) {
  const { deleteActivity } = useDashboard()

  const handleDelete = () => {
    deleteActivity(activity.id)
    toast.success("Activity deleted successfully")
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video relative bg-muted">
        <Image src={activity.imageUrl || "/placeholder.svg"} alt={activity.title} fill className="object-cover" />
        <div className="absolute top-2 right-2 flex gap-2">
          <Badge className={weatherColors[activity.weatherCondition]}>{weatherLabels[activity.weatherCondition]}</Badge>
          {!activity.isActive && (
            <Badge variant="outline" className="bg-background">
              Inactive
            </Badge>
          )}
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-lg">{activity.title}</h3>
          <Badge variant="secondary">P{activity.priority}</Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{activity.description}</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(activity)} className="flex-1">
            <Pencil className="mr-2 h-3 w-3" />
            Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-destructive hover:text-destructive bg-transparent">
                <Trash2 className="h-3 w-3" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Activity?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{activity.title}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  )
}
