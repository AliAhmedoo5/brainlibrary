# User Flows & Screen Map — Brain Library

## 1. Complete Application Screen Map

```mermaid
graph TD
  ROOT[Root / Entry] --> AUTH_CHECK{Is User Logged In?}
  
  AUTH_CHECK -->|No| LOGIN[Login Screen /login]
  LOGIN --> SIGNUP[Signup Screen /signup]
  
  AUTH_CHECK -->|Yes| DASH[Main Dashboard /]
  DASH --> SIDEBAR[Category Sidebar]
  DASH --> LIST[Notes Feed / Grid]
  DASH --> SEARCH[Search Bar Modal]
  DASH --> EDITOR[Rich Text Note Editor Modal]
  DASH --> TRASH[Trash Screen /trash]
  DASH --> SETTINGS[Header Toggles: EN/UR & Theme]
```

---

## 2. Authentication Flow (Login & Signup)

```mermaid
flowchart TD
  START([User Visits App]) --> CHECK{Has Auth Token?}
  CHECK -->|Yes| LOAD_PROFILE[Load Firestore User & Categories]
  CHECK -->|No| LOGIN_PAGE[Show /login Page]
  
  LOGIN_PAGE --> CHOICE{Sign-in Method}
  CHOICE -->|Instant Demo| DEMO[Initialize Demo Session]
  CHOICE -->|Email / Password| FORM[Fill Email & Password]
  
  DEMO --> REDIRECT([Redirect to Main Dashboard])
  FORM --> VERIFY_E{Valid Credentials?}
  
  VERIFY_E -->|No| ERR[Show Toast Error] --> LOGIN_PAGE
  VERIFY_E -->|Yes| CREATE_DOC[Ensure Firestore /users doc exists]
  
  CREATE_DOC --> REDIRECT
```

---

## 3. Note Creation & Rich Text Auto-Save Flow

```mermaid
flowchart TD
  CLICK_NEW([User Clicks '+ Note']) --> INIT[Create local Note state]
  INIT --> OPEN_MODAL[Open Tiptap Editor Modal]
  
  OPEN_MODAL --> EDIT_LOOP[User Types Title & Rich Text]
  EDIT_LOOP --> DEBOUNCE[2000ms Debounce Timer]
  
  DEBOUNCE --> CHECK_NET{Is Online?}
  CHECK_NET -->|Yes| SAVE_CLOUD[Write Note to Firestore Cloud]
  CHECK_NET -->|No| SAVE_IDB[Write Note to Local IndexedDB]
  
  SAVE_CLOUD --> UPDATE_UI[Show 'Saved' Indicator]
  SAVE_IDB --> UPDATE_UI_OFF[Show 'Saved Locally (Offline)' Indicator]
  
  UPDATE_UI --> END([Continue Editing or Close Modal])
  UPDATE_UI_OFF --> END
```

---

## 4. Full-Text Search & Offline Filtering Flow

```mermaid
flowchart TD
  INPUT([User Types Query in Header Search Bar]) --> DEBOUNCE_S[300ms Debounce]
  DEBOUNCE_S --> QUERY_FUSE[Query Client-Side Fuse.js Engine]
  
  QUERY_FUSE --> SCORE[Match Title, Body, Tags across All Notes]
  SCORE --> RESULTS{Any Matches?}
  
  RESULTS -->|Yes| RENDER_LIST[Render Highlighted Note Result Cards]
  RESULTS -->|No| EMPTY_STATE[Show Illustrated Empty Search State]
  
  RENDER_LIST --> CLICK_NOTE([User Clicks Note Card])
  CLICK_NOTE --> OPEN_EDITOR[Open Note Editor Modal]
```

---

## 5. Bilingual Language & RTL Toggle Flow

```mermaid
flowchart TD
  TOGGLE([User Clicks EN / UR Switcher]) --> CURR{Current Language?}
  
  CURR -->|English LTR| SWITCH_UR[Set Locale = 'ur']
  CURR -->|Urdu RTL| SWITCH_EN[Set Locale = 'en']
  
  SWITCH_UR --> DOM_RTL[Set html dir='rtl' & lang='ur']
  SWITCH_EN --> DOM_LTR[Set html dir='ltr' & lang='en']
  
  DOM_RTL --> FONT_UR[Apply Noto Nastaliq Urdu Font]
  DOM_LTR --> FONT_EN[Apply Inter Latin Font]
  
  FONT_UR --> PERSIST[Persist to localStorage & Firestore User Profile]
  FONT_EN --> PERSIST
```
