"use client";

import React from "react";
import { useState } from "react";
import { CalendarEvent } from "./calendar-event";
import type { Event } from "../lib/data";
import { cn } from "../lib/utils";
import { Droppable } from "./Droppable";
import { Draggable } from "./Draggable";
import { WeekdayEventsDialog } from "./weekday-events";

interface WeekViewProps {
  weekDates: Date[];
  events: Event[];
  onEventClick: (event: Event) => void;
  onTimeSlotClick: (date: Date, hour: number) => void;
  viewMode: "desktop" | "mobile";
}

export function WeekView({
  weekDates,
  events,
  onEventClick,
  viewMode,
  onTimeSlotClick,
}: WeekViewProps) {
  // Generate hours for the day (6 AM to 10 PM)
  const hours = Array.from({ length: 17 }, (_, i) => i + 6);

  // Format date to display day of week and date
  const formatDate = (date: Date) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return `${days[date.getDay()]} ${date.getDate()}`;
  };

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Format hour for display
  const formatHour = (hour: number) => {
    if (hour === 0) return "12 AM";
    if (hour === 12) return "12 PM";
    return hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
  };

  // Check if an event should be displayed in this time slot
  const getEventsForTimeSlot = (date: Date, hour: number) => {
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      if (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      ) {
        const [startHour] = event.startTime.split(":").map(Number);
        return startHour === hour;
      }
      return false;
    });
  };

  const getEventsForDay = (date: Date | null) => {
    if (!date) return [];
    return events.filter((event) => {
      return (
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
      );
    });
  };

  const [weekdayEventsDialogOpen, setWeekdayEventsDialogOpen] = useState(false);
  if (viewMode === "desktop") {
  return (
    <div className="overflow-auto" style={{ maxHeight: "calc(100vh - 200px)" }}>
      <div className="grid min-w-[800px] grid-cols-[80px_repeat(7,1fr)]">
        {/* Header row with days */}
        <div className="sticky top-0 z-10 border-b bg-white"></div>
        {weekDates.map((date, index) => (
          <div
            key={`header-${index}`}
            className="sticky top-0 z-50 cursor-pointer border-b border-l bg-white p-2 text-center font-medium hover:bg-gray-50"
            onClick={() => {
              setSelectedDate(date);
              setWeekdayEventsDialogOpen(true);
            }}
          >
            <div className="text-sm">{formatDate(date)}</div>
          </div>
        ))}

        {/* Time slots */}
        {hours.map((hour) => (
          <React.Fragment key={`hour-${hour}`}>
            {/* Hour label */}
            <div className="sticky left-0 z-10 border-r border-b bg-white p-2 text-right text-sm text-gray-500">
              {formatHour(hour)}
            </div>

            {/* Day columns */}
            {weekDates.map((date, dayIndex) => {
              const timeSlotEvents = getEventsForTimeSlot(date, hour);
              const droppableId = `week-${date.getDate()}-${date.getMonth()}-${date.getFullYear()}-${hour}`;

              return (
                <Droppable key={droppableId} id={droppableId}>
                  <div
                    className={cn(
                      "relative min-h-[60px] border-b border-l px-1 py-0",
                      // "transition-colors hover:bg-gray-50",
                    )}
                    onClick={() => onTimeSlotClick(date, hour)}
                  >
                    {timeSlotEvents.map((event) => (
                      <Draggable key={event.id} id={event.id}>
                        <CalendarEvent
                          event={event}
                          mode="week"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEventClick(event);
                          }}
                        />
                      </Draggable>
                    ))}
                  </div>
                </Droppable>
              );
            })}
          </React.Fragment>
        ))}
      </div>
      <WeekdayEventsDialog
        events={getEventsForDay(selectedDate)}
        isOpen={weekdayEventsDialogOpen}
        onClose={() => setWeekdayEventsDialogOpen(false)}
        date={selectedDate}
        onCreateEvent={() => {}}
        onViewEvent={() => {}}
      />
    </div>
    );
  } 
  return (
    <div className="overflow-auto" style={{ maxHeight: "calc(100vh - 200px)" }}>
      <div className="grid min-w-[800px] grid-cols-[80px_repeat(7,1fr)]">
        {/* Header row with days */}
        <div className="sticky top-0 z-10 border-b bg-white"></div>
      </div>
    </div>
  );
}