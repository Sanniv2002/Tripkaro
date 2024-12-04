'use client';

import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';
import { ArrowRight } from 'lucide-react';

export function LandingHero() {

  const googleAuth = () => {
    signIn("google", {
      redirect: false,
      callbackUrl: "/dashboard",
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)] px-4 text-center bg-dot-pattern">
      <div className="max-w-3xl space-y-8">
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
          Track Trip Expenses with{' '}
          <span className="text-primary">Friends</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Split expenses, track spending, and manage group trips effortlessly.
          Join now and start sharing expenses with your travel companions.
        </p>
        <Button 
          size="lg" 
          onClick={googleAuth}
          className="text-lg px-8"
        >
          Continue with Google
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}