---
title: Use React.memo for Stable Props
impact: MEDIUM
impactDescription: prevents unnecessary re-renders when props don't change
tags: rerender, memo, optimization, props
---

## Use React.memo for Stable Props

Apply `React.memo` to components that are pure functions of their props, receive stable prop references, and are children of frequently updating parents.

### Decision Matrix

| Component Characteristic | Use React.memo? |
|-------------------------|-----------------|
| Pure component, stable props, expensive render | **YES** |
| Pure component, stable props, cheap render | **MAYBE** (if parent updates frequently) |
| Pure component, unstable props | **NO** (fix props first) |
| Component with internal state changes | **NO** |
| Component renders rarely | **NO** |

### Rule 1: Props Must Be Stable

React.memo uses shallow comparison. If props change reference on every render, memoization won't work.

**Incorrect (unstable props - memo won't help):**

```tsx
function Parent() {
  const [count, setCount] = useState(0)
  // Creates new object/function on each render
  return (
    <>
      <button onClick={() => setCount(count + 1)}>{count}</button>
      <Child data={{ id: 1 }} onUpdate={() => {}} />
    </>
  )
}

const Child = memo(function Child({ data, onUpdate }) {
  return <div>{data.id}</div>
})
// Child STILL re-renders because data and onUpdate are new references
```

**Correct (stable props with useMemo/useCallback):**

```tsx
function Parent() {
  const [count, setCount] = useState(0)
  const data = useMemo(() => ({ id: 1 }), [])
  const onUpdate = useCallback(() => {}, [])

  return (
    <>
      <button onClick={() => setCount(count + 1)}>{count}</button>
      <Child data={data} onUpdate={onUpdate} />
    </>
  )
}

const Child = memo(function Child({ data, onUpdate }) {
  return <div>{data.id}</div>
})
// Child only re-renders when data or onUpdate actually change
```

### Rule 2: Component Must Be Pure

Component should produce the same output for the same props.

**Incorrect (uses context - not pure):**

```tsx
// Context changes outside of props - not suitable for memo
const UserProfile = memo(function UserProfile({ userId }) {
  const [theme] = useTheme()
  return <div className={theme}>{userId}</div>
})
```

**Correct (pure component - depends only on props):**

```tsx
const UserAvatar = memo(function UserAvatar({ userId, size }: { userId: string; size: number }) {
  const avatarUrl = getAvatarUrl(userId, size)
  return <img src={avatarUrl} alt={`User ${userId}`} width={size} height={size} />
})
```

### Rule 3: Use When Parent Updates Frequently

Most effective when parent updates often but child props don't change.

**Good use case:**

```tsx
function SearchResults() {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState({ sort: 'asc' })

  // Re-renders on every keystroke, but FilterControls props stay stable
  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <FilterControls filters={filters} onFilterChange={setFilters} />
      <ResultsList query={query} />
    </>
  )
}

const FilterControls = memo(function FilterControls({
  filters,
  onFilterChange
}: {
  filters: Filters
  onFilterChange: (f: Filters) => void
}) {
  return <select>...</select>
})
```

### Props Reference Analysis

**Stable props (safe for memo):**
- Primitives: `string`, `number`, `boolean`, `null`, `undefined`
- Values from `useMemo` with proper dependencies
- Functions from `useCallback` with proper dependencies
- Constants defined outside component

**Unstable props (need fixing):**
- Object literals: `{{ id: 1 }}`
- Array literals: `{[1, 2, 3]}`
- Arrow functions: `() => {}`
- Functions: `function() {}`

### Common Pitfalls

**Pitfall 1: Memoizing with children prop**

```tsx
// ❌ children is always a new reference
const Memoized = memo(function Memoized({ children }: { children: ReactNode }) {
  return <div>{children}</div>
})

// ✅ Either don't memo, or accept the limitation
const Memoized = function Memoized({ children }: { children: ReactNode }) {
  return <div>{children}</div>
}
```

**Pitfall 2: Memo without useMemo/useCallback**

```tsx
// ❌ Unstable references negate memo benefit
function Parent() {
  return <Child data={{ id: 1 }} onChange={() => {}} />
}

// ✅ Stabilize props first
function Parent() {
  const data = useMemo(() => ({ id: 1 }), [])
  const onChange = useCallback(() => {}, [])
  return <Child data={data} onChange={onChange} />
}
```

**Pitfall 3: Over-memoization**

```tsx
// ❌ Don't memo everything
const SimpleDiv = memo(() => <div>Hello</div>)

// ✅ Let React handle simple cases
const SimpleDiv = () => <div>Hello</div>
```

### Detection Checklist

Before applying `React.memo`, verify:
- [ ] Component is a pure function of its props
- [ ] Props are stable references (primitives or memoized)
- [ ] Parent component updates frequently
- [ ] Component rendering has measurable cost OR updates very frequently
- [ ] No internal state that causes frequent updates

### Note on React Compiler

If your project has [React Compiler](https://react.dev/learn/react-compiler) enabled, manual memoization with `memo()` is not necessary. The compiler automatically optimizes re-renders based on component purity and prop stability.

### References

- [React.memo Official Documentation](https://react.dev/reference/react/memo)
- [React.memo Guide](https://refine.dev/blog/react-memo-guide/)
- [Is React.memo Still Useful in React 19?](https://dev.to/shantih_palani/is-reactmemo-still-useful-in-react-19-a-practical-guide-for-2025-4lj5)
- [React.memo Best Practices](https://medium.com/@conboys111/react-memo-best-practices-when-to-use-it-and-when-to-avoid-it-1c0f074eaf5e)
