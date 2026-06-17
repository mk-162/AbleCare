import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { BlogSidebar } from "@/components/blocks/BlogSidebar";
import { ArticleCard } from "@/components/blocks/ArticleCard";
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
              <div className="flex flex-col gap-8">
                {articles.map((article) => (
                  <ArticleCard key={article.slug} article={article} />
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
