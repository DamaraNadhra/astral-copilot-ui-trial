"use client";

import { useState } from "react";
import { Plus, Calendar, Clock, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import type { Event } from "../lib/data";
import Image from "next/image";

interface WeekdayEventsDialogProps {
  date: Date | null;
  events: Event[];
  isOpen: boolean;
  onClose: () => void;
  onCreateEvent: (date: Date) => void;
  onViewEvent: (event: Event) => void;
}

export function WeekdayEventsDialog({
  date,
  events,
  isOpen,
  onClose,
  onCreateEvent,
  onViewEvent,
}: WeekdayEventsDialogProps) {
  if (!date) return null;

  // Format the date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  // Sort events by start time
  const sortedEvents = [...events].sort((a, b) => {
    const aTime = a.startTime.split(":").map(Number);
    const bTime = b.startTime.split(":").map(Number);

    // Compare hours first
    if (aTime[0] !== bTime[0]) {
      return (aTime[0] ?? 0) - (bTime[0] ?? 0);
    }

    // If hours are the same, compare minutes
    return (aTime[1] ?? 0) - (bTime[1] ?? 0);
  });

  // Format time for display
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    const period = (hours ?? 0) >= 12 ? "PM" : "AM";
    const displayHours = (hours ?? 0) % 12 || 12;
    return `${displayHours}:${(minutes ?? 0).toString().padStart(2, "0")} ${period}`;
  };

  // Group events by time of day (Morning, Afternoon, Evening)
  const groupedEvents = {
    morning: sortedEvents.filter((event) => {
      const hour = parseInt(event.startTime.split(":")[0] ?? "0");
      return hour >= 0 && hour < 12;
    }),
    afternoon: sortedEvents.filter((event) => {
      const hour = parseInt(event.startTime.split(":")[0] ?? "0");
      return hour >= 12 && hour < 17;
    }),
    evening: sortedEvents.filter((event) => {
      const hour = parseInt(event.startTime.split(":")[0] ?? "0");
      return hour >= 17 && hour < 24;
    }),
  };

  // Check if there are any events
  const hasEvents = sortedEvents.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Events for {formatDate(date)}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <Button className="mb-4 w-full" onClick={() => onCreateEvent(date)}>
            <Plus className="mr-2 h-4 w-4" />
            Create New Event
          </Button>

          {!hasEvents ? (
            <div className="text-muted-foreground py-8 text-center">
              No events scheduled for this day.
            </div>
          ) : (
            <ScrollArea className="h-[400px] pr-4">
              {/* Morning Events */}
              {groupedEvents.morning.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-muted-foreground mb-2 text-sm font-medium">
                    MORNING
                  </h3>
                  <div className="space-y-3">
                    {groupedEvents.morning.map((event) => (
                      <EventItem
                        key={event.id}
                        event={event}
                        onViewEvent={onViewEvent}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Afternoon Events */}
              {groupedEvents.afternoon.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-muted-foreground mb-2 text-sm font-medium">
                    AFTERNOON
                  </h3>
                  <div className="space-y-3">
                    {groupedEvents.afternoon.map((event) => (
                      <EventItem
                        key={event.id}
                        event={event}
                        onViewEvent={onViewEvent}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Evening Events */}
              {groupedEvents.evening.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-muted-foreground mb-2 text-sm font-medium">
                    EVENING
                  </h3>
                  <div className="space-y-3">
                    {groupedEvents.evening.map((event) => (
                      <EventItem
                        key={event.id}
                        event={event}
                        onViewEvent={onViewEvent}
                      />
                    ))}
                  </div>
                </div>
              )}
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Event item component
function EventItem({
  event,
  onViewEvent,
}: {
  event: Event;
  onViewEvent: (event: Event) => void;
}) {
  // Format time for display
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":").map(Number);
    const period = (hours ?? 0) >= 12 ? "PM" : "AM";
    const displayHours = (hours ?? 0) % 12 || 12;
    return `${displayHours}:${(minutes ?? 0).toString().padStart(2, "0")} ${period}`;
  };

  return (
    <div
      className="cursor-pointer rounded-lg border p-3 transition-colors hover:bg-gray-50"
      onClick={() => onViewEvent(event)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center">
            <div className={`mr-2 h-3 w-3 rounded-full ${event.color}`}></div>
            <h4 className="font-medium">{event.title}</h4>
          </div>

          <div className="mt-2 flex items-center text-sm text-gray-500">
            <Clock className="mr-1 h-3.5 w-3.5" />
            <span>
              {formatTime(event.startTime)}{" "}
              <ArrowRight className="mx-1 inline h-3 w-3" />{" "}
              {formatTime(event.endTime)}
            </span>
          </div>

          {event.description && (
            <p className="mt-2 line-clamp-2 text-sm text-gray-600">
              {event.description}
            </p>
          )}
        </div>

        {event.imageUrl && (
          <div className="ml-3 h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
            <Image
              src={event.imageUrl}
              alt={event.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
}
