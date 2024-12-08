import React from "react";

const Home = () => {
    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>You are home</h1>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f5f5f5",
    },
    heading: {
        fontSize: "2rem",
        color: "#333",
    },
};

export default Home;
