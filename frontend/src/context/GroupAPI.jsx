

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

const API_BASE_URL = "http://localhost:5000/api/photos";

export const getGroupPhotos = async (groupId) => {
    try {
        const res = await fetch(`http://localhost:5000/api/photos/group/${groupId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
            throw new Error(data.error || "Failed to fetch group photos");
        }

        return { success: true, photos: data.photos };

    } catch (err) {
        return { success: false, error: err.message };
    }
};

// 2️⃣ Add Photos (Multiple)
// Note: 'selectedFiles' should be an array from <input type="file" multiple />
export const addPhotosToGroup = async (groupId, selectedFiles, uploadedBy) => {
    try {
        const formData = new FormData();
        formData.append('groupId', groupId);
        formData.append('uploadedBy', uploadedBy);

        // Append each file to the 'photos' array
        for (let i = 0; i < selectedFiles.length; i++) {
            formData.append('photos', selectedFiles[i]);
        }

        const res = await fetch("http://localhost:5000/api/photos/upload", {
            method: "POST",
            body: formData // No manual headers for FormData
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
            throw new Error(data.error || "Failed to upload photos");
        }

        return { success: true, message: data.message };

    } catch (err) {
        return { success: false, error: err.message };
    }
};

// 3️⃣ Delete Selected Photos
export const deletePhotosFromGroup = async (photoIds) => {
    try {
        const res = await fetch("http://localhost:5000/api/photos/delete", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ photoIds }) // photoIds is an array [1, 2, 3]
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
            throw new Error(data.error || "Failed to delete photos");
        }

        return { success: true, message: data.message };

    } catch (err) {
        return { success: false, error: err.message };
    }
};