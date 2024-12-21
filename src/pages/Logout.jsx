import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect back to login page or homepage after a delay
        const timer = setTimeout(() => {
            navigate("/admin");
        }, 1500); // Adjust delay time as needed

        return () => clearTimeout(timer); // Cleanup timeout
    }, [navigate]);

    return (
        <div className="logout-page">
            <h1>You are logged out</h1>
            <p>You will be redirected to the login page shortly.</p>
        </div>
    );
};

export default Logout;
