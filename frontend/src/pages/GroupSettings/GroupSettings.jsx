import React, { useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GroupContext } from "../../context/GroupContext";
import DeleteOverlay from "../../components/ConfirmDelete/ConfirmDelete";

const EditGroup = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { groups, users, editGroup, deleteGroup } = useContext(GroupContext);

    const group = groups.find(g => g.groupId === Number(id));

    const [groupName, setGroupName] = useState(group ? group.groupName : "");
    const [groupCode, setGroupCode] = useState(group ? group.groupCode : "");
    const [removeUserIds, setRemoveUserIds] = useState([]);
    const [showDeleteOverlay, setShowDeleteOverlay] = useState(false);

    if (!group) {
        return <div>Group not found</div>;
    }

    const members = users.filter(u => group.userIds.includes(u.userId));

    const toggleRemoveUser = (userId) => {
        setRemoveUserIds(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const handleSave = () => {
        editGroup({
            groupId: group.groupId,
            groupName,
            groupCode,
            removeUserIds
        });
        navigate("/");
    };

    const handleDeleteGroup = () => {
        deleteGroup(group.groupId);
        navigate("/");
    };

    return (
        <div className="edit-group-container">
            <h2>Edit Group</h2>

            <div className="form-group">
                <label>Group Name</label>
                <input
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label>Group Code</label>
                <input
                    value={groupCode}
                    onChange={(e) => setGroupCode(e.target.value)}
                />
            </div>

            <h3>Remove Members</h3>
            <div className="members-list">
                {members.map(member => (
                    <div key={member.userId} className="member-item">
                        <span>{member.username}</span>
                        <input
                            type="checkbox"
                            checked={removeUserIds.includes(member.userId)}
                            onChange={() => toggleRemoveUser(member.userId)}
                        />
                    </div>
                ))}
            </div>

            <div className="edit-actions">
                <button className="btn save-btn" onClick={handleSave}>
                    Save Changes
                </button>

                <button
                    className="btn delete-btn"
                    onClick={() => setShowDeleteOverlay(true)}
                >
                    Delete Group
                </button>

                <button className="btn back-btn" onClick={() => navigate("/")}>
                    Back
                </button>
            </div>

            {showDeleteOverlay && (
                <DeleteOverlay
                    heading="Delete Group?"
                    message="This will permanently delete the group for all members."
                    onConfirm={handleDeleteGroup}
                    onCancel={() => setShowDeleteOverlay(false)}
                />
            )}
        </div>
    );
};

export default EditGroup;
