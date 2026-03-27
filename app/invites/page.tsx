"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { useAuth } from "@/components/auth-provider";
import { timeAgo } from "@/lib/utils";

export default function InvitesPage() {
  const invites = useAppStore((s) => s.invites);
  const acceptInvite = useAppStore((s) => s.acceptInvite);
  const declineInvite = useAppStore((s) => s.declineInvite);
  const loadInvites = useAppStore((s) => s.loadInvites);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.email) {
      void loadInvites(user.email);
    }
  }, [loadInvites, user?.email]);

  const pendingInvites = invites.filter((invite) => invite.status === "sent");

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-display font-bold text-xl text-slate-800 mb-2">You have been invited</h1>
        <p className="text-sm text-slate-500 mb-6">
          Choose to accept or decline the invitations below.
        </p>

        {pendingInvites.length === 0 ? (
          <div className="bg-white rounded-2xl border border-surface-200 shadow-card px-6 py-8 text-center text-sm text-slate-400">
            No pending invites.
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-surface-200 shadow-card overflow-hidden">
            {pendingInvites.map((invite, index) => (
              <div
                key={invite.id}
                className={
                  "flex items-center gap-4 px-5 py-4" +
                  (index === 0 ? "" : " border-t border-surface-100")
                }
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                  style={{ backgroundColor: invite.projectColor ?? "#14b8a6" }}
                >
                  {invite.projectEmoji ?? "PRJ"}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-slate-700">
                    You were invited to{" "}
                    <span className="font-semibold text-slate-900">
                      {invite.projectName ?? "a project"}
                    </span>
                  </p>
                  <p className="text-xs text-slate-400 mt-1">{timeAgo(invite.createdAt)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => user && void acceptInvite(invite, user.id)}
                    className="h-8 px-3 rounded-lg bg-brand-500 text-white text-xs font-medium hover:bg-brand-600 transition-colors"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => void declineInvite(invite.id)}
                    className="h-8 px-3 rounded-lg bg-white/70 border border-white/70 text-xs font-medium text-slate-600 hover:bg-white transition-colors"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
