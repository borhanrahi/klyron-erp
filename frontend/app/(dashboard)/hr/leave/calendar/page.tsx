"use client";

import { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const leaveEvents = [
  { employee: "Sarah Chen", type: "Annual Leave", start: 1, end: 5, color: "bg-info" },
  { employee: "Mike Johnson", type: "Sick Leave", start: 10, end: 11, color: "bg-danger" },
  { employee: "Emily Davis", type: "Personal Leave", start: 15, end: 17, color: "bg-warning" },
  { employee: "Alex Kim", type: "Annual Leave", start: 20, end: 24, color: "bg-info" },
  { employee: "Rachel Martinez", type: "Annual Leave", start: 8, end: 9, color: "bg-info" },
  { employee: "David Park", type: "Sick Leave", start: 12, end: 12, color: "bg-danger" },
];

const calendarDays = Array.from({ length: 30 }, (_, i) => i + 1);
const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function LeaveCalendarPage() {
  const [currentMonth, setCurrentMonth] = useState("June 2024");

  const getEventsForDay = (day: number) => {
    return leaveEvents.filter((e) => day >= e.start && day <= e.end);
  };

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <PageHeader
        title="Leave Calendar"
        description="Visual overview of team leave schedules."
        breadcrumbs={[
          { label: "HRM", href: "/hr" },
          { label: "Leave", href: "/hr/leaves" },
          { label: "Calendar" },
        ]}
        icon={<Calendar className="h-6 w-6 text-primary" />}
      />

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <h3 className="text-lg font-semibold">{currentMonth}</h3>
            <button className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-info" />
              <span className="text-xs text-muted-foreground">Annual</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-danger" />
              <span className="text-xs text-muted-foreground">Sick</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-warning" />
              <span className="text-xs text-muted-foreground">Personal</span>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-7 gap-2 mb-2">
            {weekDays.map((day) => (
              <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day) => {
              const events = getEventsForDay(day);
              const isWeekend = (day + 3) % 7 === 0 || (day + 3) % 7 === 6;
              return (
                <div
                  key={day}
                  className={`min-h-[80px] p-2 rounded-xl border border-border ${isWeekend ? 'bg-muted/30' : 'bg-card'} hover:ring-2 hover:ring-primary/30 transition-all cursor-pointer`}
                >
                  <span className={`text-sm font-medium ${isWeekend ? 'text-muted-foreground' : ''}`}>{day}</span>
                  <div className="mt-1 space-y-1">
                    {events.map((event, i) => (
                      <div
                        key={i}
                        className={`text-[10px] ${event.color} text-white px-1.5 py-0.5 rounded truncate`}
                        title={`${event.employee} - ${event.type}`}
                      >
                        {event.employee.split(" ")[0]}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm p-6">
        <h3 className="text-sm font-semibold mb-4">Upcoming Leaves</h3>
        <div className="space-y-3">
          {leaveEvents.map((event, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-xl">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-8 rounded-full ${event.color}`} />
                <div>
                  <p className="text-sm font-medium">{event.employee}</p>
                  <p className="text-xs text-muted-foreground">{event.type}</p>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">
                Jun {event.start} - Jun {event.end}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
