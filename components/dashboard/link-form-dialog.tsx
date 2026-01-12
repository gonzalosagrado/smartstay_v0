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
import { linkSchema, type LinkFormData } from "@/lib/validations"
import { useDashboard } from "@/contexts/dashboard-context"
import { toast } from "sonner"
import type { Link } from "@/types/dashboard"

interface LinkFormDialogProps {
  link?: Link
  trigger?: React.ReactNode
}

export function LinkFormDialog({ link, trigger }: LinkFormDialogProps) {
  const [open, setOpen] = useState(false)
  const { addLink, updateLink } = useDashboard()
  const isEditing = !!link

  const form = useForm<LinkFormData>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      title: link?.title || "",
      url: link?.url || "",
      description: link?.description || "",
      icon: link?.icon || "",
      category: link?.category || "hotel",
      isActive: link?.isActive ?? true,
    },
  })

  const onSubmit = (data: LinkFormData) => {
    try {
      if (isEditing) {
        updateLink(link.id, data)
        toast.success("Link actualizado correctamente")
      } else {
        addLink(data)
        toast.success("Link creado correctamente")
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
            Nuevo Link
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Link" : "Crear Nuevo Link"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Actualiza los detalles del link." : "Agrega un nuevo link a tu portal de huéspedes."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input placeholder="Contraseña de WiFi" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoría</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="hotel">Servicios del Hotel</SelectItem>
                        <SelectItem value="activities">Actividades</SelectItem>
                        <SelectItem value="contact">Contacto</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL o Contenido</FormLabel>
                  <FormControl>
                    <Input placeholder="https://... o Contraseña123" {...field} />
                  </FormControl>
                  <FormDescription>La URL de destino o el texto a copiar.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción (Opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Breve descripción de lo que ofrece este link..."
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
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Ícono (Lucide)</FormLabel>
                  <FormControl>
                    <Input placeholder="Wifi, Phone, etc." {...field} />
                  </FormControl>
                  <FormDescription>Nombre del ícono de la librería Lucide.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Activo</FormLabel>
                    <FormDescription>Hacer visible este link para los huéspedes</FormDescription>
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
                {isEditing ? "Update Link" : "Create Link"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
