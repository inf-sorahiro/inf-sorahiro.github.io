---
title: 主題組件與快捷功能
description: 介紹本主題內置的各種快捷功能和 UI 組件，包括主題切換、側邊欄、分頁、目錄導航等。
date: 2024-05-05
tags: [Astro, 定製]
category: 工具
cover: https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200
lang: zh-tw
draft: true
---

## 主題切換

點擊 Header 右側的 🌙 / ☀️ 按鈕切換暗色/亮色模式。

- 自動跟隨系統偏好設置
- 手動選擇會存儲到 `localStorage`
- 所有組件均適配兩種模式

### 實現原理

```typescript
// 通過 .dark class 控制
:root {
  --color-bg: #f5f5f5;
  --color-text: #2c3e50;
}

:root.dark {
  --color-bg: #1a1a2e;
  --color-text: #e8e8e8;
}
```

## 側邊欄

側邊欄包含：

| 區塊 | 內容 |
|------|------|
| 個人信息 | 頭像、簡介、社交鏈接、文章統計 |
| 分類 | 所有分類的 badge 列表，支持摺疊展開 |
| 標籤 | 按使用數量排序的標籤 cloud |
| 隨機推薦 | 5 篇隨機文章 |

### 移動端適配

移動端側邊欄收起到右下角浮動按鈕，點擊後以 Drawer 形式滑出。

## 文章目錄

文章頁左側顯示基於 `h2`/`h3` 標題自動生成的目錄導航：

- 自動高亮當前閱讀位置
- 點擊平滑滾動到對應章節
- 移動端隱藏

## 分頁

首頁和歸檔頁支持分頁，每頁 `PAGE_SIZE`（默認 10）篇文章：

- `/` — 第 1 頁
- `/page/2` — 第 2 頁
- `/page/3` — 第 3 頁
- ...

## 文章卡片

每篇文章卡片顯示：

- 封面圖片（或首字母佔位符）
- 分類 badge
- 置頂 ★ 標記
- 編輯中 🖊 標記
- 發佈日期
- 字數統計
- 閱讀時間
- 標籤列表

hover 效果：卡片上浮 + 陰影 + 封面縮放。

## 全站搜索

- `Ctrl+K` 或點擊 🔍 打開搜索面板
- 搜索標題、描述、分類、標籤和**文章正文**
- 匹配詞高亮顯示
- 顯示上下文摘要片段

## RSS 訂閱

自動生成 `/rss.xml`，包含全部已發佈文章。訂閱鏈接在 Header 社交圖標和 SEO `<head>` 中。

## SEO 優化

每頁自動注入：

| Meta 標籤 | 來源 |
|-----------|------|
| `<title>` | `frontmatter.title + 站點名` |
| `<meta description>` | `frontmatter.description` |
| `og:title / og:image` | 文章標題 / 封面圖 |
| `twitter:card` | `summary_large_image` |

## 評論區

使用 Waline 作為評論系統，支持：

- 暱稱 / 郵箱 / 網址
- Markdown 語法
- 表情包
- 暗色模式自動適配
