import React, { useState } from 'react';

function InputField({ sendMessage }) {
  const [message, setMessage] = useState('');

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (message.trim() !== '') {
      sendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="input-field">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={handleMessageChange}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default InputField;
