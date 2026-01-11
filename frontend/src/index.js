import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { GroupProvider } from "./context/GroupContext";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <GroupProvider>
      <App />
    </GroupProvider>
  </AuthProvider>
);
