import React, { useEffect, useState } from "react";
import "./AddCartSection.scss";
import { API_URL } from "@/app/services/apicofig";
import { useRouter } from "next/navigation";
import { setCartData } from "@/app/redux/slice/cartSlice";
import { useDispatch } from "react-redux";
import { setLoading } from "@/app/redux/slice/loadingSlice";

const AddCartSection = ({
  variantData,
  customDesignData,
  cartItemsData,
  cartData,
  canvas,
  onClose,
  canvasRefs,
}) => {
  const [localCartItems, setLocalCartItems] = useState(cartItemsData || []);
  const [cartName, setCartName] = useState(cartData?.name || "Demo");
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("customDesignData:", customDesignData);
    console.log("cartItemsData:", cartItemsData);
    console.log("canvas:", canvas);
    console.log("variantData:", variantData);
    console.log("cartData:", cartData);
  }, [customDesignData, cartItemsData, canvas, variantData, cartData]);

  const sizes = variantData?.map((v) => ({
    sizeName: v.sizeName,
    skuID_Master: v.skuID_Master,
    colorCode: v.colorCode,
    styleID: v.styleID,
    image: v.colorFrontImage || v.colorOnModelFrontImage,
    upcharge:
      v.sizeName === "2XL" ? "+$2.50" : v.sizeName === "3XL" ? "+$3.50" : null,
    colorFrontImage: v.colorFrontImage,
    colorOnModelFrontImage: v.colorOnModelFrontImage,
  })) || [];

  const imageUrl = sizes[0]
    ? `https://cdn.ssactivewear.com/${
        sizes[0].colorOnModelFrontImage ||
        sizes[0].colorFrontImage ||
        sizes[0].image
      }`
    : "";

  const handleQtyChange = (skuID_Master, value) => {
    const qty = parseInt(value, 10) || 0;
    setLocalCartItems((prevItems) => {
      const itemIndex = prevItems.findIndex(
        (item) => item.skuID_Master === skuID_Master
      );

      if (itemIndex !== -1) {
        const updatedItems = [...prevItems];
        updatedItems[itemIndex] = {
          ...updatedItems[itemIndex],
          quantity: qty,
        };
        return updatedItems;
      } else {
        const sizeData =
          sizes.find((s) => s.skuID_Master === skuID_Master) || {};
        return [
          ...prevItems,
          {
            cartId: 0,
            id: 0,
            skuID_Master,
            quantity: qty,
            size: sizeData.sizeName || "",
            styleID: sizeData.styleID || 0,
            colorCode: sizeData.colorCode,
            imageUrl:
              sizeData.colorOnModelFrontImage || sizeData.colorFrontImage || "",
          },
        ];
      }
    });
  };

  const handleSubmit = async () => {
    if (!cartName.trim()) {
      alert("Please enter a cart name.");
      return;
    }

    const hasValidQuantity = localCartItems.some((item) => item.quantity > 0);
    if (!hasValidQuantity) {
      alert("Please add quantity for at least one size.");
      return;
    }

    try {
      dispatch(setLoading(true));
      console.log("Custom Design Data:", customDesignData);

      // Prepare design JSON from all canvas sides
      const allDesigns = {};
      let hasDesignData = false;

      Object.entries(canvasRefs.current).forEach(([side, canvas]) => {
        if (canvas) {
          const canvasData = canvas.toJSON();
          // Check if canvas has any objects
          if (canvasData.objects && canvasData.objects.length > 0) {
            allDesigns[side] = canvasData;
            hasDesignData = true;
          } else {
            allDesigns[side] = null;
          }
        } else {
          allDesigns[side] = null;
        }
      });

      const designJson = JSON.stringify(allDesigns);
      console.log("Design JSON:", designJson);

      // Prepare final custom design data
      const finalCustomDesignData = {
        ...customDesignData,
        designJson: designJson,
        userId: customDesignData.userId || 0, // Ensure userId is set
        activeStatus: customDesignData.activeStatus !== undefined ? customDesignData.activeStatus : true
      };

      let designId = customDesignData?.id;

      // Create or update custom design
      if (designId && designId !== 0) {
        console.log("Updating existing design:", designId);
        const res = await fetch(`${API_URL}/CustomDesigns/${designId}`, {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json",
          },
          body: JSON.stringify(finalCustomDesignData),
        });
        
        if (!res.ok) {
          const errorText = await res.text();
          console.error("Update failed:", errorText);
          throw new Error(`Failed to update custom design: ${res.status} ${res.statusText}`);
        }
        
        const updatedData = await res.json();
        console.log("Design updated:", updatedData);
      } else {
        console.log("Creating new design");
        const res = await fetch(`${API_URL}/CustomDesigns`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
          },
          body: JSON.stringify(finalCustomDesignData),
        });
        
        if (!res.ok) {
          const errorText = await res.text();
          console.error("Create failed:", errorText);
          throw new Error(`Failed to create custom design: ${res.status} ${res.statusText}`);
        }
        
        const data = await res.json();
        designId = data.id;
        console.log("Design created with ID:", designId);
      }

      // Prepare cart data
      const imageUrl =
        variantData?.[0]?.colorFrontImage ||
        variantData?.[0]?.colorOnModelFrontImage ||
        "";

      let cartId = cartData?.id;
      const cartPayload = {
        ...cartData,
        name: cartName,
        designId: designId,
        imageUrl: imageUrl,
        userId: cartData?.userId || customDesignData?.userId || 0,
        createdAt: new Date().toISOString(),
      };

      // Create or update cart
      if (cartId && cartId !== 0) {
        console.log("Updating existing cart:", cartId);
        const res = await fetch(`${API_URL}/Carts/${cartId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cartPayload),
        });
        if (!res.ok) throw new Error("Failed to update cart");
      } else {
        console.log("Creating new cart");
        const res = await fetch(`${API_URL}/Carts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(cartPayload),
        });
        if (!res.ok) throw new Error("Failed to create cart");
        const data = await res.json();
        cartId = data.id;
        console.log("Cart created with ID:", cartId);
      }

      // Process cart items
      const currentColorCode = variantData?.[0]?.colorCode;
      console.log("Current color code:", currentColorCode);

      // Delete items with different color codes first
      const existingCartItems = cartItemsData || [];
      const differentColorItems = existingCartItems.filter(
        (item) => item.colorCode !== currentColorCode
      );

      console.log("Items to delete (different color):", differentColorItems);

      for (const item of differentColorItems) {
        if (item.id) {
          const res = await fetch(`${API_URL}/CartItems/${item.id}`, {
            method: "DELETE",
          });
          if (!res.ok) {
            console.warn(`Failed to delete cart item id: ${item.id}`);
          }
        }
      }

      // Process local cart items
      for (const item of localCartItems) {
        if (item.quantity === 0) {
          // Delete item if quantity is 0 and it exists
          if (item.id && item.id !== 0) {
            const res = await fetch(`${API_URL}/CartItems/${item.id}`, {
              method: "DELETE",
            });
            if (!res.ok) {
              console.warn(`Failed to delete cart item id: ${item.id}`);
            }
          }
          continue;
        }

        const itemPayload = {
          ...item,
          cartId: cartId,
          colorCode: currentColorCode, // Ensure color code is consistent
        };

        if (item.id && item.id !== 0) {
          // Update existing item
          const res = await fetch(`${API_URL}/CartItems/${item.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(itemPayload),
          });
          if (!res.ok) {
            console.warn(`Failed to update cart item id: ${item.id}`);
          }
        } else {
          // Create new item - check for duplicates
          const existingItem = existingCartItems.find(
            (existing) => 
              existing.skuID_Master === item.skuID_Master && 
              existing.colorCode === currentColorCode
          );

          if (!existingItem) {
            const res = await fetch(`${API_URL}/CartItems`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(itemPayload),
            });
            if (!res.ok) {
              console.warn("Failed to add new cart item");
            }
          } else {
            console.log(`Duplicate item skipped: ${item.skuID_Master}`);
          }
        }
      }

      console.log("✅ Cart saved successfully.");
      dispatch(setCartData([]));
      router.push("/pages/cart");
    } catch (error) {
      console.error("❌ Submit error:", error);
      alert(`Error saving cart: ${error.message}`);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="add-cart-section">
      <div className="add-cart-section-container">
        <div className="add-cart-section-head">
          <h2>Qty</h2>
          <span onClick={onClose}>✕</span>
        </div>

        <div className="add-cart-section-content">
          <div>
            <h3>How many pieces do you want?</h3>
            <p>
              No worries if you don't know exact sizes — just estimate the total
              amount for a better price estimate.
            </p>
            <div className="cart-name-input">
              <label>Cart Name</label>
              <input
                type="text"
                value={cartName}
                onChange={(e) => setCartName(e.target.value)}
                placeholder="Enter cart name"
              />
            </div>
          </div>

          <div className="add-cart-section-content-product-lists">
            <div className="add-cart-section-content-product-list">
              <div className="image">
                {imageUrl && (
                  <img src={imageUrl} alt="Product" className="product-image" />
                )}
              </div>

              <div className="content">
                <div className="product-info">
                  <h4 className="product-title">
                    {variantData?.[0]?.brandName} - {variantData?.[0]?.styleName}
                  </h4>

                  <p className="product-color">
                    Color: {variantData?.[0]?.colorName}
                  </p>
                </div>

                <div className="size-input-grid">
                  {sizes.map((size) => (
                    <div key={size.skuID_Master} className="size-box">
                      <div className="size-label">{size.sizeName}</div>
                      <input
                        type="number"
                        min={0}
                        className="size-input"
                        value={
                          localCartItems.find(
                            (item) => item.skuID_Master === size.skuID_Master
                          )?.quantity ?? 0
                        }
                        onChange={(e) =>
                          handleQtyChange(size.skuID_Master, e.target.value)
                        }
                      />
                      {size.upcharge && (
                        <div className="upcharge-text">{size.upcharge}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="btns">
            <button className="add-Cart" onClick={handleSubmit}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCartSection;