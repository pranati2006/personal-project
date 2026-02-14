import React from "react";

const MessageOverlay = ({ message, onClose }) => {
    if (!message) return null; // hide if no message

    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <p>{message}</p>
                {onClose && <button onClick={onClose}>Close</button>}
            </div>
        </div>
    );
};

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
    padding: "20px",
    borderRadius: "8px",
    minWidth: "200px",
    textAlign: "center",
};

export default MessageOverlay;
