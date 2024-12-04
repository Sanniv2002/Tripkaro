'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Clipboard, MapPinned, Users } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { InviteDialog } from '@/components/dashboard/invite-dialog';

interface TripHeaderProps {
  name: string;
  roomCode: string;
  totalExpense: number;
  participantCount: number;
  expenses: any[]; // Array of expense objects
  participants: any[];
  perPerson: number;
  userId: string; // Authenticated user's ID
}

export function TripHeader({
  name,
  roomCode,
  totalExpense,
  participantCount,
  expenses,
  participants,
  perPerson,
  userId,
}: TripHeaderProps) {
  // Calculate user's total spending
  const userSpendings = expenses
    .filter((expense) => expense.userId === userId)
    .reduce((total, expense) => total + expense.amount, 0);

  const { toast } = useToast()

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="col-span-2 flex items-center justify-between gap-2">
        <div className="flex flex-col">
          <h3 className="text-4xl font-bold flex gap-2 items-center"><MapPinned />{name}</h3>
          <h1 className="text-xs flex gap-1 items-center">{roomCode} <span><Clipboard onClick={() => {
            navigator.clipboard.writeText(roomCode); toast({
              title: "Copied!",
              description: "Trip Code Copied.",
            })
          }} className='h-4 cursor-pointer' /></span></h1>
        </div>
        <InviteDialog
          tripName={name}
          roomCode={roomCode}
        />
      </div>
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground flex gap-2 items-center">
                Total Expenses
                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="rounded-full h-4 w-4 inline-flex items-center justify-center border border-muted-foreground/40 text-muted-foreground/70 text-xs hover:bg-muted hover:text-muted-foreground">
                        i
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs max-w-[200px] p-2">
                      <p>
                        The total amount spent by all participants in this trip,
                        including all expenses and shared costs.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </p>
              <h2 className="text-3xl font-bold">{formatCurrency(totalExpense)}</h2>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-muted-foreground flex gap-2 items-center">
                Per Person
                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="rounded-full h-4 w-4 inline-flex items-center justify-center border border-muted-foreground/40 text-muted-foreground/70 text-xs hover:bg-muted hover:text-muted-foreground">
                        i
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs max-w-[200px] p-2">
                      <p>
                        The average amount each person should pay for expenses that involve
                        all trip members.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </p>
              <p className="text-3xl font-semibold">{formatCurrency(perPerson)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground flex gap-2 items-center">
                Your Spending
                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="rounded-full h-4 w-4 inline-flex items-center justify-center border border-muted-foreground/40 text-muted-foreground/70 text-xs hover:bg-muted hover:text-muted-foreground">
                        i
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs max-w-[200px] p-2">
                      <p>
                        The total amount you have personally spent on this trip, before any
                        settlements or adjustments.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </p>
              <h2 className="text-3xl font-bold">{formatCurrency(userSpendings)}</h2>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div className="flex -space-x-2">
              {participants?.map((participant: any) => (
                <Avatar
                  key={participant.id}
                  className="relative border-2 border-background w-8 h-8"
                >
                  <TooltipProvider delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                          <div className="rounded-full w-8 h-8 flex items-center justify-center"></div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-xs max-w-[200px] p-2">
                        <p>{participant.viewName}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <AvatarImage src={participant.avatar} alt={participant.viewName} />
                  <AvatarFallback>{participant.viewName}</AvatarFallback>
                </Avatar>
              ))}
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">{participantCount} participants</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}