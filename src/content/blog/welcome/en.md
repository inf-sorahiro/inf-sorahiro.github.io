---
title: Welcome to Sify Blog
description: Sify Blog is a modern blog theme built with Astro, supporting Markdown/MDX, math formulas, syntax highlighting, search, comments, and more.
date: 2024-06-01
tags: [Astro, Tutorial]
category: Notes
pinned: true
cover: https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200
lang: en
---

## Quick Start

Sify Blog is a feature-rich Astro blog theme. This article covers the quick usage of its features.

[Astro Documentation](https://astro.build)

### Installation & Development

```bash
bun install
bun dev
```

Open `http://localhost:4321` to preview.

### Configure Site Info

Edit `src/consts.ts` to modify site title, description, avatar, social links, etc.:

```typescript
export const SITE_TITLE = 'Sify Blog';
export const SITE_DESCRIPTION = 'A modern blog built with Astro';
export const SITE_AUTHOR = 'santisify';
```

## Features Overview

| Feature | Description |
|---------|-------------|
| Markdown / MDX | Standard Markdown with JSX components |
| Math Formulas | KaTeX inline and block rendering |
| Code Highlighting | Shiki themes, copy button |
| Dark Mode | System-aware + manual toggle |
| Full-Text Search | Title + body matching with highlights |
| Comments | Waline comment system |
| RSS | Auto-generated RSS Feed |
| Friend Links | Friend links with activity feed |
| Article Cover | Local images / Remote URLs |
| Responsive | Mobile-adaptive layout |

## Page Routes

| Path | Page |
|------|------|
| `/` | Home (Post list + Hero) |
| `/post/[...slug]` | Post detail |
| `/categories/[category]` | Category page |
| `/tags/[tag]` | Tag page |
| `/archives` | Article archive |
| `/weekly` | Weekly digest |
| `/friends` | Friend links |
| `/about` | About page |
| `/rss.xml` | RSS feed |

> 💡 Press `Ctrl + K` to open the search panel anytime.

