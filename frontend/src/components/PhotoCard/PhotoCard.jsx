import React from "react";
import "./PhotoCard.css";
const PhotoCard = ({
    photo,
    onClose,
    onNext,
    onPrev,
    onDelete
}) => {
    return (
        <div className="photo-overlay">
            <div className="photo-card">

                {/* Top bar */}
                <div className="photo-header">
                    <button onClick={onClose}>← Back</button>
                    <button onClick={onDelete} className="danger">Delete</button>
                </div>

                {/* Navigation */}
                <button className="nav left" onClick={onPrev}>‹</button>

                <img src={photo.url} className="photo-full" />

                <button className="nav right" onClick={onNext}>›</button>

                {/* Info */}
                <div className="photo-info">
                    <p>Uploaded by: {photo.uploaded_name}</p>
                    <p>Date: {photo.uploaded_at}</p>
                </div>

            </div>
        </div>
    );
};

export default PhotoCard;
