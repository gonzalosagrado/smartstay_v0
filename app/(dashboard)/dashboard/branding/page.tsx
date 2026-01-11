"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { brandingSchema, type BrandingFormData } from "@/lib/validations"
import { useDashboard } from "@/contexts/dashboard-context"
import { toast } from "sonner"
import { Loader2, Palette } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function BrandingPage() {
  const { hotel, updateHotel } = useDashboard()

  const form = useForm<BrandingFormData>({
    resolver: zodResolver(brandingSchema),
    defaultValues: {
      name: hotel.name,
      primaryColor: hotel.primaryColor,
      logo: hotel.logo || "",
      address: hotel.address,
      phone: hotel.phone,
      email: hotel.email,
      description: hotel.description,
      welcomeMessage: hotel.welcomeMessage,
    },
  })

  const onSubmit = (data: BrandingFormData) => {
    try {
      updateHotel(data)
      toast.success("Branding updated successfully")
    } catch (error) {
      toast.error("Failed to update branding")
    }
  }

  const watchedColor = form.watch("primaryColor")

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Hotel Branding</h2>
        <p className="text-muted-foreground">Customize how your hotel appears to guests</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Brand Settings</CardTitle>
              <CardDescription>Update your hotel's identity and appearance</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hotel Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Smart Stay Bariloche" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="primaryColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primary Color</FormLabel>
                          <div className="flex gap-2">
                            <FormControl>
                              <Input type="color" className="h-10 w-20 cursor-pointer" {...field} />
                            </FormControl>
                            <Input value={field.value} onChange={field.onChange} className="flex-1" />
                          </div>
                          <FormDescription>Your brand's main color</FormDescription>
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
                            <Input placeholder="https://example.com/logo.png" {...field} />
                          </FormControl>
                          <FormDescription>URL to your hotel logo</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="welcomeMessage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Welcome Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Welcome to our hotel! We're delighted to have you..."
                            className="resize-none"
                            rows={2}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>Greeting shown to guests on the portal</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hotel Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your hotel's unique features and amenities..."
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
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St, City, Country" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="+1 234 567 8900" {...field} />
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
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="info@hotel.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => form.reset()}>
                      Reset
                    </Button>
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                      {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save Changes
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Preview
              </CardTitle>
              <CardDescription>How your brand appears to guests</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4 space-y-3">
                <div
                  className="h-12 w-12 rounded-lg flex items-center justify-center text-white font-bold text-xl"
                  style={{ backgroundColor: watchedColor }}
                >
                  {form.watch("name")?.charAt(0) || "H"}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{form.watch("name") || "Hotel Name"}</h3>
                  <Badge variant="secondary" className="mt-1">
                    <span className="h-2 w-2 rounded-full mr-1.5" style={{ backgroundColor: watchedColor }} />
                    Primary Color
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {form.watch("welcomeMessage") || "Welcome message will appear here..."}
                </p>
                <div className="pt-2 border-t text-xs text-muted-foreground space-y-1">
                  <p>{form.watch("address") || "Address"}</p>
                  <p>{form.watch("phone") || "Phone"}</p>
                  <p>{form.watch("email") || "Email"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
