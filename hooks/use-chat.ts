import { useState, useCallback, useEffect } from "react";
import { loadChatsAction } from "@/app/actions/bot";
import { generateResponseAction } from "@/app/actions/bot";

const MESSAGES_PER_PAGE = 20;

export function useChat() {
  const initialIntroMessage = {
    id: "intro",
    role: "assistant",
    content:
      "Hello, I'm Trippy, your travel assistant! How can I help you today? I can check your expenses, provide trip advice based on your selected trip, and much more!",
    timestamp: new Date().toISOString(),
  };

  const [messages, setMessages] = useState<any[]>([initialIntroMessage]); // Start with an introductory message
  const [isTyping, setIsTyping] = useState(false);
  const [cursor, setCursor] = useState<number | null>(null); // Track cursor for pagination
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    const fetchInitialMessages = async () => {
      try {
        const initialMessages = await loadChatsAction(undefined, MESSAGES_PER_PAGE);
        if (initialMessages.length > 0) {
          setMessages((prev) => [
            ...initialMessages.reverse(), // Prepend loaded messages
            ...prev,
          ]);
          setCursor(1);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching initial messages:", error);
      }
    };

    fetchInitialMessages();
  }, []);

  // Function to load more messages
  const loadMoreMessages = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;
  
    setIsLoadingMore(true);
  
    try {
      const loadedChats = await loadChatsAction(cursor || 0, MESSAGES_PER_PAGE);
  
      if (loadedChats.length > 0) {
        setMessages((prev) => [...loadedChats.reverse(), ...prev]); // Prepend new messages
        setCursor(loadedChats[0].id); // Update cursor to the first chat's ID
      } else {
        setHasMore(false); // Stop loading if no more messages
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [cursor, isLoadingMore, hasMore]);  

  // Function to send a new message
  const sendMessage = async (context: string, prompt: string) => {
    const userMessage = {
      id: Date.now(), // Temporary ID
      role: "user",
      content: prompt,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const data = await generateResponseAction({ context }, prompt);

      const botReply = {
        id: Date.now() + 1,
        role: "assistant",
        content: data.message || "No reply available.",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (error) {
      console.error("Error sending message:", error);

      const errorReply = {
        id: Date.now() + 1,
        role: "assistant",
        content: "Error: Unable to fetch a reply.",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, errorReply]);
    } finally {
      setIsTyping(false);
    }
  };

  return {
    messages,
    isTyping,
    sendMessage,
    loadMoreMessages,
    isLoadingMore,
    hasMore,
  };
}
