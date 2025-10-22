"use client";

import React, { useState, useEffect } from "react";
import "./Checkout.scss";
import { FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import axios from "axios";
import { API_URL } from "@/app/services/apicofig";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { setLoading } from "@/app/redux/slice/loadingSlice";
import ConfirmModal from "./ConfirmModal/ConfirmModal";

const Checkout = () => {
  const dispatch = useDispatch();

  const fallbackImage =
    "http://103.146.234.88:3001/uploads/tshirt1_20250522_104343014.jpg";

  const { cartId } = useParams();

  const user = useSelector((state) => state.auth?.user || null);
  const userId = user?.id || null;
  const [showModal, setShowModal] = useState(false);
  const [cart, setCart] = useState(null);
  const router = useRouter();
  const [customDesign, setCustomDesign] = useState(null);
  const [designPosition, setDesignPosition] = useState({
    front: false,
    back: false,
    left: false,
    right: false,
  });
  const [deliveryFee, setDeliveryFee] = useState(0);

  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({
    id: 0,
    userId: userId || 0,
    addressTypeId: 0,
    addressLine1: "",
    addressLine2: "",
    city: "",
    stateId: 0,
    countryId: 0,
    postalCode: "",
    phone: "",
    activeStatus: true,
  });

  const [printingPriceRanges, setPrintingPriceRanges] = useState([]);
  const [addressTypes, setAddressTypes] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [errors, setErrors] = useState({});
  const [addresses, setAddresses] = useState([]);
  const [billingAddressId, setBillingAddressId] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [sameAsShipping, setSameAsShipping] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [deliveryError, setDeliveryError] = useState("");

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '15px';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0';
    };
  }, [showModal]);

  useEffect(() => {
    fetch("http://103.146.234.88:3001/api/PrintingPriceRanges")
      .then((res) => res.json())
      .then((data) => {
        setPrintingPriceRanges(data);
      })
      .catch((err) => console.error("Failed to fetch printing ranges:", err));
  }, []);

  // Fetch countries and address types
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get(`${API_URL}/Country`);
        setCountries(response.data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    const fetchAddressType = async () => {
      try {
        const response = await axios.get(`${API_URL}/AddressTypes`);
        setAddressTypes(response.data);
      } catch (error) {
        console.error("Error fetching Address Types:", error);
      }
    };
    fetchCountries();
    fetchAddressType();
  }, []);

  // Fetch states when country changes
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

  // Handle number-only input for phone and postal code
  const handleNumberInput = (e, field) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleChange = (e, field) => {
    if (field === 'phone' || field === 'postalCode') {
      handleNumberInput(e, field);
      return;
    }

    const value = ["countryId", "stateId", "addressTypeId"].includes(field)
      ? parseInt(e.target.value)
      : e.target.value;

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
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
    if (!data.addressTypeId)
      newErrors.addressTypeId = "Address Type is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      dispatch(setLoading(true));
      if (formData.id && formData.id !== 0) {
        await axios.put(`${API_URL}/UserShippingAddress/${formData.id}`, formData);
        alert("Address updated successfully!");
      } else {
        await axios.post(`${API_URL}/UserShippingAddress`, formData);
        alert("Address added successfully!");
      }

      setFormData({
        id: 0,
        userId: userId || 0,
        addressTypeId: 0,
        addressLine1: "",
        addressLine2: "",
        city: "",
        stateId: 0,
        countryId: 0,
        postalCode: "",
        phone: "",
        activeStatus: true,
      });

      setErrors({});
      fetchAddresses();
      setShowModal(false);
    } catch (error) {
      console.error("Error saving address:", error);
      alert("Failed to save address.");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const fetchAddresses = async () => {
    try {
      dispatch(setLoading(true));
      const response = await axios.get(`${API_URL}/UserShippingAddress/ByUserId/${userId}`);
      setAddresses(response.data);
      if (response.data.length === 1) {
        setSelectedAddressId(response.data[0].id);
        setSelectedAddress(response.data[0]);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [userId]);

  const handleSelect = (id) => {
    const updated = addresses.map((addr) =>
      addr.id === id
        ? { ...addr, selected: true }
        : { ...addr, selected: false }
    );
    setAddresses(updated);
    const selected = updated.find((addr) => addr.id === id);
    setSelectedAddressId(id);
    setSelectedAddress(selected);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    
    try {
      dispatch(setLoading(true));
      await axios.delete(`${API_URL}/UserShippingAddress/${id}`);
      setAddresses(addresses.filter((a) => a.id !== id));
      alert("Address deleted successfully.");
    } catch (error) {
      console.error("Failed to delete address", error);
      alert("Failed to delete address.");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (!cartId) return;

    const fetchCart = async () => {
      try {
        const res = await fetch(`${API_URL}/Carts/${cartId}`);
        if (!res.ok) throw new Error("Failed to fetch cart");
        const data = await res.json();
        setCart(data);

        const designRes = await fetch(`${API_URL}/customdesigns/design/${data.designId}`);
        if (!designRes.ok) throw new Error(`Failed to fetch design ${data.designId}`);
        const designData = await designRes.json();
        const parsedDesign = JSON.parse(designData.designJson);
        setCustomDesign(parsedDesign);

        const position = {
          front: parsedDesign.front?.objects?.length > 0,
          back: parsedDesign.back?.objects?.length > 0,
          left: parsedDesign.left?.objects?.length > 0,
          right: parsedDesign.right?.objects?.length > 0,
        };
        setDesignPosition(position);
      } catch (err) {
        console.error("Failed to fetch cart:", err);
      }
    };

    const fetchCartItem = async () => {
      try {
        const res = await fetch(`${API_URL}/CartItems/getByCartId/${cartId}`);
        if (!res.ok) throw new Error("Failed to fetch cart item");
        const data = await res.json();
        setCartItems(data);
      } catch (err) {
        console.error("Unable to load cart item details:", err);
      }
    };
    
    fetchCart();
    fetchCartItem();
  }, [cartId]);

  function calculatePrintCostForItem(printingPriceRanges, designPosition, quantity) {
    const range = printingPriceRanges.find(
      (r) => quantity >= r.minQty && quantity <= r.maxQty
    );
    if (!range) return 0;

    let unitCost = 0;
    if (designPosition.front) unitCost += range.front || 0;
    if (designPosition.back) unitCost += range.back || 0;
    if (designPosition.left) unitCost += range.left || 0;
    if (designPosition.right) unitCost += range.right || 0;
    if (designPosition.leftChest) unitCost += range.leftChest || 0;

    return unitCost * quantity;
  }

  // Calculate total weight
  const totalWeight = cartItems.reduce(
    (sum, item) => sum + (item.productDetails.unitWeight || 0) * item.quantity,
    0
  );

  useEffect(() => {
    const calculateDeliveryFee = async () => {
      if (!selectedAddress || totalWeight <= 0) {
        console.log("No selected address or invalid weight");
        return;
      }

      // Validate required fields for FedEx API
      if (!selectedAddress.addressLine1 || !selectedAddress.city || !selectedAddress.postalCode) {
        console.error("Missing required address fields");
        setDeliveryError("❌ Please complete your shipping address");
        return;
      }

      const fedExPayload = {
        shipperAddressId: 3,
        recipient: {
          street: selectedAddress.addressLine1 || "",
          city: selectedAddress.city || "",
          stateOrProvinceCode: selectedAddress.stateName || "",
          postalCode: selectedAddress.postalCode || "",
          countryCode: selectedAddress.countryName || "US", // Default to US if not provided
        },
        packages: [
          {
            weight: Math.max(0.1, totalWeight).toFixed(2), // Ensure minimum weight
            weightUnit: "KG",
            dimensions: {
              length: 10,
              width: 10,
              height: 10,
              units: "CM",
            },
          },
        ],
      };

      console.log("FedEx Payload:", fedExPayload);

      try {
        const response = await axios.post(`${API_URL}/FedEx/get-rates`, fedExPayload, {
          timeout: 10000, // 10 second timeout
          headers: {
            'Content-Type': 'application/json',
          }
        });

        console.log("FedEx Response:", response.data);

        if (response.data?.rates?.[0]?.ratedShipmentDetails) {
          const rate = response.data.rates[0].ratedShipmentDetails.find(
            (rate) => rate.rateType === "ACCOUNT"
          )?.totalNetCharge;

          if (!rate || Number(rate) === 0) {
            setDeliveryError("❌ Delivery not available for this address.");
            setDeliveryFee(0);
          } else {
            setDeliveryFee(parseFloat(rate));
            setDeliveryError("");
          }
        } else {
          setDeliveryError("❌ Could not calculate delivery fee. Please try again.");
          setDeliveryFee(0);
        }
      } catch (error) {
        console.error("Failed to fetch FedEx rate:", error);
        if (error.response?.status === 400) {
          setDeliveryError("❌ Invalid address format. Please check your shipping address.");
        } else if (error.code === 'ECONNABORTED') {
          setDeliveryError("❌ Delivery calculation timeout. Please try again.");
        } else {
          setDeliveryError("❌ Could not calculate delivery fee. Please try again.");
        }
        setDeliveryFee(0);
      }
    };

    calculateDeliveryFee();
  }, [selectedAddress, totalWeight]);

  const subtotal = cartItems.reduce((sum, item) => {
    const printingCost = calculatePrintCostForItem(
      printingPriceRanges,
      designPosition || {},
      item.quantity
    );
    const basePrice = (item.productDetails.salePrice || 0) * item.quantity;
    return sum + basePrice + printingCost;
  }, 0);

  const total = subtotal + deliveryFee;

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
      activeStatus: true,
    });
    setErrors({});
    setShowModal(false);
  };

  const validateAddresses = () => {
    if (!selectedAddressId) {
      alert("Please select a shipping address before placing the order.");
      return null;
    }

    const shippingAddress = addresses.find((addr) => addr.id === selectedAddressId);
    if (!shippingAddress) {
      alert("Selected shipping address not found.");
      return null;
    }

    let billingAddress;
    if (sameAsShipping) {
      billingAddress = shippingAddress;
    } else {
      if (!billingAddressId) {
        alert("Please select a billing address.");
        return null;
      }
      billingAddress = addresses.find((addr) => addr.id === billingAddressId);
      if (!billingAddress) {
        alert("Selected billing address not found.");
        return null;
      }
    }

    return { shippingAddress, billingAddress };
  };

  const handlePlaceOrder = async () => {
    const addressData = validateAddresses();
    if (!addressData) return;

    const { shippingAddress, billingAddress } = addressData;

    try {
      dispatch(setLoading(true));
      const userId = user?.id;
      const orderNumber = `ORD-${Date.now()}`;
      const trackingNumber = `TRK-${Math.floor(Math.random() * 100000)}`;

      const printingPrice = calculatePrintCostForItem(
        printingPriceRanges,
        designPosition || {},
        1
      );
      const totalPrice = subtotal + deliveryFee;

      // Create internal order first
      const orderPayload = {
        orderNumber,
        userId,
        customDesignId: cart.designId,
        totalPrice,
        orderStatusId: 1,
        paymentStatus: "Pending",
        trackingNumber,
        shippingAddressLine1: shippingAddress.addressLine1,
        shippingAddressLine2: shippingAddress.addressLine2 || "",
        shippingCity: shippingAddress.city,
        shippingStateName: shippingAddress.stateName || "",
        shippingPostalCode: shippingAddress.postalCode,
        shippingCountryName: shippingAddress.countryName || "",
        shippingUserPhone: shippingAddress.phone,
        billingAddressLine1: billingAddress.addressLine1,
        billingAddressLine2: billingAddress.addressLine2 || "",
        billingCity: billingAddress.city,
        billingStateName: billingAddress.stateName || "",
        billingPostalCode: billingAddress.postalCode,
        billingCountryName: billingAddress.countryName || "",
        billingUserPhone: billingAddress.phone,
        printingPricePerItem: printingPrice,
        deliveryFees: deliveryFee,
        ssActiveOrderNo: "",
        ssActiveInvoiceNo: "",
      };

      const orderRes = await axios.post(`${API_URL}/Order`, orderPayload);
      const createdOrderId = orderRes.data?.id;
      if (!createdOrderId) throw new Error("Order creation failed.");

      // Prepare order items
      const orderItems = cartItems.map((item) => {
        const printingCostTotal = calculatePrintCostForItem(
          printingPriceRanges,
          designPosition || {},
          item.quantity
        );
        const printingPricePerItem = printingCostTotal / item.quantity;
        const basePrice = (item.productDetails.salePrice || 0) * item.quantity;
        const totalItemPrice = basePrice + printingCostTotal;

        return {
          id: 0,
          orderId: createdOrderId,
          skuID_Master: item.skuID_Master,
          size: item.size,
          quantity: item.quantity,
          pricePerItem: item.productDetails.salePrice || 0,
          printingPricePerItem,
          totalPrice: totalItemPrice,
          customName: item.customName || "",
          imageUrl: item.productDetails.imageUrl || "",
        };
      });

      await Promise.all(
        orderItems.map((item) => axios.post(`${API_URL}/OrderItems`, item))
      );

      // Vendor Order API Integration
      try {
        const vendorOrderPayload = {
          shippingAddressId: 2,
          shippingMethod: "1",
          shipBlind: false,
          poNumber: "test",
          emailConfirmation: "test@gmail.com",
          testOrder: true,
          autoselectWarehouse: true,
          lines: cartItems.map((item) => ({
            identifier: `${item.productDetails.sku}`,
            qty: item.quantity,
          })),
        };

        const vendorRes = await axios.post(`${API_URL}/OrderSSActive/Order`, vendorOrderPayload);
        const vendorData = vendorRes.data;
        const orderData = orderRes.data;

        await axios.put(`${API_URL}/Order/${orderData.id}`, {
          id: orderData.id,
          orderStatusId: orderData.orderStatusId,
          customDesignId: orderData.customDesignId,
          paymentStatus: orderData.paymentStatus,
          trackingNumber: orderData.trackingNumber,
          printingPricePerItem: orderData.printingPricePerItem,
          deliveryFees: orderData.deliveryFees,
          ssActiveOrderNo: vendorData?.orderNumber || "",
          ssActiveInvoiceNo: vendorData?.invoiceNumber || "",
        });
      } catch (vendorErr) {
        console.error("Vendor order failed:", vendorErr);
        alert("Order placed, but vendor sync failed.");
      }

      // Clear cart
      await axios.delete(`${API_URL}/CartItems/Clear/${cart.id}`);
      await axios.delete(`${API_URL}/Carts/${cart.id}`);

      alert("Order placed successfully!");
      router.push("/");
    } catch (err) {
      console.error("❌ handlePlaceOrder error:", err);
      alert(`Something went wrong. Details logged in console.`);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleEdit = (id) => {
    const addressToEdit = addresses.find((addr) => addr.id === id);
    if (!addressToEdit) return;

    setFormData({
      id: addressToEdit.id,
      userId: addressToEdit.userId,
      addressTypeId: addressToEdit.addressTypeId,
      addressLine1: addressToEdit.addressLine1 || "",
      addressLine2: addressToEdit.addressLine2 || "",
      city: addressToEdit.city || "",
      stateId: addressToEdit.stateId || 0,
      countryId: addressToEdit.countryId || 0,
      postalCode: addressToEdit.postalCode || "",
      phone: addressToEdit.phone || "",
      activeStatus: addressToEdit.activeStatus,
    });

    setShowModal(true);
  };

  const handleBillingSelect = (id) => {
    setBillingAddressId(id);
  };

  return (
    <div className="checkout">
      <div className="checkout-container">
        <div className="checkout-head">
          <h2>Checkout</h2>
        </div>

        {/* Left Section */}
        <div className="checkout-left">
          <div className="section address-section">
            <div className="section-head">
              <div className="section-header">Shipping Address</div>
              <div className="add-address" onClick={() => setShowModal(true)}>
                + Add New Address
              </div>
            </div>

            <div className="address-list">
              {addresses.length === 0 ? (
                <div className="empty-address">
                  <p>No addresses found.</p>
                  <button onClick={() => setShowModal(true)}>
                    Add Your First Address
                  </button>
                </div>
              ) : (
                addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`address-card ${selectedAddressId === addr.id ? "selected" : ""}`}
                    onClick={() => handleSelect(addr.id)}
                  >
                    <div className="address-header">
                      <strong>{addr.addressTypeName}</strong>
                      <div className="address-header-icons">
                        <FaEdit
                          className="icon edit-icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(addr.id);
                          }}
                        />
                        <FaTrash
                          className="icon delete-icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(addr.id);
                          }}
                        />
                      </div>
                    </div>
                    <p>{addr.phone}</p>
                    <p>{addr.addressLine1}</p>
                    <p>{addr.addressLine2}</p>
                    <p>{addr.city} - {addr.postalCode}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="section address-section">
            <div className="section-head">
              <div className="section-header">Billing Address</div>
              {sameAsShipping && (
                <div className="add-address" onClick={() => setShowModal(true)}>
                  + Add New Address
                </div>
              )}
            </div>

            <div className="same-address-toggle">
              <label className="switch">
                <input
                  type="checkbox"
                  checked={sameAsShipping}
                  onChange={() => setSameAsShipping(!sameAsShipping)}
                />
                <span className="slider round"></span>
              </label>
              <span className="toggle-label">
                {sameAsShipping
                  ? "Enter a different billing address"
                  : "Billing address is the same as shipping address"}
              </span>
            </div>

            {!sameAsShipping && (
              <div className="address-list billing-address-list">
                {addresses.length === 0 ? (
                  <div className="empty-address">
                    <p>No addresses found.</p>
                    <button onClick={() => setShowModal(true)}>
                      Add Your Address
                    </button>
                  </div>
                ) : (
                  addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`address-card ${billingAddressId === addr.id ? "selected" : ""}`}
                      onClick={() => handleBillingSelect(addr.id)}
                    >
                      <div className="address-header">
                        <strong>{addr.addressTypeName}</strong>
                        <div className="address-header-icons">
                          <FaEdit
                            className="icon edit-icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(addr.id);
                            }}
                          />
                          <FaTrash
                            className="icon delete-icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(addr.id);
                            }}
                          />
                        </div>
                      </div>
                      <p>{addr.phone}</p>
                      <p>{addr.addressLine1}</p>
                      <p>{addr.addressLine2}</p>
                      <p>{addr.city} - {addr.postalCode}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="checkout-right">
          <div className="summary">
            <h3 className="summary-title">Order Summary</h3>
            {cartItems.map((item) => {
              const printingCost = calculatePrintCostForItem(
                printingPriceRanges,
                designPosition || {},
                item.quantity
              );
              const basePrice = (item.productDetails.salePrice || 0) * item.quantity;
              const totalPrice = basePrice + printingCost;

              return (
                <div className="product" key={item.id}>
                  <img
                    src={
                      item.productDetails.colorFrontImage
                        ? `https://cdn.ssactivewear.com/${item.productDetails.colorFrontImage}`
                        : fallbackImage
                    }
                    alt="Product"
                  />
                  <div className="details">
                    <div>
                      <div className="name">{item.productDetails.brandName}</div>
                      <div className="quantity">Size: {item.productDetails.sizeName}</div>
                      <div className="quantity">Qty: {item.quantity}</div>
                    </div>
                    <div>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="summary-totals">
              <div className="row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="row">
                <span>Delivery</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="row total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {deliveryError && (
              <p className="error-message">{deliveryError}</p>
            )}

            <button
              className="purchase-button"
              disabled={!!deliveryError || !selectedAddressId}
              onClick={() => {
                if (validateAddresses()) {
                  setShowConfirm(true);
                }
              }}
            >
              Pay Now
            </button>

            <p className="delivery-note">
              Delivery fee and taxes (if applicable) to be calculated during checkout
            </p>
            <div className="payment-logos">
              <img src="https://img.icons8.com/color/48/000000/visa.png" alt="Visa" />
              <img src="https://img.icons8.com/color/48/000000/mastercard-logo.png" alt="Mastercard" />
              <img src="https://img.icons8.com/color/48/000000/paypal.png" alt="PayPal" />
            </div>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCancel}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{formData.id ? "Edit Address" : "Add New Address"}</h2>
              <button 
                className="modal-close-btn"
                onClick={handleCancel}
                aria-label="Close modal"
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="placeOrderForm">
              <div className="form-grid">
                <div className={`formGroup ${errors.addressTypeId ? "errorGroup" : ""}`}>
                  <label>Address Type *</label>
                  <select
                    name="addressTypeId"
                    className={`selectField ${errors.addressTypeId ? "inputError" : ""}`}
                    onChange={(e) => handleChange(e, "addressTypeId")}
                    value={formData.addressTypeId}
                  >
                    <option value="">Select Address Type</option>
                    {addressTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                  {errors.addressTypeId && <span className="errorText">{errors.addressTypeId}</span>}
                </div>

                <div className={`formGroup ${errors.phone ? "errorGroup" : ""}`}>
                  <label>Phone Number *</label>
                  <input
                    type="text"
                    name="phone"
                    className={`inputField ${errors.phone ? "inputError" : ""}`}
                    maxLength={10}
                    value={formData.phone}
                    onChange={(e) => handleChange(e, "phone")}
                    placeholder="10-digit phone number"
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                  {errors.phone && <span className="errorText">{errors.phone}</span>}
                </div>

                <div className={`formGroup ${errors.addressLine1 ? "errorGroup" : ""}`}>
                  <label>Address Line 1 *</label>
                  <input
                    type="text"
                    name="addressLine1"
                    className={`inputField ${errors.addressLine1 ? "inputError" : ""}`}
                    value={formData.addressLine1}
                    onChange={(e) => handleChange(e, "addressLine1")}
                    placeholder="Street address, P.O. box, company name"
                  />
                  {errors.addressLine1 && <span className="errorText">{errors.addressLine1}</span>}
                </div>

                <div className="formGroup">
                  <label>Address Line 2</label>
                  <input
                    type="text"
                    name="addressLine2"
                    className="inputField"
                    value={formData.addressLine2}
                    onChange={(e) => handleChange(e, "addressLine2")}
                    placeholder="Apartment, suite, unit, building, floor, etc."
                  />
                </div>

                <div className={`formGroup ${errors.city ? "errorGroup" : ""}`}>
                  <label>City *</label>
                  <input
                    type="text"
                    name="city"
                    className={`inputField ${errors.city ? "inputError" : ""}`}
                    value={formData.city}
                    onChange={(e) => handleChange(e, "city")}
                  />
                  {errors.city && <span className="errorText">{errors.city}</span>}
                </div>

                <div className={`formGroup ${errors.postalCode ? "errorGroup" : ""}`}>
                  <label>Postal Code *</label>
                  <input
                    type="text"
                    name="postalCode"
                    className={`inputField ${errors.postalCode ? "inputError" : ""}`}
                    value={formData.postalCode}
                    onChange={(e) => handleChange(e, "postalCode")}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={10}
                  />
                  {errors.postalCode && <span className="errorText">{errors.postalCode}</span>}
                </div>

                <div className={`formGroup ${errors.countryId ? "errorGroup" : ""}`}>
                  <label>Country *</label>
                  <select
                    name="countryId"
                    className={`selectField ${errors.countryId ? "inputError" : ""}`}
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
                  {errors.countryId && <span className="errorText">{errors.countryId}</span>}
                </div>

                <div className={`formGroup ${errors.stateId ? "errorGroup" : ""}`}>
                  <label>State *</label>
                  <select
                    name="stateId"
                    className={`selectField ${errors.stateId ? "inputError" : ""}`}
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
                  {errors.stateId && <span className="errorText">{errors.stateId}</span>}
                </div>
              </div>

              <div className="formActions">
                <button type="button" className="cancel-btn" onClick={handleCancel}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {formData.id ? "Update Address" : "Add Address"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showConfirm && (
        <ConfirmModal
          title="Confirm Payment"
          message="Are you sure you want to proceed with this payment and place your order?"
          onCancel={() => setShowConfirm(false)}
          onConfirm={async () => {
            await handlePlaceOrder();
            setShowConfirm(false);
          }}
        />
      )}
    </div>
  );
};

export default Checkout;