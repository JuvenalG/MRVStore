import React, { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import axios from "axios";
import "./Admin.css";

function Admin() {
    const auth = useAuth();
    const [items, setItems] = useState([]); // State to store fetched items
    const [error, setError] = useState(null); // State to store error message
    const [responseBody, setResponseBody] = useState(null); // State to store the response body
    const [newItem, setNewItem] = useState({
        title: '',
        description: '',
        price: '',
        imageUrl: '',
    }); // State for the new item form

    const apiUrl = "https://e6kqry5fv9.execute-api.us-west-1.amazonaws.com/default/createItem"; // Replace with your actual API Gateway URL
    const deleteApiUrl = "https://e6kqry5fv9.execute-api.us-west-1.amazonaws.com/default/createItem"; // Same as above for delete

    // Fetch items from the DynamoDB table
    const fetchItems = async () => {
        try {
            const response = await axios.get(apiUrl, {
                headers: {
                    Authorization: `Bearer ${auth.user?.access_token}`, // Use Cognito token for authenticated API calls
                },
                params: {
                    TableName: "StoreItems", // Pass the DynamoDB table name as a query parameter
                },
            });

            if (response.status === 200) {
                setItems(response.data); // Set the fetched items in state
                setResponseBody(response.data); // Set the response body in state
            } else {
                console.error(`Failed to fetch items: ${response.status}`);
                setError(`Failed to fetch items: ${response.status}`);
            }
        } catch (err) {
            console.error("Error fetching items:", err);
            setError("Error fetching items: " + err.message);
        }
    };

    const handleSignOut = () => {
        auth.removeUser();

    };


    // Delete an item
    const deleteItem = async (itemId) => {
        try {
            const response = await axios.delete(deleteApiUrl, {
                headers: {
                    Authorization: `Bearer ${auth.user?.access_token}`,
                    "Content-Type": "application/json",
                },
                data: { ItemId: itemId }, // Pass the ItemId to delete
            });

            if (response.status === 200) {
                console.log("Item deleted successfully.");
                setItems((prevItems) => prevItems.filter(item => item.ItemId !== itemId)); // Remove item from the list
            } else {
                console.error(`Failed to delete item: ${response.status}`);
                setError(`Failed to delete item: ${response.status}`);
            }
        } catch (err) {
            console.error("Error deleting item:", err);
            setError("Error deleting item: " + err.message);
        }
    };

    // Add a new item
    const addNewItem = async () => {
        // Optimistically add the new item to the list
        const newItemData = { ...newItem, ItemId: Math.random().toString(36).substr(2, 9) }; // Temporary ID for optimistic update
        setItems((prevItems) => [...prevItems, newItemData]);

        try {
            const response = await axios.post(apiUrl, newItem, {
                headers: {
                    Authorization: `Bearer ${auth.user?.access_token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 200) {
                console.log("New item added successfully.");
                // Optionally, refetch items to sync with the backend
                fetchItems(); // Refetch the item list from the server

                setNewItem({
                    title: '',
                    description: '',
                    price: '',
                    imageUrl: '',
                }); // Clear the form
            } else {
                console.error(`Failed to add new item: ${response.status}`);
                setError(`Failed to add new item: ${response.status}`);
            }
        } catch (err) {
            console.error("Error adding new item:", err);
            setError("Error adding new item: " + err.message);
        }
    };

    // Fetch items when user is authenticated
    useEffect(() => {
        if (auth.isAuthenticated) {
            fetchItems(); // Fetch items from the API
        }
    }, [auth.isAuthenticated]);

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
        return (
            <div className="admin-container">
                <h1>Admin Page</h1>
                <p>Welcome, <strong>{auth.user?.profile.email}</strong>!</p>

                {/* Add New Item Form */}
                <div className="add-item-form">
                    <h3>Add New Item</h3>
                    <input
                        type="text"
                        placeholder="Title"
                        value={newItem.title}
                        onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Description"
                        value={newItem.description}
                        onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="Price"
                        value={newItem.price}
                        onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Image URL"
                        value={newItem.imageUrl}
                        onChange={(e) => setNewItem({ ...newItem, imageUrl: e.target.value })}
                    />
                    <button onClick={addNewItem}>Add Item</button>
                </div>

                {/* Display Items in Table */}
                <div className="item-list">
                    <h3>Items from DynamoDB</h3>
                    {error ? (
                        <p className="error">Error: {error}</p>
                    ) : (
                        <table className="item-table">
                            <thead>
                                <tr>
                                    <th>Image</th>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>Price</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => (
                                    <tr key={item.ItemId}>
                                        <td><img src={item.imageUrl} alt={item.title} width="50" /></td>
                                        <td>{item.title}</td>
                                        <td>{item.description}</td>
                                        <td>${item.price}</td>
                                        <td>
                                            <button onClick={() => deleteItem(item.ItemId)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
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
