import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "../lib/utils";

interface DraggableProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  isOverlay?: boolean;
  onClick?: () => void;
}

export function Draggable({
  id,
  children,
  className,
  isOverlay = false,
  onClick,
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
      // style={style}
      {...listeners}
      {...attributes}
      className={cn(
        isOverlay && "bg-muted z-50 scale-105 cursor-grabbing opacity-80",
        className,
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
