const db = require('../config/db');
exports.getGroups = (req, res) => {
    const { user_id } = req.params;

    const sql = `
        SELECT g.group_id, g.group_name, g.created_by, g.created_at
        FROM groups_info g
        JOIN user_group_map ug ON g.group_id = ug.group_id
        WHERE ug.user_id = ?
    `;

    db.query(sql, [user_id], (err, results) => {
        if (err) return res.status(500).json({ success: false, error: err });

        res.json({ success: true, groups: results });
    });
};

exports.createGroup = (req, res) => {
    const { group_name, group_password, user_id } = req.body;
    console.log(req.body);

    if (!group_name || !group_password || !user_id) {
        return res.json({ success: false, error: "All fields required" });
    }

    const checkSql = "SELECT * FROM groups_info WHERE group_name = ?";

    db.query(checkSql, [group_name], (err, results) => {
        if (err) return res.status(500).json({ success: false, error: err });

        if (results.length > 0) {
            return res.json({ success: false, error: "Group name already exists" });
        }

        // Insert new group
        const insertSql = `
            INSERT INTO groups_info (group_name, group_code, created_by)
            VALUES (?, ?, ?)
        `;

        db.query(insertSql, [group_name, group_password, user_id], (err, result) => {
            if (err) return res.status(500).json({ success: false, error: err.sqlMessage || "Server error" });

            const groupId = result.insertId;

            // Add creator into mapping table
            const mapSql = `
                INSERT INTO user_group_map (user_id, group_id)
                VALUES (?, ?)
            `;

            db.query(mapSql, [user_id, groupId], (err) => {
                if (err) return res.status(500).json({ success: false, error: err.sqlMessage || "Server error" });

                res.json({
                    success: true,
                    message: "Group created successfully",
                    group_id: groupId
                });
            });
        });
    });
};

exports.joinGroup = (req, res) => {
    const { group_name, group_password, user_id } = req.body;

    if (!group_name || !group_password || !user_id) {
        return res.json({ success: false, error: "All fields required" });
    }

    // Check if group exists with name + password
    const sql = `
        SELECT * FROM groups_info
        WHERE group_name = ? AND group_code = ?
    `;

    db.query(sql, [group_name, group_password], (err, results) => {
        if (err) return res.status(500).json({ success: false, error: err });

        if (results.length === 0) {
            return res.json({ success: false, error: "Invalid group name or password" });
        }

        const groupId = results[0].group_id;

        // Check if already joined
        const checkMapSql = `
            SELECT * FROM user_group_map
            WHERE user_id = ? AND group_id = ?
        `;

        db.query(checkMapSql, [user_id, groupId], (err, mapResults) => {
            if (err) return res.status(500).json({ success: false, error: err });

            if (mapResults.length > 0) {
                return res.json({ success: false, error: "Already joined this group" });
            }

            // Insert into mapping
            const insertMapSql = `
                INSERT INTO user_group_map (user_id, group_id)
                VALUES (?, ?)
            `;

            db.query(insertMapSql, [user_id, groupId], (err) => {
                if (err) return res.status(500).json({ success: false, error: err });

                res.json({
                    success: true,
                    message: "Joined group successfully"
                });
            });
        });
    });
};

exports.leaveGroup = (req, res) => {
    const { group_id, user_id } = req.body;

    if (!group_id || !user_id) {
        return res.json({ success: false, error: "Missing fields" });
    }

    const sql = `
        DELETE FROM user_group_map
        WHERE user_id = ? AND group_id = ?
    `;

    db.query(sql, [user_id, group_id], (err, result) => {
        if (err) return res.status(500).json({ success: false, error: err });

        if (result.affectedRows === 0) {
            return res.json({ success: false, error: "User not in group" });
        }

        res.json({
            success: true,
            message: "Left group successfully"
        });
    });
};

exports.deleteGroup = (req, res) => {
    const { group_id } = req.body;

    if (!group_id) {
        return res.json({ success: false, error: "Group ID required" });
    }

    // First delete mappings
    const deleteMapSql = `
        DELETE FROM user_group_map
        WHERE group_id = ?
    `;

    db.query(deleteMapSql, [group_id], (err) => {
        if (err) return res.status(500).json({ success: false, error: err });

        // Then delete group itself
        const deleteGroupSql = `
            DELETE FROM groups_info
            WHERE group_id = ?
        `;

        db.query(deleteGroupSql, [group_id], (err, result) => {
            if (err) return res.status(500).json({ success: false, error: err });

            if (result.affectedRows === 0) {
                return res.json({ success: false, error: "Group not found" });
            }

            res.json({
                success: true,
                message: "Group deleted successfully"
            });
        });
    });
};


exports.editGroup = (req, res) => {
    const { groupId, groupName, groupCode, removeUserIds = [] } = req.body;

    if (!groupId) {
        return res.status(400).json({
            success: false,
            message: "Group ID required"
        });
    }

    // 1️⃣ Check if group exists
    const checkSql = "SELECT * FROM groups_info WHERE group_id = ?";

    db.query(checkSql, [groupId], (err, existing) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: "Server error" });
        }

        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: "Group not found" });
        }

        const currentGroup = existing[0];

        // 2️⃣ If name is changing → check uniqueness
        if (groupName && groupName !== currentGroup.group_name) {
            const nameCheckSql =
                "SELECT * FROM groups_info WHERE group_name = ? AND group_id != ?";

            db.query(nameCheckSql, [groupName, groupId], (err, nameCheck) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ success: false, message: "Server error" });
                }

                if (nameCheck.length > 0) {
                    return res.status(400).json({
                        success: false,
                        message: "Group name already exists"
                    });
                }

                updateGroup();
            });
        } else {
            updateGroup();
        }

        // 3️⃣ Update function
        function updateGroup() {
            const newName = groupName || currentGroup.group_name;

            // 🔥 IMPORTANT FIX:
            // If groupCode is empty string, keep old code
            const newCode =
                groupCode && groupCode.trim() !== ""
                    ? groupCode
                    : currentGroup.group_code;

            const updateSql = `
                UPDATE groups_info
                SET group_name = ?, group_code = ?
                WHERE group_id = ?
            `;

            db.query(updateSql, [newName, newCode, groupId], (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ success: false, message: "Server error" });
                }

                // 4️⃣ Remove users if provided
                if (removeUserIds.length > 0) {
                    const deleteSql = `
                        DELETE FROM user_group_map
                        WHERE group_id = ?
                        AND user_id IN (?)
                    `;

                    db.query(deleteSql, [groupId, removeUserIds], (err) => {
                        if (err) {
                            console.error(err);
                            return res.status(500).json({
                                success: false,
                                message: "Failed to remove users"
                            });
                        }

                        return res.json({
                            success: true,
                            message: "Group updated successfully"
                        });
                    });
                } else {
                    return res.json({
                        success: true,
                        message: "Group updated successfully"
                    });
                }
            });
        }
    });
};

exports.getGroupMembers = (req, res) => {
    const { groupId } = req.body;

    const sql = `
        SELECT 
            u.id,
            u.name
        FROM user_group_map gu
        INNER JOIN users u 
            ON gu.user_id = u.id
        WHERE gu.group_id = ?
    `;

    db.query(sql, [groupId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: "Failed to retrieve group members"
            });
        }

        res.json({
            success: true,
            members: results
        });
    });
};