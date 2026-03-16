"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";

interface AuthGateProps {
  children: React.ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);

  return (
    <div className="relative flex-1 min-h-0">
      <div className={cn("h-full", !isAuthenticated && "pointer-events-none blur-[2px]")}> 
        {children}
      </div>
      {!isAuthenticated && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/85 backdrop-blur-xl border border-white/70 shadow-modal rounded-3xl px-8 py-7 text-center animate-scale-in">
            <div className="w-12 h-12 rounded-2xl bg-white/70 border border-white/70 flex items-center justify-center mx-auto mb-4">
              <span className="text-xl">🔒</span>
            </div>
            <h2 className="font-display font-semibold text-slate-800 text-lg">Sign in to continue</h2>
            <p className="text-sm text-slate-400 mt-1">Your data is hidden until you sign in.</p>
          </div>
        </div>
      )}
    </div>
  );
}
