import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Admin from "./pages/admin";
import Logout from "./pages/Logout";
import Home from "./pages/Home";
import Store from "./pages/Store";
import CartBubble from "./components/CartBubble";
import CartOverlay from "./components/CartOverlay";
import Navbar from "./components/Navbar";
import axios from "axios";
import './App.css';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [tax, setTax] = useState(0.1); // Placeholder until fetched from the table
  const [deliveryFee, setDeliveryFee] = useState(5.0); // Placeholder until fetched from the table

  useEffect(() => {
    const fetchTaxAndDelivery = async () => {
      try {
        const response = await axios.get(
          "https://alx55pkslj.execute-api.us-west-1.amazonaws.com/default/getItem", // Replace with your actual API URL
          {
            params: {
              TableName: "Settings", // Assuming the table where tax and delivery are stored
            },
          }
        );

        const settings = response.data;
        const taxSetting = settings.find((item) => item.key === "tax");
        const deliverySetting = settings.find((item) => item.key === "delivery");

        if (taxSetting) setTax(parseFloat(taxSetting.value));
        if (deliverySetting) setDeliveryFee(parseFloat(deliverySetting.value));
      } catch (error) {
        console.error("Failed to fetch tax and delivery settings:", error);
      }
    };

    fetchTaxAndDelivery();
  }, []);

  const addToCart = (item) => {
    setCartItems((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (id, quantity) => {
    setCartItems((prevCart) =>
      prevCart
        .map((item) => (item.id === id ? { ...item, quantity } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const calculateSummary = () => {
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const taxAmount = subtotal * tax;
    const total = subtotal + taxAmount + deliveryFee;
    return { subtotal, taxAmount, total };
  };

  const summary = calculateSummary();

  return (
    <Router>
      <Navbar />
      <CartBubble
        itemCount={cartItems.reduce((count, item) => count + item.quantity, 0)}
        onClick={() => setIsCartOpen(true)}
      />
      <CartOverlay
        isOpen={isCartOpen}
        cartItems={cartItems}
        updateQuantity={updateQuantity}
        summary={summary}
        tax={tax}
        deliveryFee={deliveryFee}
        onClose={() => setIsCartOpen(false)}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/store"
          element={<Store addToCart={addToCart} />}
        />
        <Route
          path="/admin"
          element={<Admin setTax={setTax} setDeliveryFee={setDeliveryFee} />} // Updated admin props
        />
        <Route path="/logout" element={<Logout />} />
        <Route path="/about" element={<div><h1>About Us</h1><p>Information about us.</p></div>} />
        <Route path="/faq" element={<div><h1>FAQ</h1><p>Frequently asked questions.</p></div>} />
        <Route path="/contact" element={<div><h1>Contact</h1><p>Contact details here.</p></div>} />
        <Route path="/gallery" element={<div><h1>Gallery</h1><p>Gallery images here.</p></div>} />
      </Routes>
    </Router>
  );
}

export default App;
