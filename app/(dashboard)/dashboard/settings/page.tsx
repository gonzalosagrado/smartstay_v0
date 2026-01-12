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
import { useDashboard } from "@/contexts/dashboard-context"

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()
  const { updateHotel } = useDashboard()
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
      await updateHotel({
        name: data.name,
        description: data.description,
        address: data.address,
        phone: data.phone,
        email: data.email,
        welcomeMessage: data.welcomeMessage,
        primaryColor: data.primaryColor,
        logo: data.logo || null,
      })
      // Toast is now handled in Context
    } catch (error) {
      console.error("Error saving hotel:", error)
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
        <h2 className="text-3xl font-bold tracking-tight">Configuración</h2>
        <p className="text-muted-foreground">Administra los detalles de tu propiedad y perfil público.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            <CardTitle>Perfil del Hotel</CardTitle>
          </div>
          <CardDescription>Esta información se mostrará en tu portal de huéspedes.</CardDescription>
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
                      <FormLabel>Nombre del Hotel</FormLabel>
                      <FormControl>
                        <Input placeholder="Gran Hotel Bariloche" {...field} />
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
                      <FormLabel>Email de Contacto</FormLabel>
                      <FormControl>
                        <Input placeholder="contacto@hotel.com" {...field} />
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
                      <FormLabel>Número de Teléfono</FormLabel>
                      <FormControl>
                        <Input placeholder="+54 9 294 4123456" {...field} />
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
                      <FormLabel>Dirección</FormLabel>
                      <FormControl>
                        <Input placeholder="Av. Bustillo 1500, Bariloche" {...field} />
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
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Una breve descripción de tu hotel..."
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
                    <FormLabel>Mensaje de Bienvenida</FormLabel>
                    <FormControl>
                      <Input placeholder="¡Bienvenidos a nuestro hotel! Esperamos que disfruten su estadía." {...field} />
                    </FormControl>
                    <FormDescription>Se muestra en la parte superior del portal.</FormDescription>
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
                      <FormLabel>Color Principal (Hex)</FormLabel>
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
                      <FormLabel>Logo URL (Opcional)</FormLabel>
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
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Guardar Cambios
                    </>
                  )}
                </Button>
              </div>

            </form>
          </Form>
        </CardContent>
      </Card>
    </div >
  )
}
