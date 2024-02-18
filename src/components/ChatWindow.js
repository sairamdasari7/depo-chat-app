import React from 'react';

function ChatWindow({ messages }) {
  return (
    <div className="chat-window">
      <ul>
        {messages.map((message, index) => (
          <li key={index}>
            <strong>{message.sender}:</strong> {message.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChatWindow;
