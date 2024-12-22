import React, { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import axios from "axios";
import "./Admin.css";
import ImageHandler from "./AdminCalls/ImageHandler"; // Import the ImageHandler component

function Admin() {
    const auth = useAuth();
    const [deliveryFeeTitle, setDeliveryFeeTitle] = useState(""); // Primary key for delivery fee option

    const [items, setItems] = useState([]); // State to store fetched items
    const [error, setError] = useState(null); // State to store error message
    const [responseBody, setResponseBody] = useState(null); // State to store the response body
    const [newItem, setNewItem] = useState({
        title: '',
        description: '',
        price: '',
        imageUrl: '', // imageUrl is set by ImageHandler
    }); // State for the new item form
    const [deliveryFee, setDeliveryFee] = useState(0); // State for delivery fee

    const apiUrl = "https://api.mrvco.com/createItem"; // Replace with your actual API Gateway URL
    const deleteApiUrl = "https://api.mrvco.com/createItem"; // Same as above for delete
    const optionsUrl = "https://api.mrvco.com/options";

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

    // Fetch the current delivery fee from the Options table
    const fetchDeliveryFee = async () => {
        try {
            const response = await axios.get(optionsUrl, {
                headers: {
                    Authorization: `Bearer ${auth.user?.access_token}`,
                },
                params: {
                    TableName: "Options", // Ensure the TableName parameter is included
                },
            });

            const deliveryOption = response.data.find(option => option.optionName === "delivery");
            if (deliveryOption) {
                setDeliveryFee(deliveryOption.optionValue);
                setDeliveryFeeTitle(deliveryOption.title); // Save the primary key for updates
            }
        } catch (err) {
            console.error("Error fetching delivery fee:", err);
            setError("Error fetching delivery fee: " + err.message);
        }
    };

    // Update the delivery fee in the Options table
    const updateDeliveryFee = async () => {
        try {
            const response = await axios.put(optionsUrl, {
                title: deliveryFeeTitle, // Use the existing title as the primary key
                optionName: "delivery",
                optionValue: deliveryFee,
            }, {
                headers: {
                    Authorization: `Bearer ${auth.user?.access_token}`,
                    "Content-Type": "application/json",
                },
                params: {
                    TableName: "Options", // Ensure the TableName parameter is included
                },
            });

            if (response.status === 200) {
                console.log("Delivery fee updated successfully.");
            } else {
                console.error(`Failed to update delivery fee: ${response.status}`);
                setError(`Failed to update delivery fee: ${response.status}`);
            }
        } catch (err) {
            console.error("Error updating delivery fee:", err);
            setError("Error updating delivery fee: " + err.message);
        }
    };

    const signOutRedirect = () => {
        const clientId = "3cnq10hkpdqt0mk9klnaohn7g6";
        const logoutUri = "http://localhost:3000/logout";
        const cognitoDomain = "https://mrv.auth.us-west-1.amazoncognito.com";
        window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
    };

    const signOutOrder = () => {
        auth.removeUser();
        signOutRedirect();
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
            fetchDeliveryFee(); // Fetch delivery fee from the API
        }
    }, [auth.isAuthenticated]);

    // Handle Image URL update from ImageHandler component
    const handleImageUrlChange = (url) => {
        setNewItem((prevState) => ({
            ...prevState,
            imageUrl: url, // Set image URL received from ImageHandler
        }));
    };

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

                {/* Update Delivery Fee */}
                <div className="update-delivery-fee">
                    <h3>Update Delivery Fee</h3>
                    <input
                        type="number"
                        value={deliveryFee}
                        onChange={(e) => setDeliveryFee(Number(e.target.value))}
                    />
                    <button onClick={updateDeliveryFee}>Update Delivery Fee</button>
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

                {/* ImageHandler Component */}
                <ImageHandler setItemImageUrl={handleImageUrlChange} />

                <button onClick={() => signOutOrder()}>Sign out</button>
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
