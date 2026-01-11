// src/pages/JoinGroup/JoinGroup.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GroupContext } from "../../context/GroupContext";
import { AuthContext } from "../../context/AuthContext";

const JoinGroup = () => {
    const navigate = useNavigate();
    const { joinGroup } = useContext(GroupContext);
    const { user } = useContext(AuthContext);

    const [groupName, setGroupName] = useState("");
    const [groupCode, setGroupCode] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!groupName.trim() || !groupCode.trim()) {
            setError("Please enter both group name and group code.");
            return;
        }

        const result = joinGroup({
            groupName,
            groupCode,
            userId: user.id
        });

        if (!result.success) {
            setError(result.message);
            return;
        }

        // success → go back to home
        navigate("/");
    };

    const handleBack = () => {
        navigate("/");
    };

    return (
        <div className="join-group-container">
            <h2>Join Group</h2>

            {error && <div className="error">{error}</div>}

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
