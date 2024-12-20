import React from "react";

const items = [
    { id: 1, title: "Item 1", description: "Description 1", price: 10.0, image: "https://via.placeholder.com/150" },
    { id: 2, title: "Item 2", description: "Description 2", price: 20.0, image: "https://via.placeholder.com/150" },
    { id: 3, title: "Item 3", description: "Description 3", price: 30.0, image: "https://via.placeholder.com/150" },
];

const Store = ({ addToCart }) => {
    return (
        <div style={{ padding: "20px" }}>
            <h1>Store</h1>
            <div style={{ display: "flex", gap: "20px" }}>
                {items.map((item) => (
                    <div key={item.id} style={{ border: "1px solid #ddd", padding: "10px", width: "200px" }}>
                        <img src={item.image} alt={item.title} style={{ width: "100%" }} />
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
