'use client';

import { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';

interface TimelineEvent {
  id: string;
  message: {
    content?: string;
    avatar?: string;
  };
  createdAt: Date;
  tripId: string;
}

interface TripTimelineProps {
  events: TimelineEvent[];
}

export function TripTimeline({ events }: TripTimelineProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }, [events]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trip Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea
          className=" max-h-80 overflow-y-auto rounded-md border"
          ref={scrollAreaRef}
        >
          <div className="space-y-8 p-4">
            {[...events].reverse().map((event) => (
              <div key={event.id} className="flex gap-4 relative">
                <div className="w-10 h-10 rounded-full flex-shrink-0">
                  <Avatar>
                    <AvatarImage src={event.message.avatar} />
                    <AvatarFallback>{event.message.content}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{event.message.content}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(event.createdAt, { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}