"use client";
import { useMemo } from "react";
import { Bell } from "lucide-react";
import { cn, timeAgo } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import { useAuth } from "@/components/auth-provider";

export default function NotificationsPage() {
  const projects = useAppStore((s) => s.projects);
  const activeProjectId = useAppStore((s) => s.activeProjectId);
  const activeProject = projects.find((p) => p.id === activeProjectId);
  const { user } = useAuth();

  const notifications = useMemo(() => {
    const baseActivities = activeProject?.activities ?? [];
    const seedSource = user?.id ?? user?.email ?? "guest";
    const hashString = (value: string) => {
      let hash = 0;
      for (let i = 0; i < value.length; i += 1) {
        hash = (hash << 5) - hash + value.charCodeAt(i);
        hash |= 0;
      }
      return Math.abs(hash);
    };
    const seed = hashString(seedSource);

    return [...baseActivities]
      .sort((a, b) => hashString(a.id + seed) - hashString(b.id + seed))
      .slice(0, 8);
  }, [activeProject?.activities, user?.email, user?.id]);

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-display font-bold text-xl text-slate-800 mb-5">Notifications</h1>
        <div className="bg-white rounded-2xl border border-surface-200 shadow-card overflow-hidden">
          {notifications.map((item, i) => (
            <div
              key={item.id}
              className={cn(
                "flex gap-4 px-5 py-4 hover:bg-surface-50 transition-colors",
                i !== 0 && "border-t border-surface-100",
              )}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                style={{ backgroundColor: item.user.color }}
              >
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
          {notifications.length === 0 && (
            <div className="px-5 py-8 text-center text-sm text-slate-400">
              No notifications yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
