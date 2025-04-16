"use client";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  TouchSensor,
} from "@dnd-kit/core";
import { useState, useRef } from "react";
import { Draggable } from "~/components/Draggable";
import { Droppable } from "~/components/Droppable";
import { cn } from "~/lib/utils";

const itemsPerPage = 4;
const totalPages = 3;

export default function CarouselDnD() {
  const [activeId, setActiveId] = useState(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 1000,
      tolerance: 5,
    },
  });
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    }),
    touchSensor,
  );
  const [isDragging, setIsDragging] = useState(false);
  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setActiveId(null);
    setIsDragging(false);
  };

  const scrollToPage = (page: number) => {
    const container = containerRef.current;
    if (container) {
      container.scrollTo({
        left: page * container.clientWidth,
        behavior: "smooth",
      });
    }
  };
  const [items, setItems] = useState<
    { id: string; title: string; page: string }[]
  >([
    {
      id: "1",
      title: "Item 1",
      page: "page-0",
    },
    {
      id: "2",
      title: "Item 2",
      page: "page-0",
    },
    {
      id: "3",
      title: "Item 3",
      page: "page-1",
    },
    {
      id: "4",
      title: "Item 4",
      page: "page-2",
    },
  ]);
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div
        ref={containerRef}
        className={cn(
          "flex w-full snap-x snap-mandatory overflow-x-auto scroll-smooth border",
          isDragging && "touch-none",
        )}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {Array.from({ length: totalPages }).map((_, pageIndex) => (
          <Droppable
            key={pageIndex}
            id={`page-${pageIndex}`}
            className="flex min-w-full snap-start flex-col gap-4 p-4"
          >
            {items
              .filter((item) => item.page === `page-${pageIndex}`)
              .map((item) => {
                return (
                  <Draggable
                    key={item.id}
                    id={item.id}
                    className="w-full rounded border bg-gray-100 p-4"
                    onClick={() => {
                      console.log("clicked");
                    }}
                  >
                    {item.title}
                  </Draggable>
                );
              })}
          </Droppable>
        ))}
      </div>

      {/* Optional shoulder hitboxes for early scroll */}
      {activeId && (
        <>
          <div
            className="fixed top-0 left-0 z-50 h-full w-10"
            onDragEnter={() => scrollToPage(0)}
          />
          <div
            className="fixed top-0 right-0 z-50 h-full w-10"
            onDragEnter={() => scrollToPage(totalPages - 1)}
          />
        </>
      )}

      <DragOverlay>
        {activeId && (
          <div className="rounded bg-blue-200 p-4 shadow">{activeId}</div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
