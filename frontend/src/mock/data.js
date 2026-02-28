// src/mock/database.js

export const usersDB = [
    {
        userId: 1,
        username: "Alice",
        groupIds: [1]
    },
    {
        userId: 2,
        username: "Bob",
        groupIds: []
    },
    {
        userId: 3,
        username: "Charlie",
        groupIds: [2]
    }
];

export const groupsDB = [
    {
        groupId: 1,
        groupName: "Group A",
        groupCode: "AAA123",
        userIds: [1]
    },
    {
        groupId: 2,
        groupName: "Group B",
        groupCode: "BBB456",
        userIds: [3]
    }
];

export const photosDB = [
    {
        photoId: 1,
        groupId: 1,
        url: "/mock/photos/1.jpg",
        uploadedBy: 1,
        uploadedAt: "2026-01-10T10:30:00"
    },
    {
        photoId: 2,
        groupId: 1,
        url: "/mock/photos/2.jpg",
        uploadedBy: 1,
        uploadedAt: "2026-01-11T14:15:00"
    },
    {
        photoId: 3,
        groupId: 2,
        url: "/mock/photos/3.jpg",
        uploadedBy: 3,
        uploadedAt: "2026-01-12T09:00:00"
    }
];


