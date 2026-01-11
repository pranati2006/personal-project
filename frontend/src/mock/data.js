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

