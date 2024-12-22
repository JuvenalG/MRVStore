import React, { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import axios from "axios";

function ImageHandler({ setItemImageUrl }) {
    const auth = useAuth();
    const [images, setImages] = useState([]); // State to store fetched images
    const [imageFile, setImageFile] = useState(null); // State for image file to upload
    const [imageUrl, setImageUrl] = useState(""); // State for storing the uploaded image URL
    const [error, setError] = useState(null); // State to store error message
    const uploadUrl = "https://e6kqry5fv9.execute-api.us-west-1.amazonaws.com/default/images"; // Lambda for S3 uploads

    // Fetch images from S3 bucket using the action query parameter
    const fetchImages = async () => {
        try {
            const response = await axios.get(uploadUrl, {
                headers: {
                    Authorization: `Bearer ${auth.user?.access_token}`,
                },
                params: {
                    action: "listImages", // Query parameter to list images
                },
            });

            if (response.status === 200) {
                setImages(response.data.imageUrls || []); // Assuming response contains an "imageUrls" array
            } else {
                console.error(`Failed to fetch images: ${response.status}`);
                setError(`Failed to fetch images: ${response.status}`);
            }
        } catch (err) {
            console.error("Error fetching images:", err);
            setError("Error fetching images: " + err.message);
        }
    };

    // Upload an image to S3
    const uploadImage = async () => {
        if (!imageFile) {
            setError("No image selected.");
            return;
        }

        const fileKey = `images/${Date.now()}_${imageFile.name}`;
        const reader = new FileReader();

        return new Promise((resolve, reject) => {
            reader.onloadend = async () => {
                try {
                    const base64FileContent = reader.result.split(",")[1];
                    const response = await axios.post(uploadUrl, {
                        key: fileKey,
                        fileContent: base64FileContent,
                        contentType: imageFile.type,
                    }, {
                        headers: {
                            Authorization: `Bearer ${auth.user?.access_token}`,
                            "Content-Type": "application/json",
                        },
                    });

                    if (response.status === 200) {
                        console.log("Image uploaded successfully:", response.data);

                        // Set default values for bucket and region if not provided
                        const bucketName = process.env.BUCKET_NAME || 'mrv-store-images-bucket'; // Use your bucket name
                        const region = process.env.AWS_REGION || 'us-west-1'; // Use your region

                        // Generate the image URL after upload
                        const uploadedImageUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${fileKey}`;
                        setImageUrl(uploadedImageUrl); // Set the uploaded image URL in the form field
                        fetchImages(); // Refetch images after upload

                        // Pass the image URL to the Admin page using the setItemImageUrl function
                        setItemImageUrl(uploadedImageUrl); // Pass the image URL to the Admin page
                    } else {
                        setError("Failed to upload image");
                        reject("Failed to upload image");
                    }
                } catch (err) {
                    console.error("Error uploading image:", err);
                    setError("Error uploading image: " + err.message);
                    reject("Error uploading image: " + err.message);
                }
            };

            reader.readAsDataURL(imageFile);
        });
    };

    // Delete an image from S3 (using image key)
    const deleteImage = async (url) => {
        const bucketName = 'mrv-store-images-bucket'; // Your S3 bucket name
        const imageKey = url.replace(`https://${bucketName}.s3.us-west-1.amazonaws.com/`, '');

        try {
            // Sending DELETE request to the API Gateway endpoint
            const response = await axios.delete(uploadUrl, {
                headers: {
                    Authorization: `Bearer ${auth.user?.access_token}`,
                    "Content-Type": "application/json",
                },
                data: { key: imageKey }, // Send image key in the body for deletion
            });

            if (response.status === 200) {
                console.log(`Image with key "${imageKey}" deleted successfully.`);
                fetchImages(); // Refetch images after delete to update the UI
            } else {
                console.error(`Failed to delete image: ${response.status}`);
                setError(`Failed to delete image: ${response.status}`);
            }
        } catch (err) {
            console.error("Error deleting image:", err);
            setError("Error deleting image: " + err.message);
        }
    };

    // Fetch images on component mount
    useEffect(() => {
        if (auth.isAuthenticated) {
            fetchImages();
        }
    }, [auth.isAuthenticated]);

    if (!auth.isAuthenticated) {
        return <div>Please log in to access this feature.</div>;
    }

    return (
        <div className="image-handler-container">
            <h1>Image Handler</h1>

            {/* Upload Image Form */}
            <div className="upload-image-form">
                <h3>Upload New Image</h3>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                />
                <button onClick={uploadImage}>Upload Image</button>
                {error && <p className="error">{error}</p>}
            </div>

            {/* Display Images */}
            <div className="image-list">
                <h3>Uploaded Images</h3>
                {images.length === 0 ? (
                    <p>No images found.</p>
                ) : (
                    <table className="image-table">
                        <thead>
                            <tr>
                                <th>Preview</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {images.map((imageUrl, index) => (
                                <tr key={index}>
                                    <td><img src={imageUrl} alt={`image-${index}`} width="100" /></td>
                                    <td>
                                        <button onClick={() => deleteImage(imageUrl)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default ImageHandler;
