import React, { useState, useEffect, useRef } from 'react';
import { connectWebSocket, sendMessage, disconnectWebSocket } from '../services/websocketService';
import { fetchConversation, deleteMessage } from '../services/api'
import { Link } from "react-router-dom";



export default function ChatScreen({ myUserId, receiverId }) {

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [connected, setConnected] = useState(false);
  const bottomRef = useRef(null);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const messageRef = useRef(null);

 
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

  const handleDelete = async (id) => {
      await deleteMessage(id);
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (messageRef.current && !messageRef.current.contains(event.target)) {
        setSelectedMessageId(null);
      }
    };
  
    document.addEventListener("click", handleClickOutside);
  
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-950 p-6">
      {/* Tablet-Sized Container with Standard Border */}
      <div className="w-full max-w-xl h-[600px] bg-gray-900 border border-gray-800 rounded-2xl flex flex-col shadow-xl text-gray-100 font-sans overflow-hidden">
        
        {/* Header Bar */}
        <div className="relative flex items-center py-3.5 px-4 border-b border-gray-800 bg-gray-900/50">
          <div className="w-full text-center text-gray-400 text-sm font-medium">
            {connected ? `Connected as User ${myUserId}` : "Connecting..."}
          </div>
  
          <Link
            to="/"
            className="absolute right-4 text-sm font-medium text-blue-400 hover:text-blue-300 transition"
          >
            Back
          </Link>
        </div>
  
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2.5">
          {messages.map((msg, index) => (
            !msg.deleted && (
           <div
              ref={selectedMessageId === msg.id ? messageRef : null}
              key={msg.id}
              onDoubleClick={() => {
                if(myUserId === msg.senderId) {
                  setSelectedMessageId(prev => prev === msg.id ? null : msg.id);
                }
              }}
              className={`relative px-4 py-2.5 rounded-2xl max-w-[70%] break-words text-sm leading-relaxed ${
                msg.senderId === myUserId
                  ? "bg-emerald-600 text-white self-end rounded-br-xs"
                  : "bg-gray-800 text-gray-100 self-start rounded-bl-xs border border-gray-750"
              }`}
            >
              {msg.content}

              {myUserId === msg.senderId && selectedMessageId === msg.id &&  (
                <button
                  onClick={() => handleDelete(msg.id)}
                  className="absolute -right-10 top-1/2 -translate-y-1/2 text-red-500"
                >
                  🗑️
                </button>
              )}
            </div>
            )
          ))}
          <div ref={bottomRef} />
        </div>
  
        {/* Input Bar */}
        <div className="flex p-4 border-t border-gray-800 gap-3 bg-gray-900/50 items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2.5 rounded-full border border-gray-700 bg-gray-800 text-gray-100 placeholder-gray-400 outline-none focus:border-blue-500 text-sm transition"
          />
          <button
            onClick={handleSend}
            className="px-6 py-2.5 rounded-full bg-blue-600 text-white text-sm font-medium hover:bg-blue-500 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}