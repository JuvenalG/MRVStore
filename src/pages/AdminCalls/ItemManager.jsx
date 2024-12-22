import React, { useState, useEffect } from "react";
import axios from "axios";

function ItemManager({ auth, newItemImageUrl }) {
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState({ title: '', description: '', price: '', imageUrl: '' });
    const [error, setError] = useState(null);
    const [validationError, setValidationError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const apiUrl = "https://api.mrvco.com/createItem";

    useEffect(() => {
        if (newItemImageUrl) {
            setNewItem((prevItem) => ({ ...prevItem, imageUrl: newItemImageUrl }));
        }
    }, [newItemImageUrl]);

    const fetchItems = async () => {
        try {
            const response = await axios.get(apiUrl, {
                headers: { Authorization: `Bearer ${auth.user?.access_token}` },
                params: { TableName: "StoreItems" },
            });
            setItems(response.data);
            setError(null); // Clear any previous errors
        } catch (err) {
            setError("Error fetching items: " + err.message);
        }
    };

    const validateFields = () => {
        if (!newItem.title.trim()) return "Title is required.";
        if (!newItem.description.trim()) return "Description is required.";
        if (!newItem.price || isNaN(newItem.price) || Number(newItem.price) <= 0)
            return "Price must be a positive number.";
        if (!newItem.imageUrl) return "Image is required. Please upload an image.";
        return "";
    };

    const addNewItem = async () => {
        const validationMessage = validateFields();
        if (validationMessage) {
            setValidationError(validationMessage);
            return;
        }

        try {
            const response = await axios.post(apiUrl, newItem, {
                headers: {
                    Authorization: `Bearer ${auth.user?.access_token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 200) {
                fetchItems(); // Refresh items after addition
                setNewItem({ title: '', description: '', price: '', imageUrl: '' }); // Reset the form
                setValidationError(''); // Clear any validation errors
                setSuccessMessage('Item added successfully!');
            }
        } catch (err) {
            setError("Error adding item: " + err.message);
        }
    };

    const deleteItem = async (itemId) => {
        const itemToDelete = items.find((item) => item.ItemId === itemId);
        if (!itemToDelete || !itemToDelete.imageUrl) {
            setError("Image URL not found for item.");
            return;
        }

        const imageKey = itemToDelete.imageUrl.split(".com/")[1]; // Extract the S3 key from the URL

        try {
            // Delete the item from DynamoDB
            await axios.delete(apiUrl, {
                headers: {
                    Authorization: `Bearer ${auth.user?.access_token}`,
                    "Content-Type": "application/json",
                },
                data: { ItemId: itemId },
            });

            // Delete the image from S3
            const uploadUrl = "https://e6kqry5fv9.execute-api.us-west-1.amazonaws.com/default/images";
            await axios.delete(uploadUrl, {
                headers: {
                    Authorization: `Bearer ${auth.user?.access_token}`,
                    "Content-Type": "application/json",
                },
                data: { key: imageKey },
            });

            setItems((prevItems) => prevItems.filter((item) => item.ItemId !== itemId));
            setError(null); // Clear any previous errors
            setSuccessMessage('Item deleted successfully!');
        } catch (err) {
            setError("Error deleting item or image: " + err.message);
        }
    };

    useEffect(() => {
        if (auth.isAuthenticated) fetchItems();
    }, [auth.isAuthenticated]);

    return (
        <div>
            <h3>Add New Item</h3>
            {validationError && <p className="error">{validationError}</p>}
            {successMessage && <p className="success">{successMessage}</p>}
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
                readOnly
            />
            <button onClick={addNewItem}>Add Item</button>

            <h3>Items from DynamoDB</h3>
            {error && <p className="error">{error}</p>}
            {items.length === 0 ? (
                <p>No items available.</p>
            ) : (
                <table>
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
                                <td>
                                    <img src={item.imageUrl} alt={item.title} width="50" />
                                </td>
                                <td>{item.title}</td>
                                <td>{item.description}</td>
                                <td>{item.price}</td>
                                <td>
                                    <button onClick={() => deleteItem(item.ItemId)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default ItemManager;
