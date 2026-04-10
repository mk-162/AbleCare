import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-ac-grey">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold text-ac-blue/20 mb-4">404</div>
        <h1 className="text-3xl font-bold text-ac-black mb-4">Page not found</h1>
        <p className="text-ac-black/60 font-light mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/">
          <Button className="bg-ac-blue hover:bg-ac-blue/90 text-white rounded-full font-bold px-8">
            Back to homepage
          </Button>
        </Link>
      </div>
    </div>
  );
}
