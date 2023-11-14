import React, { useEffect } from 'react';
import { useWebSocket } from './App';
import background from './background.jpg';

function Chat() {
  const { stompClient, userData, setUserData } = useWebSocket();

  // Код компонента Chat остается неизменным, используем данные через хук useWebSocket

  useEffect(() => {
    console.log(userData);
  }, [userData]);

  // ...

  return (
    <div className="container" style={{ backgroundImage: `url(${background})` }}>
      {/* Код компонента Chat */}
    </div>
  );
}

export default Chat;
