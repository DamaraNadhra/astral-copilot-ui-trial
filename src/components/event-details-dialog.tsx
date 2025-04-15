"use client"

import { useState } from "react"
import Image from "next/image"
import { Calendar, Clock, MapPin, Edit, Trash2, X } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Separator } from "./ui/separator"
import type { Event } from "../lib/data"
import { EventDialog } from "./event-dialog"

interface EventDetailsDialogProps {
  event: Event | null
  isOpen: boolean
  onClose: () => void
  onEdit: (event: Event) => void
  onDelete: (eventId: string) => void
}

export function EventDetailsDialog({ event, isOpen, onClose, onEdit, onDelete }: EventDetailsDialogProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  if (!event) return null

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  const handleEdit = () => {
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = (updatedEvent: Event) => {
    onEdit(updatedEvent)
    setIsEditDialogOpen(false)
  }

  const handleDelete = () => {
    onDelete(event.id)
  }

  // Extract color name from the Tailwind class
  const getColorName = (colorClass: string) => {
    const colorMap: Record<string, string> = {
      "bg-blue-500": "Blue",
      "bg-green-500": "Green",
      "bg-purple-500": "Purple",
      "bg-red-500": "Red",
      "bg-yellow-500": "Yellow",
      "bg-pink-500": "Pink",
    }
    return colorMap[colorClass] || "Default"
  }

  return (
    <>
      <Dialog open={isOpen && !isEditDialogOpen} onOpenChange={onClose}>
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden">
          <div className="relative">
            {event.imageUrl ? (
              <div className="w-full h-[200px] relative">
                <Image
                  src={event.imageUrl || "/placeholder.svg"}
                  alt={event.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 550px) 100vw, 550px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
            ) : (
              <div className={`w-full h-[120px] ${event.color}`}></div>
            )}
            
            
            <div className={`absolute bottom-4 left-4 right-4 ${event.imageUrl ? 'text-white' : ''}`}>
              <Badge className={`${event.color} border-none`}>
                {getColorName(event.color)}
              </Badge>
              <h2 className="text-2xl font-bold mt-1">{event.title}</h2>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <span>{formatDate(event.date)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-500" />
                <span>{event.startTime} - {event.endTime}</span>
              </div>
              
              {/* Optional location field - can be added to the Event interface */}
              {event.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <span>{event.location}</span>
                </div>
              )}
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-line">{event.description || "No description provided."}</p>
              </div>
            </div>
          </div>

          <DialogFooter className="p-6 pt-0">
            <div className="flex gap-2 w-full">
              <Button variant="outline" className="flex-1" onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="destructive" className="flex-1" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <EventDialog
        event={event}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={handleSaveEdit}
        onDelete={() => {
          onDelete(event.id)
          setIsEditDialogOpen(false)
        }}
      />
    </>
  )
}
