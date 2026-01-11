"use client"

import type React from "react"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { activitySchema, type ActivityFormData } from "@/lib/validations"
import { useDashboard } from "@/contexts/dashboard-context"
import { toast } from "sonner"
import type { Activity } from "@/types/dashboard"

interface ActivityFormDialogProps {
  activity?: Activity
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function ActivityFormDialog({ activity, trigger, open: controlledOpen, onOpenChange }: ActivityFormDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const { addActivity, updateActivity } = useDashboard()
  const isEditing = !!activity

  const open = controlledOpen ?? internalOpen
  const setOpen = onOpenChange ?? setInternalOpen

  const form = useForm<ActivityFormData>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      title: activity?.title || "",
      description: activity?.description || "",
      imageUrl: activity?.imageUrl || "",
      weatherCondition: activity?.weatherCondition || "sunny",
      priority: activity?.priority || 5,
      isActive: activity?.isActive ?? true,
    },
  })

  const onSubmit = (data: ActivityFormData) => {
    try {
      if (isEditing) {
        updateActivity(activity.id, data)
        toast.success("Activity updated successfully")
      } else {
        addActivity(data)
        toast.success("Activity created successfully")
      }
      setOpen(false)
      form.reset()
    } catch (error) {
      toast.error("Something went wrong")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Activity
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Activity" : "Create New Activity"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update the activity details below." : "Add a new weather-based activity recommendation."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Cerro Catedral Skiing" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the activity and what makes it special..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.jpg" {...field} />
                  </FormControl>
                  <FormDescription>URL to the activity image</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="weatherCondition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weather Condition</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select weather" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="sunny">Sunny</SelectItem>
                        <SelectItem value="cloudy">Cloudy</SelectItem>
                        <SelectItem value="rainy">Rainy</SelectItem>
                        <SelectItem value="snowy">Snowy</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>When to recommend this activity</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority: {field.value}</FormLabel>
                    <FormControl>
                      <Slider
                        min={1}
                        max={10}
                        step={1}
                        value={[field.value]}
                        onValueChange={(vals) => field.onChange(vals[0])}
                        className="mt-2"
                      />
                    </FormControl>
                    <FormDescription>Display priority (1-10)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active</FormLabel>
                    <FormDescription>Show this activity to guests</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? "Update Activity" : "Create Activity"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
