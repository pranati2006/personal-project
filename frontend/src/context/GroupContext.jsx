// src/context/GroupContext.js
import React, { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";


export const GroupContext = createContext();

export const GroupProvider = ({ children }) => {

    // simulate DB tables in memory
    const { user } = useContext(AuthContext);
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);

    useEffect(() => {
        if (user) {
            fetchGroups();
        } else {
            setGroups([]);
            setSelectedGroup(null);
        }
    }, [user]);

    // helper: get groups of a user
    const fetchGroups = async () => {
        try {
            const res = await fetch(
                `http://localhost:5000/api/groups/${user.id}`
            );
            const data = await res.json();

            if (data.success) {
                setGroups(data.groups);
            }
        } catch (err) {
            console.error(err);
        }
    };

    // CREATE GROUP
    const createGroup = async (groupName, groupCode) => {
        try {
            console.log("USER:", user);
            const res = await fetch(
                "http://localhost:5000/api/groups/create",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        group_name: groupName,
                        group_password: groupCode,
                        user_id: user.id
                    })
                }
            );

            const data = await res.json();

            if (data.success) {
                fetchGroups();
                return { success: true };
            }

            return { success: false, error: data.error };

        } catch (err) {
            console.error(err);
            return { success: false, error: "Server error" };
        }
    };

    // JOIN GROUP
    const joinGroup = async (groupName, groupCode) => {
        try {
            const res = await fetch(
                "http://localhost:5000/api/groups/join",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        group_name: groupName,
                        group_password: groupCode,
                        user_id: user.id
                    })
                }
            );

            const data = await res.json();

            if (data.success) {
                fetchGroups(); // refresh
                return { success: true };
            }

            return { success: false, error: data.error };

        } catch (err) {
            console.error(err);
            return { success: false, error: "Server error" };
        }
    };

    // DELETE GROUP
    const deleteGroup = async (groupId) => {
        try {
            const res = await fetch(
                "http://localhost:5000/api/groups/delete",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ group_id: groupId })
                }
            );

            const data = await res.json();

            if (data.success) {
                fetchGroups();
                return { success: true };
            }

            return { success: false, error: data.error };

        } catch (err) {
            console.error(err);
            return { success: false, error: "Server error" };
        }
    };

    //LEAVE GROUP
    const leaveGroup = async (groupId) => {
        try {
            const res = await fetch(
                "http://localhost:5000/api/groups/leave",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        group_id: groupId,
                        user_id: user.id
                    })
                }
            );

            const data = await res.json();

            if (data.success) {
                fetchGroups();
                return { success: true };
            }

            return { success: false, error: data.error };

        } catch (err) {
            console.error(err);
            return { success: false, error: "Server error" };
        }
    };


    // EDIT GROUP (name / code / remove users)
    const editGroup = async ({ groupId, groupName, groupCode, removeUserIds = [] }) => {
        try {
            const res = await fetch("http://localhost:5000/api/groups/edit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    groupId,
                    groupName,
                    groupCode,
                    removeUserIds
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message);
            }

            fetchGroups();

            return { success: true };
        } catch (error) {
            console.error(error);
            return { success: false, message: error.message };
        }
    };


    return (
        <GroupContext.Provider value={{
            groups,
            selectedGroup,
            setSelectedGroup,
            createGroup,
            joinGroup,
            fetchGroups,
            deleteGroup,
            editGroup,
            leaveGroup
        }}>
            {children}
        </GroupContext.Provider>
    );
};
