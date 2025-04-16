"use client";

import { useEffect, useRef, useState } from "react";
import {
  FileText,
  Image as ImageIcon,
  File,
  Flag,
  ExternalLink,
} from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import { Badge } from "./ui/badge";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";

pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;

export default function AttachmentPreviewCard({
  url,
  setTotalPages,
  totalPages,
  link,
  onInvalid,
}: {
  url: string;
  setTotalPages: (pages: number) => void;
  totalPages: number;
  link: string;
  onInvalid: () => void;
}) {
  const [error, setError] = useState<Error | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [pageWidth, setPageWidth] = useState(288);
  const containerRef = useRef<HTMLDivElement>(null);
  const handleError = (error: Error) => {
    setError(error);
    console.error("PDF loading error:", error);
  };

  useEffect(() => {
    const resize = () => {
      if (containerRef.current) {
        setPageWidth(containerRef.current.offsetWidth);
      }
    };

    resize(); // initial

    const observer = new ResizeObserver(() => resize());
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex h-42 w-full cursor-pointer items-start gap-3 overflow-hidden rounded-l-lg border shadow-sm transition-all duration-200 hover:shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Document
        file={url}
        loading={
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2 p-4">
            <Skeleton className="h-[80%] w-full rounded-md" />
            <Skeleton className="h-4 w-3/4 rounded-md" />
          </div>
        }
        onLoadError={handleError}
        error={
          <div className="absolute inset-0 flex h-full w-full flex-col items-center justify-center space-y-3 p-4">
            <div className="bg-destructive/10 flex h-12 w-12 items-center justify-center rounded-full">
              <FileText className="text-destructive h-6 w-6" />
            </div>
            <div className="flex flex-col items-center space-y-1">
              <span className="text-destructive text-sm font-medium">
                Unable to load PDF
              </span>
            </div>
          </div>
        }
        onError={handleError}
        onLoadSuccess={({ numPages }) => {
          setTotalPages(numPages);
        }}
      >
        <Page
          pageNumber={1}
          className="w-full"
          width={pageWidth}
          height={128}
          renderTextLayer={false}
          renderAnnotationLayer={false}
        />
      </Document>

      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity duration-200",
          isHovered && "opacity-100",
        )}
      >
        <Button
          variant="secondary"
          size="sm"
          className="cursor-pointer bg-white/90 hover:bg-white"
          onClick={(e) => {
            e.stopPropagation();
            window.open(link, "_blank");
          }}
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          Open
        </Button>

        <Button
          variant="destructive"
          size="sm"
          className="bg-destructive/90 hover:bg-destructive cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onInvalid();
          }}
        >
          <Flag className="mr-2 h-4 w-4" />
          Invalid
        </Button>
      </div>

      <Badge className="absolute right-2 bottom-2 opacity-90" variant="default">
        {totalPages} pages
      </Badge>
    </div>
  );
}
