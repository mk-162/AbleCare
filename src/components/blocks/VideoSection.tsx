"use client";

interface VideoSectionProps {
  heading?: string;
  videoUrl?: string;
  caption?: string;
  thumbnail?: string;
}

export function VideoSection({ heading, videoUrl, caption }: VideoSectionProps) {
  const getEmbedUrl = (url?: string) => {
    if (!url) return null;
    const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
    if (ytMatch) return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}`;
    return url;
  };

  const embedUrl = getEmbedUrl(videoUrl);

  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        {heading && (
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-ac-black">{heading}</h2>
          </div>
        )}
        {embedUrl && (
          <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-video bg-ac-black">
            <iframe
              src={embedUrl}
              title={heading || "Video"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        )}
        {caption && <p className="text-center text-sm text-ac-black/60 font-light mt-6">{caption}</p>}
      </div>
    </section>
  );
}
