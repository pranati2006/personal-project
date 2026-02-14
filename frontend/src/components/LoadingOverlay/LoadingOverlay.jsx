import React from "react";

const LoadingOverlay = () => {
    return (
        <div style={overlayStyle}>
            <div style={modalStyle}>
                <p>Loading...</p>
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
    minWidth: "150px",
    textAlign: "center",
};

export default LoadingOverlay;
