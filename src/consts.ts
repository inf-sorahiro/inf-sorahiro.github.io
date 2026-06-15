export const SITE_TITLE = 'INF-Sorahiro Blog';
export const SITE_DESCRIPTION = 'A personal blog about technology, programming, and life.';
export const SITE_AUTHOR = 'Inf-Sorahiro';
export const SITE_URL = 'https://inf-sorahiro.github.io';
export const SITE_AVATAR = 'https://avatars.githubusercontent.com/u/293424032?v=4';
export const SITE_COVER = 'https://raw.githubusercontent.com/LingXi9374/LingXi9374.github.io/master/src/content/posts/images/ArchInst.png';

export const PAGE_SIZE = 10;

// Navigation items are now generated dynamically by locale in src/i18n/utils.ts
export const NAV_ITEMS = [
  { label: '首页', href: '/' },
  { label: '周刊', href: '/weekly' },
  { label: '文章', href: '/archives' },
  { label: '友链', href: '/friends' },
  { label: '关于', href: '/about' },
];

export const SOCIAL_LINKS = [
  { name: 'GitHub', href: 'https://github.com/inf-sorahiro', icon: 'github' },
  { name: 'RSS', href: '/rss.xml', icon: 'rss' },
];

export const npmCDN = '';
export const walineServer = '';

/** 站点创建日期，用于计算运行时长 */
export const SITE_START_DATE = '2026-06-14';