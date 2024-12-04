'use client';

import { Sidebar } from '@/components/dashboard/sidebar';
import { Header } from '@/components/dashboard/header';
import { useSession } from "next-auth/react";
import { RecoilRoot } from "recoil";
import { Toaster } from '@/components/ui/toaster';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = useSession();
  return (
    <RecoilRoot>
      <div className="min-h-screen flex">
        <Sidebar />
        <div className="flex-1">
          <Header user={session.data?.user} />
          <main className="p-8">{children}</main>
          <Toaster />
        </div>
      </div>
    </RecoilRoot>
  );
}