"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Pencil, Trash2, ExternalLink } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Link } from "@/types/dashboard"
import { cn } from "@/lib/utils"
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
import { LinkFormDialog } from "./link-form-dialog"

interface SortableLinkItemProps {
  link: Link
}

export function SortableLinkItem({ link }: SortableLinkItemProps) {
  const { deleteLink } = useDashboard()
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: link.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const handleDelete = () => {
    deleteLink(link.id)
    toast.success("Link deleted successfully")
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn("p-4 transition-shadow hover:shadow-md", isDragging && "opacity-50 shadow-lg")}
    >
      <div className="flex items-center gap-3">
        <button
          className="cursor-grab touch-none text-muted-foreground hover:text-foreground active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-5 w-5" />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium truncate">{link.title}</h3>
            <Badge variant="secondary" className="text-xs">
              {link.category}
            </Badge>
            {!link.isActive && (
              <Badge variant="outline" className="text-xs">
                Inactive
              </Badge>
            )}
          </div>
          {link.description && <p className="text-sm text-muted-foreground truncate">{link.description}</p>}
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
          >
            {link.url}
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        <div className="flex items-center gap-1">
          <LinkFormDialog
            link={link}
            trigger={
              <Button variant="ghost" size="icon">
                <Pencil className="h-4 w-4" />
              </Button>
            }
          />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Link?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{link.title}"? This action cannot be undone.
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
      </div>
    </Card>
  )
}
