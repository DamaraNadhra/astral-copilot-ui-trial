"use client";

import Image from "next/image";
import type React from "react";

import type { Event } from "~/lib/data";
import { cn } from "~/lib/utils";
import moment from "~/utils/moment-adapter";

interface CalendarEventProps {
  event: Event;
  onClick: (e: React.MouseEvent) => void;
  mode: "week" | "month";
  isDragging?: boolean;
  totalEvents?: number;
  shrink?: boolean;
}

export function CalendarEvent({
  event,
  onClick,
  mode,
  isDragging,
  shrink = false,
  totalEvents = 1,
}: CalendarEventProps) {
  return (
    <div
      style={{
        height:
          mode === "week"
            ? `${event.duration * 1}px`
            : // : `calc((100% - ${(totalEvents - 1) * 4}px) / ${totalEvents})`,
              "",
      }}
      className={cn(
        isDragging ? "" : mode === "week" ? "absolute" : "",
        mode === "month" ? "flex-shrink flex-grow" : "",
        "truncate rounded text-xs font-medium text-white",
        "z-10 max-w-[130px] min-w-[130px] cursor-pointer border-1 border-gray-300 transition-opacity hover:opacity-90",
        event.color,
      )}
      onClick={(e) => {
        e.stopPropagation();
        onClick(e);
      }}
    >
      <div className="relative h-full w-full">
        {event.imageUrl && (
          <div className="absolute top-0 left-0 h-full w-full">
            <Image
              src={event.imageUrl}
              alt={event.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div
          className={`z-10 flex h-full w-full ${mode === "week" ? "flex-col p-2" : shrink ? "flex-row" : "flex-col p-1"} justify-between`}
        >
          <div className="h-fit truncate font-semibold text-white opacity-90">
            {event.title}
          </div>
          <div className="h-fit text-xs text-black opacity-90">
            {event.startTime} - {event.endTime}
          </div>
        </div>
      </div>
    </div>
  );
}
