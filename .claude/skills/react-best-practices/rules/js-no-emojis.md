---
title: Avoid Emojis in UI
impact: LOW
impactDescription: Improved accessibility and professional appearance
tags: accessibility, i18n, ui
---

## Avoid Emojis in UI

**Impact: LOW (improved accessibility and professional appearance)**

Emojis should not be used as UI elements or icons. They have inconsistent rendering across platforms, poor accessibility, and limited internationalization support.

**Incorrect (using emojis as UI icons):**

```tsx
function Header() {
  return (
    <header>
      <h1>🚀 My App</h1>
      <nav>
        <a href="/settings">⚙️ Settings</a>
        <a href="/profile">👤 Profile</a>
        <a href="/notifications">🔔 Notifications</a>
      </nav>
    </header>
  )
}
```

**Correct (use icon libraries or SVG):**

```tsx
import { Rocket, Settings, User, Bell } from 'lucide-react'

function Header() {
  return (
    <header>
      <h1><Rocket className="inline" /> My App</h1>
      <nav>
        <a href="/settings"><Settings className="inline" /> Settings</a>
        <a href="/profile"><User className="inline" /> Profile</a>
        <a href="/notifications"><Bell className="inline" /> Notifications</a>
      </nav>
    </header>
  )
}
```

**Correct (use SVG for custom icons):**

```tsx
function SettingsIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )
}
```

**Why this matters:**

1. **Inconsistent Rendering**: Emojis look different across Windows, macOS, Android, and iOS
2. **Poor Accessibility**: Screen readers announce emoji names (e.g., "rocket") which may not convey intended meaning
3. **Limited Control**: Cannot customize size, color, or weight consistently
4. **Internationalization**: Emojis may have different cultural meanings or be considered inappropriate
5. **Professional Appearance**: Emojis can make applications appear unprofessional
6. **Missing ARIA Support**: Cannot add proper aria-label or role semantics

**Recommended Icon Libraries:**
- `lucide-react` - Lightweight, tree-shakeable icons
- `@heroicons/react` - Heroicons official React package
- `react-icons` - Comprehensive collection of icon sets
- `lucide` successor to `lucide-react`

**For decorative emojis, use aria-hidden:**

```tsx
// If emoji must be used, hide from screen readers
<span aria-hidden="true">🎉</span>
```

Reference: [WCAG Guidelines for Non-Text Content](https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html)
