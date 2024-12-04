'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  PlusCircle,
  Settings,
  ChevronLeft,
  Plane,
  Hash,
  Bot,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { addTrip, joinRoom } from '@/app/actions/trips';
import { useRecoilState } from 'recoil';
import { tripsAtom } from '@/store/atoms/trips';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [tripName, setTripName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [trips, setTrips] = useRecoilState(tripsAtom);
  const [loading, setLoading] = useState(false);  // Loading state for buttons
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);  // Track if create trip dialog is open
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);  // Track if join trip dialog is open
  const router = useRouter();

  // Use media query to detect screen size and collapse sidebar on smaller screens
  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    setIsCollapsed(mediaQuery.matches);

    const handleResize = (e: MediaQueryListEvent) => {
      setIsCollapsed(e.matches);
    };

    mediaQuery.addEventListener('change', handleResize);

    return () => {
      mediaQuery.removeEventListener('change', handleResize);
    };
  }, []);

  // Function to handle creating a new trip
  const handleCreateTrip = async () => {
    if (!tripName || !startDate) {
      alert('Please fill out all fields before creating a trip!');
      return;
    }

    setLoading(true); // Start loading
    const data = {
      name: tripName,
      startDate,
      endDate,
    };
    const result = await addTrip(data);
    if (result) {
      setTrips([...trips, result]);
      router.push(`dashboard/trip/${result.id}`);
      setIsCreateDialogOpen(false);  // Close the create trip dialog
    }
    setLoading(false); // Stop loading
    setTripName('');
    setStartDate('');
    setEndDate('');
  };

  // Function to handle joining an existing trip
  const handleJoinTrip = async () => {
    if (!roomCode) {
      alert('Please enter a room code!');
      return;
    }

    setLoading(true);
    const data = await joinRoom(roomCode);
    if (data.success) {
      router.push(`dashboard/trip/${data.trip.id}`);
      setIsJoinDialogOpen(false);
    }
    setLoading(false);
    setRoomCode('');
  };

  return (
    <div
      className={cn(
        'relative pb-12 min-h-screen border-r transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <Link href="/dashboard">
            <div className="flex items-center space-x-2 mb-8">
              <Plane className="h-6 w-6 mx-2 md:mx-0" />
              {!isCollapsed && <h2 className="text-lg font-semibold">Tripkaro</h2>}
            </div>
          </Link>
          <div className="space-y-2">
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full',
                    isCollapsed ? 'justify-center px-2' : 'justify-start'
                  )}
                >
                  <PlusCircle className={cn('h-4 w-4', !isCollapsed && 'mr-2')} />
                  {!isCollapsed && 'New Trip'}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Trip</DialogTitle>
                  <DialogDescription>
                    Start a new trip and invite your friends to join.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Trip Name</Label>
                    <Input
                      id="name"
                      placeholder="Summer Vacation 2024"
                      value={tripName}
                      onChange={(e) => setTripName(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="dates">Dates</Label>
                    <div className="flex gap-2">
                      <Input
                        type="date"
                        id="start-date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                      <Input
                        type="date"
                        id="end-date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" onClick={handleCreateTrip} disabled={loading}>
                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Create Trip'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full',
                    isCollapsed ? 'justify-center px-2' : 'justify-start'
                  )}
                >
                  <Hash className={cn('h-4 w-4', !isCollapsed && 'mr-2')} />
                  {!isCollapsed && 'Join Trip'}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Join Existing Trip</DialogTitle>
                  <DialogDescription>
                    Enter the room code to join an existing trip.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="roomCode">Room Code</Label>
                    <Input
                      id="roomCode"
                      placeholder="Enter room code"
                      value={roomCode}
                      onChange={(e) => setRoomCode(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" onClick={handleJoinTrip} disabled={loading}>
                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Join Trip'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <nav className="space-y-1 px-2">
          <Link
            href="/dashboard"
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
              pathname === '/dashboard' ? 'bg-accent' : 'transparent',
              isCollapsed && 'justify-center'
            )}
          >
            <LayoutDashboard className="h-4 w-4" />
            {!isCollapsed && 'Dashboard'}
          </Link>
          <Link
            href="/dashboard/settings"
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
              pathname === '/dashboard/settings' ? 'bg-accent' : 'transparent',
              isCollapsed && 'justify-center'
            )}
          >
            <Settings className="h-4 w-4" />
            {!isCollapsed && 'Settings'}
          </Link>
        </nav>
      </div>
    </div>
  );
}
