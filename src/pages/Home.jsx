import React from "react";
import "../App.css";

const Home = () => {
    return (
        <div className="home-container">
            {/* Parallax Banner Section */}
            <section className="parallax-banner-container">
                <h1 className="banner-title">Welcome to Middle River Valley Jerky Co.</h1>
                <div className="parallax-banner"></div>
            </section>

            {/* About Section */}
            <section className="about-section">
                <div className="about-content">
                    {/* Left Section: Logo and Heading */}
                    <div className="about-left">
                        <h2>Your New Favorite Snack</h2>
                        <img
                            src="https://mrv-assets.s3.us-west-1.amazonaws.com/mrvLogo.jpg"
                            alt="MRV Logo"
                        />
                    </div>

                    {/* Right Section: Text and Button */}
                    <div className="about-right">
                        <p>
                            Every batch is handcrafted. We take every effort from selecting our source
                            of beef to the type of wood and spices used to make sure you're getting the
                            best we can offer you. We've poured ourselves into our products and are so
                            grateful that you would enjoy them.
                        </p>
                        <p>~Thank you.</p>
                        <button onClick={() => window.location.href = "/about"}>Our Story</button>
                    </div>
                </div>
            </section>

            {/* Second Section */}
            <section className="image-section">
                <div className="image-content">
                    {/* Left Side: Barn Image */}
                    <div className="image-left">
                        <img
                            src="https://mrv-assets.s3.us-west-1.amazonaws.com/barn.jpg"
                            alt="Barn"
                        />
                    </div>

                    {/* Right Side: Jerky Sticks Image */}
                    <div className="image-right">
                        <img
                            src="https://mrv-assets.s3.us-west-1.amazonaws.com/jerkySticks.jpg"
                            alt="Jerky Sticks"
                        />
                    </div>
                </div>
            </section>

            <h1>Everything we offer</h1>

            <section className="features-section">
                <div className="features-content">
                    {/* Feature 1 */}
                    <div className="feature-item">
                        <img src="https://mrv-assets.s3.us-west-1.amazonaws.com/ribbon.png" alt="Handcrafted Quality" className="feature-icon" />
                        <h3 className="feature-title">Handcrafted Quality</h3>
                    </div>

                    {/* Feature 2 */}
                    <div className="feature-item">
                        <img src="https://mrv-assets.s3.us-west-1.amazonaws.com/ribbon.png" alt="Grass Fed" className="feature-icon" />
                        <h3 className="feature-title">Grass Fed</h3>
                    </div>
                </div>
            </section>


        </div>
    );
};

export default Home;
