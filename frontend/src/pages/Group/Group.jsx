import React, { useContext, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { GroupContext } from "../../context/GroupContext";
import { AuthContext } from "../../context/AuthContext";
import DeleteOverlay from "../../components/ConfirmDelete/ConfirmDelete";

const GroupGallery = () => {
    const { id } = useParams();
    const numericGroupId = Number(id);
    const fileInputRef = useRef(null);

    const { groups, getGroupPhotos, deletePhotosFromGroup, addPhotosToGroup } = useContext(GroupContext);
    const { user } = useContext(AuthContext);

    const group = groups.find(g => g.groupId === numericGroupId);
    const photos = getGroupPhotos(numericGroupId);

    const [deleteMode, setDeleteMode] = useState(false);
    const [selectedPhotos, setSelectedPhotos] = useState([]);
    const [showDeleteOverlay, setShowDeleteOverlay] = useState(false);

    if (!group) {
        return <div>Group not found</div>;
    }

    const toggleSelectPhoto = (photoId) => {
        setSelectedPhotos(prev =>
            prev.includes(photoId)
                ? prev.filter(id => id !== photoId)
                : [...prev, photoId]
        );
    };

    const handleDeleteConfirm = () => {
        deletePhotosFromGroup(selectedPhotos);
        setSelectedPhotos([]);
        setDeleteMode(false);
        setShowDeleteOverlay(false);
    };

    const handleAddPhotos = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        const photoUrls = files.map(file =>
            URL.createObjectURL(file)
        );//to backend we send the files, here we just simulate with URLs

        addPhotosToGroup({
            groupId: numericGroupId,
            photoUrls,
            uploadedBy: user.userId
        });

        e.target.value = null; // reset input
    };

    const handlePhotoClick = (photo, index) => {
        if (deleteMode) return;

        alert("Open PhotoCard", photo, "index:", index);
    };

    /* ---------------- UI ---------------- */

    return (
        <div className="group-gallery-container">
            <div className="group-gallery-header">
                <h2 className="group-name">{group.groupName}</h2>

                <button
                    className="btn delete-toggle-btn"
                    onClick={() => {
                        setDeleteMode(prev => !prev);
                        setSelectedPhotos([]);
                    }}
                >
                    {deleteMode ? "Cancel" : "Delete"}
                </button>
            </div>

            {/* Photos Grid */}
            <div className="photos-grid">
                {photos.map((photo, index) => (
                    <div key={photo.photoId} className="photo-item">
                        {deleteMode && (
                            <input
                                type="checkbox"
                                className="photo-checkbox"
                                checked={selectedPhotos.includes(photo.photoId)}
                                onChange={() => toggleSelectPhoto(photo.photoId)}
                            />
                        )}

                        <img
                            src={photo.url}
                            alt="group"
                            onClick={() => handlePhotoClick(photo, index)}
                        />
                    </div>
                ))}

                {photos.length === 0 && (
                    <div className="empty-state">
                        No photos yet
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="group-gallery-footer">
                <button
                    className="btn add-photo-btn"
                    onClick={() => fileInputRef.current.click()}
                >
                    +
                </button>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    hidden
                    onChange={handleAddPhotos}
                />

                {deleteMode && selectedPhotos.length > 0 && (
                    <button
                        className="btn confirm-delete-btn"
                        onClick={() => setShowDeleteOverlay(true)}
                    >
                        Delete Selected
                    </button>
                )}
            </div>

            {/* Delete Confirmation */}
            {showDeleteOverlay && (
                <DeleteOverlay
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setShowDeleteOverlay(false)}
                />
            )}
        </div>
    );
};

export default GroupGallery;
