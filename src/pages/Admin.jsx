import React, { useState } from "react";
import { useAuth } from "react-oidc-context";
import ItemManager from "./AdminCalls/ItemManager";
import DeliveryFeeManager from "./AdminCalls/DeliveryFeeManager";
import ImageHandler from "./AdminCalls/ImageHandler";

function Admin() {
    const auth = useAuth();
    const [newItemImageUrl, setNewItemImageUrl] = useState(""); // State to hold the uploaded image URL

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

            <button onClick={() => auth.removeUser()}>Sign Out</button>
        </div>
    );
}

export default Admin;