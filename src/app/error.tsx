"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-ac-black mb-4">Something went wrong</h2>
        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-ac-blue text-white font-bold rounded-full hover:bg-ac-blue/90 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
