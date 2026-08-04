import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ChatScreen from './screens/ChatScreen';
import Register from './components/Register';
import Login from './components/Login';

function App() {
  // Load user from localStorage on initial render
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const navigate = useNavigate();

  const params = new URLSearchParams(window.location.search);
  const RECEIVER_ID = Number(params.get('receiverId')) || 2;

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user)); // Persist to localStorage
    navigate('/');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser'); // Clear on logout
    navigate('/login');
  };

  return (
    <div className="relative min-h-screen bg-gray-950">
      <Routes>
        {/* Home Route (Chat Screen - Protected) */}
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
                <ChatScreen myUserId={currentUser.id} receiverId={RECEIVER_ID} />
              </>
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