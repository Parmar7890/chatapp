import React, { useState, useEffect } from "react";
import  { useNavigate } from "react-router-dom";
import { searchUsers, sendFriendRequest, getFriends } from '../services/friendApi';

export default function FriendsList ({ currentUser }){

    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        getFriends(currentUser.id)
    
        .then((data) => setFriends(data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    },[currentUser.id])

    const openChat = (friendId) => {
        navigate(`/chat?receiverId=${friendId}`);
    }

    return (
        <div className="hello min-h-screen bg-gray-950 text-gray-100 font-sans p-6 max-w-md mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Your Friends</h2>
            <button
              onClick={() => navigate('/search')}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 transition"
            >
              + Find Friends
            </button>
          </div>
    
          <button
            onClick={() => navigate('/requests')}
            className="button-hello w-full mb-6 px-4 py-2 text-sm rounded-xl bg-gray-800 border border-gray-700 hover:bg-gray-700 transition"
          >
            View Pending Requests
          </button>
    
          {loading && <p className="text-gray-400 text-sm">Loading...</p>}
    
          {!loading && friends.length === 0 && (
            <p className="text-gray-400 text-sm">No friends yet — search to add some!</p>
          )}
    
          <div className="flex flex-col gap-2">
            {friends.map((f) => {
              const friendId = f.senderId === currentUser.id ? f.receiverId : f.senderId;
              const friendName = f.senderId === currentUser.id ? f.receiverUsername : f.senderUsername;
    
              return (
                <button
                  key={f.id}
                  onClick={() => openChat(friendId)}
                  className="text-left px-4 py-3 rounded-xl bg-gray-900 border border-gray-800 hover:bg-gray-800 transition"
                >
                  {friendName}
                </button>
              );
            })}
          </div>
        </div>
      );
}