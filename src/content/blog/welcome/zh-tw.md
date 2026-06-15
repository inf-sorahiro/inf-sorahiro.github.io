---
title: 歡迎使用 Sify Blog
description: Sify Blog 是一個基於 Astro 構建的現代化部落格主題，支持 Markdown/MDX、數學公式、代碼高亮、搜索、評論等豐富功能。
date: 2024-06-01
tags: [Astro, 教程]
category: 筆記
pinned: true
cover: https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200
lang: zh-tw
draft: false
---

## 快速開始

Sify Blog 是一個功能完備的 Astro 部落格主題。本文介紹各項功能的快速用法。

[Astro文檔](https://astro.build)

### 安裝運行

```bash
bun install
bun dev
```

打開 `http://localhost:4321` 即可預覽。

### 配置站點信息

編輯 `src/consts.ts` 修改站點標題、描述、頭像、社交鏈接等基本信息：

```typescript
export const SITE_TITLE = 'Sify Blog';
export const SITE_DESCRIPTION = '一個基於 Astro 的現代化部落格主題';
export const SITE_AUTHOR = 'santisify';
```

## 特性一覽

| 特性 | 說明 |
|------|------|
| Markdown / MDX | 支持標準 Markdown 和 JSX 組件 |
| 數學公式 | KaTeX 渲染行內和塊級公式 |
| 代碼高亮 | Shiki 主題，複製按鈕 |
| 暗色模式 | 跟隨系統 + 手動切換 |
| 全站搜索 | 標題+正文匹配，高亮顯示 |
| 評論系統 | Waline 評論區 |
| RSS | 自動生成 RSS Feed |
| 友鏈 | 好友鏈接 + 友鏈圈動態 |
| 文章封面 | 本地圖片 / 遠程 URL |
| 響應式 | 移動端適配 |

## 頁面路由

| 路徑 | 頁面 |
|------|------|
| `/` | 首頁（文章列表 + Hero） |
| `/post/[...slug]` | 文章詳情頁 |
| `/categories/[category]` | 分類頁面 |
| `/tags/[tag]` | 標籤頁面 |
| `/archives` | 文章歸檔 |
| `/weekly` | 週刊 |
| `/friends` | 友鏈頁面 |
| `/about` | 關於頁面 |
| `/rss.xml` | RSS 訂閱 |

> 💡 使用 `Ctrl + K` 快捷鍵隨時喚出搜索面板。
