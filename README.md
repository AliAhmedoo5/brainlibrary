# Brain Library — Bilingual & Offline-First Note-Taking Web App

Welcome to **Brain Library** — a high-end personal knowledge management and note-taking application designed with native bilingual support (English & Urdu RTL) and offline-first cloud synchronization.

## 📖 Senior Engineering Documentation Suite

All planning, architecture, flows, timeline, and QA documents are saved in the [`docs/`](file:///E:/Projects/noteapp2/docs) folder:

| # | Document | File Link | Description |
|---|---|---|---|
| **01** | **Product Requirements Document (PRD)** | [`docs/01_prd.md`](file:///E:/Projects/noteapp2/docs/01_prd.md) | Personas, user stories, P0/P1/P2 feature matrix, KPIs & acceptance criteria |
| **02** | **Technical Requirements Document (TRD)** | [`docs/02_trd.md`](file:///E:/Projects/noteapp2/docs/02_trd.md) | Next.js 15 App Router + Tailwind v4 + Firestore schema, security rules & Fuse.js architecture |
| **03** | **User Flows & Screen Map** | [`docs/03_user_flows.md`](file:///E:/Projects/noteapp2/docs/03_user_flows.md) | Complete screen map and Mermaid flowcharts for Auth, Notes, RTL flip, Search & Trash |
| **04** | **Project Implementation Plan** | [`docs/04_project_plan.md`](file:///E:/Projects/noteapp2/docs/04_project_plan.md) | Executable 8-phase implementation roadmap with dependency graph and time estimates |
| **05** | **QA & Testing Plan** | [`docs/05_testing_plan.md`](file:///E:/Projects/noteapp2/docs/05_testing_plan.md) | Testing pyramid, unit/component/integration test cases & Playwright E2E scenario |
| **06** | **Implementation & Build Status Report** | [`docs/06_implementation_status.md`](file:///E:/Projects/noteapp2/docs/06_implementation_status.md) | Completed V1 engineering summary, post-V1 roadmap, and build verification |

---

## 🚀 Running the Project Locally

Start the Next.js development server:

```powershell
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** to experience the bilingual app in **Instant Demo Mode** (`demo_user_001`). No login required!

---

## 📱 Packaging as a Native Mobile App (Capacitor)

Brain Library is pre-configured for native mobile app generation using **Capacitor** ([`capacitor.config.ts`](file:///E:/Projects/noteapp2/capacitor.config.ts)):

```powershell
# 1. Install Capacitor packages
npm install @capacitor/core @capacitor/cli

# 2. Add Android or iOS native shell
npx cap add android
npx cap add ios

# 3. Build & sync web assets
npm run build
npx cap sync

# 4. Open in Android Studio or Xcode
npx cap open android
```

---

## 🛠️ Tech Stack Overview
- **Core**: Next.js 15 (App Router) + TypeScript + React 19
- **Mobile Packaging**: Capacitor pre-configured (`capacitor.config.ts`) + Mobile touch-first responsive design
- **Styling**: Tailwind CSS v4 (with native `rtl:` support & Dark/Light mode toggle)
- **Backend & Auth**: Firebase Authentication + Cloud Firestore (with multi-tab IndexedDB offline persistence)
- **Editor**: Tiptap Rich Text Editor (ProseMirror engine)
- **Search Engine**: Client-side full-text search powered by `Fuse.js`
- **Typography**: Inter (Latin) + Noto Nastaliq Urdu (Urdu script)
