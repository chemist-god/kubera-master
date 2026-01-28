import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/utils/constants";

export const dynamic = 'force-dynamic';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden px-4">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute left-0 top-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -translate-x-1/2" />
      <div className="absolute right-0 bottom-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none translate-x-1/2" />

      <div className="text-center relative z-10 max-w-md">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary/20">404</h1>
          <h2 className="text-3xl font-bold text-foreground mt-4">Page Not Found</h2>
          <p className="text-muted-foreground mt-2">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <Link href={ROUTES.DASHBOARD}>
          <Button className="rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30">
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
