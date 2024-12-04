'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, LogIn, UserPlus } from 'lucide-react';
import { getTripName, joinRoom } from '@/app/actions/trips';

interface InvitePageClientProps {
    code: string;
}

export function InvitePageClient({ code }: InvitePageClientProps) {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [isJoining, setIsJoining] = useState(false);
    const [trip, setTrip] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const googleAuth = () => {
        signIn("google", {
            redirect: false,
            callbackUrl: `/redirect?fn=joinInvitedRoom&roomId=${code}`,
        });
    };

    const handleJoinTrip = async () => {
        if (!session) {
            googleAuth()
            return;
        }

        setIsJoining(true);
        try{
            const result = await joinRoom(code)
            if (result.success) {
                router.push(`/dashboard/trip/${result.trip.id}`);
            }
        } catch(error) {
            console.log(error)
        }
    };

    useEffect(() => {
        async function fetchTripDetails() {
            try {
                const result = await getTripName(code);
                if (result) {
                    setTrip(result);
                    setError(null);
                } else {
                    setError('Invalid invitation code');
                }
            } catch (error) {
                setError('Error fetching trip details');
            }
        }
        fetchTripDetails();
    }, [code]);

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <CardTitle className="text-destructive">Invalid Invitation</CardTitle>
                        <CardDescription>{error}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <Button onClick={() => router.push('/')}>Return Home</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!trip) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle>Join Trip</CardTitle>
                    <CardDescription>
                        You&apos;ve been invited to join {trip.name}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="text-center space-y-2">
                        <p className="text-sm text-muted-foreground">
                            Trip dates: {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                        </p>
                    </div>
                    <Button
                        className="w-full"
                        onClick={handleJoinTrip}
                        disabled={isJoining}
                    >
                        {isJoining ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : session ? (
                            <UserPlus className="h-4 w-4 mr-2" />
                        ) : (
                            <LogIn className="h-4 w-4 mr-2" />
                        )}
                        {session ? 'Join Trip' : 'Sign in with Google'}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}