import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getPendingRequests, respondToRequest } from "../services/friendApi";


export function PendingRequests({ currentUser }) {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const loadRequest = () => {
        setLoading(true);
        getPendingRequests(currentUser.id)
        .then((data) => setRequests(data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
        console.log(currentUser.id);
    };

    useEffect(() => {
        loadRequest();
    },[currentUser.id])

    const handleRespond = async (requestId, accept) => {
    try {
        await respondToRequest(requestId, accept);
        setMessage(accept ? 'Request Accept' : 'Request Reject');
        setRequests((prev) => prev.filter((r) => r.id !== requestId));
    } catch (err) {
        setMessage('Failed to respond')
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
            <h2 className="text-xl font-bold">Pending Requests</h2>
          </div>
    
          {message && (
            <p className="mb-4 text-sm text-center text-gray-300 bg-gray-800 border border-gray-700 p-2.5 rounded-xl">
              {message}
            </p>
          )}
    
          {loading && <p className="text-gray-400 text-sm">Loading...</p>}
    
          {!loading && requests.length === 0 && (
            <p className="text-gray-400 text-sm">No pending requests</p>
          )}
    
          <div className="flex flex-col gap-2">
            {requests.map((req) => (
              <div
                key={req.id}
                className="flex justify-between items-center px-4 py-3 rounded-xl bg-gray-900 border border-gray-800"
              >
                <span>{req.senderUsername}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRespond(req.id, true)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-700 hover:bg-emerald-600 transition"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleRespond(req.id, false)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-800 hover:bg-red-700 transition"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    export default PendingRequests;