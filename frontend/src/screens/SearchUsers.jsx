import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchUsers, sendFriendRequest, getRequestStatus, cancelFriendRequest } from '../services/friendApi';

export default function SearchUsers({ currentUser }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  

  const handleSearch = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const data = await searchUsers(query);
      setResults(data.filter((u) => u.id !== currentUser.id));

      const withStatus = await Promise.all(
        filtered.map(async (user) => {
          const status = await getRequestStatus(currentUser.id, user.id);
          return {...user, requestStatus: status};
        })
      )
    } catch (err) {
      setMessage('Search failed');
    }
  };

  const handleSendRequest = async (receiverId) => {
    try {
      await sendFriendRequest(currentUser.id, receiverId);
      setMessage('Friend request sent!');
    } catch (err) {
      setMessage(err.message || 'Failed to send request');
    }
  };

  const handleCancelRequest = async (targetUser) => {
    try{
        await cancelFriendRequest(targetUser.requestStatus.id);
        setResults((prev) => {
          prev.map((u) => 
            u.id === targetUser.id ? {...u, requestStatus: null} : u
          )
        })
    } catch (err) {
      setMessage('Failed to cancel request');
    }
  };

  const renderActionButton = (user) => {
    const status = user.requestStatus?.status;

    if(!status) {
      return (
        <button onClick={() => handleSendRequest(user)} className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-700 hover:bg-emerald-600 transition cursor-pointer">
          Send Request
        </button>
      )
    }

    if(status === 'PENDING') {
      const iSent = user.requestStatus.senderId === currentUser.id;
      if(iSent) {
        return (
          <button className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-yellow-700 hover:bg-yellow-600 transition cursor-pointer" onClick={() => handleCancelRequest(user)}>
              Request Sent (Cancel)
          </button>
        );
      }
      return (
        <span className="px-3 py-1.5 text-xs font-semibold text-gray-400">
          Respond in Requests 
        </span>
      )
    }

    if(status === 'ACCEPTED') {
      return (
        <span className="px-3 py-1.5 text-xs font-semibold text-emerald-400">
          Friends
        </span>
      )
    }

    
  return (
    <button onClick={() => handleSendRequest(user)} className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-700 hover:bg-emerald-600 transition cursor-pointer">
      Send Request
    </button>
  )
  }


  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans p-6 max-w-md mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/')}
          className="text-gray-400 hover:text-white text-sm cursor-pointer"
        >
          ← Back
        </button>
        <h2 className="text-xl font-bold">Find Friends</h2>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by username..."
          className="flex-1 bg-gray-800 border border-gray-700 text-gray-100 text-sm py-2.5 px-4 rounded-xl placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm font-semibold transition cursor-pointer"
        >
          Search
        </button>
      </form>

      {message && (
        <p className="mb-4 text-sm text-center text-gray-300 bg-gray-800 border border-gray-700 p-2.5 rounded-xl">
          {message}
        </p>
      )}

      <div className="flex flex-col gap-2">
        {results.map((user) => (
          <div
            key={user.id}
            className="flex justify-between items-center px-4 py-3 rounded-xl bg-gray-900 border border-gray-800"
          >
            <span>{user.username}</span>
            <button
              onClick={() => handleSendRequest(user.id)}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-700 hover:bg-emerald-600 transition cursor-pointer"
            >
              Send Request
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}