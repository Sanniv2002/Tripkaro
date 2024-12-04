import { useEffect, RefObject } from 'react';

export function useChatScroll(
  messages: any, 
  isTyping: boolean,
  scrollRef: RefObject<HTMLDivElement>
) {
  useEffect(() => {
    if (scrollRef.current) {
      const { scrollHeight, clientHeight, scrollTop } = scrollRef.current;
      const isScrolledToBottom = scrollHeight - clientHeight <= scrollTop + 100;

      if (isScrolledToBottom || isTyping) {
        scrollRef.current.scrollTo({
          top: scrollHeight,
          behavior: 'smooth'
        });
      }
    }
  }, [messages, isTyping]);
}