import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkDirective from "remark-directive";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";
import type { Html, Paragraph, Root, RootContent } from "mdast";
import type { Parent } from "unist";
import { visit } from "unist-util-visit";
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
    .use(remarkDirective)
    .use(remarkStaticNoiseComponents)
    .use(remarkHtml, { sanitize: false })
    .process(markdown);
  return result.toString();
}

type DirectiveNode = Parent & {
  type: "containerDirective" | "leafDirective" | "textDirective";
  name: string;
  attributes?: Record<string, string | null | undefined>;
  children: RootContent[];
  data?: {
    hName?: string;
    hProperties?: Record<string, string | string[]>;
  };
};

type MarkdownNode = RootContent | DirectiveNode;

type MarkdownParent = Parent & {
  children: MarkdownNode[];
};

function remarkStaticNoiseComponents() {
  return (tree: Root) => {
    visit(
      tree,
      ["containerDirective", "leafDirective", "textDirective"],
      (node, index, parent) => {
        const directive = node as DirectiveNode;

        if (directive.type === "containerDirective") {
          transformContainerDirective(directive, index, parent);
          return;
        }

        if (directive.type === "leafDirective") {
          transformLeafDirective(directive, index, parent);
          return;
        }

        if (directive.type === "textDirective") {
          transformTextDirective(directive);
        }
      },
    );
  };
}

function transformContainerDirective(
  directive: DirectiveNode,
  index: number | undefined,
  parent: Parent | undefined,
) {
  if (directive.name === "section") {
    const number = getAttribute(directive, "number", "01");
    const [title, ...rest] = directive.children;

    directive.data = {
      hName: "div",
      hProperties: { className: "md-section" },
    };
    directive.children = [
      htmlNode(`<span class="section-number">${escapeHtml(number)}</span>`),
      titleAsHeading(title),
      ...rest,
    ];
    return;
  }

  if (directive.name === "note") {
    const label = getAttribute(directive, "label", "Note");
    directive.data = {
      hName: "aside",
      hProperties: { className: "analysis" },
    };
    directive.children = [
      htmlNode(`<span class="analysis-label">${escapeHtml(label)}</span>`),
      ...directive.children,
    ];
    return;
  }

  if (directive.name === "thesis") {
    const label = getAttribute(directive, "label", "Thesis");
    directive.data = {
      hName: "aside",
      hProperties: { className: "thesis" },
    };
    directive.children = [
      htmlNode(`<span class="thesis-label">${escapeHtml(label)}</span>`),
      ...directive.children,
    ];
    return;
  }

  if (directive.name === "pullquote") {
    const cite = getAttribute(directive, "cite", "");
    directive.data = {
      hName: "figure",
      hProperties: { className: "pullquote" },
    };

    if (cite) {
      directive.children = [
        ...directive.children,
        htmlNode(`<cite>${escapeHtml(cite)}</cite>`),
      ];
    }
    return;
  }

  if (directive.name === "chat" && typeof index === "number" && parent) {
    const markdownParent = parent as MarkdownParent;
    markdownParent.children[index] = htmlNode(renderChatBlock(directive));
  }
}

function transformLeafDirective(
  directive: DirectiveNode,
  index: number | undefined,
  parent: Parent | undefined,
) {
  if (directive.name !== "divider" || typeof index !== "number" || !parent) {
    return;
  }

  const markdownParent = parent as MarkdownParent;
  markdownParent.children[index] = htmlNode('<div class="article-divider">§</div>');
}

function transformTextDirective(directive: DirectiveNode) {
  if (directive.name !== "fallacy") {
    return;
  }

  directive.data = {
    hName: "span",
    hProperties: { className: "fallacy" },
  };
}

function titleAsHeading(node: RootContent | undefined): RootContent {
  if (!node) {
    return {
      type: "heading",
      depth: 2,
      children: [{ type: "text", value: "Untitled section" }],
    };
  }

  if (node.type === "paragraph") {
    const heading = node as Paragraph & {
      data?: { hName?: string };
    };
    heading.data = { ...heading.data, hName: "h2" };
    return heading;
  }

  return node;
}

function renderChatBlock(directive: DirectiveNode) {
  const label = getAttribute(directive, "label", "Conversation");
  const messages = directiveText(directive.children)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map(parseChatLine);

  const messageHtml = messages
    .map((message) => {
      const speakerClass = normalizeClassName(message.speaker);

      return `<div class="chat-msg">
  <div class="chat-avatar avatar-${speakerClass}">${escapeHtml(message.avatar)}</div>
  <div class="chat-content">
    <span class="chat-name name-${speakerClass}">${escapeHtml(message.speaker)}</span>
    <div class="chat-text">${escapeHtml(message.text)}</div>
  </div>
</div>`;
    })
    .join("\n");

  return `<div class="chat-block">
  <div class="chat-header">${escapeHtml(label)}</div>
  <div class="chat-body">
${messageHtml}
  </div>
</div>`;
}

function parseChatLine(line: string) {
  const pipeParts = line.split("|").map((part) => part.trim());

  if (pipeParts.length >= 3) {
    const [speaker, avatar, ...textParts] = pipeParts;
    return {
      speaker,
      avatar: avatar || speaker.slice(0, 1).toUpperCase(),
      text: textParts.join("|").trim(),
    };
  }

  const colonMatch = line.match(/^([^:]+):\s*(.+)$/);

  if (colonMatch) {
    const speaker = colonMatch[1].trim();
    return {
      speaker,
      avatar: speaker.slice(0, 1).toUpperCase(),
      text: colonMatch[2].trim(),
    };
  }

  return {
    speaker: "Unknown",
    avatar: "?",
    text: line,
  };
}

function directiveText(children: RootContent[]): string {
  return children.map(nodeText).join("\n");
}

function nodeText(node: RootContent): string {
  if ("value" in node && typeof node.value === "string") {
    return node.value;
  }

  if ("children" in node && Array.isArray(node.children)) {
    return node.children.map((child) => nodeText(child as RootContent)).join("");
  }

  return "";
}

function getAttribute(
  directive: DirectiveNode,
  name: string,
  fallback: string,
) {
  const value = directive.attributes?.[name];
  return typeof value === "string" ? value : fallback;
}

function htmlNode(value: string): Html {
  return {
    type: "html",
    value,
  };
}

function normalizeClassName(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
