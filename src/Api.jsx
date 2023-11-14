import React, { createContext, useContext, useState, useEffect } from 'react';
import { over } from 'stompjs';
import SockJS from 'sockjs-client';

const WebSocketContext = createContext();

export function useWebSocket() {
  return useContext(WebSocketContext);
}

function App() {
  const [stompClient, setStompClient] = useState(null);
  const [userData, setUserData] = useState({
    username: '',
    connected: false,
  });

  useEffect(() => {
    if (userData.username) {
      const connect = () => {
        const Sock = new SockJS('http://localhost:8080/ws');
        const client = over(Sock);
        client.connect({}, onConnected, onError);
        setStompClient(client);
      };

      const onConnected = () => {
        setUserData({ ...userData, connected: true });
        // Дополнительная логика, подписка на каналы и т.д.
      };

      const onError = (err) => {
        console.log(err);
      };

      connect();
    }
  }, [userData.username]);

  return (
    <WebSocketContext.Provider value={{ stompClient, userData, setUserData }}>
      {/* Добавить разметку для интерфейса */}
    </WebSocketContext.Provider>
  );
}

export default App;
