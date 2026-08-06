import React, { useState, useEffect, useRef } from 'react';
import { connectWebSocket, sendMessage, disconnectWebSocket } from '../services/websocketService';
import { fetchConversation } from '../services/api'
import { Link } from "react-router-dom";

export default function ChatScreen({ myUserId, receiverId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [connected, setConnected] = useState(false);
  const bottomRef = useRef(null);

  
  useEffect(() => {

    fetchConversation(myUserId, receiverId)
    .then((history) => setMessages(history))
    .catch((err) => console.log(err));
   
    connectWebSocket(
      myUserId,
      (newMessage) => {
        setMessages((prev) => [...prev, newMessage]);
      },
      () => setConnected(true)
    );

    return () => disconnectWebSocket();
  }, [myUserId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(myUserId, receiverId, input.trim());
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto font-sans border-x border-gray-800 bg-gray-900 text-gray-100">
      <div className="relative flex items-center py-3 border-b border-gray-800">
  <div className="w-full text-center text-gray-400 text-sm">
    {connected ? `Connected as User ${myUserId}` : "Connecting..."}
  </div>

  <Link
    to="/"
    className="absolute right-0 text-blue-400 hover:text-blue-300"
  >
    Back
  </Link>
</div>
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-1">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`px-3 py-2 rounded-2xl max-w-[70%] break-words text-sm ${
              msg.senderId === myUserId
                ? 'bg-emerald-600 text-white self-end'
                : 'bg-gray-800 text-gray-100 self-start'
            }`}
          >
            {msg.content}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="flex p-3 border-t border-gray-800 gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 rounded-full border border-gray-700 bg-gray-800 text-gray-100 placeholder-gray-400 outline-none focus:border-blue-500 text-sm"
        />
        <button
          onClick={handleSend}
          className="px-5 py-2 rounded-full bg-blue-600 text-white text-sm font-medium hover:bg-blue-500 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}