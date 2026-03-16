"use client";
import { useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { TaskModal } from "@/components/modals/task-modal";
import { cn, formatDate, isOverdue } from "@/lib/utils";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function toDateKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function AgendaPage() {
  const tasks = useAppStore((s) => s.tasks);
  const preferences = useAppStore((s) => s.preferences);
  const selectedTask = useAppStore((s) => s.selectedTask);
  const setSelectedTask = useAppStore((s) => s.setSelectedTask);

  const todayKey = toDateKey(new Date());
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(todayKey);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 0);
  const leadingBlankDays = preferences.weekStartsOnMonday
    ? (monthStart.getDay() + 6) % 7
    : monthStart.getDay();
  const daysInMonth = monthEnd.getDate();

  const tasksByDate: Record<string, typeof tasks> = {};
  tasks.forEach((task) => {
    if (!task.dueDate) return;
    if (!preferences.showCompleted && task.status === "done") return;
    if (!tasksByDate[task.dueDate]) tasksByDate[task.dueDate] = [];
    tasksByDate[task.dueDate].push(task);
  });

  const selectedTasks = tasksByDate[selectedDate] ?? [];
  const noDate = tasks.filter((t) => !t.dueDate && (preferences.showCompleted || t.status !== "done"));

  return (
    <>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto space-y-5">
          <div>
            <h1 className="font-display font-bold text-2xl text-slate-800">Agenda</h1>
            <p className="text-sm text-slate-400 mt-1">Calendar-style view of your upcoming work.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-5">
            <div className={cn(
              "bg-white/80 backdrop-blur-xl border border-white/70 shadow-card rounded-2xl p-5",
              preferences.enableAnimations && "animate-fade-up"
            )}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-brand-500" />
                  <h2 className="font-display font-semibold text-slate-800">
                    {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
                    className="w-8 h-8 rounded-lg bg-white/70 border border-white/70 hover:bg-white/90 flex items-center justify-center"
                  >
                    <ChevronLeft className="w-4 h-4 text-slate-500" />
                  </button>
                  <button
                    onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
                    className="w-8 h-8 rounded-lg bg-white/70 border border-white/70 hover:bg-white/90 flex items-center justify-center"
                  >
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 text-[11px] text-slate-400 mb-2">
                {(preferences.weekStartsOnMonday
                  ? [...WEEKDAYS.slice(1), WEEKDAYS[0]]
                  : WEEKDAYS
                ).map((day) => (
                  <div key={day} className="py-1 text-center font-semibold uppercase tracking-wider">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: leadingBlankDays }).map((_, i) => (
                  <div key={`blank-${i}`} className="h-16 rounded-xl bg-transparent" />
                ))}

                {Array.from({ length: daysInMonth }).map((_, index) => {
                  const day = index + 1;
                  const dateKey = toDateKey(new Date(year, month, day));
                  const hasTasks = (tasksByDate[dateKey]?.length ?? 0) > 0;
                  const isToday = dateKey === todayKey;
                  const isSelected = dateKey === selectedDate;
                  return (
                    <button
                      key={dateKey}
                      onClick={() => setSelectedDate(dateKey)}
                      className={cn(
                        "h-16 rounded-xl border border-white/70 bg-white/60 hover:bg-white/90 transition-colors flex flex-col items-center justify-center gap-1",
                        isSelected && "ring-2 ring-brand-300",
                        isToday && "bg-brand-50/70"
                      )}
                    >
                      <span className={cn("text-sm font-semibold", isToday ? "text-brand-700" : "text-slate-700")}>
                        {day}
                      </span>
                      <div className="flex items-center gap-1">
                        {hasTasks ? (
                          <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                        ) : (
                          <span className="h-1.5 w-1.5 rounded-full bg-slate-200" />
                        )}
                        {hasTasks && (
                          <span className="text-[10px] text-slate-400">
                            {tasksByDate[dateKey].length}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div
              className={cn(
                "bg-white/80 backdrop-blur-xl border border-white/70 shadow-card rounded-2xl overflow-hidden",
                preferences.enableAnimations && "animate-fade-up"
              )}
              style={preferences.enableAnimations ? { animationDelay: "80ms" } : undefined}
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/70">
                <div>
                  <h2 className="font-display font-semibold text-slate-800">Tasks</h2>
                  <p className="text-xs text-slate-400">{formatDate(selectedDate)}</p>
                </div>
                <span className="text-xs text-slate-400">{selectedTasks.length} tasks</span>
              </div>

              {selectedTasks.length === 0 ? (
                <div className="px-5 py-6 text-sm text-slate-400">No tasks due on this date.</div>
              ) : (
                <div className="divide-y divide-white/70">
                  {selectedTasks.map((task) => (
                    <button
                      key={task.id}
                      onClick={() => setSelectedTask(task)}
                      className="w-full text-left flex items-center gap-3 px-5 py-3 hover:bg-white/70 transition-colors"
                    >
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        isOverdue(task.dueDate) ? "bg-red-500" : "bg-brand-500"
                      )} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-700 truncate">{task.title}</p>
                        <p className="text-xs text-slate-400">{task.status}</p>
                      </div>
                      <span className={cn(
                        "text-xs font-medium",
                        isOverdue(task.dueDate) ? "text-red-500" : "text-slate-400"
                      )}>
                        {formatDate(task.dueDate)}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {noDate.length > 0 && (
                <div className="border-t border-white/70 px-5 py-4">
                  <p className="text-xs uppercase tracking-widest text-slate-400 mb-2">No Due Date</p>
                  <div className="space-y-2">
                    {noDate.slice(0, 4).map((task) => (
                      <button
                        key={task.id}
                        onClick={() => setSelectedTask(task)}
                        className="w-full text-left flex items-center gap-2.5 rounded-lg px-3 py-2 bg-white/70 hover:bg-white transition-colors"
                      >
                        <span className="w-2 h-2 rounded-full bg-slate-300" />
                        <span className="text-sm text-slate-700 truncate">{task.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedTask && (
        <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </>
  );
}
