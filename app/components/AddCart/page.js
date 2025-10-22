"use client";
import React, { useState } from "react";
import axios from "axios";
import { RiShoppingCartLine } from "react-icons/ri";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

const AddToCartButton = ({ skuID_Master, imageUrl, quantity }) => {
  const API_URL = "http://103.146.234.88:3001/api";
  console.log("API_URL",API_URL);

  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);

  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);

  const user = useSelector((state) => state.auth?.user || null);
  const userId = user?.id || 0;

  const addAllToCart = () => {
    tableData.forEach(item => {
    
      addItemToCart({
        skuID_Master: item.skuID_Master,
        imageUrl: item.imageUrl,
        quantity: item.quantity
      });
    });
    
    // Show confirmation
    setShowCartConfirmation(true);
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      router.push("/pages/login");
      return;
    }

    setIsAdding(true);

    const requestBody = {
      userId,
      skuID_Master,
      imageUrl,
      quantity,
    };

    try {
        const response = await axios.post(`${API_URL}/CartItems`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        alert("Product successfully added to cart!");
        //router.push("/pages/cart");
      } else {
        alert("Failed to add product to cart.");
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
      alert("An error occurred while adding the product to the cart.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdding}
      style={{
        padding: "10px",
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        backgroundColor: "#5751e1",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      <RiShoppingCartLine />
      {isAdding ? "Adding..." : "Add to Cart"}
    </button>
  );
};

export default AddToCartButton;
