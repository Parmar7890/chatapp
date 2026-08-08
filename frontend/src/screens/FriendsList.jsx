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
      <div className="flex justify-center items-center min-h-screen bg-[#030712] p-6">
        {/* Tablet Container Matching Image Specs Exactly */}
        <div className="w-full max-w-xl h-[600px] bg-[#0b1329] border border-[#1d293d] rounded-2xl p-6 shadow-2xl text-gray-100 font-sans flex flex-col justify-between">
          
          <div>
            {/* Header Row */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white tracking-tight">Your Friends</h2>
              <button
                onClick={() => navigate('/search')}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 transition text-white"
              >
                + Find Friends
              </button>
            </div>
    
            {/* View Pending Requests Button */}
            <button
              onClick={() => navigate('/requests')}
              className="button-hello w-full mb-6 px-4 py-3 text-sm font-medium text-center rounded-xl bg-[#131d36] border border-[#1d293d] hover:bg-[#1a2747] transition text-gray-200"
            >
              View Pending Requests
            </button>
    
            {/* Loading State */}
            {loading && <p className="text-gray-400 text-sm">Loading...</p>}
    
            {/* Empty State */}
            {!loading && friends.length === 0 && (
              <p className="text-gray-400 text-sm">No friends yet — search to add some!</p>
            )}
    
            {/* Friends List */}
            <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-1">
              {friends.map((f) => {
                const friendId = f.senderId === currentUser.id ? f.receiverId : f.senderId;
                const friendName = f.senderId === currentUser.id ? f.receiverUsername : f.senderUsername;
    
                return (
                  <button
                    key={f.id}
                    onClick={() => openChat(friendId)}
                    className="text-left px-4 py-3 rounded-xl bg-[#131d36] border border-[#1d293d] hover:bg-[#1a2747] transition text-sm font-medium text-gray-200"
                  >
                    {friendName}
                  </button>
                );
              })}
            </div>
          </div>
    
        </div>
      </div>
    );
}