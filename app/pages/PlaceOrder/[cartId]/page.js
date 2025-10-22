"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import "./PlaceOrder.scss";
import { API_URL } from "@/app/services/apicofig";

const PlaceOrder = () => {
  console.log("staet");

  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const cartId = searchParams.get("cartId");

  console.log(cartId);

  const user = useSelector((state) => state.auth?.user || null);
  const userId = user?.id || null;
  console.log("user Id", userId);

  const [formData, setFormData] = useState({
    userId: userId || 0,

    addressLine1: "",
    addressLine2: "",
    city: "",
    stateId: 0,
    countryId: 0,
    postalCode: "",
    phone: "",
    isDefault: true,
  });

  const [errors, setErrors] = useState({});
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const [imageUrls, setImageUrls] = useState({});
  const imagesFetched = useRef(false);

  useEffect(() => {
    const currentDate = new Date();
    const futureDate = new Date(currentDate);
    futureDate.setDate(currentDate.getDate() + 10);

    setFormData((prev) => ({
      ...prev,
      createDate: currentDate.toISOString(),
      updateDate: futureDate.toISOString(),
    }));
  }, []);

  // Fetch countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get(`${API_URL}/Country`);
        setCountries(response.data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    if (formData.countryId) {
      const fetchStates = async () => {
        try {
          const response = await axios.get(`${API_URL}/State`);
          const filteredStates = response.data.filter(
            (state) => state.countryId === Number(formData.countryId)
          );
          setStates(filteredStates);
        } catch (error) {
          console.error("Error fetching states:", error);
        }
      };
      fetchStates();
    } else {
      setStates([]);
    }
  }, [formData.countryId]);

  const handleChange = (e, field) => {
    const value =
      field === "countryId" || field === "stateId"
        ? parseInt(e.target.value)
        : e.target.value;

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const data = formData;

    if (!/^\d{10}$/.test(data.phone))
      newErrors.phone = "Phone number must be 10 digits";

    if (!data.addressLine1)
      newErrors.addressLine1 = "Address Line 1 is required";
    if (!data.city) newErrors.city = "City is required";
    if (!data.postalCode) newErrors.postalCode = "Postal Code is required";
    if (!data.countryId) newErrors.countryId = "Country is required";
    if (!data.stateId) newErrors.stateId = "State is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await axios.post(
        `${API_URL}/UserShippingAddress`,
        formData
      );
      alert("Address added successfully!");
      console.log(response.data);

      //   const newAddress = {
      //     id: 0,
      //     userId: userId || 0,
      //     addressLine1: "",
      //     addressLine2: "",
      //     city: "",
      //     stateId: "",
      //     countryId: "",
      //     postalCode: "",
      //     phone: "",
      //     isDefault: true,
      // };

      //   setFormData(resetAddress);

      setErrors({});
      fetchAddresses();
      setIsFormVisible(false);
    } catch (error) {
      console.error("Error adding address:", error);
      alert("Failed to add address.");
    }
  };

  const handleCancel = () => {
    setFormData({
      id: 0,
      userId: userId || 0,
      addressLine1: "",
      addressLine2: "",
      city: "",
      stateId: "",
      countryId: "",
      postalCode: "",
      phone: "",
      isDefault: true,
    });

    // setFormData(resetAddress);

    setErrors({});
    setIsFormVisible(false);
  };

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const fetchAddresses = async () => {
    try {
      //dispatch(startLoading());
      const response = await axios.get(`${API_URL}/UserShippingAddress`);

      setAddresses(response.data);
      if (response.data.length === 1) {
        setSelectedAddressId(response.data[0].id);
        setSelectedAddress(response.data[0]);
      }

      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleAddressChange = (addressId) => {
    console.log(addressId);
    const selected = addresses.find(
      (address) => address.id === parseInt(addressId)
    );
    console.log(selected);

    setSelectedAddress(selected);
    setSelectedAddressId(addressId);
  };

  const handleAddNewAddress = () => {
    setIsFormVisible(true);
  };

  //card data

  const [cartItems, setCartItems] = useState([]);
  console.log("userId", userId);

  // Fetch Cart Items
  useEffect(() => {
    if (!cartId) return;
    console.log("userId", cartId);

    const fetchCartItem = async () => {
      try {
        const res = await fetch(`${API_URL}/CartItems/getByCartId/${cartId}`);
        if (!res.ok) throw new Error("Failed to fetch cart item");
        const data = await res.json();
        setCartItems(data);
      } catch (err) {
        setErrors("Unable to load cart item details.");
      }
    };

    fetchCartItem();
  }, [cartId]);

  // Handle Place Order
  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      alert("Please select a shipping address before placing the order.");
      return;
    }

    // const orderPayload = {
    //   userId: userId,
    //   shippingAddressId: selectedAddressId,
    //   items: cartItems.map((item) => ({
    //     skuID_Master: item.skuID_Master || 0,
    //     size: item.size || "M",
    //     quantity: item.quantity || 1,
    //     customName: item.customName || "",
    //     customDesignId: item.customDesignId || 1,
    //   })),
    // };

    const orderPayload = {
      userId: userId,
      shippingAddressId: selectedAddressId,
      items: cartItems.map((item) => ({
        orderNumber: item.orderNumber || "string",
        totalPrice: item.totalPrice || 3000,
        orderStatusId: 1,
        orderStatus: "Pending",
        paymentStatus: "Pending",
        createdAt: new Date().toISOString(),
        trackingNumber: "",
      })),
    };

    console.log("Order Payload:", orderPayload);

    try {
      const response = await fetch(`${API_URL}/Order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) throw new Error("Failed to place order.");

      const result = await response.json();
      alert("Order placed successfully!");

      // Clear cart after successful order
      const clearResponse = await fetch(
        `${API_URL}/CartItems/Clear?userId=${userId}`,
        { method: "DELETE" }
      );

      if (!clearResponse.ok) throw new Error("Failed to clear cart.");

      setCartItems([]);
      alert("Cart cleared successfully!");
      placeOrderFormrouter.push("/");
    } catch (err) {
      console.error(err);
      alert("Error placing order.");
    }
  };

  return (
    <>
      <div className="placeOrder">
        <div className="placeOrderContainer">
          <div className="placeOrderHead">
            <h2>Place Order</h2>
          </div>

          {!isFormVisible && (
            <>
              <div className="placeOrderContentMain">
                <div className="placeOrderContentHead">
                  <h2>Shipping Address</h2>
                  <button onClick={handleAddNewAddress}>Add New Address</button>
                </div>

                {addresses.length > 1 ? (
                  <div className="placeOrderContent">
                    <label htmlFor="addressSelect">
                      <strong>Select Address:</strong>
                    </label>
                    <select
                      id="addressSelect"
                      className="addressDropdown"
                      value={selectedAddressId || ""}
                      onChange={(e) => handleAddressChange(e.target.value)}
                    >
                      <option value="" disabled>
                        Select an Address
                      </option>
                      {addresses.map((address) => (
                        <option key={address.id} value={address.id}>
                          {address.fullName} - {address.city},{" "}
                          {address.postalCode}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : addresses.length === 0 ? (
                  <p>No Addresses Available, Please Add a New Address</p>
                ) : null}

                {selectedAddress && (
                  <div>
                    <p>
                      <strong>Phone Number:</strong> {selectedAddress.phone}
                    </p>
                    <p>
                      <strong>Address Line 1:</strong>{" "}
                      {selectedAddress.addressLine1}
                    </p>
                    <p>
                      <strong>Address Line 2:</strong>{" "}
                      {selectedAddress.addressLine2}
                    </p>
                    <p>
                      <strong>City:</strong> {selectedAddress.city}
                    </p>
                    <p>
                      <strong>Postal Code:</strong> {selectedAddress.postalCode}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          {isFormVisible && formData && (
            <form className="placeOrderForm" onSubmit={handleSubmit}>
              {/* <div className={`formGroup ${errors.fullName ? "errorGroup" : ""}`}>
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                className={`inputField ${errors.fullName ? "inputError" : ""}`}
                value={formData.fullName}
                onChange={(e) => handleChange(e, "fullName")}
              />
            </div> */}

              <div className={`formGroup ${errors.phone ? "errorGroup" : ""}`}>
                <label>Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  className={`inputField ${errors.phone ? "inputError" : ""}`}
                  maxLength={10}
                  value={formData.phone}
                  onChange={(e) => handleChange(e, "phone")}
                />
              </div>

              <div className={`formGroup ${errors.city ? "errorGroup" : ""}`}>
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  className={`inputField ${errors.city ? "inputError" : ""}`}
                  value={formData.city}
                  onChange={(e) => handleChange(e, "city")}
                />
              </div>

              <div
                className={`formGroup ${errors.postalCode ? "errorGroup" : ""}`}
              >
                <label>Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  className={`inputField ${
                    errors.postalCode ? "inputError" : ""
                  }`}
                  value={formData.postalCode}
                  onChange={(e) => handleChange(e, "postalCode")}
                />
              </div>

              <div
                className={`formGroup ${errors.countryId ? "errorGroup" : ""}`}
              >
                <label>Country</label>
                <select
                  name="countryId"
                  className={`selectField ${
                    errors.countryId ? "inputError" : ""
                  }`}
                  value={formData.countryId}
                  onChange={(e) => handleChange(e, "countryId")}
                >
                  <option value="">Select Country</option>
                  {countries.map((country) => (
                    <option key={country.id} value={country.id}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              <div
                className={`formGroup ${errors.stateId ? "errorGroup" : ""}`}
              >
                <label>State</label>
                <select
                  name="stateId"
                  className={`selectField ${
                    errors.stateId ? "inputError" : ""
                  }`}
                  value={formData.stateId}
                  onChange={(e) => handleChange(e, "stateId")}
                >
                  <option value="">Select State</option>
                  {states.map((state) => (
                    <option key={state.id} value={state.id}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="formActions">
                <button type="button" onClick={handleCancel}>
                  Cancel
                </button>
                <button type="submit">Add Address</button>
              </div>
            </form>
          )}
        </div>

        <div className="OrderContainer">
          <div className="orderContainerHead">
            <h2>Place Your Order</h2>
            <div className="orderContainerContent">
              {cartItems.length === 0 ? (
                <p>No items in cart</p>
              ) : (
                <table className="place-cart-items">
                  <thead>
                    <tr>
                      <th>Product Image</th>
                      {/* <th>SKU ID</th> */}
                      <th>Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item, index) => (
                      <tr key={index}>
                        <td className="place-image-column">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={`Product ${item.skuID_Master}`}
                            />
                          ) : (
                            <p>Image not available</p>
                          )}
                        </td>
                        {/* <td className="place-details-column">
                        {item.skuID_Master}
                      </td> */}
                        <td>{item.quantity}</td>
                      </tr>
                    ))}
                    {/* <tr className="place-card-bottom">
                    <td colSpan="2">
                      Total: ₹ {totalAmount.toFixed(2)}
                    </td>
                  </tr> */}
                  </tbody>
                </table>
              )}
            </div>
            <div className="place-order-btn">
              <button
                className="update-btn"
                onClick={handlePlaceOrder}
                disabled={cartItems.length === 0}
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>


    </>
  );
};

export default PlaceOrder;
