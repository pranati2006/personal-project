import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { GroupContext } from "../../context/GroupContext";
import DeleteOverlay from "../../components/ConfirmDelete/ConfirmDelete";
import LoadingOverlay from "../../components/LoadingOverlay/LoadingOverlay";
import MessageOverlay from "../../components/MessageOverlay/MessageOverlay";
import "./Home.css";
const GroupsList = () => {
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);
    const { groups, leaveGroup } = useContext(GroupContext);
    const [showMenu, setShowMenu] = useState(false); // toggle menu for create and join
    const [showDeleteOverlay, setShowDeleteOverlay] = useState(false);
    const [groupIdToDelete, setGroupIdToDelete] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");


    const handleLeave = (groupId) => {
        setGroupIdToDelete(groupId);
        setShowDeleteOverlay(true);
    };

    const handleConfirmLeave = async () => {
        setShowDeleteOverlay(false);
        setLoading(true);
        const result = await leaveGroup(groupIdToDelete);
        setLoading(false);
        if (result.success) {
            setMessage(`Successfully left group!`);
        } else {
            setMessage(`Failed to leave group: ${result.error}`);
        }
        setGroupIdToDelete(null);
    };

    const handleEdit = (groupId) => {
        navigate(`/group/${groupId}/settings`);
    };

    const handleLogout = () => {
        logout();
    };

    const handleCreateGroup = () => {
        navigate("/create-group");
        setShowMenu(false);
    };

    const handleJoinGroup = () => {
        navigate("/join-group");
        setShowMenu(false);
    };

    const toggleMenu = () => {
        setShowMenu((prev) => !prev);
    };

    const handleOpen = (groupId) => {
        navigate(`/group/${groupId}`);
    }

    return (
        <div className="groups-container">
            {loading && <LoadingOverlay />}
            {message && (
                <MessageOverlay
                    message={message}
                    onClose={() => setMessage("")}
                />
            )}
            <div className="groups-actions">
                {showDeleteOverlay && (
                    <DeleteOverlay
                        onConfirm={handleConfirmLeave}
                        onCancel={() => setShowDeleteOverlay(false)}
                    />
                )}
                <button className="btn logout-btn" onClick={handleLogout}>Logout</button>

                <div className="dropdown">
                    <button className="btn add-btn" onClick={toggleMenu}>+</button>
                    {showMenu && (
                        <div className="dropdown-menu">
                            <button className="btn create-btn" onClick={handleCreateGroup}>Create Group</button>
                            <button className="btn join-btn" onClick={handleJoinGroup}>Join Group</button>
                        </div>
                    )}
                </div>
            </div>

            <div className="groups-list">
                {groups.map((group) => (
                    <div key={group.group_id} className="group-item">
                        <span className="group-name" onClick={() => handleOpen(group.group_id)}>{group.group_name}</span>
                        <div className="group-item-actions">
                            <button className="btn delete-btn" onClick={() => handleLeave(group.group_id)}>Leave</button>
                            <button className="btn edit-btn" onClick={() => handleEdit(group.group_id)}>Edit</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GroupsList;
