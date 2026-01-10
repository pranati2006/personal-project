import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import Group from "./pages/Group/Group";
import CreateGroup from "./pages/CreateGroup/CreateGroup";
import JoinGroup from "./pages/JoinGroup/JoinGroup";
import GroupSettings from "./pages/GroupSettings/GroupSettings";

function App() {
  const { user } = useContext(AuthContext);

  // Function to protect routes
  const requireAuth = (component) => (user ? component : <Navigate to="/" replace />);

  return (
    <Routes>
      {/* Public route */}
      <Route path="/" element={user ? <Navigate to="/home" replace /> : <Login />} />

      {/* Protected routes */}
      <Route path="/home" element={requireAuth(<Home />)} />
      <Route path="/group/:id" element={requireAuth(<Group />)} />
      <Route path="/group/:id/settings" element={requireAuth(<GroupSettings />)} />
      <Route path="/create-group" element={requireAuth(<CreateGroup />)} />
      <Route path="/join-group" element={requireAuth(<JoinGroup />)} />

      {/* Fallback for unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
