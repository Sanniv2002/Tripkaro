import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ChatHeader } from './ChatHeader';
import { TypingIndicator } from './TypingIndicator';
import { useChat } from '@/hooks/use-chat';
import { useChatScroll } from '@/hooks/use-chat-scroll';
import { Bot, Loader2 } from 'lucide-react';

export function ChatWindow() {
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const { 
    messages, 
    isTyping, 
    sendMessage, 
    loadMoreMessages, 
    isLoadingMore, 
    hasMore 
  } = useChat();
  
  useChatScroll(messages, isTyping, scrollContainerRef);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (target.scrollTop === 0 && hasMore && !isLoadingMore) {
      loadMoreMessages();
    }
  };  

  const handleSendMessage = () => {
    if (!input.trim()) return;
    sendMessage("", input);
    setInput('');
  };

  if (!isOpen) {
    return (
      <Button
        className="fixed bottom-4 right-4 flex gap-2"
        onClick={() => setIsOpen(true)}
      >
        <Bot /> Ask Trippy
      </Button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-full md:w-[400px] h-[600px] md:h-[500px] bg-background border rounded-lg shadow-lg flex flex-col">
      <ChatHeader onClose={() => setIsOpen(false)} />
      
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-4"
        onScroll={handleScroll}
      >
        {isLoadingMore && (
          <div className="flex justify-center py-2">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        )}
        
        <div className="space-y-4">
          {messages.map((message:any, i:any) => (
            <ChatMessage key={i} message={message} />
          ))}
          {isTyping && <TypingIndicator />}
        </div>
      </div>

      <ChatInput
        value={input}
        onChange={setInput}
        onSubmit={handleSendMessage}
      />
    </div>
  );
}