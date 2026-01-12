"use client"

import { useState, useMemo } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LinkFormDialog } from "@/components/dashboard/link-form-dialog"
import { SortableLinkItem } from "@/components/dashboard/sortable-link-item"
import { useDashboard } from "@/contexts/dashboard-context"
import { Badge } from "@/components/ui/badge"
import { Link2 } from "lucide-react"

export default function LinksPage() {
  const { links, reorderLinks } = useDashboard()
  const [activeTab, setActiveTab] = useState<"all" | "hotel" | "activities" | "contact">("all")

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const filteredLinks = useMemo(() => {
    if (activeTab === "all") return links
    return links.filter((link) => link.category === activeTab)
  }, [links, activeTab])

  const linksByCategory = useMemo(() => {
    return {
      hotel: links.filter((l) => l.category === "hotel").length,
      activities: links.filter((l) => l.category === "activities").length,
      contact: links.filter((l) => l.category === "contact").length,
    }
  }, [links])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = filteredLinks.findIndex((link) => link.id === active.id)
      const newIndex = filteredLinks.findIndex((link) => link.id === over.id)
      const reordered = arrayMove(filteredLinks, oldIndex, newIndex)
      reorderLinks(reordered)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestor de Links</h2>
          <p className="text-muted-foreground">Administra y organiza los links de tu portal de huéspedes</p>
        </div>
        <LinkFormDialog />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Mis Links</CardTitle>
              <CardDescription>Arrastra y suelta para reordenar</CardDescription>
            </div>
            <Badge variant="secondary">
              <Link2 className="mr-1 h-3 w-3" />
              {links.length} total
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">Todos ({links.length})</TabsTrigger>
              <TabsTrigger value="hotel">Servicios ({linksByCategory.hotel})</TabsTrigger>
              <TabsTrigger value="activities">Actividades ({linksByCategory.activities})</TabsTrigger>
              <TabsTrigger value="contact">Contacto ({linksByCategory.contact})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {filteredLinks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Link2 className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No hay links aún</h3>
                  <p className="text-sm text-muted-foreground mb-4">Comienza creando tu primer link</p>
                  <LinkFormDialog />
                </div>
              ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={filteredLinks.map((l) => l.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-3">
                      {filteredLinks.map((link) => (
                        <SortableLinkItem key={link.id} link={link} />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
