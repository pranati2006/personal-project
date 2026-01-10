import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login/Login";
import Home from "./pages/Home/Home";
import Group from "./pages/Group/Group";
import CreateGroup from "./pages/CreateGroup/CreateGroup";
import JoinGroup from "./pages/JoinGroup/JoinGroup";
import GroupSettings from "./pages/GroupSettings/GroupSettings";

function App() {
  return (
    <Routes>

      <Route path="/" element={<Login />} />


      <Route path="/home" element={<Home />} />


      <Route path="/group/:id" element={<Group />} />
      <Route path="/group/:id/settings" element={<GroupSettings />} />


      <Route path="/create-group" element={<CreateGroup />} />
      <Route path="/join-group" element={<JoinGroup />} />


      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;

