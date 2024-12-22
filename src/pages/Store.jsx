import React, { useEffect, useState } from "react";
import axios from "axios";

const Store = ({ addToCart }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get(
                    "https://alx55pkslj.execute-api.us-west-1.amazonaws.com/default/getItem", // Replace with your actual API URL
                    {
                        params: {
                            TableName: "StoreItems", // Match the DynamoDB table name
                        },
                    }
                );
                setItems(response.data);
            } catch (err) {
                setError("Failed to fetch items. " + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, []);

    if (loading) {
        return <p>Loading items...</p>;
    }

    if (error) {
        return <p className="error">{error}</p>;
    }

    return (
        <div style={{ padding: "20px" }}>
            <h1>Store</h1>
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                {items.map((item) => (
                    <div key={item.id} style={{ border: "1px solid #ddd", padding: "10px", width: "200px" }}>
                        {/* Display the image from imageUrl */}
                        <img
                            src={item.imageUrl || "https://via.placeholder.com/200"} // Fallback placeholder if imageUrl is missing
                            alt={item.title}
                            style={{ width: "100%", height: "auto" }}
                        />
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                        <p>${item.price.toFixed(2)}</p>
                        <button onClick={() => addToCart(item)}>Add to Cart</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Store;
