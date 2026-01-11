import React, { useState, useContext } from "react";
import { AuthContext } from '../../context/AuthContext';
import "./Login.css";

const Login = () => {
    const { login } = useContext(AuthContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        login(username, password);
    };

    const handleCreate = () => {
        console.log("Create user clicked"); // replace with create logic if needed
    };

    return (
        <div className="login-page-container">
            <div className="login-page-box">
                <input
                    type="text"
                    placeholder="username"
                    className="login-page-input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="password"
                    className="login-page-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <div className="login-page-btn-group">
                    <button className="login-page-btn login-page-btn-create" onClick={handleCreate}>
                        create
                    </button>
                    <button className="login-page-btn login-page-btn-login" onClick={handleLogin}>
                        login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
