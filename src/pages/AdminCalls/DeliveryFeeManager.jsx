import React, { useState, useEffect } from "react";
import axios from "axios";

function DeliveryFeeManager({ auth }) {
    const [deliveryFee, setDeliveryFee] = useState(0);
    const [deliveryFeeTitle, setDeliveryFeeTitle] = useState("");
    const [error, setError] = useState(null);
    const optionsUrl = "https://api.mrvco.com/options";

    const fetchDeliveryFee = async () => {
        try {
            const response = await axios.get(optionsUrl, {
                headers: { Authorization: `Bearer ${auth.user?.access_token}` },
                params: { TableName: "Options" },
            });
            const deliveryOption = response.data.find(option => option.optionName === "delivery");
            if (deliveryOption) {
                setDeliveryFee(deliveryOption.optionValue);
                setDeliveryFeeTitle(deliveryOption.title);
            }
        } catch (err) {
            setError("Error fetching delivery fee: " + err.message);
        }
    };

    const updateDeliveryFee = async () => {
        try {
            await axios.put(optionsUrl, {
                title: deliveryFeeTitle,
                optionName: "delivery",
                optionValue: deliveryFee,
            }, {
                headers: { Authorization: `Bearer ${auth.user?.access_token}`, "Content-Type": "application/json" },
                params: { TableName: "Options" },
            });
        } catch (err) {
            setError("Error updating delivery fee: " + err.message);
        }
    };

    useEffect(() => {
        if (auth.isAuthenticated) fetchDeliveryFee();
    }, [auth.isAuthenticated]);

    return (
        <div>
            <h3>Update Delivery Fee</h3>
            <input type="number" value={deliveryFee} onChange={(e) => setDeliveryFee(Number(e.target.value))} />
            <button onClick={updateDeliveryFee}>Update</button>
            {error && <p className="error">{error}</p>}
        </div>
    );
}

export default DeliveryFeeManager;
