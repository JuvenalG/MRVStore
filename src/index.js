import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from 'react-oidc-context'; // Keep using AuthProvider

const cognitoAuthConfig = {
  authority: "https://cognito-idp.us-west-1.amazonaws.com/us-west-1_DWq5z2xbl", // Your Cognito authority
  client_id: "3cnq10hkpdqt0mk9klnaohn7g6", // Your Cognito client ID
  redirect_uri: "http://localhost:3000/admin", // Redirect URI after login
  response_type: "code", // Code flow for authentication
  scope: "email openid phone", // Scopes requested during authentication
  post_logout_redirect_uri: "http://localhost:3000/logout", // Redirect after logout
  automaticSilentRenew: true, // Automatically renew the token when expired
  loadUserInfo: true, // Load user info (email, name, etc.)
  // No need for WebStorageStateStore, as it's handled by the provider itself
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
