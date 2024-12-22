import React, { useState } from "react";
import { useAuth } from "react-oidc-context";
import axios from "axios";

function ImageHandler({ setItemImageUrl }) {
    const auth = useAuth();
    const [imageFile, setImageFile] = useState(null);
    const [error, setError] = useState(null);
    const uploadUrl = "https://e6kqry5fv9.execute-api.us-west-1.amazonaws.com/default/images"; // Lambda for S3 uploads

    // Upload an image to S3
    const uploadImage = async () => {
        if (!imageFile) {
            setError("No image selected.");
            return;
        }

        const fileKey = `images/${Date.now()}_${imageFile.name}`;
        const reader = new FileReader();

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
                    const bucketName = process.env.BUCKET_NAME || 'mrv-store-images-bucket'; // Your bucket name
                    const region = process.env.AWS_REGION || 'us-west-1'; // Your region
                    const uploadedImageUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${fileKey}`;

                    // Pass the image URL to the parent component
                    setItemImageUrl(uploadedImageUrl);
                    setError(null); // Clear previous errors
                } else {
                    setError("Failed to upload image.");
                }
            } catch (err) {
                setError("Error uploading image: " + err.message);
            }
        };

        reader.readAsDataURL(imageFile);
    };

    return (
        <div className="image-handler-container">
            <h3>Upload Image</h3>
            <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
            />
            <button onClick={uploadImage}>Upload Image</button>
            {error && <p className="error">{error}</p>}
        </div>
    );
}

export default ImageHandler;
