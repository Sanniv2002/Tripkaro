import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserRound } from 'lucide-react';

interface ChatMessageProps {
  message: any;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isBot = message.role === 'assistant';

  return (
    <div className={cn('flex items-start gap-3', !isBot && 'flex-row-reverse')}>
      <Avatar className="h-8 w-8">
        {isBot ? (
          <>
            <AvatarImage src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiMa0N3X9LL47n9IvTRsxqgnUA9-WFzTPEUw&s" />
            <AvatarFallback>AI</AvatarFallback>
          </>
        ) : (
          <>
          <UserRound />
          </>
        )}
      </Avatar>
      <div className={cn(
        'rounded-lg px-4 py-2 max-w-[80%]',
        isBot ? 'bg-secondary' : 'bg-primary text-primary-foreground'
      )}>
        <p className="text-sm">{message.content}</p>
      </div>
    </div>
  );
}