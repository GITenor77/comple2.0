"use client";

export default function Cargando() {
    const containerStyle = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#000000"
    };

    const spinnerStyle = {
        width: "50px",
        height: "50px",
        border: "5px solid #444",
        borderTop: "5px solid #800080",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
        marginBottom: "20px"
    };

    const textStyle = {
        fontSize: "1.5em",
        color: "#800080",
        fontFamily: "Arial, Helvetica, sans-serif",
        fontWeight: "bold"
    };

    return (
        <div style={containerStyle}>
            <div style={spinnerStyle}></div>
            <h1 style={textStyle}>Cargando...</h1>

            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}