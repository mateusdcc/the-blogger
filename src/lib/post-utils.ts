export type PostMeta = {
  slug: string;
  title: string;
  subtitle?: string;
  date: string;
  category: string;
  excerpt: string;
  tags: string[];
  featured: boolean;
  readingTime: string;
};

export function formatPostDate(date: string) {
  const [year, month, day] = date.split("-");

  if (!year || !month || !day) {
    return date;
  }

  return `${year} — ${month} — ${day}`;
}
