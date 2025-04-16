import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "../lib/utils";

interface DraggableProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  isOverlay?: boolean;
}

export function Draggable({
  id,
  children,
  className,
  isOverlay = false,
}: DraggableProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id,
    });

  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
        // position: isDragging ? ("fixed" as const) : ("relative" as const),
        // zIndex: isDragging ? 1000 : undefined,
      }
    : undefined;

  return (
    <div
      suppressHydrationWarning
      ref={setNodeRef}
      // style={isOverlay ? undefined : style}
      {...listeners}
      {...attributes}
      className={cn(
        isOverlay &&
          isOverlay &&
          "bg-muted z-50 scale-105 cursor-grabbing opacity-80",
        className,
      )}
    >
      {children}
    </div>
  );
}
