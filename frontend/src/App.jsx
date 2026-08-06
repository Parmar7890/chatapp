import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ChatScreen from './screens/ChatScreen';
import FriendsList from './screens/FriendsList';
import Register from './components/Register';
import Login from './components/Login';
import SearchUsers from './screens/SearchUsers';
import PendingRequests from './screens/PendingRequests';
import { getFriends } from './services/friendApi'

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const navigate = useNavigate();

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    navigate('/');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  return (
    <div className="relative min-h-screen bg-gray-950">
      <Routes>
        {/* Home Route (Friends List - Protected) */}
        <Route
          path="/"
          element={
            currentUser ? (
              <>
                <div className="absolute top-4 right-4 z-50">
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-red-800 text-red-100 hover:bg-red-700 border border-red-700 transition cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
                <FriendsList currentUser={currentUser} />
              </>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Chat Route (Protected) */}
        <Route
          path="/chat"
          element={
            currentUser ? (
              <ChatScreenWrapper currentUser={currentUser} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

      {/* Search Route (Protected) */}
      <Route
        path="/search"
        element={
          currentUser ? (
            <SearchUsers currentUser={currentUser} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

{/* Pending Requests Route (Protected) */}
<Route
  path="/requests"
  element={
    currentUser ? (
      <PendingRequests currentUser={currentUser} />
    ) : (
      <Navigate to="/login" replace />
    )
  }
/>


        {/* Login Route */}
        <Route
          path="/login"
          element={
            currentUser ? (
              <Navigate to="/" replace />
            ) : (
              <Login onLoginSuccess={handleLoginSuccess} />
            )
          }
        />

        {/* Register Route */}
        <Route
          path="/register"
          element={
            currentUser ? (
              <Navigate to="/" replace />
            ) : (
              <Register />
            )
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to={currentUser ? "/" : "/login"} replace />} />
      </Routes>
    </div>
  );
}
export default App;
function ChatScreenWrapper({ currentUser }) {
  const params = new URLSearchParams(window.location.search);
  const receiverId = Number(params.get('receiverId'));
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [isFriend, setIsFriend] = useState(false);

  useEffect(() => {
    getFriends(currentUser.id)
      .then((friends) => {
        const friend = friends.some(
          (f) => f.senderId === receiverId || f.receiverId === receiverId
        );
        setIsFriend(friend);
        if (!friend) {
          navigate('/');
        }
      })
      .catch(() => navigate('/'))
      .finally(() => setChecking(false));
  }, [receiverId]);

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-400">
        Checking...
      </div>
    );
  }

  if (!isFriend) return null; // navigate already redirected

  return <ChatScreen myUserId={currentUser.id} receiverId={receiverId} />;
}
