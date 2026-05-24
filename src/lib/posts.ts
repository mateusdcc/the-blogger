import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";
import type { PostMeta } from "@/lib/post-utils";

const postsDirectory = path.join(process.cwd(), "posts");

export type Post = PostMeta & {
  contentHtml: string;
};

type FrontMatter = {
  slug?: string;
  title?: string;
  subtitle?: string;
  date?: string;
  category?: string;
  excerpt?: string;
  tags?: string[];
  featured?: boolean;
};

export function getAllPosts(): PostMeta[] {
  return getPostFiles()
    .map((fileName) => readPostMeta(fileName))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPostSlugs() {
  return getAllPosts().map((post) => post.slug);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const fileName = getPostFiles().find((file) => slugFromFile(file) === slug);

  if (!fileName) {
    return null;
  }

  const fullPath = path.join(postsDirectory, fileName);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { content } = matter(fileContents);
  const meta = readPostMeta(fileName);
  const contentHtml = await markdownToHtml(content);

  return {
    ...meta,
    contentHtml,
  };
}

export function getAdjacentPosts(slug: string) {
  const posts = getAllPosts();
  const index = posts.findIndex((post) => post.slug === slug);

  return {
    previous: index >= 0 ? posts[index + 1] : undefined,
    next: index > 0 ? posts[index - 1] : undefined,
  };
}

function getPostFiles() {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  return fs.readdirSync(postsDirectory).filter((fileName) => fileName.endsWith(".md"));
}

function readPostMeta(fileName: string): PostMeta {
  const fullPath = path.join(postsDirectory, fileName);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const frontMatter = data as FrontMatter;
  const slug = normalizeSlug(frontMatter.slug ?? slugFromFile(fileName));
  const title = frontMatter.title ?? titleFromSlug(slug);
  const date = frontMatter.date ?? dateFromFile(fileName);

  return {
    slug,
    title,
    subtitle: frontMatter.subtitle,
    date,
    category: frontMatter.category ?? "recursive doubt",
    excerpt: frontMatter.excerpt ?? excerptFromContent(content),
    tags: frontMatter.tags ?? [],
    featured: frontMatter.featured ?? false,
    readingTime: readingTime(content),
  };
}

function slugFromFile(fileName: string) {
  return normalizeSlug(fileName.replace(/\.md$/, "").replace(/^\d{4}-\d{2}-\d{2}-/, ""));
}

function normalizeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(" ");
}

function dateFromFile(fileName: string) {
  const match = fileName.match(/^(\d{4}-\d{2}-\d{2})-/);
  return match?.[1] ?? "2026-05-23";
}

function excerptFromContent(content: string) {
  return content
    .replace(/[#>*_`[\]()]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 34)
    .join(" ");
}

function readingTime(content: string) {
  const words = content.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 220));
  return `${minutes} min`;
}

async function markdownToHtml(markdown: string) {
  const result = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(markdown);
  return result.toString();
}
