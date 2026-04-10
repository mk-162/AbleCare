"use client";

interface RichTextProps {
  body?: any;
}

export function RichText({ body }: RichTextProps) {
  if (!body) return null;

  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl prose prose-lg prose-ac-black">
        {typeof body === "string" ? (
          <div dangerouslySetInnerHTML={{ __html: body }} />
        ) : (
          <p className="text-ac-black/70">Content loading...</p>
        )}
      </div>
    </section>
  );
}
