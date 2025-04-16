"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { CalendarEvent } from "./calendar-event";
import { EventDialog } from "./event-dialog";
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { cn } from "../lib/utils";
import type { Event } from "../lib/data";
import { WeekView } from "./week-view";
import moment from "../utils/moment-adapter";
import { Droppable } from "./Droppable";
import { Draggable } from "./Draggable";
import { EventDetailsDialog } from "./event-details-dialog";
import { MobileView } from "./mobile-view";
import MobileAppEventComponent from "./mobileAppEventComponent";
// Sample events data
const initialEvents: Event[] = [
  {
    id: "1",
    title: "Team Meeting",
    date: new Date(2025, 3, 10),
    startTime: "05:00",
    location: "123 Main St, Anytown, USA",
    endTime: "06:00",
    duration: 60,
    imageUrl:
      "https://fastly.picsum.photos/id/312/1920/1080.jpg?hmac=OD_fP9MUQN7uJ8NBR7tlii78qwHPUROGgohG4w16Kjw",
    description: "Weekly team sync to discuss project progress.",
    color: "bg-blue-500",
  },
  {
    id: "2",
    title: "Product Demo",
    date: new Date(2025, 3, 15),
    startTime: "14:00",
    location: "123 Main St, Anytown, USA",
    endTime: "15:30",
    duration: 90,
    imageUrl:
      "https://fastly.picsum.photos/id/312/1920/1080.jpg?hmac=OD_fP9MUQN7uJ8NBR7tlii78qwHPUROGgohG4w16Kjw",
    description: "Demonstrate new features to stakeholders.",
    color: "bg-green-500",
  },
  {
    id: "3",
    title: "Client Call",
    date: new Date(2025, 3, 12),
    startTime: "09:00",
    location: "123 Main St, Anytown, USA",
    endTime: "10:00",
    duration: 60,
    imageUrl:
      "https://fastly.picsum.photos/id/312/1920/1080.jpg?hmac=OD_fP9MUQN7uJ8NBR7tlii78qwHPUROGgohG4w16Kjw",
    description: "Quarterly review with client.",
    color: "bg-purple-500",
  },
];

