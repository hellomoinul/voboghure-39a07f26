# Voboghure — Task Assignment (v2)

**Team:** Moinul (Lead), Fatin, Shafin
**Updated:** 21 August 2026
**Aligned with:** [Platform Structure (Final Locked Version)](https://docs.google.com/document/d/1mc9xke43x-r4IDLAVlcZIAmRwcfkWAlSZQbw8eQvY1M/edit) · [Snapshot Doc](https://docs.google.com/document/d/11msMAH3YCTet0Q5q2cT6-9_5Rv7iNM4ubZqStjHtjWU/edit)
**Repo refs:** `TASK_ASSIGNMENT.md` (this file) · `SNAPSHOT.md`

---

## 📌 Legend

| Tag | Meaning |
|-----|---------|
| 🔵 | Moinul (Lead) |
| 🟢 | Fatin |
| 🟠 | Shafin |
| 🔴 | Blocked — depends on another task |
| ✅ | Done |

---

## ✅ Already Completed (stable — do not touch)

- Core auth, password reset, Supabase integration, global state
- Community create/join, join requests, admin approval flow
- Access control: CommunityGuard + protected routes
- Admin panel: role management, request approval
- Notification system: real-time + DB triggers
- Navigation: single hamburger, solid menus, outside-click close
- SEO basics: meta tags, OG, Twitter cards (`index.html`)
- Deployment: live on Vercel

---

## ⚠️ Phase 0 — Foundation (Moinul, BEFORE feature work)

Everything below depends on these. No feature PRs until Phase 0 merges.

| # | Task | Owner | Notes |
|---|------|-------|-------|
| 0.1 | **Master DB migration** — stories (event-linked + general, visibility modes), gallery items (event-based + general), events upgrade (status, participants), activity log, bookmarks, community lifecycle (`active/suspended/deleted`), `platform_admin` role, soft-delete flags (`deleted_at`) on all content tables | 🔵 Moinul | One migration set = single source of truth. Replaces dashboard-only schema |
| 0.2 | **Security fixes** — `search_path` on 3 trigger functions, restrict `event-gallery` bucket + signed URLs, enable Leaked Password Protection, full RLS audit | 🔵 Moinul | From snapshot Priority 1 |
| 0.3 | **Google Photos link utility** — shared component: link input + helper text ("Paste Google Photos link (make sure it's shareable)") + preview-first render + fallback link card | 🔵 Moinul | Structure §4. Used by Stories, Gallery, Events covers, avatars |
| 0.4 | **Consolidate duplicate clients/services** — merge `lib/supabase.ts` + `integrations/supabase/client.ts`; merge 3 overlapping service files into one per domain | 🔵 Moinul | Structural cleanup before team scales |

---

## 🔵 Moinul (Lead) — Backend & Platform Systems

| # | Task | Structure § | Notes |
|---|------|------------|-------|
| M1 | Soft delete implementation — hidden flag, recovery logic, filtered queries everywhere | §18 | Depends on 0.1 |
| M2 | Community lifecycle backend — suspend (read-only mode + warning banner data), delete (hard delete after soft) | §12, §13 | Depends on 0.1 |
| M3 | Platform admin role + permissions — all communities access, search | §12, §14 | Depends on 0.1 |
| M4 | Bookmarks DB table | — | Unblocks S4 |
| M5 | Activity tracking table + triggers (joined events, posted stories, added links) | §17 | Unblocks F3 |
| M6 | Global error handling UI (ErrorBoundary) | — | Snapshot item |
| M7 | Re-render reduction audit | — | Snapshot item |

## 🟢 Fatin — Stories, Gallery & Memory System

| # | Task | Structure § | Notes |
|---|------|------------|-------|
| F1 | **Stories system (full)** — Supabase CRUD, Event Story + General Story types, title/content/images (first image = cover), author prominence + profile link | §5 | Depends on 0.1, uses 0.3 |
| F2 | **Story visibility** — Private (default, members-only, full interaction) vs Public/Shareable (external link, limited view, creator toggle "Make this story shareable"); outside viewers see story only, never community data | §5 | Depends on F1 |
| F3 | **Story interactions** — reactions + comments (members-only) | §5 | Depends on F1 |
| F4 | **Gallery system (real)** — replace mock data; link-based via 0.3; event-based + general collections; members-only privacy | §7 | Depends on 0.1, 0.3 |
| F5 | **My Activity page** — joined events, posted stories, added links | §17 | Depends on M5 |
| F6 | Real contribution stats — replace mock in `ProfilePage.tsx` | §17 | Depends on M5 |
| F7 | Skeleton loaders app-wide (Events, Stories, Gallery, Members, Timeline) | §11 | |
| F8 | Empty states with CTAs — "Create your first event" / "Share your first memory" / "Add photos" | §11 | |
| F9 | Page-level titles (`usePageTitle` hook) | — | Closes SEO |

## 🟠 Shafin — Events, Admin & Discovery

| # | Task | Structure § | Notes |
|---|------|------------|-------|
| S1 | **Events upgrade** — admin-only creation enforced, fields (title/date/location/description/cover via 0.3), status badge (upcoming/ongoing/computed completed) | §6 | Depends on 0.1, 0.3 |
| S2 | **Event participation** — join button, participants list, member view | §6 | Depends on 0.1 |
| S3 | **Platform Admin UI** — all-communities list + search, suspend/delete actions, suspension warning banner in suspended communities | §12, §13 | Depends on M2, M3 |
| S4 | Bookmark/save UI — save button on events/stories + My Bookmarks page | — | 🔴 Blocked on M4 |
| S5 | Search — events + communities | §1 | |
| S6 | Filters — date/category for events | §6 | |
| S7 | Lazy loading images (`loading="lazy"` everywhere) | — | |
| S8 | Hover/animation polish + spacing consistency | — | |
| S9 | Mobile scaling fixes | — | |

---

## 🔴 Dependency Map

| Blocked | Waiting on |
|---------|-----------|
| ALL feature work (F1–F6, S1–S2, S3) | Phase 0 (Moinul): migrations + security + Photos utility |
| F3 story interactions | F1 stories core |
| F5/F6 activity & stats | M5 activity table |
| S3 platform admin UI | M2/M3 lifecycle + role backend |
| S4 bookmark UI | M4 bookmarks table |

---

## 🗑️ Also Removed / To Delete During Cleanup

- `src/data/mockData.ts`, `src/data/communityData.ts` — after F1/F4/S1 replace every mock page (Dashboard, StoryDetail, StoriesPage, Archive, Timeline, Map, Gallery, Upcoming)
- `src/services/communityService.ts` + `src/services/adminService.ts` — merged into consolidated services (0.4)
- Hardcoded UUIDs in `RequestAccessPage.tsx` — replace with role-based lookup (M3)

---

## 📋 Workflow

1. Branch per task: `fix/...`, `feat/...`, `ui/...`
2. PR → `main`; **Moinul reviews & merges**
3. All DB migrations go through Moinul only
4. Vercel auto-deploys on merge
5. Update `SNAPSHOT.md` when a task flips to ✅

---

## 🎯 Order of Execution

```
Week 1:  Phase 0 (Moinul)  ||  F7/F8/F9 + S7/S8/S9 (UI work that needs no new tables)
Week 2:  F1→F2→F3 (Stories) || S1→S2 (Events) || M4/M5 (tables)
Week 3:  F4 (Gallery), F5/F6 (Activity) || S3 (Platform Admin), S4 (Bookmarks) || M1/M2/M3 (lifecycle)
Week 4:  Integration testing, mobile pass, final security review → launch hardening done
```
