import { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { BlogSidebar } from "@/components/blocks/BlogSidebar";
import { SearchBox } from "@/components/search/SearchBox";
import { getArticles, getCategories, slugifyCategory } from "@/lib/blog";
import { getSearchDocs } from "@/lib/search-index";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog | Current Knowledge & Insights",
  description:
    "Expert insights on falls prevention, functional assessment, and senior care technology from the Able Care team.",
};

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: filterCategory } = await searchParams;
  const allArticles = getArticles();
  const categories = getCategories(allArticles);
  const searchDocs = getSearchDocs("blog");

  const articles = filterCategory
    ? allArticles.filter(
        (a) => slugifyCategory(a.category) === filterCategory
      )
    : allArticles;

  const activeCategoryName = filterCategory
    ? categories.find((c) => c.slug === filterCategory)?.name
    : null;

  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <div className="pt-32 pb-20 min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            ...(activeCategoryName
              ? [
                  { label: "Blog", href: "/blog" },
                  { label: activeCategoryName },
                ]
              : [{ label: "Blog" }]),
          ]}
        />

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-ac-black mb-4">
            {activeCategoryName || "Current Knowledge & Insights"}
          </h1>
          <p className="text-lg text-ac-black/70 font-light max-w-2xl mb-6">
            {activeCategoryName
              ? `Articles and guides on ${activeCategoryName.toLowerCase()}.`
              : "Expert perspectives on falls prevention, functional assessment, and the future of senior care technology."}
          </p>
          <div className="max-w-xl">
            <SearchBox documents={searchDocs} placeholder="Search blog articles..." />
          </div>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-10">
          <Link
            href="/blog"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              !filterCategory
                ? "bg-ac-blue text-white"
                : "bg-black/5 text-ac-black/60 hover:bg-black/10 hover:text-ac-black"
            }`}
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/blog?category=${cat.slug}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filterCategory === cat.slug
                  ? "bg-ac-blue text-white"
                  : "bg-black/5 text-ac-black/60 hover:bg-black/10 hover:text-ac-black"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {articles.length === 0 ? (
          <p className="text-ac-black/60">
            No articles found. Check back soon.
          </p>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Main content */}
            <div className="flex-1 min-w-0">
              {/* Featured article */}
              {featured && (
                <Link href={`/blog/${featured.slug}`} className="block mb-10 group">
                  <article className="bg-white rounded-2xl overflow-hidden border border-black/5 shadow-sm hover:shadow-lg transition-all duration-300">
                    <div className="flex flex-col md:flex-row">
                      <div className="w-full md:w-1/2 h-64 md:h-auto relative overflow-hidden">
                        {featured.image ? (
                          <img
                            src={featured.image}
                            alt={featured.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full min-h-[280px] bg-gradient-to-br from-ac-blue to-ac-aqua" />
                        )}
                      </div>
                      <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
                        {featured.category && (
                          <span className="text-xs font-bold uppercase tracking-widest text-ac-blue mb-3">
                            {featured.category}
                          </span>
                        )}
                        <h2 className="text-2xl md:text-3xl font-bold text-ac-black mb-4 group-hover:text-ac-blue transition-colors leading-tight">
                          {featured.title}
                        </h2>
                        {featured.excerpt && (
                          <p className="text-sm text-ac-black/60 font-light mb-6 line-clamp-3">
                            {featured.excerpt}
                          </p>
                        )}
                        <div className="flex items-center gap-3 text-xs text-ac-black/40">
                          {featured.author && (
                            <span className="font-medium text-ac-black/60">
                              {featured.author}
                            </span>
                          )}
                          {featured.publishedDate && (
                            <span>{featured.publishedDate}</span>
                          )}
                          {featured.readTime > 0 && (
                            <span>{featured.readTime} min read</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              )}

              {/* Article grid */}
              {rest.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {rest.map((article) => (
                    <Link key={article.slug} href={`/blog/${article.slug}`}>
                      <article className="bg-white rounded-2xl overflow-hidden border border-black/5 shadow-sm hover:shadow-lg hover:border-ac-blue/20 transition-all duration-300 h-full flex flex-col group">
                        <div className="h-44 relative overflow-hidden">
                          {article.image ? (
                            <img
                              src={article.image}
                              alt={article.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-ac-blue/10 to-ac-aqua/10" />
                          )}
                        </div>
                        <div className="p-6 flex-grow flex flex-col">
                          {article.category && (
                            <span className="text-[10px] font-bold uppercase tracking-widest text-ac-blue mb-3">
                              {article.category}
                            </span>
                          )}
                          <h3 className="text-lg font-bold text-ac-black mb-3 group-hover:text-ac-blue transition-colors leading-snug">
                            {article.title}
                          </h3>
                          {article.excerpt && (
                            <p className="text-sm text-ac-black/60 font-light flex-grow mb-4 line-clamp-3">
                              {article.excerpt}
                            </p>
                          )}
                          <div className="flex items-center gap-3 text-xs text-ac-black/40 pt-4 border-t border-black/5">
                            {article.publishedDate && (
                              <span>{article.publishedDate}</span>
                            )}
                            {article.readTime > 0 && (
                              <span>{article.readTime} min read</span>
                            )}
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <BlogSidebar
              categories={categories}
              activeCategory={filterCategory}
            />
          </div>
        )}
      </div>
    </div>
  );
}