export function Calendar({
  currentDeviceView,
  setCurrentDeviceView,
}: {
  currentDeviceView: "desktop" | "mobile";
  setCurrentDeviceView: (view: "desktop" | "mobile") => void;
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [currentView, setCurrentView] = useState<"month" | "week">("month");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dndKey, setDndKey] = useState(`dnd-${Date.now()}`);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get day of week for the first day of the month (0 = Sunday, 6 = Saturday)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Previous month
  const handlePrev = () => {
    if (currentView === "month") {
      setCurrentDate(moment(currentDate).subtract(1, "month").toDate());
    } else {
      setCurrentDate(moment(currentDate).subtract(1, "week").toDate());
    }
  };

  // Next month
  const handleNext = () => {
    if (currentView === "month") {
      setCurrentDate(moment(currentDate).add(1, "month").toDate());
    } else {
      setCurrentDate(moment(currentDate).add(1, "week").toDate());
    }
  };

  const getCurrentWeekDates = (currentDate: Date) => {
    const dates = [];
    // Get the first day of the week (Sunday)
    const firstDayOfWeek = new Date(currentDate);
    const day = currentDate.getDay();
    firstDayOfWeek.setDate(currentDate.getDate() - day);

    // Get all 7 days of the week
    for (let i = 0; i < 7; i++) {
      const date = new Date(firstDayOfWeek);
      date.setDate(firstDayOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  // Handle event click
  const handleEventClick = (event: Event) => {
    console.log("handleEventClick", event);
    setSelectedEvent(event);
    setIsDetailsDialogOpen(true);
  };

  // handle day click to create new event
  const handleDayClick = (day: number) => {
    const newEvent: Event = {
      id: `event-${Date.now()}`,
      title: "New Event",
      date: new Date(year, month, day),
      location: "123 Main St, Anytown, USA",
      startTime: "12:00",
      duration: 60,
      endTime: "13:00",
      imageUrl:
        "https://fastly.picsum.photos/id/312/1920/1080.jpg?hmac=OD_fP9MUQN7uJ8NBR7tlii78qwHPUROGgohG4w16Kjw",
      description: "Add description here",
      color: "bg-blue-500",
    };
    setSelectedEvent(newEvent);
    setIsDialogOpen(true);
  };

  const saveEvent = (event: Event) => {
    if (events.find((e) => e.id === event.id)) {
      setEvents(events.map((e) => (e.id === event.id ? event : e)));
    } else {
      setEvents([...events, event]);
    }
    setSelectedEvent(event);
    setIsDialogOpen(false);
  };

  const deleteEvent = (eventId: string) => {
    setEvents(events.filter((e) => e.id !== eventId));
    setIsDialogOpen(false);
  };

  const handleDragStart = (event: any) => {
    setIsDragging(true);
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    setIsDragging(false);
    const eventId = active.id as string;
    const parts = over.id.toString().split("-");
    console.log(parts);
    if (parts.length < 3) return;

    const [modifier, day, month, year, hour] = parts;
    if (!day || !month || !year) return;

    const newDate = new Date(parseInt(year), parseInt(month), parseInt(day));
    const newHour = parseInt(hour ?? "0");

    if (currentView === "month" || currentDeviceView === "mobile") {
      handleMonthEventDrop(eventId, newDate);
    } else {
      handleWeekEventDrop(eventId, newDate, newHour);
    }
    setActiveId(null);
  };

  const handleDragCancel = () => {
    console.log("Drag cancelled");
    setIsDragging(false);
    setActiveId(null);
  };

  const handleWeekTimeSlotClick = (date: Date, hour: number) => {
    const newDate = new Date(date);
    newDate.setHours(hour);

    const startTime = `${hour.toString().padStart(2, "0")}:00`;
    const endTime = `${(hour + 1).toString().padStart(2, "0")}:00`;

    const newEvent: Event = {
      id: `event-${Date.now()}`,
      title: "New Event",
      date: newDate,
      location: "123 Main St, Anytown, USA",
      imageUrl: "",
      startTime,
      endTime,
      duration: 60,
      description: "Add description here",
      color: "bg-blue-500",
    };

    setSelectedEvent(newEvent);
    setIsDialogOpen(true);
  };

  const handleWeekEventDrop = (
    eventId: string,
    newDate: Date,
    newHour: number,
  ) => {
    setEvents(
      events.map((event) => {
        if (event.id === eventId) {
          const updatedDate = new Date(newDate);
          console.log(newHour);
          console.log(event.startTime);
          // Extract hours and minutes from the original start time
          const [startHour, startMinute] = event.startTime
            .split(":")
            .map(Number);
          const [endHour, endMinute] = event.endTime.split(":").map(Number);

          // Calculate duration in minutes
          const durationMinutes =
            (endHour ?? 0) * 60 +
            (endMinute ?? 0) -
            ((startHour ?? 0) * 60 + (startMinute ?? 0));

          // Set new start time
          const newStartHour = newHour;
          const newStartTime = `${newStartHour.toString().padStart(2, "0")}:${(startMinute ?? 0).toString().padStart(2, "0")}`;

          // Calculate new end time based on the same duration
          const newEndMinutes =
            newHour * 60 + (startMinute ?? 0) + durationMinutes;
          const newEndHour = Math.floor(newEndMinutes / 60);
          const newEndMinute = newEndMinutes % 60;
          const newEndTime = `${newEndHour.toString().padStart(2, "0")}:${newEndMinute.toString().padStart(2, "0")}`;
          return {
            ...event,
            date: updatedDate,
            startTime: newStartTime,
            endTime: newEndTime,
          };
        }
        return event;
      }),
    );
  };

  const handleMonthEventDrop = (eventId: string, newDate: Date) => {
    setEvents(
      events.map((event) =>
        event.id === eventId ? { ...event, date: newDate } : event,
      ),
    );
  };

  const handleViewChange = (view: "month" | "week") => {
    setCurrentView(view);
  };

  // Generate calendar grid
  const calendarDays = [];
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Add weekday headers
  for (let i = 0; i < 7; i++) {
    calendarDays.push(
      <div
        key={`header-${i}`}
        className="border-b py-2 text-center font-medium"
      >
        {weekdays[i]}
      </div>,
    );
  }

  // add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(
      <div key={`empty-${i}`} className="min-h-24 border bg-gray-50 p-1"></div>,
    );
  }

  // add cells for days in the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dayEvents = events.filter(
      (event) =>
        event.date.getDate() === day &&
        event.date.getMonth() === month &&
        event.date.getFullYear() === year,
    );

    calendarDays.push(
      <Droppable
        key={`month-${day}-${month}-${year}`}
        id={`month-${day}-${month}-${year}`}
      >
        <div
          className={cn(
            "relative max-h-24 min-h-24 border p-1",
            "cursor-pointer transition-colors hover:bg-gray-50",
          )}
          onClick={() => handleDayClick(day)}
        >
          <div className="mb-1 text-sm font-medium">{day}</div>
          <div className="h-full space-y-1">
            {dayEvents
              .sort((a, b) => a.startTime.localeCompare(b.startTime))
              .map((event) => (
                <Draggable key={event.id} id={event.id}>
                  <CalendarEvent
                    event={event}
                    mode="month"
                    shrink={dayEvents.length > 1}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEventClick(event);
                    }}
                    totalEvents={dayEvents.length}
                  />
                </Draggable>
              ))}
          </div>
        </div>
      </Droppable>,
    );
  }

  // const pointerSensor = useSensor(PointerSensor, {
  //   activationConstraint: {
  //     ...(currentDeviceView === "mobile"
  //       ? {
  //           delay: 1000,
  //           tolerance: 5,
  //         }
  //       : {
  //           distance: 0.01,
  //         }),
  //   },
  // });
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 0.01,
    },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 100,
      tolerance: 2,
    },
  });
  const keyboardSensor = useSensor(KeyboardSensor);

  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

  // useEffect(() => {
  //   console.log("isDragging", isDragging);
  // }, [isDragging]);

  return (
    <DndContext
      key={dndKey}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      collisionDetection={closestCenter}
      sensors={sensors}
    >
      <div
        className={cn(
          "rounded-lg bg-white shadow",
          currentDeviceView === "mobile"
            ? "h-screen"
            : "container mx-auto border py-4",
          isDragging && "touch-none",
        )}
      >
        <div
          className={cn(
            "flex items-center justify-between border-b px-4 pb-4",
            currentDeviceView === "mobile" && "hidden",
          )}
        >
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handlePrev}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-semibold">
              {monthNames[month]} {year}
            </h2>
            <Button variant="outline" size="icon" onClick={handleNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              variant={currentDeviceView === "mobile" ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setCurrentDeviceView(
                  currentDeviceView === "mobile" ? "desktop" : "mobile",
                );
                setCurrentView("week");
              }}
            >
              Mobile
            </Button>
            <Button
              variant={currentView === "month" ? "default" : "outline"}
              size="sm"
              onClick={() => handleViewChange("month")}
            >
              Month
            </Button>
            <Button
              variant={currentView === "week" ? "default" : "outline"}
              size="sm"
              onClick={() => handleViewChange("week")}
            >
              Week
            </Button>
          </div>
        </div>

        {currentView === "month" ? (
          <div className="grid grid-cols-7 gap-px">{calendarDays}</div>
        ) : currentDeviceView === "mobile" ? (
          <MobileView
            currentDate={currentDate}
            events={events}
            currentWeek={getCurrentWeekDates(currentDate)}
            onEventClick={handleEventClick}
            setDndKey={setDndKey}
            isDragging={isDragging}
            onTimeSlotClick={handleWeekTimeSlotClick}
            setCurrentDate={setCurrentDate}
          />
        ) : (
          <WeekView
            weekDates={getCurrentWeekDates(currentDate)}
            events={events}
            viewMode={currentDeviceView}
            onEventClick={handleEventClick}
            onTimeSlotClick={handleWeekTimeSlotClick}
          />
        )}

        <DragOverlay>
          {activeId ? (
            currentDeviceView === "desktop" ? (
              <div className="w-full">
                {events.find((e) => e.id === activeId) && (
                  <CalendarEvent
                    event={events.find((e) => e.id === activeId)!}
                    mode={currentView}
                    onClick={() => {}}
                    isDragging={true}
                  />
                )}
              </div>
            ) : (
              <MobileAppEventComponent
                event={events.find((e) => e.id === activeId)!}
              />
            )
          ) : null}
        </DragOverlay>

        <EventDialog
          event={selectedEvent}
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSave={saveEvent}
          onDelete={deleteEvent}
        />
        {selectedEvent && (
          <EventDetailsDialog
            event={selectedEvent}
            isOpen={isDetailsDialogOpen}
            onClose={() => setIsDetailsDialogOpen(false)}
            onEdit={saveEvent}
            onDelete={deleteEvent}
          />
        )}
      </div>
    </DndContext>
  );
}
