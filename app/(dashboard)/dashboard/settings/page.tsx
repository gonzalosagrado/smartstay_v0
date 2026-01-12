"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { brandingSchema, type BrandingFormData } from "@/lib/validations"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Loader2, Building, Save } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const form = useForm<BrandingFormData>({
    resolver: zodResolver(brandingSchema),
    defaultValues: {
      name: "",
      description: "",
      address: "",
      phone: "",
      email: "",
      welcomeMessage: "",
      primaryColor: "#3B82F6",
      logo: "",
    },
  })

  // Fetch data on mount
  useEffect(() => {
    async function loadData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push("/login")
          return
        }

        const { data: hotel, error } = await supabase
          .from("hotels")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle() // Use maybeSingle to not throw error if empty

        if (hotel) {
          form.reset({
            name: hotel.name,
            description: hotel.description || "",
            address: hotel.address || "",
            phone: hotel.phone || "",
            email: hotel.email || "",
            welcomeMessage: hotel.welcome_message || "",
            primaryColor: hotel.primary_color || "#3B82F6",
            logo: hotel.logo || "",
          })
        }
      } catch (error) {
        console.error("Error loading hotel data:", error)
        toast.error("Failed to load hotel data")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [form, router, supabase])

  const onSubmit = async (data: BrandingFormData) => {
    setIsSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error("You must be logged in")
        return
      }

      // Check if hotel exists to decide INSERT vs UPDATE
      const { data: existingHotel } = await supabase
        .from("hotels")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle()

      if (existingHotel) {
        // Update
        const { error } = await supabase
          .from("hotels")
          .update({
            name: data.name,
            description: data.description,
            address: data.address,
            phone: data.phone,
            email: data.email,
            welcome_message: data.welcomeMessage,
            primary_color: data.primaryColor,
            logo: data.logo || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingHotel.id)

        if (error) throw error
        toast.success("Hotel profile updated successfully")
      } else {
        // Insert
        const { error } = await supabase
          .from("hotels")
          .insert({
            user_id: user.id,
            name: data.name,
            description: data.description,
            address: data.address,
            phone: data.phone,
            email: data.email,
            welcome_message: data.welcomeMessage,
            primary_color: data.primaryColor,
            logo: data.logo || null,
          })

        if (error) throw error
        toast.success("Hotel profile created successfully")
        router.refresh() // Refresh to update dashboard state
      }

    } catch (error) {
      console.error("Error saving hotel:", error)
      toast.error("Failed to save changes. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Hotel Settings</h2>
        <p className="text-muted-foreground">Manage your property details and public profile.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            <CardTitle>Hotel Profile</CardTitle>
          </div>
          <CardDescription>This information will be displayed on your guest portal.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hotel Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Grand Hotel" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Public Contact Email</FormLabel>
                      <FormControl>
                        <Input placeholder="contact@grandhotel.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 234 567 890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St, City" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="A brief description of your hotel..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="welcomeMessage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Welcome Message</FormLabel>
                    <FormControl>
                      <Input placeholder="Welcome to our hotel! We hope you enjoy your stay." {...field} />
                    </FormControl>
                    <FormDescription>Displayed at the top of the guest portal.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="primaryColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Color (Hex)</FormLabel>
                      <div className="flex gap-2">
                        <div
                          className="w-10 h-10 rounded border shadow-sm"
                          style={{ backgroundColor: field.value }}
                        />
                        <FormControl>
                          <Input placeholder="#3B82F6" {...field} />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="logo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logo URL (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isSaving} size="lg">
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>

            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
