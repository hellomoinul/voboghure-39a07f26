# 🚀 Voboghure — Project Snapshot (Single Source of Truth)

📍 **Last updated:** 21 August 2026
👥 **Team:** Moinul (Lead) · Fatin · Shafin
🔗 **Task details:** `TASK_ASSIGNMENT.md` (v2) · [Platform Structure (Locked)](https://docs.google.com/document/d/1mc9xke43x-r4IDLAVlcZIAmRwcfkWAlSZQbw8eQvY1M/edit)
📊 **Overall completion:** ~70% of locked structure (was 95% of old scope — structure expanded)

> This document replaces all previous snapshots. One snapshot, one truth.
> Status legend: ✅ Done · ⚙️ In Progress · ❌ Pending

---

## 1. ✅ Completed & Stable (do not touch)

| System | Status |
|--------|--------|
| 🔐 Core: Auth, password reset, Supabase integration, global state | ✅ STABLE |
| 🏘️ Community: Create/Join, join requests, admin approval | ✅ STABLE |
| 🛡️ Access control: CommunityGuard + protected routes | ✅ STABLE |
| 👑 Admin panel: role management, request approval | ✅ STABLE |
| 🔔 Notifications: real-time + DB trigger based | ✅ STABLE |
| 🧭 Navigation: single hamburger, solid menus, outside-click close | ✅ STABLE |
| 🌐 SEO basics: meta tags, OG, Twitter cards (`index.html`) | ✅ DONE |
| 🚀 Deployment: live on Vercel | ✅ LIVE |

---

## 2. ⚠️ Phase 0 — Foundation (blocks ALL feature work)

**Owner: 🔵 Moinul**

- ❌ **0.1** Master DB migration — stories, gallery, events upgrade (status/participants), activity log, bookmarks, community lifecycle, `platform_admin` role, soft-delete flags
- ✅ **0.2** Security fixes — `search_path` verified already set on all 3 triggers; storage policies applied to `event-gallery` + `avatars` buckets; RLS audit clean. *Leaked Password Protection skipped — requires Supabase paid plan.*
- ❌ **0.3** Google Photos link utility — shared input + preview-first + fallback card component
- ❌ **0.4** Consolidate duplicate clients/services (2 Supabase clients → 1; 3 service files → per-domain)

---

## 3. ⚙️ Feature Work (starts after Phase 0)

### 🔵 Moinul — Backend & Platform Systems
- ❌ M1 Soft delete implementation (§18)
- ❌ M2 Community lifecycle backend — suspend read-only mode + banner (§12–13)
- ❌ M3 Platform admin role + permissions (§12, §14)
- ❌ M4 Bookmarks table *(unblocks S4)*
- ❌ M5 Activity tracking table + triggers *(unblocks F5/F6)*
- ❌ M6 Global error handling UI (ErrorBoundary)
- ❌ M7 Re-render reduction audit

### 🟢 Fatin — Stories, Gallery & Memory System
- ❌ F1 Stories full CRUD — Event Story + General Story, cover = first image (§5)
- ❌ F2 Story visibility — private default / shareable external link, creator toggle (§5)
- ❌ F3 Story interactions — reactions + comments (§5)
- ❌ F4 Gallery real implementation — link-based, event-based + general (§7)
- ❌ F5 My Activity page (§17)
- ❌ F6 Real contribution stats (replace mock in ProfilePage)
- ❌ F7 Skeleton loaders app-wide
- ❌ F8 Empty states with CTAs (§11)
- ❌ F9 Page-level titles (`usePageTitle`)

### 🟠 Shafin — Events, Admin & Discovery
- ❌ S1 Events upgrade — admin-only creation, status badges (§6)
- ❌ S2 Event participation — join + participants list (§6)
- ❌ S3 Platform Admin UI — all communities, search, suspend/delete, banner (§12–13)
- 🔴 S4 Bookmark UI + My Bookmarks page *(blocked on M4)*
- ❌ S5 Search — events + communities
- ❌ S6 Filters — date/category
- ❌ S7 Lazy loading images
- ❌ S8 Hover/animation polish + spacing
- ❌ S9 Mobile scaling fixes

*No-chat decision: messaging is explicitly out of scope.*

---

## 4. 🔴 Dependency Map

| Blocked | Waiting on |
|---------|-----------|
| ALL feature work | Phase 0 (Moinul) |
| F3 interactions | F1 stories core |
| F5/F6 activity & stats | M5 activity table |
| S3 platform admin UI | M2/M3 backend |
| S4 bookmark UI | M4 bookmarks table |

---

## 5. 🗑️ Cleanup Targets (delete after replacement)

- `src/data/mockData.ts`, `src/data/communityData.ts` — once Dashboard/Stories/Gallery/Timeline/Archive/Map/Upcoming use real data
- `src/services/communityService.ts`, `src/services/adminService.ts` — merged in 0.4
- Hardcoded UUIDs in `RequestAccessPage.tsx` — replaced by role lookup (M3)

---

## 6. 🗓️ Execution Order

```
Week 1:  Phase 0 (Moinul)      ||  F7/F8/F9 + S7/S8/S9 (table-free UI work)
Week 2:  F1→F2→F3 Stories      ||  S1→S2 Events    ||  M4/M5 tables
Week 3:  F4 Gallery, F5/F6     ||  S3 Platform Admin, S4 Bookmarks || M1/M2/M3 lifecycle
Week 4:  Integration testing, mobile pass, final security review
```

---

## 7. 📋 Team Workflow

1. Branch per task: `fix/...`, `feat/...`, `ui/...`
2. PR → `main`; **Moinul reviews & merges**
3. All DB migrations through Moinul only (single source of truth)
4. Vercel auto-deploys on merge
5. Flip ❌ → ✅ here when a task lands

---

## 🧠 Final Note

The platform definition was locked and expanded (media model, stories visibility, lifecycle, soft delete). Completion re-baselined from ~95% (old scope) to **~70% (locked structure)**. Security remains Priority 1 — no feature PRs merge before Phase 0 security fixes land.
