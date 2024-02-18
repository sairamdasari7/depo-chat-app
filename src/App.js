import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import ChatWindow from './components/ChatWindow';
import InputField from './components/InputField';
import UserList from './components/UserList';
import './App.css';

const ENDPOINT = 'http://localhost:5000'; // Backend server endpoint

function App() {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    setSocket(socket);

    socket.on('message', (message) => {
      setMessages(prevMessages => [...prevMessages, message]);
    });

    socket.on('userList', (userList) => {
      setUsers(userList);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = (messageText) => {
    const message = {
      sender: 'Me',
      text: messageText
    };
    socket.emit('message', message);
    setMessages(prevMessages => [...prevMessages, message]);
  };

  // Function to generate a random message
  const generateRandomMessage = () => {
    const messages = [
      "Hello!",
      "How are you?",
      "What's up?",
      "Nice to meet you!",
      "Have a great day!"
    ];
    const randomIndex = Math.floor(Math.random() * messages.length);
    const randomMessage = messages[randomIndex];
    sendMessage(randomMessage);
  };

  return (
    <div className="App">
      <UserList users={users} />
      <ChatWindow messages={messages} />
      <InputField sendMessage={sendMessage} />
      <button onClick={generateRandomMessage}>Send Random Message</button>
    </div>
  );
}

export default App;
