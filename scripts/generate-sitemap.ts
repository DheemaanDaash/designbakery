import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const BASE_URL = "https://designbakery.lovable.app";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

const entries: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/pricing", changefreq: "weekly", priority: "0.8" },
  { path: "/free-trial", changefreq: "weekly", priority: "0.8" },
  { path: "/contact", changefreq: "weekly", priority: "0.8" },
  { path: "/about", changefreq: "monthly", priority: "0.7" },
  { path: "/design-request", changefreq: "weekly", priority: "0.8" },
  { path: "/brand-guidelines", changefreq: "monthly", priority: "0.6" },
  { path: "/our-works", changefreq: "weekly", priority: "0.7" },
  { path: "/blog", changefreq: "weekly", priority: "0.7" },
];

function generateSitemap(entries: SitemapEntry[]) {
  const urls = entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n"),
  );

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
  ].join("\n");
}

// Adds published blog posts using the public (read-only) key. Never fails the build.
async function addBlogPosts() {
  try {
    const env = Object.fromEntries(
      readFileSync(resolve(".env"), "utf8")
        .split("\n")
        .filter((l) => l.includes("="))
        .map((l) => {
          const i = l.indexOf("=");
          return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^"|"$/g, "")];
        }),
    );
    const url = process.env.VITE_SUPABASE_URL ?? env.VITE_SUPABASE_URL;
    const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? env.VITE_SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) return;
    const res = await fetch(`${url}/rest/v1/blog_posts?select=slug&published=eq.true`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    if (!res.ok) return;
    const posts = (await res.json()) as { slug: string }[];
    for (const p of posts) entries.push({ path: `/blog/${p.slug}`, changefreq: "monthly", priority: "0.6" });
  } catch {
    // offline or unavailable — keep static entries only
  }
}

addBlogPosts().then(() => {
  writeFileSync(resolve("public/sitemap.xml"), generateSitemap(entries));
  console.log(`sitemap.xml written (${entries.length} entries)`);
});
