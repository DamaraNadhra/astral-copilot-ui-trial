import type { Event } from "~/lib/data";
import { Draggable } from "./Draggable";
import { Droppable } from "./Droppable";
import { cn } from "~/lib/utils";
import moment from "~/utils/moment-adapter";
import { Separator } from "./ui/separator";
import MobileAppEventComponent from "./mobileAppEventComponent";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "./ui/carousel";
import { useEffect, useRef, useState } from "react";

const EDGE_THRESHOLD = 50; // px from edge
const SCROLL_DELAY = 220;

interface MobileViewProps {
  currentDate: Date;
  events: Event[];
  onEventClick: (event: Event) => void;
  onTimeSlotClick: (date: Date, hour: number) => void;
  currentWeek: Date[];
  setCurrentDate: (date: Date) => void;
  isDragging: boolean;
  setDndKey: (key: string) => void;
}

export function MobileView({
  currentDate,
  events,
  onEventClick,
  onTimeSlotClick,
  setCurrentDate,
  currentWeek,
  isDragging,
  setDndKey,
}: MobileViewProps) {
  // Filter events for the current day
  const dayEvents = events.filter(
    (event) =>
      event.date.getDate() === currentDate.getDate() &&
      event.date.getMonth() === currentDate.getMonth() &&
      event.date.getFullYear() === currentDate.getFullYear(),
  );

  // Generate time slots for the day (24 hours)
  const timeSlots = Array.from({ length: 24 }, (_, i) => i);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    function handlePointerMove(e: PointerEvent) {
      if (!isDragging) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        return;
      }

      const { clientX } = e;
      const screenWidth = window.innerWidth;
      const isRightEdge = clientX > screenWidth - EDGE_THRESHOLD;
      const isLeftEdge = clientX < EDGE_THRESHOLD;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      // Right edge
      if (isRightEdge || isLeftEdge) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          if (isRightEdge) {
            api?.scrollNext();
          } else if (isLeftEdge) {
            api?.scrollPrev();
          }
          // setDndKey(`dnd-${Date.now()}`);
          timeoutRef.current = null;
        }, SCROLL_DELAY);
      }
    }

    window.addEventListener("pointermove", handlePointerMove);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [api, isDragging]);

  const dummyEvent = {
    id: "dummy",
    title: "Dummy Event",
    description: "Dummy Description",
    date: new Date(),
    startTime: "10:00",
    endTime: "11:00",
    color: "bg-red-500",
    duration: 60,
    imageUrl:
      "http://fastly.picsum.photos/id/737/1920/1080.jpg?hmac=aFzER8Y4wcWTrXVx2wVKSj10IqnygaF33gESj0WGDwI",
    location: "Dummy Location",
  };

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);
    const initialSlide = currentWeek.findIndex((date) =>
      moment(date).isSame(currentDate, "day"),
    );
    api.scrollTo(initialSlide);

    api.on("select", () => {
      const selectedDate = currentWeek[api.selectedScrollSnap()];
      if (selectedDate) {
        setCurrentDate(selectedDate);
      }
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Current date header */}
      <div className="flex flex-col gap-2 bg-[#557af2] bg-gradient-to-l from-[#8563f2] to-[#557af2] py-4">
        <span className="p-4 text-start text-2xl font-semibold text-white">
          Your Schedule
        </span>
        <div className="mx-4 flex flex-row justify-between">
          {currentWeek.map((date) => (
            <div
              key={date.toISOString()}
              className={cn(
                `flex min-w-[50px] flex-col gap-2 rounded-xl p-2`,
                date.toISOString() === currentDate.toISOString()
                  ? "bg-purple-500 bg-gradient-to-br from-[#534be2] to-[#7145e7]"
                  : "bg-white/10",
                "cursor-pointer transition-colors duration-200 hover:bg-white/20",
              )}
              onClick={() => {
                setCurrentDate(date);
                api?.scrollTo(currentWeek.findIndex((d) => d.toISOString() === date.toISOString()));
              }}
            >
              <span className="text-center text-sm text-white">
                {moment(date).format("ddd")}
              </span>
              <span className="text-center font-semibold text-white">
                {moment(date).format("DD")}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-row gap-2 bg-white p-4">
        <h2 className="text-2xl font-semibold whitespace-nowrap text-gray-600">
          {currentDate.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </h2>
        <Separator className="mt-4 mr-4 w-auto" />
      </div>

      <Carousel
        setApi={setApi}
        opts={{
          watchDrag: isDragging ? false : true,
        }}
      >
        <CarouselContent>
          {currentWeek.map((date) => {
            const dayEvents = events.filter(
              (event) =>
                event.date.getDate() === date.getDate() &&
                event.date.getMonth() === date.getMonth() &&
                event.date.getFullYear() === date.getFullYear(),
            );
            return (
              <CarouselItem
                className="basis-[90%]"
                key={date.toISOString()}
                id={`mobile-${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`}
              >
                <Droppable
                  className="h-full"
                  id={`mobile-${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`}
                >
                  <div className="flex min-h-[40rem] flex-grow flex-col gap-2 p-4">
                    {dayEvents.length > 0 ? (
                      dayEvents.map((event) => (
                        <Draggable key={event.id} id={event.id}>
                          <MobileAppEventComponent
                            key={event.id}
                            event={event}
                            onClick={() => {
                              onEventClick(event);
                            }}
                          />
                        </Draggable>
                      ))
                    ) : (
                      <div className="flex items-center justify-center">
                        <p className="text-gray-500">No events for this day</p>
                      </div>
                    )}
                  </div>
                </Droppable>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
