// src/context/GroupContext.js
import React, { createContext, useState } from "react";
import { usersDB, groupsDB, photosDB } from "../mock/data";

export const GroupContext = createContext();

export const GroupProvider = ({ children }) => {

    // simulate DB tables in memory
    const [users, setUsers] = useState(usersDB);
    const [groups, setGroups] = useState(groupsDB);
    const [photos, setPhotos] = useState(photosDB);

    // helper: get groups of a user
    const getUserGroups = (userId) => {
        const user = users.find(u => u.userId === userId);
        if (!user) return [];

        return groups.filter(g => user.groupIds.includes(g.groupId));
    };

    // CREATE GROUP
    const createGroup = ({ groupName, groupCode, userId }) => {
        const newGroupId = Date.now();

        const newGroup = {
            groupId: newGroupId,
            groupName,
            groupCode,
            userIds: [userId]
        };

        setGroups(prev => [...prev, newGroup]);

        setUsers(prev =>
            prev.map(u =>
                u.userId === userId
                    ? { ...u, groupIds: [...u.groupIds, newGroupId] }
                    : u
            )
        );
    };

    // JOIN GROUP
    const joinGroup = ({ groupName, groupCode, userId }) => {
        const group = groups.find(
            g => g.groupName === groupName && g.groupCode === groupCode
        );

        if (!group) return { success: false, message: "Group not found" };

        // already joined?
        if (group.userIds.includes(userId)) {
            return { success: false, message: "Already a member" };
        }

        // update group
        setGroups(prev =>
            prev.map(g =>
                g.groupId === group.groupId
                    ? { ...g, userIds: [...g.userIds, userId] }
                    : g
            )
        );

        // update user
        setUsers(prev =>
            prev.map(u =>
                u.userId === userId
                    ? { ...u, groupIds: [...u.groupIds, group.groupId] }
                    : u
            )
        );

        return { success: true };
    };

    // DELETE GROUP
    const deleteGroup = (groupId) => {
        // remove group
        setGroups(prev => prev.filter(g => g.groupId !== groupId));

        // remove groupId from all users
        setUsers(prev =>
            prev.map(u => ({
                ...u,
                groupIds: u.groupIds.filter(id => id !== groupId)
            }))
        );
    };

    //LEAVE GROUP
    const leaveGroup = ({ groupId, userId }) => {
        setGroups(prevGroups =>
            prevGroups
                .map(group =>
                    group.groupId === groupId
                        ? {
                            ...group,
                            userIds: group.userIds.filter(id => id !== userId)
                        }
                        : group
                )
        );

        setUsers(prevUsers =>
            prevUsers.map(user =>
                user.userId === userId
                    ? {
                        ...user,
                        groupIds: user.groupIds.filter(id => id !== groupId)
                    }
                    : user
            )
        );
    };


    // EDIT GROUP (name / code / remove users)
    const editGroup = ({ groupId, groupName, groupCode, removeUserIds = [] }) => {
        // update group
        setGroups(prev =>
            prev.map(g =>
                g.groupId === groupId
                    ? {
                        ...g,
                        groupName: groupName ?? g.groupName,
                        groupCode: groupCode ?? g.groupCode,
                        userIds: g.userIds.filter(id => !removeUserIds.includes(id))
                    }
                    : g
            )
        );

        // update users
        setUsers(prev =>
            prev.map(u =>
                removeUserIds.includes(u.userId)
                    ? { ...u, groupIds: u.groupIds.filter(id => id !== groupId) }
                    : u
            )
        );
    };

    // Get all photos of a group
    const getGroupPhotos = (groupId) => {
        return photos.filter(photo => photo.groupId === groupId);
    };

    //add photos to a group
    const addPhotosToGroup = ({ groupId, photoUrls, uploadedBy }) => {
        const newPhotos = photoUrls.map(url => ({
            photoId: Date.now() + Math.random(), // ensure uniqueness
            groupId,
            url,
            uploadedBy,
            uploadedAt: new Date().toISOString()
        }));

        setPhotos(prev => [...prev, ...newPhotos]);
    };

    // Delete selected photos from a group (add groupid)
    const deletePhotosFromGroup = (photoIds) => {
        setPhotos(prev =>
            prev.filter(photo => !photoIds.includes(photo.photoId))
        );
    };

    return (
        <GroupContext.Provider value={{
            users,
            groups,
            photos,
            getGroupPhotos,
            addPhotosToGroup,
            deletePhotosFromGroup,
            getUserGroups,
            createGroup,
            joinGroup,
            deleteGroup,
            editGroup,
            leaveGroup
        }}>
            {children}
        </GroupContext.Provider>
    );
};
