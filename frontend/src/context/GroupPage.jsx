const [photos, setPhotos] = useState([]);

const getGroupPhotos = (groupId) => {
    return photos.filter(photo => photo.groupId === groupId);
};

// Add photos to group
const addPhotosToGroup = ({ groupId, photoUrls, uploadedBy }) => {
    const newPhotos = photoUrls.map(url => ({
        photoId: Date.now() + Math.random(),
        groupId,
        url,
        uploadedBy,
        uploadedAt: new Date().toISOString()
    }));

    setPhotos(prev => [...prev, ...newPhotos]);
};

// Delete selected photos
const deletePhotosFromGroup = (photoIds) => {
    setPhotos(prev =>
        prev.filter(photo => !photoIds.includes(photo.photoId))
    );
};