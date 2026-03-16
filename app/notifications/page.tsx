"use client";
import { Bell } from "lucide-react";
import { cn, timeAgo } from "@/lib/utils";
import { useAppStore } from "@/lib/store";

export default function NotificationsPage() {
  const projects = useAppStore((s) => s.projects);
  const activeProjectId = useAppStore((s) => s.activeProjectId);
  const activeProject = projects.find((p) => p.id === activeProjectId);

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-display font-bold text-xl text-slate-800 mb-5">Notifications</h1>
        <div className="bg-white rounded-2xl border border-surface-200 shadow-card overflow-hidden">
          {(activeProject?.activities ?? []).map((item, i) => (
            <div key={item.id} className={cn("flex gap-4 px-5 py-4 hover:bg-surface-50 transition-colors", i !== 0 && "border-t border-surface-100")}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ backgroundColor: item.user.color }}>
                {item.user.initials}
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-700">
                  <span className="font-semibold text-slate-900">{item.user.name}</span>{" "}
                  {item.action}{" "}
                  <span className="text-brand-600 font-medium">{item.target}</span>
                </p>
                <p className="text-xs text-slate-400 mt-1">{timeAgo(item.createdAt)}</p>
              </div>
              <div className="w-2 h-2 rounded-full bg-brand-500 mt-1.5 shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
