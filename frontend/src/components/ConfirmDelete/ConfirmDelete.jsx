import React from "react";
import "./ConfirmDelete.css";

const DeleteOverlay = ({ onConfirm, onCancel }) => {
    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <h2>Confirm Delete</h2>
                <div>
                    <button onClick={onConfirm}>Yes</button>
                    <button onClick={onCancel} >No</button>
                </div>
            </div>
        </div>
    );
};

// Basic overlay styles
const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
};

const modalStyle = {
    backgroundColor: "#fff",
};

export default DeleteOverlay;
