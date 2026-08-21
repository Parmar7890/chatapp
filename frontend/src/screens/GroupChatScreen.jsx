import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { watchLocation, clearLocationWatch } from '../utils/geoUtils';
import { updateLocation } from '../services/locationApi';
import { fetchGroupHistory } from '../services/groupApi';
import { connectGroupChat, subscribeToGroup, sendGroupMessage, disconnectGroupChat } from '../services/groupWebsocketService';

export default function GroupChatScreen({ currentUser, onGeohashResolved }) {
  const [geohash, setGeohash] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('Getting your location...');
  const bottomRef = useRef(null);
  const watchIdRef = useRef(null);
  const lastSyncTimeRef = useRef(0);
  const isConnectedRef = useRef(false);
  const currentGeohashRef = useRef(null); // avoids stale closure issues

  useEffect(() => {
    let isMounted = true;

    async function handleLocationUpdate({ latitude, longitude }) {
      
      const now = Date.now();

     
      if (now - lastSyncTimeRef.current < 60000 && currentGeohashRef.current) {
        return;
      }
      lastSyncTimeRef.current = now;

      try {
        const response = await updateLocation(currentUser.id, latitude, longitude);
        if (!isMounted) return;

        const newGeohash = response.geohash;

        // only act if zone actually changed (or first time)
        if (newGeohash !== currentGeohashRef.current) {
          currentGeohashRef.current = newGeohash;
          setGeohash(newGeohash);
          if (onGeohashResolved) onGeohashResolved(newGeohash);

          setStatus('Loading nearby messages...');
          const history = await fetchGroupHistory(newGeohash);
          if (!isMounted) return;
          setMessages(history);

          if (!isConnectedRef.current) {
            connectGroupChat(newGeohash, (newMsg) => {
              setMessages((prev) => [...prev, newMsg]);
            });
            isConnectedRef.current = true;
          } else {
            subscribeToGroup(newGeohash, (newMsg) => {
              setMessages((prev) => [...prev, newMsg]);
            });
          }

          setStatus(`Connected to zone: ${newGeohash}`);
        }
      } catch (err) {
        setStatus('Location error: ' + err.message);
      }
    }

    watchIdRef.current = watchLocation(handleLocationUpdate);

    return () => {
      isMounted = false;
      clearLocationWatch(watchIdRef.current);
      disconnectGroupChat();
    };
  }, [currentUser.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !geohash) return;
    sendGroupMessage(geohash, currentUser.id, input.trim());
    setInput('');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-950 p-4">
      <div className="w-full max-w-xl h-[650px] bg-gray-900 border border-gray-800 rounded-2xl flex flex-col shadow-2xl text-gray-100">
        <div className="flex items-center justify-between py-3.5 px-5 border-b border-gray-800">
          <span className="text-sm text-gray-300">{status}</span>
          <div className="flex gap-2">
          <Link to="/map" className="text-xs px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700">
              Map
            </Link>
            <Link to="/current-users" className="text-xs px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700">
              Nearby Users
            </Link>
            <Link to="/friends" className="text-xs px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700">
              Friends
            </Link>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.senderId === currentUser.id ? 'items-end' : 'items-start'}`}>
              <span className="text-xs text-gray-500 mb-0.5">{msg.senderUsername}</span>
              <div className={`px-4 py-2 rounded-2xl max-w-[75%] text-sm ${
                msg.senderId === currentUser.id ? 'bg-blue-600' : 'bg-gray-800'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="flex p-3.5 border-t border-gray-800 gap-2.5">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Message your nearby group..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-700 bg-gray-800 text-gray-100 outline-none text-sm"
          />
          <button onClick={handleSend} className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}