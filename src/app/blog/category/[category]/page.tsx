import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { BlogSidebar } from "@/components/blocks/BlogSidebar";
import {
  getArticles,
  getCategories,
  slugifyCategory,
  unslugifyCategory,
} from "@/lib/blog";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const name = unslugifyCategory(category);
  if (!name) return { title: "Category Not Found" };
  return {
    title: `${name} Articles`,
    description: `Expert articles and guides on ${name.toLowerCase()} from the Able Care team.`,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const allArticles = getArticles();
  const categories = getCategories(allArticles);
  const categoryName = unslugifyCategory(category);

  if (!categoryName) notFound();

  const articles = allArticles.filter(
    (a) => slugifyCategory(a.category) === category
  );

  return (
    <div className="pt-32 pb-20 min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Blog", href: "/blog" },
            { label: categoryName },
          ]}
        />

        {/* Header */}
        <div className="mb-10">
          <div className="text-xs font-bold uppercase tracking-[0.25em] text-ac-blue mb-4">
            Category
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-ac-black mb-4">
            {categoryName}
          </h1>
          <p className="text-lg text-ac-black/70 font-light max-w-2xl">
            {articles.length} article{articles.length !== 1 ? "s" : ""} on{" "}
            {categoryName.toLowerCase()}.
          </p>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-10">
          <Link
            href="/blog"
            className="px-4 py-2 rounded-full text-sm font-medium bg-black/5 text-ac-black/60 hover:bg-black/10 hover:text-ac-black transition-colors"
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/blog/category/${cat.slug}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                category === cat.slug
                  ? "bg-ac-blue text-white"
                  : "bg-black/5 text-ac-black/60 hover:bg-black/10 hover:text-ac-black"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Article grid */}
          <div className="flex-1 min-w-0">
            {articles.length === 0 ? (
              <p className="text-ac-black/60">No articles in this category yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {articles.map((article) => (
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
                          {article.publishedDate && <span>{article.publishedDate}</span>}
                          {article.readTime > 0 && <span>{article.readTime} min read</span>}
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <BlogSidebar categories={categories} activeCategory={category} />
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const categories = getCategories();
  return categories.map((c) => ({ category: c.slug }));
}
