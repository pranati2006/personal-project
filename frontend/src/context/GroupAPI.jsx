

export const fetchGroupMembers = async (groupId) => {
    try {
        const res = await fetch("http://localhost:5000/api/groups/members", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ groupId })
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
            throw new Error(data.message || "Failed to fetch group members");
        }

        return { success: true, members: data.members };

    } catch (err) {
        return { success: false, error: err.message };
    }
};

// const getGroupPhotos = (groupId) => {
//     return photos.filter(photo => photo.groupId === groupId);
// };
// // Add photos to group
// const addPhotosToGroup = ({ groupId, photoUrls, uploadedBy }) => {
//     const newPhotos = photoUrls.map(url => ({
//         photoId: Date.now() + Math.random(),
//         groupId,
//         url,
//         uploadedBy,
//         uploadedAt: new Date().toISOString()
//     }));

//     setPhotos(prev => [...prev, ...newPhotos]);
// };
// // Delete selected photos
// const deletePhotosFromGroup = (photoIds) => {
//     setPhotos(prev =>
//         prev.filter(photo => !photoIds.includes(photo.photoId))
//     );
// };