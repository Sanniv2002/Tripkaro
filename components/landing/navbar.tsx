'use client';

import { Plane } from 'lucide-react';
import Link from 'next/link';

export function LandingNavbar() {
  return (
    <nav className="p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto flex items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Plane className="h-8 w-8" />
          <span className="font-bold text-2xl">Tripkaro</span>
        </Link>
      </div>
    </nav>
  );
}