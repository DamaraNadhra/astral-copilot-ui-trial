import { Calendar } from "~/components/calendar"

export default function CalendarPage() {
  return (
    <div className="h-screen">
      <span className="text-3xl font-bold mb-6 hidden md:flex">Calendar Events</span>
      <Calendar />
    </div>
  )
}
