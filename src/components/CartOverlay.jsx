import React from "react";

const CartOverlay = ({ isOpen, cartItems, updateQuantity, summary, deliveryFee, onClose }) => {
    console.log("Cart items in CartOverlay:", cartItems);

    if (!isOpen) return null;

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const total = subtotal + deliveryFee;

    return (
        <div className="cart-overlay">
            <div className="overlay-content">
                <button className="close-button" onClick={onClose}>X</button>
                <h2>Your Cart</h2>
                {cartItems.length === 0 ? (
                    <p>Your cart is empty.</p>
                ) : (
                    <div>
                        <ul className="cart-items">
                            {cartItems.map((item) => (
                                <li key={item.id} className="cart-item">
                                    <img
                                        src={item.imageUrl || "https://via.placeholder.com/200"}
                                        alt={item.title}
                                        style={{ width: "50px", height: "50px" }}
                                    />
                                    <div>
                                        <h3>{item.title}</h3>
                                        <p>${item.price.toFixed(2)}</p>
                                        <div>
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                        </div>
                                    </div>
                                    <p>Total: ${(item.price * item.quantity).toFixed(2)}</p>
                                </li>
                            ))}
                        </ul>
                        <div className="summary">
                            <p>Subtotal: ${subtotal.toFixed(2)}</p>
                            <p>Delivery: ${deliveryFee.toFixed(2)}</p>
                            <h3>Total: ${total.toFixed(2)}</h3>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartOverlay;
