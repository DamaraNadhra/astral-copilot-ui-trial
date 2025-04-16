import type { Event } from "~/lib/data";
import { cn } from "~/lib/utils";
import { Badge } from "./ui/badge";
import Image from "next/image";

export default function MobileAppEventComponent({ event }: { event: Event }) {
  return (
    <div
      className="relative w-full cursor-pointer overflow-hidden rounded-lg bg-white shadow-sm transition-opacity duration-200 hover:opacity-90"
      onTouchStart={() => console.log("Touch start")}
    >
      <div className="relative h-[240px]">
        {event.imageUrl && (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <Badge className={cn("absolute top-2 right-2", event.color)}>
          {event.startTime} - {event.endTime}
        </Badge>
        {/* Content */}
        <div className="absolute bottom-0 left-0 w-full p-3">
          <h3 className="mt-1 line-clamp-1 text-lg font-semibold text-white">
            {event.title}
          </h3>
          {event.location && (
            <p className="line-clamp-1 text-sm text-white/80">
              📍 {event.location}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
