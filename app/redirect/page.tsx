'use client'

import { useEffect, useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { joinRoom } from "../actions/trips";

const redirectFunctions = {
    joinInvitedRoom: async (router: ReturnType<typeof useRouter>, params: Record<string, string>) => {
        const { roomId } = params;
        if (!roomId) {
            throw new Error("Missing required parameter: roomId");
        }
        try {
            const result = await joinRoom(roomId); // Replace with your actual API call
            if (result.success) {
                router.push(`/dashboard/trip/${result.trip.id}`);
            }
        } catch (error) {
            console.error("Error joining room:", error);
            throw new Error("Failed to join room");
        }
    },
} as const;

type RedirectFunction = keyof typeof redirectFunctions;

// Loading Component
function LoadingState() {
    return (
        <div className="min-h-screen w-full bg-background text-foreground flex flex-col items-center justify-center p-4">
            <div className="text-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
                <h2 className="text-xl font-semibold">Redirecting...</h2>
            </div>
        </div>
    );
}

// Error Component
function ErrorState() {
    return (
        <div className="min-h-screen w-full bg-background text-foreground flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full text-center space-y-6">
                <div className="space-y-2">
                    <div className="flex justify-center">
                        <AlertTriangle className="h-24 w-24 text-destructive animate-pulse" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
                        Redirect Error
                    </h1>
                    <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                        Invalid Redirect Request
                    </h2>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button
                        variant="default"
                        onClick={() => window.history.back()}
                        className="min-w-[140px]"
                    >
                        Go Back
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => window.location.href = "/"}
                        className="min-w-[140px]"
                    >
                        Home Page
                    </Button>
                </div>
            </div>

            <div className="absolute bottom-4 text-center text-sm text-muted-foreground">
                <p>© 2024 Tripkaro. All rights reserved.</p>
            </div>
        </div>
    );
}

// Main Redirect Component
function Redirect() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const fn = searchParams.get("fn") as RedirectFunction;

        const handleRedirect = async () => {
            if (!fn || !Object.keys(redirectFunctions).includes(fn)) {
                setIsValid(false);
                setIsLoading(false);
                return;
            }

            const params: Record<string, string> = {};
            searchParams.forEach((value, key) => {
                if (key !== "fn") {
                    params[key] = value;
                }
            });

            try {
                setIsValid(true);
                await redirectFunctions[fn](router, params); // Pass all extracted parameters
            } catch (error) {
                console.error("Error in redirect function:", error);
                setIsValid(false);
            } finally {
                setIsLoading(false);
            }
        };

        handleRedirect();
    }, [router]);

    if (isLoading) {
        return <LoadingState />;
    }

    if (!isValid) {
        return <ErrorState />;
    }

    return null;
}

export default Redirect;
