'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Share2, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InviteDialogProps {
  tripName: string;
  roomCode: string;
}

export function InviteDialog({ tripName, roomCode }: InviteDialogProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const inviteLink = `${window.location.origin}/invite/${roomCode}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      toast({
        title: 'Copied to clipboard',
        description: 'The invitation link has been copied to your clipboard.',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: 'Failed to copy',
        description: 'Please try copying the link manually.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Share2 className="h-4 w-4 mr-2" />
          Invite
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite to {tripName}</DialogTitle>
          <DialogDescription>
            Share this link with friends to invite them to join your trip.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Invitation Link</Label>
            <div className="flex gap-2">
              <Input
                readOnly
                value={inviteLink}
                onClick={(e) => e.currentTarget.select()}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={copyToClipboard}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Room Code</Label>
            <Input
              readOnly
              value={roomCode}
              onClick={(e) => e.currentTarget.select()}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}