---
title: Avoid Inline Styles
impact: MEDIUM
impactDescription: 10-30% rendering performance improvement
tags: performance, styling, react
---

## Avoid Inline Styles

**Impact: MEDIUM (10-30% rendering performance improvement)**

Inline styles in React cause unnecessary re-renders and prevent CSS optimizations. React must recalculate inline styles on every render, while CSS classes can be optimized by the browser and cached.

**Incorrect (inline styles create new objects on every render):**

```tsx
function Button({ isActive }) {
  return (
    <button
      style={{
        backgroundColor: isActive ? 'blue' : 'gray',
        padding: '12px 24px',
        borderRadius: '4px'
      }}
    >
      Click me
    </button>
  )
}
```

**Correct (use Tailwind CSS classes or CSS modules):**

```tsx
function Button({ isActive }) {
  return (
    <button className={isActive ? 'bg-blue-500 px-6 py-3 rounded' : 'bg-gray-500 px-6 py-3 rounded'}>
      Click me
    </button>
  )
}
```

**Correct (with conditional styling using clsx or classnames):**

```tsx
import clsx from 'clsx'

function Button({ isActive }) {
  return (
    <button className={clsx(
      'px-6 py-3 rounded',
      isActive ? 'bg-blue-500' : 'bg-gray-500'
    )}>
      Click me
    </button>
  )
}
```

**Why this matters:**
- Inline style objects are recreated on every render, preventing React memoization
- Browser cannot optimize inline styles like it can with CSS classes
- CSS classes enable better caching and selector matching
- Tailwind CSS purges unused styles, reducing final CSS bundle size
- Inline styles increase component props diffing cost

**Exceptions:**
- Dynamic values that must be calculated (e.g., `height: ${progress}%`)
- Animation frames where values change frequently
- Component library prop interfaces that accept style objects

Reference: [React Optimization - Inline Styles](https://react.dev/reference/react-dom/components/common#style-object)
