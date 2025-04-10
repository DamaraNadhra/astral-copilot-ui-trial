import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "../lib/utils";
import { useSortable } from "@dnd-kit/react/sortable";
interface SortableProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export function Sortable({ id, children, className }: SortableProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(className)}
    >
      {children}
    </div>
  );
}
