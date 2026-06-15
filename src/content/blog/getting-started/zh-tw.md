---
title: 從零搭建部落格
description: 詳細介紹如何基於本主題從零搭建個人部落格，包括安裝、配置、部署全流程。
date: 2024-05-10
tags: [教程, 入門]
category: 教程
cover: https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200
lang: zh-tw
draft: true
---

## 環境準備

確保已安裝 [Bun](https://bun.sh)（推薦）或 Node.js 18+。

```bash
# 安裝 Bun
curl -fsSL https://bun.sh/install | bash
```

## 創建項目

```bash
# 克隆或初始化項目
git clone <your-repo-url> my-blog
cd my-blog
bun install
```

### 本地開發

```bash
bun dev
```

瀏覽器打開 `http://localhost:4321`，支持熱重載。

### 構建生產版本

```bash
bun run build
```

### 預覽生產構建

```bash
bun preview
```

## 配置站點

編輯 `src/consts.ts` 文件，修改以下配置：

```typescript
// 站點基本信息
export const SITE_TITLE = 'My Blog';
export const SITE_DESCRIPTION = '這是我的個人部落格';
export const SITE_AUTHOR = 'Your Name';
export const SITE_URL = 'https://example.com';
export const SITE_AVATAR = '/avatar.png';
export const SITE_COVER = '/cover.jpg';

// 每頁文章數
export const PAGE_SIZE = 10;

// 導航菜單
export const NAV_ITEMS = [
  { label: '首頁', href: '/' },
  { label: '週刊', href: '/weekly' },
  { label: '文章', href: '/archives' },
  { label: '友鏈', href: '/friends' },
  { label: '關於', href: '/about' },
];

// 社交鏈接
export const SOCIAL_LINKS = [
  { name: 'GitHub', href: 'https://github.com/yourname', icon: 'github' },
  { name: 'RSS', href: '/rss.xml', icon: 'rss' },
];
```

## 編寫文章

在 `src/content/blog/` 目錄下創建 `.md` 或 `.mdx` 文件。

### 文章 Frontmatter

```yaml
---
title: 文章標題
description: 文章描述
date: 2024-06-01
tags: [標籤1, 標籤2]
category: 分類
cover: https://example.com/cover.jpg  # 或 ./images/cover.webp
pinned: false   # 是否置頂
draft: false    # 是否為草稿
---
```

### 文章存放方式

支持兩種目錄結構：

```
src/content/blog/
├── post-slug.md              # 單文件
└── post-slug/
    ├── index.md              # 目錄形式
    └── cover.webp            # 本地圖片
```

## 部署

### Vercel

```bash
# 一鍵部署
vercel
```

### Cloudflare Pages

- 構建命令：`bun run build`
- 輸出目錄：`dist`

### 其他平臺

任何支持靜態文件託管的平臺可直接部署 `dist/` 目錄。

## 自定義主題

編輯 `src/styles/global.css` 中的 CSS 變量來自定義配色：

```css
@theme {
  --color-primary: #e9536a;       /* 主色調 */
  --color-bg-light: #f5f5f5;      /* 淺色背景 */
  --color-bg-dark: #1a1a2e;       /* 深色背景 */
  --color-card-light: #ffffff;    /* 淺色卡片 */
  --color-card-dark: #1e2a45;     /* 深色卡片 */
}
```

修改站點字體：

```css
--font-family-sans: 'Inter', 'Noto Sans SC', sans-serif;
--font-family-mono: 'JetBrains Mono', 'Fira Code', monospace;
```
