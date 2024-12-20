import React from "react";


const CartBubble = ({ itemCount, onClick }) => {
    return (
        <div className="cart-bubble" onClick={onClick}>
            <span className="icon">🛒</span>
            {itemCount > 0 && <span className="count">{itemCount}</span>}
        </div>
    );
};

export default CartBubble;