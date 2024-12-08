'use client';

import { TripHeader } from '@/components/trip/trip-header';
import { ExpenseList } from '@/components/trip/expense-list';
import { ExpenseChart } from '@/components/trip/expense-chart';
import { Settlements } from '@/components/trip/settlements';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { getTimeline, getTripDetails } from '@/app/actions/trips';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { TripTimeline } from '@/components/trip/trip-timeline';
import { ChatWindow } from '@/components/chat/ChatWindow';

const ENABLE_CHATBOT = process.env.NEXT_PUBLIC_ENABLE_CHATBOT === "true";

export default function TripPage() {
  const [chartView, setChartView] = useState<'daily' | 'category'>('daily');
  const [trip, setTrip] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshTrip, setRefreshTrip] = useState(false);
  const [timeline, setTimeline] = useState<any>()
  const pathname = usePathname();
  const tripId = pathname.split('/').pop();
  const router = useRouter();
  const session = useSession();

  if (session.status === 'unauthenticated') {
    router.push('/');
  }

  useEffect(() => {
    async function tripInit() {
      console.log("Started")
      if (tripId) {
        try {
          console.log("getting data...")
          const data = await getTripDetails(tripId as string);
          const timelineData = await getTimeline(tripId as string)
          console.log(data, timelineData)
          if (data) {
            console.log("done...")
            setTrip(data);
            setTimeline(timelineData)
            setLoading(false);
            console.log(data, timelineData)
          }
        } catch (error) {
          router.push("/invalid")
          console.error('Failed to fetch trip details:', error);
        } finally {
          console.log("in finally")
          setLoading(false);
        }
      }
    }
    tripInit();
  }, [tripId, refreshTrip]);

  useEffect(() => {
    if (tripId) {
      const url = `wss://${process.env.NEXT_PUBLIC_EVENTS_URL}?tripId=${tripId}`;
      const ws = new WebSocket(url);

      ws.onopen = () => {
      };

      ws.onmessage = (event) => {
        setRefreshTrip((prev) => !prev);
      };

      ws.onclose = () => {
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      return () => {
        ws.close();
      };
    }
  }, [tripId]);

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          className={cn('animate-spin')}
        >
          <path d='M21 12a9 9 0 1 1-6.219-8.56' />
        </svg>
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      <TripHeader
        name={trip?.trip.name}
        roomCode={trip?.trip.roomCode}
        totalExpense={trip?.totalExpense}
        participantCount={trip?.participants.length}
        userId={trip?.userId}
        expenses={trip?.expenses}
        participants={trip?.participants}
        perPerson={trip?.perPerson}
      />
      <ExpenseList
        user={session.data?.user}
        expenses={trip?.expenses}
        setTrip={setTrip}
        participants={trip?.participants}
        tripId={tripId}
        setRefreshTrip={setRefreshTrip}
      />
      <ExpenseChart expenses={trip?.expenses} view={chartView} onViewChange={setChartView} />
      <Settlements settlements={trip?.settlements} />
      <TripTimeline events={timeline} />
      {ENABLE_CHATBOT ? <ChatWindow /> : null}
    </div>
  );
}