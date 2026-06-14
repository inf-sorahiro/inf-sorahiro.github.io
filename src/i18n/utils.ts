import { ui, type Locale, type TranslationKey } from './ui';
import { DEFAULT_LOCALE, LOCALES } from '../config/locale';

export const defaultLocale = DEFAULT_LOCALE as Locale;
export const locales = LOCALES as unknown as Locale[];

export function getLangFromUrl(url: URL): Locale {
  const [, lang] = url.pathname.split('/');
  if (lang && locales.includes(lang as Locale)) return lang as Locale;
  return defaultLocale;
}

export function useTranslations(locale: Locale) {
  return function t(key: TranslationKey): string {
    return ui[locale][key] || ui[defaultLocale][key] || key;
  };
}

export function getLocalePath(path: string, locale: Locale): string {
  if (path === '/') return `/${locale}`;
  return `/${locale}${path}`;
}

export function getAlternateLocalePath(pathname: string, currentLocale: Locale): string {
  const target = locales.find((l) => l !== currentLocale);
  if (!target) return pathname;

  for (const l of locales) {
    const prefix = `/${l}`;
    if (pathname === prefix) return `/${target}`;
    if (pathname.startsWith(prefix + '/')) {
      return `/${target}${pathname.slice(prefix.length)}`;
    }
  }

  return `/${target}${pathname}`;
}

export function getNavItems(locale: Locale) {
  const t = useTranslations(locale);
  return [
    { label: t('nav.home'), href: getLocalePath('/', locale) },
    { label: t('nav.weekly'), href: getLocalePath('/weekly', locale) },
    { label: t('nav.articles'), href: getLocalePath('/archives', locale) },
    { label: t('nav.friends'), href: getLocalePath('/friends', locale) },
    { label: t('nav.about'), href: getLocalePath('/about', locale) },
  ];
}
