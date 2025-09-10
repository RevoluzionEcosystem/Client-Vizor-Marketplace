import { useState, useEffect, useRef, useCallback } from 'react';

interface WebSocketMessage {
  type: string;
  data: any;
}

interface UseWebSocketProps {
  url: string;
  onMessage?: (message: WebSocketMessage) => void;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  autoReconnect?: boolean;
  enabled?: boolean; // Added for controlling whether the WebSocket should connect
}

export function useWebSocket({
  url,
  onMessage,
  reconnectInterval = 5000,
  maxReconnectAttempts = 10,
  autoReconnect = true,
  enabled = true, // Default to true for backward compatibility
}: UseWebSocketProps) {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const websocketRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef<number>(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Create a function to establish the WebSocket connection
  const connect = useCallback(() => {
    // Close any existing connection
    if (websocketRef.current) {
      websocketRef.current.close();
    }

    try {
      const ws = new WebSocket(url);

      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setError(null);
        reconnectAttemptsRef.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const parsedData: WebSocketMessage = JSON.parse(event.data);
          if (onMessage) {
            onMessage(parsedData);
          }
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err);
        }
      };

      ws.onerror = (event) => {
        console.error('WebSocket error:', event);
        setError(new Error('WebSocket connection error'));
      };

      ws.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason);
        setIsConnected(false);

        // Attempt to reconnect if autoReconnect is enabled
        if (autoReconnect && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current += 1;
            console.log(`Attempting to reconnect (${reconnectAttemptsRef.current}/${maxReconnectAttempts})`);
            connect();
          }, reconnectInterval);
        }
      };

      websocketRef.current = ws;
    } catch (err) {
      console.error('Failed to create WebSocket:', err);
      setError(err as Error);
    }
  }, [url, onMessage, reconnectInterval, maxReconnectAttempts, autoReconnect]);

  // Connect when the component mounts and disconnect when it unmounts
  useEffect(() => {
    if (enabled) {
      connect();
    }

    return () => {
      // Clean up the WebSocket connection and any pending reconnect attempts
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }

      if (websocketRef.current) {
        websocketRef.current.close();
        websocketRef.current = null;
      }
    };
  }, [connect, enabled]);

  // Function to send a message through the WebSocket
  const sendMessage = useCallback((message: string | object) => {
    if (!websocketRef.current || websocketRef.current.readyState !== WebSocket.OPEN) {
      setError(new Error('WebSocket is not connected'));
      return false;
    }

    try {
      const messageToSend = typeof message === 'string' ? message : JSON.stringify(message);
      websocketRef.current.send(messageToSend);
      return true;
    } catch (err) {
      console.error('Failed to send WebSocket message:', err);
      setError(err as Error);
      return false;
    }
  }, []);

  // Function to manually reconnect
  const reconnect = useCallback(() => {
    reconnectAttemptsRef.current = 0;
    connect();
  }, [connect]);

  return {
    isConnected,
    error,
    sendMessage,
    reconnect,
  };
}