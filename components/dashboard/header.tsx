'use client';

import { UserNav } from '@/components/dashboard/user-nav';
import { ModeToggle } from '@/components/mode-toggle';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function Header({ user }: { user: any }) {
  const router = useRouter()
  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4">
      <ArrowLeft onClick={() => router.back()} className='hover:cursor-pointer'/>
        <div className="ml-auto flex items-center space-x-4">
          <ModeToggle />
          <UserNav user={user} />
        </div>
      </div>
    </header>
  );
}