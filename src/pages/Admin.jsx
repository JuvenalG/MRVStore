import React, { useState } from "react";
import { useAuth } from "react-oidc-context";
import ItemManager from "./AdminCalls/ItemManager";
import DeliveryFeeManager from "./AdminCalls/DeliveryFeeManager";
import ImageHandler from "./AdminCalls/ImageHandler";

function Admin() {
    const auth = useAuth();
    const [newItemImageUrl, setNewItemImageUrl] = useState(""); // State to hold the uploaded image URL

    // Enhanced sign-out logic
    const signOutRedirect = () => {
        const clientId = "3cnq10hkpdqt0mk9klnaohn7g6"; // Replace with your actual Client ID
        const logoutUri = "http://localhost:3000/logout"; // Replace with your actual logout URL
        const cognitoDomain = "https://mrv.auth.us-west-1.amazoncognito.com"; // Replace with your Cognito domain

        window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
    };

    const signOut = () => {
        auth.removeUser();
        signOutRedirect();
    };

    if (auth.isLoading) return <div>Loading...</div>;
    if (!auth.isAuthenticated) return <button onClick={() => auth.signinRedirect()}>Sign In</button>;

    return (
        <div>
            <h1>Admin Page</h1>
            <p>Welcome, {auth.user?.profile.email}</p>

            {/* ImageHandler to upload images */}
            <ImageHandler setItemImageUrl={setNewItemImageUrl} />

            {/* ItemManager to manage store items */}
            <ItemManager auth={auth} newItemImageUrl={newItemImageUrl} />

            {/* DeliveryFeeManager to update delivery fees */}
            <DeliveryFeeManager auth={auth} />

            {/* Enhanced Sign Out */}
            <button onClick={signOut}>Sign Out</button>
        </div>
    );
}

export default Admin;
