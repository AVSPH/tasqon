# TaskFlow — Modern Project Management App

A beautiful, MeisterTask-inspired Kanban project management frontend built with Next.js 14, TypeScript, Tailwind CSS, and @dnd-kit.

## ✨ Features

- **Kanban Board** with drag-and-drop task management across columns (To Do → In Progress → Review → Done)
- **Task Detail Modal** with full editing: title, description, checklist, comments, assignees, tags, due date, attachments
- **Dashboard** with productivity overview, activity feed, and tasks due today
- **Collapsible Sidebar** with project navigation
- **Search & Filter** by task title/description and priority
- **Invite Members** panel
- **Add Tasks** inline in columns
- **Add Columns** button
- Fully responsive with smooth animations
- Zustand state management with mock data

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🗂️ Project Structure

```
app/
  board/          → Kanban board (main view)
  dashboard/      → Productivity overview
  agenda/         → Calendar view (placeholder)
  notifications/  → Notification feed
  settings/       → Settings (placeholder)

components/
  layout/
    sidebar.tsx   → Collapsible left navigation
    navbar.tsx    → Top bar with search, filter, invite
  kanban/
    board.tsx     → DnD context + column layout
    column.tsx    → Droppable column with add-task
    task-card.tsx → Draggable task card
  modals/
    task-modal.tsx → Full task detail side panel

lib/
  types.ts        → TypeScript interfaces
  mock-data.ts    → Sample tasks, members, projects
  store.ts        → Zustand state store
  utils.ts        → Helpers, priority config, column config
```

## 🛠 Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** (custom design tokens)
- **@dnd-kit** (drag and drop)
- **Zustand** (state management)
- **lucide-react** (icons)
- **Plus Jakarta Sans** + **DM Sans** (typography)
