// src/pages/JoinGroup/JoinGroup.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GroupContext } from "../../context/GroupContext";
import { AuthContext } from "../../context/AuthContext";
import LoadingOverlay from "../../components/LoadingOverlay/LoadingOverlay";
import MessageOverlay from "../../components/MessageOverlay/MessageOverlay";

const JoinGroup = () => {
    const navigate = useNavigate();
    const { joinGroup } = useContext(GroupContext);
    const { user } = useContext(AuthContext);

    const [groupName, setGroupName] = useState("");
    const [groupCode, setGroupCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!groupName.trim() || !groupCode.trim()) {
            setMessage("Please enter both group name and group code.");
            return;
        }

        setLoading(true);

        const result = await joinGroup(
            groupName,
            groupCode
        );

        setLoading(false);

        if (!result.success) {
            setMessage(result.error || "Failed to join group.");
            return;
        }

        setMessage("Successfully joined group!");

        setGroupCode("");
        setGroupName("");
    };

    const handleBack = () => {
        navigate("/");
    };

    return (
        <div className="join-group-container">

            {loading && <LoadingOverlay />}

            {message && (
                <MessageOverlay
                    message={message}
                    onClose={() => setMessage("")}
                />
            )}

            <h2>Join Group</h2>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Group Name</label>
                    <input
                        type="text"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        placeholder="Enter group name"
                    />
                </div>

                <div className="form-group">
                    <label>Group Code</label>
                    <input
                        type="text"
                        value={groupCode}
                        onChange={(e) => setGroupCode(e.target.value)}
                        placeholder="Enter group code"
                    />
                </div>

                <div className="form-buttons">
                    <button type="submit" className="btn join-btn">
                        Join Group
                    </button>
                    <button
                        type="button"
                        className="btn back-btn"
                        onClick={handleBack}
                    >
                        Back
                    </button>
                </div>
            </form>
        </div>
    );
};

export default JoinGroup;