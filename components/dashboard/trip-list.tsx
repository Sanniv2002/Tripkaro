'use client';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Calendar, Users, Code } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { formatCurrency } from '@/lib/utils';

export function TripList({ trips }: { trips: any }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [sortedTrips, setSortedTrips] = useState<any[]>([]);

  // Simulate loading trips for demonstration (remove if data is already fetched)
  useEffect(() => {
    if (trips) {
      // Sort trips by the latest startDate in descending order
      const sorted = [...trips].sort((a: any, b: any) => {
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      });
      setSortedTrips(sorted);
      setIsLoading(false); // Set loading to false once trips data is sorted
    }
  }, [trips]);

  const handleTripClick = (tripId: string) => {
    router.push(`dashboard/trip/${tripId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn("animate-spin")}
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">Your Trips</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sortedTrips?.map((trip: any) => (
          <Card
            key={trip.id}
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handleTripClick(trip.id)}
          >
            <div className="space-y-4">
              <div>
                <h3 className="text-3xl font-semibold">{trip.name}</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>
                    {new Date(trip.startDate).toLocaleDateString()} -{' '}
                    {new Date(trip.endDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <Users className="mr-2 h-4 w-4" />
                  <span>{trip.participants?.length} participants</span>
                </div>
                <div className="flex items-center text-sm">
                  <Code className="mr-2 h-4 w-4" />
                  <span>Trip Code: {trip.roomCode}</span>
                </div>
              </div>
              <div className="pt-2">
                {trip.expenses?.length > 0 ? (
                  <p className="text-xl font-bold">
                    {formatCurrency(
                      trip.expenses.reduce(
                        (total: number, expense: any) => total + expense.amount,
                        0
                      )
                    )}
                  </p>
                ) : (
                  <p className="text-xl font-bold">No expenses yet</p>
                )}
                <p className="text-xs text-muted-foreground">Total expenses</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
