import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchUsers, sendFriendRequest } from '../services/friendApi';

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
      // filter out yourself from results
      setResults(data.filter((u) => u.id !== currentUser.id));
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

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans p-6 max-w-md mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/')}
          className="text-gray-400 hover:text-white text-sm"
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
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm font-semibold transition"
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
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-700 hover:bg-emerald-600 transition"
            >
              Send Request
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}