---
title: Weekly #1 — Frontend News This Week
description: The first weekly digest covering Astro 6.x updates, Tailwind CSS v4 practices, Bun ecosystem progress, and more frontend tech news.
date: 2024-06-02
tags: [Frontend, Astro, CSS]
issue: 1
cover: https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=1200
lang: en
---

## This Week's Highlights

### Astro 6.x Officially Released

Astro 6 brings a new Content Layer API and faster build speeds.

- New `content.config.ts` replaces `content/config.ts`
- `unified()` processor unifies Markdown/MDX plugin configuration
- Build speed improved by approximately 30%

### Tailwind CSS v4

Tailwind CSS v4 adopts a CSS-first configuration approach, no `tailwind.config.js` needed:

```css
@import 'tailwindcss';

@theme {
  --color-primary: #e9536a;
}
```

### Bun 1.3

Bun 1.3 improves package manager stability and compatibility:

- Faster `bun install`
- Improved Node.js compatibility layer
- New `bun build` optimizations

## Tool Recommendations

| Tool | Purpose |
|------|---------|
| [Waline](https://waline.js.org) | Lightweight comment system |
| [KaTeX](https://katex.org) | Web math formula rendering |
| [Shiki](https://shiki.style) | Code syntax highlighting |

## Code Snippets

### React Custom Hook

```typescript
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
```

### CSS Grid Responsive Layout

```css
.grid-layout {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}
```

## Featured Articles

- [Content Collections in Astro 6](https://docs.astro.build/en/guides/content-collections/)
- [MDX Guide](https://docs.astro.build/en/guides/integrations-guide/mdx/)
- [CSS Container Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_container_queries)

## Next Issue Preview

Next issue will cover TypeScript 5.5 new features and React 19 updates. Stay tuned!
