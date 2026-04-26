import { useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export const useWebSocket = (topic, onMessageReceived) => {
  const [connected, setConnected] = useState(false);
  const clientRef = useRef(null);

  useEffect(() => {
    const socket = new SockJS('http://localhost:8085/ws-tracking');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    stompClient.onConnect = (frame) => {
      setConnected(true);
      stompClient.subscribe(topic, (message) => {
        if (message.body && onMessageReceived) {
          onMessageReceived(JSON.parse(message.body));
        }
      });
    };

    stompClient.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
    };

    clientRef.current = stompClient;
    stompClient.activate();

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, [topic]);

  const publish = (destination, body) => {
    if (clientRef.current && connected) {
      clientRef.current.publish({ destination, body: JSON.stringify(body) });
    }
  };

  return { connected, publish };
};
