import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

export function NotFound() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-2">
          <div className="flex justify-center">
            <FileQuestion className="h-24 w-24 text-muted-foreground animate-pulse" />
          </div>
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
            404
          </h1>
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            Page Not Found
          </h2>
          <p className="text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            variant="default"
            onClick={() => window.history.back()}
            className="min-w-[140px]"
          >
            Go Back
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.href = '/'}
            className="min-w-[140px]"
          >
            Home Page
          </Button>
        </div>
      </div>

      <div className="absolute bottom-4 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Your Company. All rights reserved.</p>
      </div>
    </div>
  );
}