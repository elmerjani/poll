// src/contexts/WebSocketContext.tsx
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { OptionExample } from '../types/poll';
import type { Owner } from '../types/user';
interface WebSocketMessage {
  pollId: string;
  optionId:number
  options: OptionExample[]
  user: Owner

}

interface WebSocketContextType {
  socket: WebSocket | null;
  isConnected: boolean;
  sendVote: (pollId: string, optionId: number) => void;
  subscribe: (pollId: string, callback: (data: WebSocketMessage) => void) => () => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

interface WebSocketProviderProps {
  children: React.ReactNode;
  url: string; // WebSocket server URL
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ 
  children, 
  url 
}) => {

  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const subscribers = useRef<Map<string, Set<(data: WebSocketMessage) => void>>>(new Map());
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = () => {
    try {
      const ws = new WebSocket(url);
      
      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        reconnectAttempts.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data);
          console.log('Received WebSocket message:', data);
          
          // Notify all subscribers for this pollId
          const pollSubscribers = subscribers.current.get(data.pollId);
          if (pollSubscribers) {
            pollSubscribers.forEach(callback => callback(data));
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        setSocket(null);
        
        // Attempt to reconnect
        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          console.log(`Attempting to reconnect... (${reconnectAttempts.current}/${maxReconnectAttempts})`);
          setTimeout(connect, 2000 * reconnectAttempts.current);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      setSocket(ws);
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
    }
  };

  useEffect(() => {
    connect();

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [url]);

  const sendVote = (pollId: string, optionId: number) => {
    if (socket && isConnected) {
      const message = JSON.stringify({ pollId, optionId });
      socket.send(message);
      console.log('Sent vote:', message);
    } else {
      console.warn('WebSocket not connected, cannot send vote');
    }
  };

  const subscribe = (pollId: string, callback: (data: WebSocketMessage) => void) => {
    if (!subscribers.current.has(pollId)) {
      subscribers.current.set(pollId, new Set());
    }
    subscribers.current.get(pollId)!.add(callback);

    // Return unsubscribe function
    return () => {
      const pollSubscribers = subscribers.current.get(pollId);
      if (pollSubscribers) {
        pollSubscribers.delete(callback);
        if (pollSubscribers.size === 0) {
          subscribers.current.delete(pollId);
        }
      }
    };
  };

  return (
    <WebSocketContext.Provider value={{
      socket,
      isConnected,
      sendVote,
      subscribe
    }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};