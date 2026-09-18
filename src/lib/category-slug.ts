/**
 * Category name → URL slug.
 *
 * Its own module so client components (live preview, the blog sidebar) can
 * import it without pulling in lib/blog.ts, which reads the filesystem and is
 * therefore server-only.
 */
export function slugifyCategory(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}
