export function formatPostDate(date: string, locale: string) {
  return new Intl.DateTimeFormat(locale === 'tr' ? 'tr-TR' : 'en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
    .format(new Date(date))
    .toUpperCase()
    .replace(/\./g, '')
}
