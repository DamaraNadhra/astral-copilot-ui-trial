import { Calendar } from "~/components/calendar"

export default function CalendarPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Calendar Events</h1>
      <Calendar />
    </div>
  )
}
