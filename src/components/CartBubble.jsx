import React from "react";

const CartBubble = ({ cartItems, onClick }) => {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div
            onClick={onClick}
            style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                backgroundColor: "#ff6347",
                color: "white",
                borderRadius: "50%",
                width: "30px",
                height: "30px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
            }}
        >
            {totalItems}
        </div>
    );
};

export default CartBubble;
