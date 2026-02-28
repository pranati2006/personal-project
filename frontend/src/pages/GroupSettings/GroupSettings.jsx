import React, { useContext, useState,useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GroupContext } from "../../context/GroupContext";
import DeleteOverlay from "../../components/ConfirmDelete/ConfirmDelete";
import LoadingOverlay from "../../components/LoadingOverlay/LoadingOverlay";
import MessageOverlay from "../../components/MessageOverlay/MessageOverlay";
import { fetchGroupMembers } from "../../context/GroupAPI";

const EditGroup = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { groups, users, editGroup, deleteGroup } = useContext(GroupContext);

    // ⚠ Match DB structure
    const group = groups.find(g => g.group_id === Number(id));

    const [groupName, setGroupName] = useState(group ? group.group_name : "");
    const [groupCode, setGroupCode] = useState(group ? group.group_code : "");
    const [removeUserIds, setRemoveUserIds] = useState([]);
    const [showDeleteOverlay, setShowDeleteOverlay] = useState(false);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const loadMembers = async () => {
            setLoading(true);

            const result = await fetchGroupMembers(id);

            setLoading(false);

            if (!result.success) {
                setMessage(result.error);
                return;
            }

            setMembers(result.members);
        };

        loadMembers();
    }, [id]);

    if (!group) {
        return <div>Group not found</div>;
    }

    const toggleRemoveUser = (userId) => {
        setRemoveUserIds(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const handleSave = async () => {
        setLoading(true);

        const result = await editGroup({
            groupId: group.group_id,
            groupName,
            groupCode,
            removeUserIds
        });

        setLoading(false);

        if (!result.success) {
            setMessage(result.error || "Failed to update group.");
            return;
        }

        setMessage("Group updated successfully!");

        setTimeout(() => {
            navigate("/");
        }, 1000);
    };

    const handleDeleteGroup = async () => {
        setShowDeleteOverlay(false);
        setLoading(true);

        const result = await deleteGroup(group.group_id);

        setLoading(false);

        if (!result.success) {
            setMessage(result.error || "Failed to delete group.");
            return;
        }

        setMessage("Group deleted successfully!");

        setTimeout(() => {
            navigate("/");
        }, 1000);
    };

    return (
        <div className="edit-group-container">

            {loading && <LoadingOverlay />}

            {message && (
                <MessageOverlay
                    message={message}
                    onClose={() => setMessage("")}
                />
            )}

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
                    <div key={member.id} className="member-item">
                        <span>{member.name}</span>
                        <input
                            type="checkbox"
                            checked={removeUserIds.includes(member.id)}
                            onChange={() => toggleRemoveUser(member.id)}
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

                <button
                    className="btn back-btn"
                    onClick={() => navigate("/")}
                >
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