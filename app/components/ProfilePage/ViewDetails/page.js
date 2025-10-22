"use client";

import React, { useEffect, useState } from "react";
import "./ViewDetails.scss";
import { FaArrowLeft, FaRegUser } from "react-icons/fa";

import { FaUserCircle, FaMapMarkerAlt, FaShippingFast } from "react-icons/fa";

import { FaArrowRight } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import { ImCross } from "react-icons/im";
import dynamic from "next/dynamic";

const CustomDesignCanvas = dynamic(
  () => import("@/app/utils/CanvasPreview/CanvasPreview"),
  { ssr: false }
);

import axios from "axios";
import { API_URL } from "@/app/services/apicofig";

const ViewDetails = ({ id, goBack }) => {
  const fallbackImage =
    "http://103.146.234.88:3001/uploads/tshirt1_20250522_104343014.jpg";

  const [customDesign, setCustomDesign] = useState({});

  const Image_Url = "http://103.146.234.88:3001";
  console.log("Image url", Image_Url);
  const [order, setOrder] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [productDetailsMap, setProductDetailsMap] = useState({});
  console.log(productDetailsMap);

  useEffect(() => {
    fetchOrderDetails();
    fetchOrderUserDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/OrderItems/ByOrder/${id}`);
      setOrder(response.data);
      console.log("swd", response.data);

      const skuIds = [
        ...new Set(response.data.map((item) => item.skuID_Master)),
      ];

      const productResponses = await Promise.all(
        skuIds.map((skuID) => axios.get(`${API_URL}/Products/${skuID}`))
      );
      const detailsMap = {};
      console.log(productResponses);

      productResponses.forEach((res, index) => {
        const productData = res.data[0];
        if (productData) {
          detailsMap[skuIds[index]] = {
            styleName: productData.styleName || "No style Name",

            brandName: productData.brandName || "No Brand",
            colorFrontImage: productData.colorFrontImage || null,
          };
        }
      });

      setProductDetailsMap(detailsMap);
    } catch (error) {
      console.error("Failed to fetch order details or product details:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderUserDetails = async () => {
    setLoading(true);

    try {
      const response = await axios.get(`${API_URL}/Order/Details/${id}`);
      console.log("Order Details:", response.data);
      const data = response.data;
      setOrderData(data);
      console.log(data);

      const designRes = await axios.get(
        `${API_URL}/customdesigns/design/${data.customDesignId}`
      );
      console.log(designRes);

      const designData = designRes.data;
      setCustomDesign(designData);
      console.log(designData);
    } catch (error) {
      console.error("Failed to fetch order details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading order details...</p>;
  if (!order && !orderData) return <p>No data found.</p>;

  const statusMap = {
    order_placed: { label: "Order Placed", className: "status-pending" },
    shipped: { label: "Shipped", className: "status-shipped" },
    delivered: { label: "Delivered", className: "status-delivered" },
    cancelled: { label: "Cancelled", className: "status-cancelled" },
    printing: { label: "Printing", className: "status-printing" },
    packed: { label: "Packed", className: "status-packed" },
  };

  // In your component or render method:
  const orderStatus = orderData
    ? statusMap[orderData.orderStatus?.toLowerCase()] || {
        label: orderData.orderStatus,
        className: "",
      }
    : { label: "", className: "" };

  const formattedDate = orderData?.createdAt
    ? new Date(orderData.createdAt.slice(0, 23)).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <div className="order-details">
      <button
        onClick={goBack}
        className="back-button"
        style={{
          border: "1px solid black",
          outline: "none",
          background: "transparent",
          borderRadius: "20px",

          color: "#333",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          fontSize: "16px",
          padding: "5px 12px",
        }}
      >
        <FaArrowLeft style={{ marginRight: "3px" }} />
        Go Back
      </button>

      {!loading && (
        <div className="order-details-container">
          <div className="view-order-head">
            <h3>Order Number #{orderData?.orderNumber}</h3>
            <p>
              <span>Order Created</span>
              {formattedDate || "Loading..."}
            </p>
          </div>

          {/* === First Row === */}
          <div className="order-details-row first-row">
            <div className="order-col">
              <div className="header-row">
                <h2>Customer Details</h2>
                <FaUserCircle className="header-icon" />
              </div>
              <div className="info-row">
                <span className="label">Name</span>
                <span className="value">{orderData?.userName || "N/A"}</span>
              </div>
              <div className="info-row">
                <span className="label">Phone</span>
                <span className="value">{orderData?.userMobile || "N/A"}</span>
              </div>
            </div>
            <div className="order-col">
              <div className="header-row">
                <h2>Billing Address</h2>
                <FaMapMarkerAlt className="header-icon" />
              </div>
              <div className="info-row">
                <span className="label">Address</span>
                <span className="value">
                  {orderData?.billingAddressLine1 || "N/A"}
                  {orderData?.billingAddressLine2 && (
                    <>
                      <br />
                      {orderData.billingAddressLine2}
                    </>
                  )}
                </span>
              </div>
              <div className="info-row">
                <span className="label">City</span>
                <span className="value">{orderData?.billingCity || "N/A"}</span>
              </div>
              <div className="info-row">
                <span className="label">State</span>
                <span className="value">
                  {orderData?.billingStateName || "N/A"}
                </span>
              </div>
              <div className="info-row">
                <span className="label">Country</span>
                <span className="value">
                  {orderData?.billingCountryName || "N/A"}
                </span>
              </div>
              <div className="info-row">
                <span className="label">Postal Code</span>
                <span className="value">
                  {orderData?.billingPostalCode || "N/A"}
                </span>
              </div>
              <div className="info-row">
                <span className="label">Phone</span>
                <span className="value">
                  {orderData?.billingUserPhone || "N/A"}
                </span>
              </div>
            </div>
            <div className="order-col">
              <div className="header-row">
                <h2>Shipping Address</h2>
                <FaShippingFast className="header-icon" />
              </div>
              <div className="info-row">
                <span className="label">Address</span>
                <span className="value">
                  {orderData?.shippingAddressLine1 || "N/A"}
                  {orderData?.shippingAddressLine2 && (
                    <>
                      <br />
                      {orderData.shippingAddressLine2}
                    </>
                  )}
                </span>
              </div>
              <div className="info-row">
                <span className="label">City</span>
                <span className="value">
                  {orderData?.shippingCity || "N/A"}
                </span>
              </div>
              <div className="info-row">
                <span className="label">State</span>
                <span className="value">
                  {orderData?.shippingStateName || "N/A"}
                </span>
              </div>
              <div className="info-row">
                <span className="label">Country</span>
                <span className="value">
                  {orderData?.shippingCountryName || "N/A"}
                </span>
              </div>
              <div className="info-row">
                <span className="label">Postal Code</span>
                <span className="value">
                  {orderData?.shippingPostalCode || "N/A"}
                </span>
              </div>
              <div className="info-row">
                <span className="label">Phone</span>
                <span className="value">
                  {orderData?.shippingUserPhone || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* === Second Row === */}
          <div className="order-details-row second-row">
            <div className="order-col-large">
              <h2>Item Summary</h2>

              {/* Headers */}
              <div className="content-left-container headers">
                <p className="col-image">Image</p>
                <p className="col-name-price">Details</p>
                <p className="col-size">Size</p>
                <p className="col-quantity">Quantity</p>
                <p className="col-total-price">Total Price</p>
              </div>

              {order && order.length > 0 ? (
                order.map((item) => {
                  const product = productDetailsMap[item.skuID_Master] || {};
                  const brandName = product.brandName || "Unknown Brand";
                  const colorFrontImage = product.colorFrontImage;
                  const styleName = product.styleName || "Unknown styleName";

                  return (
                    <div className="content-left-container" key={item.id}>
                      <div className="col-image">
                        <img
                          src={
                            colorFrontImage
                              ? `https://cdn.ssactivewear.com/${colorFrontImage}`
                              : fallbackImage
                          }
                          alt="Product"
                          className="cart-image"
                        />
                      </div>

                      <div className="col-name-price">
                        {/* <p className="sku-id">
                          SkuID Master: {item.skuID_Master}
                        </p> */}

                        <p>
                          {brandName} - {styleName}
                        </p>
                      </div>

                      <div className="col-size">
                        <span>{item.size}</span>
                      </div>

                      <div className="col-quantity">
                        <span>{item.quantity}</span>
                      </div>

                      <div className="col-total-price">₹{item.totalPrice}</div>
                    </div>
                  );
                })
              ) : (
                <p>No order item details available.</p>
              )}
            </div>

            <div className="order-col-small">
              <div className="order-header">
                <h2>Order Summary</h2>
                <p className={orderStatus.className}>{orderStatus.label}</p>
              </div>

              <div className="summary-left">
                <p>Subtotal</p>
                {/* <p>₹{(order.totalPrice - 150).toFixed(2)}</p> */}
              </div>
              <div className="summary-left">
                <p>Tax</p>
                {/* <p>₹100</p> */}
              </div>
              <div className="summary-left">
                <p>Shipping</p>
                {/* <p>₹50</p> */}
              </div>
              <div className="summary-left">
                <b>Total</b>
                {/* <p>₹{order.totalPrice}</p> */}
              </div>
            </div>
          </div>

          <div className="order-details-row third-row">
            <div className="order-col-small">
              <div className="order-header">
                <h2>Order Summary</h2>
                <p className={orderStatus.className}>{orderStatus.label}</p>
              </div>

              <div className="summary-left">
                <p>Subtotal</p>
                {/* <p>₹{(order.totalPrice - 150).toFixed(2)}</p> */}
              </div>
              <div className="summary-left">
                <p>Tax</p>
                {/* <p>₹100</p> */}
              </div>
              <div className="summary-left">
                <p>Shipping</p>
                {/* <p>₹50</p> */}
              </div>
              <div className="summary-left">
                <b>Total</b>
                {/* <p>₹{order.totalPrice}</p> */}
              </div>
            </div>
          </div>
          <div className="order-details-row fourth-row">
            <CustomDesignCanvas designJson={customDesign.designJson} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewDetails;
