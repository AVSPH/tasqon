"use client";
import React, { useState } from "react";
import {
  X, Trash2, Archive, Tag, Users, Move, Flag
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";
import type { Priority } from "@/lib/types";

const PRIORITY_OPTIONS: { label: string; value: Priority }[] = [
  { label: "Urgent", value: "urgent" },
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" },
];

export function BulkActionsToolbar() {
  const selectedTaskIds = useAppStore((s) => s.selectedTaskIds);
  const clearSelection = useAppStore((s) => s.clearSelection);
  const bulkArchive = useAppStore((s) => s.bulkArchive);
  const bulkUnarchive = useAppStore((s) => s.bulkUnarchive);
  const bulkUpdatePriority = useAppStore((s) => s.bulkUpdatePriority);
  const bulkAssignTo = useAppStore((s) => s.bulkAssignTo);
  const bulkAddTags = useAppStore((s) => s.bulkAddTags);
  const bulkMoveToColumn = useAppStore((s) => s.bulkMoveToColumn);
  const tasks = useAppStore((s) => s.tasks);
  const members = useAppStore((s) => s.members);
  const tags = useAppStore((s) => s.tags);
  const columns = useAppStore((s) => s.columns);

  const [showPriorityMenu, setShowPriorityMenu] = useState(false);
  const [showAssigneeMenu, setShowAssigneeMenu] = useState(false);
  const [showTagMenu, setShowTagMenu] = useState(false);
  const [showColumnMenu, setShowColumnMenu] = useState(false);

  if (selectedTaskIds.length === 0) return null;

  // Determine which tasks are archived and which are not
  const selectedTasks = tasks.filter((t) => selectedTaskIds.includes(t.id));
  const hasArchivedTasks = selectedTasks.some((t) => t.archived);
  const hasUnarchivedTasks = selectedTasks.some((t) => !t.archived);

  const handleArchive = async () => {
    try {
      await bulkArchive(selectedTaskIds);
      toast.success(`${selectedTaskIds.length} task(s) archived`);
    } catch {
      toast.error("Failed to archive tasks");
    }
  };

  const handleUnarchive = async () => {
    try {
      await bulkUnarchive(selectedTaskIds);
      toast.success(`${selectedTaskIds.length} task(s) unarchived`);
    } catch {
      toast.error("Failed to unarchive tasks");
    }
  };

  const handlePriorityChange = async (priority: Priority) => {
    try {
      await bulkUpdatePriority(selectedTaskIds, priority);
      toast.success(`Priority updated for ${selectedTaskIds.length} task(s)`);
      setShowPriorityMenu(false);
    } catch {
      toast.error("Failed to update priority");
    }
  };

  const handleAssignTo = async (userId: string) => {
    try {
      await bulkAssignTo(selectedTaskIds, [userId]);
      toast.success(`${selectedTaskIds.length} task(s) assigned`);
      setShowAssigneeMenu(false);
    } catch {
      toast.error("Failed to assign tasks");
    }
  };

  const handleAddTags = async (tagId: string) => {
    try {
      await bulkAddTags(selectedTaskIds, [tagId]);
      toast.success(`Tags added to ${selectedTaskIds.length} task(s)`);
      setShowTagMenu(false);
    } catch {
      toast.error("Failed to add tags");
    }
  };

  const handleMoveToColumn = async (columnId: string) => {
    try {
      await bulkMoveToColumn(selectedTaskIds, columnId);
      toast.success(`${selectedTaskIds.length} task(s) moved`);
      setShowColumnMenu(false);
    } catch {
      toast.error("Failed to move tasks");
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-xl rounded-2xl border border-white/70 shadow-lg p-4 z-40">
      <div className="flex items-center gap-3">
        {/* Selection count */}
        <span className="text-sm font-medium text-slate-700 whitespace-nowrap">
          {selectedTaskIds.length} selected
        </span>

        <div className="w-px h-6 bg-slate-200" />

        {/* Priority button */}
        <div className="relative">
          <button
            onClick={() => setShowPriorityMenu(!showPriorityMenu)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/70 transition-colors text-sm text-slate-700"
            title="Change priority"
          >
            <Flag className="w-4 h-4" />
            Priority
          </button>
          {showPriorityMenu && (
            <div className="absolute bottom-full mb-2 left-0 bg-white rounded-lg shadow-lg border border-white/70 py-1 min-w-max">
              {PRIORITY_OPTIONS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => handlePriorityChange(p.value)}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm text-slate-700"
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Assign button */}
        <div className="relative">
          <button
            onClick={() => setShowAssigneeMenu(!showAssigneeMenu)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/70 transition-colors text-sm text-slate-700"
            title="Assign to member"
          >
            <Users className="w-4 h-4" />
            Assign
          </button>
          {showAssigneeMenu && (
            <div className="absolute bottom-full mb-2 left-0 bg-white rounded-lg shadow-lg border border-white/70 py-1 min-w-max max-h-60 overflow-y-auto">
              {members.map((m) => (
                <button
                  key={m.id}
                  onClick={() => handleAssignTo(m.id)}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm text-slate-700 flex items-center gap-2"
                >
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ backgroundColor: m.color }}
                  >
                    {m.initials}
                  </div>
                  {m.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Tags button */}
        <div className="relative">
          <button
            onClick={() => setShowTagMenu(!showTagMenu)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/70 transition-colors text-sm text-slate-700"
            title="Add tags"
          >
            <Tag className="w-4 h-4" />
            Tags
          </button>
          {showTagMenu && (
            <div className="absolute bottom-full mb-2 left-0 bg-white rounded-lg shadow-lg border border-white/70 py-1 min-w-max max-h-60 overflow-y-auto">
              {tags.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleAddTags(t.id)}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm text-slate-700"
                >
                  <span
                    className="inline-flex items-center h-5 px-2 rounded-full text-[10px] font-semibold"
                    style={{ backgroundColor: t.color + "18", color: t.color }}
                  >
                    {t.label}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Move button */}
        <div className="relative">
          <button
            onClick={() => setShowColumnMenu(!showColumnMenu)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/70 transition-colors text-sm text-slate-700"
            title="Move to column"
          >
            <Move className="w-4 h-4" />
            Move
          </button>
          {showColumnMenu && (
            <div className="absolute bottom-full mb-2 left-0 bg-white rounded-lg shadow-lg border border-white/70 py-1 min-w-max">
              {columns.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleMoveToColumn(c.id)}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm text-slate-700 flex items-center gap-2"
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: c.color }}
                  />
                  {c.title}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Archive/Unarchive buttons */}
        {hasUnarchivedTasks && (
          <button
            onClick={handleArchive}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-amber-50 transition-colors text-sm text-amber-600"
            title="Archive selected tasks"
          >
            <Archive className="w-4 h-4" />
            Archive
          </button>
        )}
        {hasArchivedTasks && (
          <button
            onClick={handleUnarchive}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-green-50 transition-colors text-sm text-green-600"
            title="Unarchive selected tasks"
          >
            <Archive className="w-4 h-4" />
            Unarchive
          </button>
        )}

        {/* Close button */}
        <button
          onClick={clearSelection}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors text-sm text-slate-500"
          title="Clear selection"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
