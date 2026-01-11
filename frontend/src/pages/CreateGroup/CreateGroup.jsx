import React, { useState, useContext } from "react";
import { GroupContext } from "../../context/GroupContext";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const CreateGroup = () => {
    const { createGroup } = useContext(GroupContext);
    const { user } = useContext(AuthContext); // current logged-in user
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name.trim() || !code.trim()) {
            setError("Please enter both group name and code.");
            return;
        }

        // create the group
        createGroup({ groupName: name, groupCode: code, userId: user.id });

        // navigate back to home
        navigate("/");
    };

    const handleBack = () => {
        navigate("/"); // go back to home
    };

    return (
        <div className="create-group-container">
            <h2>Create New Group</h2>
            {error && <div className="error">{error}</div>}

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
                    <button type="submit" className="btn create-btn">Create Group</button>
                    <button type="button" className="btn back-btn" onClick={handleBack}>Back</button>
                </div>
            </form>
        </div>
    );
};

export default CreateGroup;
