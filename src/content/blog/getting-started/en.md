---
title: Building a Blog from Scratch
description: A detailed guide on building a personal blog from scratch using this theme, covering installation, configuration, and deployment.
date: 2024-05-10
tags: [Tutorial, Getting Started]
category: Tutorial
cover: https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200
lang: en
draft: true
---

## Prerequisites

Make sure you have [Bun](https://bun.sh) (recommended) or Node.js 18+ installed.

```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash
```

## Create Project

```bash
# Clone or initialize the project
git clone <your-repo-url> my-blog
cd my-blog
bun install
```

### Local Development

```bash
bun dev
```

Open `http://localhost:4321` in your browser. Hot reload is supported.

### Build for Production

```bash
bun run build
```

### Preview Production Build

```bash
bun preview
```

## Configure Site

Edit `src/consts.ts` to modify the following settings:

```typescript
// Site basic info
export const SITE_TITLE = 'My Blog';
export const SITE_DESCRIPTION = 'This is my personal blog';
export const SITE_AUTHOR = 'Your Name';
export const SITE_URL = 'https://example.com';
export const SITE_AVATAR = '/avatar.png';
export const SITE_COVER = '/cover.jpg';

// Posts per page
export const PAGE_SIZE = 10;

// Navigation menu
export const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Weekly', href: '/weekly' },
  { label: 'Articles', href: '/archives' },
  { label: 'Friends', href: '/friends' },
  { label: 'About', href: '/about' },
];

// Social links
export const SOCIAL_LINKS = [
  { name: 'GitHub', href: 'https://github.com/yourname', icon: 'github' },
  { name: 'RSS', href: '/rss.xml', icon: 'rss' },
];
```

## Writing Posts

Create `.md` or `.mdx` files in the `src/content/blog/` directory.

### Post Frontmatter

```yaml
---
title: Post Title
description: Post description
date: 2024-06-01
tags: [tag1, tag2]
category: category
cover: https://example.com/cover.jpg  # or ./images/cover.webp
pinned: false   # whether to pin
draft: false    # whether it's a draft
---
```

### Post Storage

Two directory structures are supported:

```
src/content/blog/
├── post-slug.md              # Single file
└── post-slug/
    ├── index.md              # Directory form
    └── cover.webp            # Local image
```

## Deployment

### Vercel

```bash
# One-click deploy
vercel
```

### Cloudflare Pages

- Build command: `bun run build`
- Output directory: `dist`

### Other Platforms

Any platform that supports static file hosting can directly deploy the `dist/` directory.

## Customizing the Theme

Edit CSS variables in `src/styles/global.css` to customize colors:

```css
@theme {
  --color-primary: #e9536a;       /* Primary color */
  --color-bg-light: #f5f5f5;      /* Light background */
  --color-bg-dark: #1a1a2e;       /* Dark background */
  --color-card-light: #ffffff;    /* Light card */
  --color-card-dark: #1e2a45;     /* Dark card */
}
```

Customize site fonts:

```css
--font-family-sans: 'Inter', 'Noto Sans SC', sans-serif;
--font-family-mono: 'JetBrains Mono', 'Fira Code', monospace;
```
