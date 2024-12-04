'use client';

import { TripList } from '@/components/dashboard/trip-list';
import { DashboardStats } from '@/components/dashboard/dashboard-stats';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchTrips } from '../actions/trips';
import { useRecoilState } from 'recoil'
import { tripsAtom } from '@/store/atoms/trips';
import { ChatWindow } from '@/components/chat/ChatWindow';

export default function DashboardPage() {
  const [metrics, setMetrics] = useState({
    totalExpense: 0,
    activeTripsCount: 0,
    totalParticipants: 0,
    averageParticipantsPerTrip: 0,
  });
  const [trips, setTrips] = useRecoilState(tripsAtom)
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const session = useSession();
  if (session.status === "unauthenticated") {
    router.push("/");
  }

  useEffect(() => {
    async function getTripData() {
      try {
        const data = await fetchTrips();
        setMetrics(data.metrics);
        console.log(data)
        setTrips(data.trips)
      } catch (error: any) {
        console.error("Error fetching trips:", error.message);
      } finally {
        setLoading(false);
      }
    }

    getTripData();
  }, []);
  
  return (
    <div className="space-y-8">
      <DashboardStats metrics={metrics} loading={loading} />
      <TripList trips={trips}/>
      {/* <ChatWindow /> */}
    </div>
  );
}
