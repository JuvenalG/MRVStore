import React from "react";

const CartOverlay = ({ cartItems, onClose, updateQuantity, removeFromCart, tax, delivery }) => {
    const totalPrice = cartItems.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
    );
    const taxAmount = totalPrice * tax;
    const grandTotal = totalPrice + taxAmount + delivery;

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                right: 0,
                width: "300px",
                height: "100%",
                backgroundColor: "white",
                borderLeft: "1px solid #ddd",
                padding: "20px",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            }}
        >
            <button
                style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    background: "none",
                    border: "none",
                    fontSize: "16px",
                    cursor: "pointer",
                }}
                onClick={onClose}
            >
                X
            </button>
            <h3>Cart</h3>
            <ul>
                {cartItems.map((item) => (
                    <li key={item.id}>
                        {item.title} - ${item.price} x {item.quantity}
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                            -
                        </button>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                            +
                        </button>
                        <button onClick={() => removeFromCart(item.id)}>Remove</button>
                    </li>
                ))}
            </ul>
            <h4>Summary</h4>
            <p>Items: {cartItems.reduce((sum, item) => sum + item.quantity, 0)}</p>
            <p>Total: ${totalPrice.toFixed(2)}</p>
            <p>Tax: ${taxAmount.toFixed(2)}</p>
            <p>Delivery: ${delivery.toFixed(2)}</p>
            <h3>Grand Total: ${grandTotal.toFixed(2)}</h3>
        </div>
    );
};

export default CartOverlay;
