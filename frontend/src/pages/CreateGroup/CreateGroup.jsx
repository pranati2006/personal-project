// src/pages/CreateGroup/CreateGroup.jsx
import React, { useState, useContext } from "react";
import { GroupContext } from "../../context/GroupContext";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import LoadingOverlay from "../../components/LoadingOverlay/LoadingOverlay";
import MessageOverlay from "../../components/MessageOverlay/MessageOverlay";

const CreateGroup = () => {
    const { createGroup } = useContext(GroupContext);
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!name.trim() || !code.trim()) {
            setMessage("Please enter both group name and code.");
            return;
        }

        setLoading(true);

        const result = await createGroup(
            name, code
        );

        setLoading(false);

        if (!result.success) {
            setMessage(result.error || "Failed to create group.");
            return;
        }

        setMessage("Group created successfully!");

        setName("");
        setCode("");
    };

    const handleBack = () => {
        navigate("/");
    };

    return (
        <div className="create-group-container">

            {loading && <LoadingOverlay />}

            {message && (
                <MessageOverlay
                    message={message}
                    onClose={() => setMessage("")}
                />
            )}

            <h2>Create New Group</h2>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Group Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter group name"
                    />
                </div>

                <div className="form-group">
                    <label>Group Code</label>
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Enter group code"
                    />
                </div>

                <div className="form-buttons">
                    <button type="submit" className="btn create-btn">
                        Create Group
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

export default CreateGroup;