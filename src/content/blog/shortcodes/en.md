---
title: Theme Components & Shortcuts
description: Introduces the built-in shortcuts and UI components of this theme, including theme switching, sidebar, pagination, table of contents, and more.
date: 2024-05-05
tags: [Astro, Customization]
category: Tools
cover: https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200
lang: en
draft: true
---

## Theme Switching

Click the 🌙 / ☀️ button on the right side of the Header to toggle dark/light mode.

- Auto-follows system preference
- Manual selection is stored in `localStorage`
- All components adapt to both modes

### Implementation

```typescript
// Controlled via .dark class
:root {
  --color-bg: #f5f5f5;
  --color-text: #2c3e50;
}

:root.dark {
  --color-bg: #1a1a2e;
  --color-text: #e8e8e8;
}
```

## Sidebar

The sidebar includes:

| Section | Content |
|---------|---------|
| Profile | Avatar, bio, social links, post stats |
| Categories | Badge list of all categories, collapsible |
| Tags | Tag cloud sorted by usage count |
| Random | 5 random posts |

### Mobile Adaptation

On mobile, the sidebar collapses into a floating button at the bottom right. Clicking it opens a sliding Drawer.

## Table of Contents

Post pages display an auto-generated TOC based on `h2`/`h3` headings on the left side:

- Auto-highlights current reading position
- Click to smoothly scroll to the corresponding section
- Hidden on mobile

## Pagination

The home page and archive page support pagination with `PAGE_SIZE` (default 10) posts per page:

- `/` — Page 1
- `/page/2` — Page 2
- `/page/3` — Page 3
- ...

## Post Cards

Each post card displays:

- Cover image (or first-letter placeholder)
- Category badge
- Pinned ★ marker
- Draft 🖊 marker
- Publish date
- Word count
- Reading time
- Tag list

Hover effect: card lifts + shadow + cover zoom.

## Full-Text Search

- `Ctrl+K` or click the 🔍 icon to open the search panel
- Searches titles, descriptions, categories, tags, and **article body**
- Matching terms are highlighted
- Context snippets are displayed

## RSS Feed

Auto-generates `/rss.xml` containing all published posts. Subscribe links are in the Header social icons and SEO `<head>`.

## SEO Optimization

Each page auto-injects:

| Meta Tag | Source |
|----------|--------|
| `<title>` | `frontmatter.title + site name` |
| `<meta description>` | `frontmatter.description` |
| `og:title / og:image` | Post title / cover |
| `twitter:card` | `summary_large_image` |

## Comments

Uses Waline as the comment system, supporting:

- Nickname / Email / Website
- Markdown syntax
- Emoji reactions
- Dark mode auto-adaptation
