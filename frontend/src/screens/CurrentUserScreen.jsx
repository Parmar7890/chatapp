import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { getZoneUsers } from '../services/locationApi';


export default function CurrentUsersScreen({ currentUser, currentGeohash }) {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();


    useEffect(() => {
        if (!currentGeohash) return;
        getZoneUsers(currentGeohash, currentUser.id)
        .then((data) => setUsers(data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }, [currentGeohash]);


    return(
        <div className="min-h-screen bg-gray-950 text-gray-100 p-6 max-w-md mx-auto">
            <div className="flex items-center gap-3 mb-6">
                <Link to="/" className="text-gray-400 hover:text-white text-sm">← Back to Group</Link>
            </div>
            <h2 className="text-xl font-bold mb-4">People Nearby</h2>

            {loading && <p className="text-gray-400 text-sm">Loading...</p>}
            {!loading && users.length === 0 && <p className="text-gray-400 text-sm">No one else nearby right now.</p>}

            <div className="flex flex-col gap-2">
                {users.map((user) => (
                    <button
                    key={user.id}
                    onClick={() => navigate(`/chat?receiverId=${user.id}`)}>
                            {user.username}
                    </button>
                ))}
            </div>
        </div>
    )
}