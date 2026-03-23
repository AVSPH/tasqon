"use client";
import { useEffect, useState } from "react";
import { User, SlidersHorizontal, ShieldCheck } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth-provider";
import { updateUserProfile } from "@/lib/auth";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user, isAuthenticated, isLoading, signOut } = useAuth();
  const preferences = useAppStore((s) => s.preferences);
  const updatePreferences = useAppStore((s) => s.updatePreferences);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setName((user.user_metadata?.full_name as string) ?? "");
      setEmail(user.email ?? "");
    } else {
      setName("");
      setEmail("");
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    try {
      await updateUserProfile({
        fullName: name.trim() || undefined,
        email: email.trim() || undefined,
      });
      setSaved(true);
      window.setTimeout(() => setSaved(false), 1500);
      toast.success("Profile updated");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Update failed";
      toast.error(message);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-slate-800">Settings</h1>
          <p className="text-sm text-slate-400 mt-1">Personalize your workspace and preferences.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-white/80 backdrop-blur-xl border border-white/70 shadow-card rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-white/70 border border-white/70 flex items-center justify-center">
                <User className="w-4 h-4 text-brand-500" />
              </div>
              <div>
                <h2 className="font-display font-semibold text-slate-800">Profile</h2>
                <p className="text-xs text-slate-400">Manage your personal details.</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-500">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-9 mt-1 px-3 rounded-lg bg-white/70 border border-white/70 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400/30"
                  disabled={!isAuthenticated || isLoading}
                />
              </div>
              <div>
                <label className="text-xs text-slate-500">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-9 mt-1 px-3 rounded-lg bg-white/70 border border-white/70 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400/30"
                  disabled={!isAuthenticated || isLoading}
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSave}
                  className="h-8 px-3 rounded-lg bg-brand-500 text-white text-xs font-medium hover:bg-brand-600 transition-colors"
                  disabled={!isAuthenticated || isLoading}
                >
                  Save changes
                </button>
                {saved && <span className="text-xs text-emerald-500">Saved</span>}
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl border border-white/70 shadow-card rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-white/70 border border-white/70 flex items-center justify-center">
                <SlidersHorizontal className="w-4 h-4 text-brand-500" />
              </div>
              <div>
                <h2 className="font-display font-semibold text-slate-800">Preferences</h2>
                <p className="text-xs text-slate-400">Tune your workspace experience.</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-xl border border-white/70 bg-white/70 px-3 py-2.5">
                <label className="text-xs text-slate-500">Theme</label>
                <select
                  value={preferences.theme}
                  onChange={(e) =>
                    updatePreferences({
                      theme: e.target.value as typeof preferences.theme,
                    })
                  }
                  className="w-full h-9 mt-1 px-3 rounded-lg bg-white/70 border border-white/70 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400/30"
                >
                  <option value="mist">Mist (light, airy)</option>
                  <option value="linen">Linen (warm light)</option>
                  <option value="dark">Midnight (dark)</option>
                </select>
              </div>
              {[
                {
                  id: "compactMode",
                  label: "Compact board spacing",
                  description: "Reduce padding and gaps in the Project board.",
                },
                {
                  id: "showCompleted",
                  label: "Show completed tasks",
                  description: "Include tasks in the Done column and agenda.",
                },
                {
                  id: "weekStartsOnMonday",
                  label: "Week starts on Monday",
                  description: "Use Monday as the first day in Agenda.",
                },
                {
                  id: "enableAnimations",
                  label: "Enable animations",
                  description: "Turn on subtle UI motion.",
                },
              ].map((item) => (
                <label
                  key={item.id}
                  className="flex items-start gap-3 rounded-xl border border-white/70 bg-white/70 px-3 py-2.5"
                >
                  <input
                    type="checkbox"
                    checked={preferences[item.id as keyof typeof preferences] as boolean}
                    onChange={(e) => updatePreferences({ [item.id]: e.target.checked })}
                    className="mt-1"
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-700">{item.label}</p>
                    <p className="text-xs text-slate-400">{item.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-white/70 shadow-card rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-white/70 border border-white/70 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-brand-500" />
            </div>
            <div>
              <h2 className="font-display font-semibold text-slate-800">Session</h2>
              <p className="text-xs text-slate-400">Manage your current session.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-sm text-slate-700">Signed in as</p>
              <p className="text-xs text-slate-400">{user?.email ?? "Not signed in"}</p>
            </div>
            <button
              onClick={signOut}
              className={cn(
                "h-8 px-3 rounded-lg text-xs font-medium border transition-colors",
                isAuthenticated
                  ? "border-red-200 text-red-600 hover:bg-red-50"
                  : "border-slate-200 text-slate-400 cursor-not-allowed"
              )}
              disabled={!isAuthenticated}
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
