---
title: 週刊 #1 — 本週前端動態
description: 第一期週刊，包含 Astro 6.x 更新、Tailwind CSS v4 實踐、Bun 生態進展等前端技術動態。
date: 2024-06-02
tags: [前端, Astro, CSS]
issue: 1
cover: https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=1200
lang: zh-tw
---

## 本週推薦

### Astro 6.x 正式發佈

Astro 6 帶來了全新的內容層 API 和更快的構建速度。

- 新的 `content.config.ts` 替代 `content/config.ts`
- `unified()` 處理器統一 Markdown/MDX 插件配置
- 構建速度提升約 30%

### Tailwind CSS v4

Tailwind CSS v4 採用 CSS-first 配置方式，無需 `tailwind.config.js`：

```css
@import 'tailwindcss';

@theme {
  --color-primary: #e9536a;
}
```

### Bun 1.3

Bun 1.3 改進了包管理器的穩定性和兼容性：

- 更快的 `bun install`
- 改進的 Node.js 兼容層
- 新增 `bun build` 優化

## 工具推薦

| 工具 | 用途 |
|------|------|
| [Waline](https://waline.js.org) | 輕量評論系統 |
| [KaTeX](https://katex.org) | Web 數學公式渲染 |
| [Shiki](https://shiki.style) | 代碼語法高亮 |

## 代碼片段

### React 自定義 Hook

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

### CSS Grid 響應式佈局

```css
.grid-layout {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}
```

## 精選文章

- [Content Collections in Astro 6](https://docs.astro.build/en/guides/content-collections/)
- [MDX Guide](https://docs.astro.build/en/guides/integrations-guide/mdx/)
- [CSS Container Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_container_queries)

## 下期預告

下期將介紹 TypeScript 5.5 新特性和 React 19 更新。敬請期待！
