import { LandingHero } from '@/components/landing/hero';
import { LandingNavbar } from '@/components/landing/navbar';

export default function Home() {
  return (
      <main className="min-h-screen bg-background">
        <LandingNavbar />
        <LandingHero />
      </main>
  );
}