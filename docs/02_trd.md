# Technical Requirements Document (TRD) — Brain Library

## 1. System Overview & Architecture

Brain Library is built on a modern **Next.js 15 App Router** architecture using **React 19 Client & Server Components**, styled with **Tailwind CSS v4**, and backed by **Firebase Cloud Firestore & Authentication**.

```mermaid
graph TD
  subgraph Client [Browser / PWA Client]
    UI[Next.js React UI Layer]
    TIPTAP[Tiptap Rich Text Editor]
    FUSE[Fuse.js Client Search Index]
    IDB[(IndexedDB Local Cache)]
  end

  subgraph Cloud [Firebase Backend]
    AUTH[Firebase Auth Service]
    FS[(Cloud Firestore Database)]
  end

  UI <-->|Auth State| AUTH
  UI <-->|Read / Write / Snapshot| IDB
  IDB <-->|Background Sync| FS
  UI -->|Rich JSON / HTML| TIPTAP
  UI -->|Plain Text Extract| FUSE
```

---

## 2. Technical Stack Specifications

| Layer | Technology | Justification |
| :--- | :--- | :--- |
| **Framework** | Next.js 15 (App Router) + TypeScript | Modern routing, clean folder structure, strict type safety. |
| **Styling** | Tailwind CSS v4 | Rapid responsive styling with native `rtl:` CSS variant support. |
| **Database & Offline** | Firebase Cloud Firestore | Multi-tab IndexedDB persistence out-of-the-box. |
| **Authentication** | Firebase Authentication | Secure Email/Password + Instant Demo Mode session support. |
| **Editor Engine** | Tiptap (ProseMirror core) | Headless rich text editor with flawless RTL/Urdu text support. |
| **Search Engine** | Fuse.js (v7.x) | Zero-latency client-side fuzzy search across memory index. |

---

## 3. Project Directory & Architecture

```text
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx              # Protected App Shell (Sidebar + Header)
│   │   ├── page.tsx                # Main Notes Feed & Dashboard view
│   │   └── trash/page.tsx          # Trash recovery view
│   ├── layout.tsx                  # Root Layout (Fonts, Providers)
│   └── globals.css                 # Tailwind v4 directives + Urdu font rules
├── components/
│   ├── layout/
│   │   ├── Header.tsx              # Search bar, Theme & Language toggles
│   │   └── Sidebar.tsx             # Categories list & Navigation links
│   ├── notes/
│   │   ├── NoteCard.tsx            # Individual note item in grid/list
│   │   ├── NoteEditorModal.tsx     # Full-screen or modal Tiptap editor
│   │   └── TiptapToolbar.tsx       # Formatting controls
│   └── categories/
│       └── CategoryModal.tsx       # Color & Emoji picker modal
├── lib/
│   ├── firebase.ts                 # Firebase app initialization & SDK export
│   ├── firestore.ts                # Typed CRUD functions for Categories & Notes
│   ├── search.ts                   # Fuse.js singleton & index synchronizer
│   └── i18n/
│       ├── dictionaries.ts         # EN and UR string maps
│       └── LocaleContext.tsx       # Language & RTL direction provider
├── hooks/
│   ├── useAuth.ts                  # Listen to Firebase Auth user state
│   ├── useNotes.ts                 # Real-time Firestore snapshot listener
│   └── useSearch.ts                # Client-side debounced search hook
└── types/
    ├── note.ts                     # Note interface definitions
    └── category.ts                 # Category interface definitions
```

---

## 4. Firestore Data Schema & Indexes

We use a **Flat Data Schema** under each user document to allow fast, non-nested queries and optimal caching.

```mermaid
erDiagram
  USER ||--o{ CATEGORY : owns
  USER ||--o{ NOTE : owns
  CATEGORY ||--o{ NOTE : categorizes

  USER {
    string uid PK
    string email
    string displayName
    string locale
    string theme
  }
  CATEGORY {
    string id PK
    string name
    string color
    string emoji
    number order
  }
  NOTE {
    string id PK
    string categoryId FK
    string title
    object contentJSON
    string plainTextContent
    string[] tags
    string color
    boolean isPinned
    boolean isTrashed
    timestamp trashedAt
    timestamp updatedAt
  }
```

### TypeScript Type Definitions (`src/types/note.ts` & `src/types/category.ts`)

```typescript
export interface Category {
  id: string;
  name: string;
  color: string;       // Hex e.g. '#3B82F6'
  emoji: string;       // Unicode emoji e.g. '📚'
  order: number;
  createdAt: number;
  updatedAt: number;
}

export interface Note {
  id: string;
  categoryId: string | null;
  title: string;
  contentJSON: Record<string, any>; // Tiptap JSON document tree
  plainTextContent: string;         // Extracted string for Fuse.js indexing
  tags: string[];
  color: string;                    // Card accent color
  isPinned: boolean;
  isTrashed: boolean;
  trashedAt: number | null;
  createdAt: number;
  updatedAt: number;
}
```

---

## 5. Firestore Security Rules

Strict user isolation ensures zero cross-tenant data access:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isOwner(userId) {
      return request.auth != null && request.auth.uid == userId;
    }

    match /users/{userId} {
      allow read, write: if isOwner(userId);

      match /categories/{categoryId} {
        allow read, write: if isOwner(userId);
      }

      match /notes/{noteId} {
        allow read, write: if isOwner(userId);
      }
    }
  }
}
```

---

## 6. Mobile & CI/CD Deployment Architecture

Brain Library is compiled as an offline-first **Progressive Web App (PWA)** and pre-configured for native **Capacitor Mobile Packaging** with an automated **GitHub Actions CI/CD pipeline** to build standalone Android APK binaries.

### PWA Manifest Configuration
The application exposes a standard Web App Manifest (`src/app/manifest.ts`) compiled dynamically:
- **Display Mode:** `standalone` (removes mobile browser navigation header and navigation chrome).
- **Theme Color:** `#0A0D14` matching the dark mode background theme.
- **Orientation:** Supports `any` rotation mode.
- **Dynamic Routing:** Utilizes `export const dynamic = 'force-static'` for flawless static exporting.

### GitHub Actions CI/CD Pipeline (`.github/workflows/build-apk.yml`)
Whenever code is pushed to the `main` branch, a runner builds the Next.js static files, syncs them to the Android workspace, compiles a native Android debug APK, and attaches it as a GitHub Release:

- **Node.js Environment:** Uses Node.js `22` (required by the latest Capacitor CLI).
- **Java Platform:** JDK `21` (required by Capacitor Android compiler toolchains).
- **Build Command:** Runs `npx next build` to output the `out/` directory, then `npx cap sync android` to copy assets.
- **Gradle Compilation:** Calls `chmod +x ./gradlew && ./gradlew assembleDebug` in the `./android` workspace directory.
- **Artifact Release:** Utilizes `softprops/action-gh-release@v2` to publish the build artifact named `BrainLibrary-v1.0.apk` directly to the repository's GitHub Releases page.

