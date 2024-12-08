import React, { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import "./Admin.css";

function Admin() {
    const auth = useAuth();

    // Handle sign-out logic
    const handleSignOut = () => {
        const clientId = "3cnq10hkpdqt0mk9klnaohn7g6";
        const logoutUri = "http://localhost:3000/logout"; // Redirect to logout page
        const cognitoDomain = "https://mrv.auth.us-west-1.amazoncognito.com";

        console.log("Initiating sign-out...");
        auth.removeUser().then(() => {
            console.log("Cleared local user data.");
            window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
        }).catch((error) => {
            console.error("Error during sign-out:", error);
        });
    };

    // Debugging logs
    useEffect(() => {
        console.log("Is user authenticated?", auth.isAuthenticated);
        console.log("Auth object:", auth);

        if (auth.error) {
            console.error("Authentication error:", auth.error);
        }
    }, [auth]);

    // Render loading state
    if (auth.isLoading) {
        return <div className="loading">Loading...</div>;
    }

    // Render error state
    if (auth.error) {
        return <div className="error">Error: {auth.error.message}</div>;
    }

    // Render authenticated state
    if (auth.isAuthenticated) {
        console.log("Authenticated user:", auth.user);
        return (
            <div className="admin-container">
                <h1>Admin Page</h1>
                <p>Welcome, <strong>{auth.user?.profile.email}</strong>!</p>

                <div className="token-box">
                    <h3>Tokens</h3>
                    <p>
                        <strong>ID Token:</strong> {auth.user?.id_token}
                    </p>
                    <p>
                        <strong>Access Token:</strong> {auth.user?.access_token}
                    </p>
                </div>

                <button className="signout-button" onClick={handleSignOut}>
                    Sign Out
                </button>
            </div>
        );
    }

    // Render unauthenticated state
    return (
        <div className="admin-login">
            <h1>Please log in to access the Admin page.</h1>
            <button className="signin-button" onClick={() => auth.signinRedirect()}>
                Sign In
            </button>
        </div>
    );
}

export default Admin;
