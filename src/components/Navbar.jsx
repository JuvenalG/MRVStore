import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png"; // Path to your logo file
import "../App.css"; // Ensure your global styles include the navbar styles

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/">
                    <img src={logo} alt="Logo" className="logo" />
                </Link>
            </div>
            <ul className="nav-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/store">Store</Link></li>
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/faq">FAQ</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><Link to="/gallery">Gallery</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;
