import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { GroupContext } from "../../context/GroupContext";
import DeleteOverlay from "../../components/ConfirmDelete/ConfirmDelete";

const GroupsList = () => {
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);
    const { getUserGroups, leaveGroup } = useContext(GroupContext);
    const [showMenu, setShowMenu] = useState(false); // toggle menu for create and join
    const [showDeleteOverlay, setShowDeleteOverlay] = useState(false);
    const [groupIdToDelete, setGroupIdToDelete] = useState(null);
    const handleLeave = (groupId) => {
        setGroupIdToDelete(groupId);
        setShowDeleteOverlay(true);
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
            <div className="groups-actions">
                {showDeleteOverlay && (
                    <DeleteOverlay
                        onConfirm={() => {
                            leaveGroup({ groupId: groupIdToDelete, userId: user.id });
                            setShowDeleteOverlay(false);
                            setGroupIdToDelete(null);
                        }}
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
                {getUserGroups(user.id).map((group) => (
                    <div key={group.groupId} className="group-item">
                        <span className="group-name" onClick={() => handleOpen(group.groupId)}>{group.groupName}</span>
                        <div className="group-item-actions">
                            <button className="btn delete-btn" onClick={() => handleLeave(group.groupId)}>Leave</button>
                            <button className="btn edit-btn" onClick={() => handleEdit(group.groupId)}>Edit</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GroupsList;
