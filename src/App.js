import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Admin from "./pages/Admin";
import Logout from "./pages/Logout";
import Home from "./pages/Home";
import Store from "./pages/Store";
import About from "./pages/About"; // Import the About component
import FAQ from "./pages/FAQ"; // Import the FAQ component
import Contact from "./pages/Contact"; // Import the Contact component
import Gallery from "./pages/Gallery"; // Import the Gallery component
import CartBubble from "./components/CartBubble";
import CartOverlay from "./components/CartOverlay";
import Navbar from "./components/Navbar";
import axios from "axios";
import "./App.css";

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [deliveryFee, setDeliveryFee] = useState(5.0); // Placeholder until fetched from the table

  // Fetch delivery fee from the backend
  useEffect(() => {
    const fetchDeliveryFee = async () => {
      try {
        const response = await axios.get(
          "https://alx55pkslj.execute-api.us-west-1.amazonaws.com/default/getItem",
          {
            params: {
              TableName: "Settings", // Assuming the table where delivery fee is stored
            },
          }
        );

        const settings = response.data;
        const deliverySetting = settings.find((item) => item.key === "delivery");

        if (deliverySetting) setDeliveryFee(parseFloat(deliverySetting.value));
      } catch (error) {
        console.error("Failed to fetch delivery fee:", error);
      }
    };

    fetchDeliveryFee();
  }, []);

  // Add an item to the cart
  const addToCart = (item) => {
    console.log("Adding item:", item);

    setCartItems((prevCart) => {
      console.log("Previous cart state:", prevCart);

      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);

      if (existingItem) {
        // Update quantity for existing item
        const updatedCart = prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
        console.log("Updated cart state (incremented quantity):", updatedCart);
        return updatedCart;
      } else {
        // Add new item to cart
        const newCart = [...prevCart, { ...item, quantity: 1 }];
        console.log("Updated cart state (new item added):", newCart);
        return newCart;
      }
    });
  };


  // Update the quantity of an item in the cart
  const updateQuantity = (id, quantity) => {
    setCartItems((prevCart) =>
      prevCart
        .map((item) => (item.id === id ? { ...item, quantity } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  // Calculate cart summary
  const calculateSummary = () => {
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const total = subtotal + deliveryFee;
    return { subtotal, total };
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
          element={<Admin setDeliveryFee={setDeliveryFee} />}
        />
        <Route path="/logout" element={<Logout />} />
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/gallery" element={<Gallery />} />
      </Routes>
    </Router>
  );
}

export default App;
