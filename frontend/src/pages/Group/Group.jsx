import React, { useContext, useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { GroupContext } from "../../context/GroupContext";
import { AuthContext } from "../../context/AuthContext";
import DeleteOverlay from "../../components/ConfirmDelete/ConfirmDelete";
import PhotoCard from "../../components/PhotoCard/PhotoCard";
import LoadingOverlay from "../../components/LoadingOverlay/LoadingOverlay";
import MessageOverlay from "../../components/MessageOverlay/MessageOverlay";
import { getGroupPhotos, addPhotosToGroup, deletePhotosFromGroup } from "../../context/GroupAPI";

const GroupGallery = () => {
    const { id } = useParams();
    const numericGroupId = Number(id);
    const fileInputRef = useRef(null);

    const { groups } = useContext(GroupContext);
    const { user } = useContext(AuthContext);

    // 🔥 Use DB naming convention (group_id)
    const group = groups.find(g => g.group_id === numericGroupId);

    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [deleteMode, setDeleteMode] = useState(false);
    const [selectedPhotos, setSelectedPhotos] = useState([]);
    const [showDeleteOverlay, setShowDeleteOverlay] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(null);

    // 1️⃣ Load photos from Backend on mount or id change
    useEffect(() => {
        const loadPhotos = async () => {
            setLoading(true);
            const result = await getGroupPhotos(numericGroupId);
            setLoading(false);

            if (result.success) {
                setPhotos(result.photos);
            } else {
                setMessage(result.error || "Failed to load photos.");
            }
        };

        if (numericGroupId) loadPhotos();
    }, [numericGroupId, getGroupPhotos]);


    if (!group) {
        return <div className="error-state">Group not found</div>;
    }

    const toggleSelectPhoto = (photoId) => {
        setSelectedPhotos(prev => prev.includes(photoId) ? prev.filter(id => id !== photoId) : [...prev, photoId])
    };

    const handleDeleteConfirm = async () => {
        setShowDeleteOverlay(false);
        setLoading(true);

        const result = await deletePhotosFromGroup(selectedPhotos);

        setLoading(false);

        if (result.success) {
            // Update local UI state
            setPhotos(prev => prev.filter(p => !selectedPhotos.includes(p.photo_id)));
            setSelectedPhotos([]);
            setDeleteMode(false);
            if (selectedIndex !== null) setSelectedIndex(null);
            setMessage("Photos deleted successfully!");
        } else {
            setMessage(result.error || "Failed to delete photos.");
        }
    };

    const handleAddPhotos = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        setLoading(true);
        const result = await addPhotosToGroup(numericGroupId, files, user.id); // Assuming user.id
        setLoading(false);

        if (result.success) {
            // Re-fetch photos to get the new ones with real server paths
            const updated = await getGroupPhotos(numericGroupId);
            if (updated.success) setPhotos(updated.photos);
            setMessage("Photos uploaded successfully!");
        } else {
            setMessage(result.error || "Upload failed.");
        }

        e.target.value = null; // reset input
    };

    /* ---------------- Navigation Logic ---------------- */

    const nextPhoto = () => setSelectedIndex((i) => (i + 1) % photos.length);
    const prevPhoto = () => setSelectedIndex((i) => (i - 1 + photos.length) % photos.length);
    const closePhoto = () => setSelectedIndex(null);

    const openDeleteModalForSingle = (photoId) => {
        setSelectedPhotos([photoId]);
        setShowDeleteOverlay(true);
    };
    const handlePhotoClick = (index) => {
        if (deleteMode) return; // Don't open preview if we are in delete mode
        setSelectedIndex(index);
    };

    return (
        <div className="group-gallery-container">
            {loading && <LoadingOverlay />}

            {message && (
                <MessageOverlay
                    message={message}
                    onClose={() => setMessage("")}
                />
            )}

            <div className="group-gallery-header">
                <h2 className="group-name">{group.group_name}</h2>

                <button
                    className={`btn delete-toggle-btn ${deleteMode ? "active" : ""}`}
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
                    <div key={photo.photo_id} className="photo-item">
                        {deleteMode && (
                            <input
                                type="checkbox"
                                className="photo-checkbox"
                                checked={selectedPhotos.includes(photo.photo_id)}
                                onChange={() => toggleSelectPhoto(photo.photo_id)}
                            />
                        )}

                        <img
                            src={photo.url}
                            alt="group content"
                            loading="lazy"
                            onClick={() => handlePhotoClick(index)}
                        />
                    </div>
                ))}

                {!loading && photos.length === 0 && (
                    <div className="empty-state">No photos yet. Start by adding some!</div>
                )}
            </div>

            {/* Footer Actions */}
            <div className="group-gallery-footer">
                <button
                    className="btn add-photo-btn"
                    onClick={() => fileInputRef.current.click()}
                    disabled={deleteMode}
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
                        Delete Selected ({selectedPhotos.length})
                    </button>
                )}
            </div>

            {/* Lightbox / Preview */}
            {selectedIndex !== null && (
                <PhotoCard
                    photo={photos[selectedIndex]}
                    onClose={closePhoto}
                    onNext={nextPhoto}
                    onPrev={prevPhoto}
                    onDelete={() => openDeleteModalForSingle(photos[selectedIndex].photo_id)}
                />
            )}

            {/* Delete Confirmation */}
            {showDeleteOverlay && (
                <DeleteOverlay
                    heading="Delete Photos?"
                    message={`Are you sure you want to delete ${selectedPhotos.length} photo(s)?`}
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => {
                        setShowDeleteOverlay(false);
                        if (!deleteMode) setSelectedPhotos([]);
                    }}
                />
            )}
        </div>
    );
};

export default GroupGallery;