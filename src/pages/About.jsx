import React from "react";
import "../pages/styles/About.css"; // Ensure this file contains global styling

const About = () => {
    return (
        <div>
            {/* Main About Section */}
            <div className="about-container">
                <p className="about-small-text">About</p>
                <h1 className="about-header">MRV Jerky Co.</h1>
                <div className="about-line"></div>
                <img
                    src="https://mrv-assets.s3.us-west-1.amazonaws.com/barn.jpg"
                    alt="Barn"
                    className="about-image"
                />
            </div>

            {/* Our Story Section */}
            <section className="our-story-section">
                <div className="our-story-content">
                    <div className="our-story-left">
                        <h1 className="our-story-header">Our Story</h1>
                        <p className="our-story-subheader">The Beginning</p>
                    </div>
                    <div className="our-story-right">
                        <p>
                            Hello there,
                            <br />
                            <br />
                            My name is Joe Sliger and my passion is jerky. I have been making jerky for the better part of 30 years, mainly for my family, close friends, and of course my hunting partners. After a good day of hunting, we'd gather around the campfire and have great conversations. It was there when my buddy Jeff said to me, "Joe, your jerky would be a hit in stores, I'm sure of it."
                            <br />
                            <br />
                            After a few seasons of consideration, I made it a goal to introduce my jerky to the public. I have landed on Jerky Island and burned the ship that brought me, so Middle River Valley Jerky Co. is here to stay!
                            <br />
                            <br />
                            With pride and integrity I put into every batch, customers will taste the difference. I only use ingredients of high quality and do not withhold any of the necessities. I believe in the jerky I sell and after one bite, you will too. Thank you for your purchase, and God bless.
                            <br />
                            <br />
                            <span className="signature">~Joe Sliger</span>
                        </p>
                    </div>
                </div>
            </section>

            <section className="image-section">
                <div className="image-wrapper">
                    {/* Left Image */}
                    <div className="image-left">
                        <img
                            src="https://mrv-assets.s3.us-west-1.amazonaws.com/jerkyPackageZoom.jpg"
                            alt="Jerky Package"
                            className="rectangular-image"
                        />
                    </div>

                    {/* Right Image */}
                    <div className="image-right">
                        <img
                            src="https://mrv-assets.s3.us-west-1.amazonaws.com/jerkyAbout.jpg"
                            alt="Jerky About"
                            className="rectangular-image"
                        />
                    </div>
                </div>
            </section>

        </div>
    );
};

export default About;
