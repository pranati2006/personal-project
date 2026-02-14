import React, { useState, useContext } from "react";
import { AuthContext } from '../../context/AuthContext';
import "./Login.css";
import LoadingOverlay from "../../components/LoadingOverlay/LoadingOverlay";
import MessageOverlay from "../../components/MessageOverlay/MessageOverlay";

const Login = () => {
    const { login, create } = useContext(AuthContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        const result = await login(username, password);
        setLoading(false);
        if (result.success) {
            setMessage(`Login successful! Welcome, ${username}`);
        } else {
            setMessage(`Login failed: ${result.error}`);
        }
    };

    const handleCreate = async () => {
        setLoading(true);
        const result = await create(username, password);
        setLoading(false);
        if (result.success) {
            setMessage(`User created successfully!`);
        } else {
            setMessage(`Signup failed: ${result.error}`);
        }
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
                {loading && <LoadingOverlay />}
                {message && (<MessageOverlay message={message} onClose={() => setMessage("")} />)}

            </div>
        </div>
    );
};

export default Login;
