"use client";

import { useState } from "react";
import { Calendar } from "~/components/calendar";

export default function CalendarPage() {
  const [currentDeviceView, setCurrentDeviceView] = useState<
    "desktop" | "mobile"
  >("desktop");
  return (
    <div className="h-screen">
      {currentDeviceView === "desktop" && (
        <span className="my-6 text-3xl font-bold flex justify-center items-center text-center w-full">
          Calendar Events
        </span>
      )}
      <Calendar
        currentDeviceView={currentDeviceView}
        setCurrentDeviceView={setCurrentDeviceView}
      />
    </div>
  );
}
