# 🚀 Voboghure — ভবঘুরে

> **A Private Multi-Community Platform** — where every event becomes a story, every story becomes a memory, and every memory stays alive forever.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres%20%2B%20Auth%20%2B%20Realtime-3FCF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?logo=vercel&logoColor=white)](https://voboghure.vercel.app)

**Live:** [voboghure.vercel.app](https://voboghure.vercel.app)

---

## 🎯 What is Voboghure?

Voboghure (*ভবঘুরে* — "the wanderer") is a private platform where friend circles form their own communities, live moments together through **events**, preserve them as **structured stories**, and selectively share those memories with the outside world.

### Platform Principles

| Principle | Meaning |
|-----------|---------|
| 🔒 Private by default | Not joined = no access |
| 🏘️ Community-based access | Every piece of content belongs to a community |
| 🧠 Structured memory | Event → Story → Memory pipeline |
| 🖼️ Zero media storage | Images via Google Photos links only — no uploads |
| 📤 Selective sharing | Only stories can be made publicly shareable |

---

## ✨ Features

- 🔐 **Authentication** — email/password, password reset, protected routes
- 🏘️ **Communities** — create or join via code, join-request approval flow, private & invite-only types
- 🧭 **Community Home** — dashboard per community: recent stories, upcoming events, gallery preview, member count
- 🔄 **Multi-community** — switcher with one active community at a time
- 📅 **Events** — admin-created events with details, participation, real-time photo galleries
- 📖 **Stories** — event-linked & standalone memories with reactions and comments; public/shareable mode coming
- 🖼️ **Gallery** — link-based photo collections, event-based & general
- 👥 **Members** — profiles, roles, activity history
- 🔔 **Notifications** — real-time, database-trigger based
- 👑 **Admin Panel** — role management, join request approvals
- 🌓 **Dark/Light theme** — full theming support

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 · TypeScript · Vite |
| UI | Tailwind CSS 4 · shadcn/ui · Radix Primitives · Framer Motion · Lucide Icons |
| State/Data | TanStack Query · React Context · React Hook Form + Zod |
| Backend | Supabase (Postgres, Auth, Realtime, Storage, RLS) |
| Testing | Vitest · Testing Library |
| Hosting | Vercel |

---

## ⚡ Getting Started

### Prerequisites
- Node.js 18+
- npm (or bun)

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/hellomoinul/voboghure-39a07f26.git
cd voboghure-39a07f26

# 2. Install dependencies
npm install

# 3. Create your .env file (ask the lead for values)
VITE_SUPABASE_URL=<your-project-url>
VITE_SUPABASE_ANON_KEY=<your-anon-key>
VITE_SUPABASE_PUBLISHABLE_KEY=<same-as-anon-key>

# 4. Start the dev server
npm run dev
```

Open http://localhost:5173 — done! 🎉

> ⚠️ `.env` is gitignored. Never commit secrets.

### Scripts

| Command | Action |
|---------|--------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run tests (Vitest) |
| `npm run preview` | Preview production build locally |

---

## 📁 Project Structure

```
src/
├── components/        # App components (Navbar, cards, guards) + ui/ (shadcn)
├── contexts/          # Auth, Brand, Theme, Community providers
├── data/              # Mock data (being phased out → Supabase)
├── hooks/             # Custom hooks
├── integrations/      # Supabase client + generated DB types
├── lib/               # Services & utilities
├── pages/             # Route pages
├── services/          # Service layer
└── types/             # Shared TypeScript interfaces
supabase/
└── migrations/        # Database migrations
```

---

## 👥 Team & Workflow

| Member | Role | Track |
|--------|------|-------|
| 🔵 **Moinul** | Lead | Security, backend, DB migrations, reviews |
| 🟢 **Fatin** | Developer | Stories, gallery, profile & UI polish |
| 🟠 **Shafin** | Developer | Events, admin systems, search & discovery |

### Contribution Rules

1. **Never push to `main` directly**
2. Branch per task: `feat/...`, `fix/...`, `ui/...`
3. Open a Pull Request → Moinul reviews & merges
4. All DB migrations go through Moinul only
5. Vercel auto-deploys on merge

📚 **Read before starting:** [`TASK_ASSIGNMENT.md`](./TASK_ASSIGNMENT.md) — your tasks · [`SNAPSHOT.md`](./SNAPSHOT.md) — project status

---

## 🗺️ Roadmap

Current phase: **Security Hardening + Structure Completion** (~70%)

- [x] Core auth, communities, access control, admin, notifications
- [ ] Phase 0: master DB migration, security fixes, Google Photos media utility
- [ ] Stories system with public/private visibility modes
- [ ] Gallery system (link-based)
- [ ] Events upgrade (status, participants)
- [ ] Platform admin (suspend/delete communities)
- [ ] My Activity page, bookmarks, search & filters

See [`SNAPSHOT.md`](./SNAPSHOT.md) for the detailed execution plan.

---

## 📄 License

Private project — all rights reserved by the Voboghure team.
