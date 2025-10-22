"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { API_URL } from "@/app/services/apicofig";
import "./ViewCartDetails.scss";
import CanvasPreview from "@/app/utils/CanvasPreview/CanvasPreview";
import { useDispatch } from "react-redux";
import { setLoading } from "@/app/redux/slice/loadingSlice";

const ViewCartDetails = () => {
  const router = useRouter();
  const { cartId } = useParams();  
  const dispatch = useDispatch();
  const [productDetails, setProductDetails] = useState(null);
  const [customDesign, setCustomDesign] = useState({});
  const [designPosition, setDesignPosition] = useState({
    front: false,
    back: false,
    left: false,
    right: false,
  });
  const [cart, setCart] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [printingPriceRanges, setPrintingPriceRanges] = useState([]);
  const [error, setError] = useState(null);

  const fallbackImage = "http://103.146.234.88:3001/uploads/tshirt1_20250522_104343014.jpg";

  useEffect(() => {
    if (!cartId) {
      setError("Cart ID is missing");
      return;
    }

    const fetchAllData = async () => {
      try {
        dispatch(setLoading(true));
        setError(null);

        // Fetch cart data
        const cartRes = await fetch(`${API_URL}/Carts/${cartId}`);
        if (!cartRes.ok) throw new Error("Failed to fetch cart");
        const cartData = await cartRes.json();
        setCart(cartData);

        // Fetch cart items
        const itemsRes = await fetch(`${API_URL}/CartItems/getByCartId/${cartId}`);
        if (!itemsRes.ok) throw new Error("Failed to fetch cart items");
        const itemsData = await itemsRes.json();
        setCartItems(itemsData);

        // Fetch design data if designId exists
        if (cartData.designId) {
          const designRes = await fetch(`${API_URL}/customdesigns/design/${cartData.designId}`);
          if (designRes.ok) {
            const designData = await designRes.json();
            setCustomDesign(designData);
            
            try {
              const parsedDesign = JSON.parse(designData.designJson);
              const position = {
                front: parsedDesign.front?.objects?.length > 0,
                back: parsedDesign.back?.objects?.length > 0,
                left: parsedDesign.left?.objects?.length > 0,
                right: parsedDesign.right?.objects?.length > 0,
              };
              setDesignPosition(position);
            } catch (parseError) {
              console.error("Error parsing design JSON:", parseError);
            }
          }
        }

        // Fetch product details if items exist
        if (itemsData.length > 0 && itemsData[0]?.skuID_Master) {
          const productRes = await fetch(`${API_URL}/Products/${itemsData[0].skuID_Master}`);
          if (productRes.ok) {
            const productData = await productRes.json();
            setProductDetails(productData[0]);
          }
        }

        // Fetch printing price ranges
        const printingRes = await fetch(`${API_URL}/PrintingPriceRanges`);
        if (printingRes.ok) {
          const printingData = await printingRes.json();
          setPrintingPriceRanges(printingData);
        }

      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to load cart details");
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchAllData();
  }, [cartId, dispatch]);

  const calculatePrintCostForItem = (quantity) => {
    const range = printingPriceRanges.find(
      r => quantity >= r.minQty && quantity <= r.maxQty
    );
    if (!range) return 0;

    let unitCost = 0;
    if (designPosition.front) unitCost += range.front || 0;
    if (designPosition.back) unitCost += range.back || 0;
    if (designPosition.left) unitCost += range.left || 0;
    if (designPosition.right) unitCost += range.right || 0;
    if (designPosition.leftChest) unitCost += range.leftChest || 0;

    return unitCost * quantity;
  };

  const calculateItemTotal = (item) => {
    const basePrice = (item.productDetails?.salePrice || 0) * item.quantity;
    const printCost = calculatePrintCostForItem(item.quantity);
    return basePrice + printCost;
  };

  const calculateCartTotal = () => {
    return cartItems.reduce((total, item) => total + calculateItemTotal(item), 0);
  };

  const handleBack = () => {
    router.push("/pages/cart");
  };

  const handleCheckout = () => {
    if (cart?.id) {
      router.push(`/pages/Checkout/${cart.id}`);
    }
  };

  const handleQuantityUpdate = async (itemId, action) => {
    try {
      const res = await fetch(`${API_URL}/CartItems/${itemId}/${action}`, {
        method: "PATCH",
      });
      
      if (!res.ok) throw new Error(`Failed to ${action} quantity`);

      // Update local state
      setCartItems(prevItems => 
        prevItems.map(item => 
          item.id === itemId 
            ? { 
                ...item, 
                quantity: action === 'increase' ? item.quantity + 1 : item.quantity - 1 
              }
            : item
        ).filter(item => item.quantity > 0) // Remove items with zero quantity
      );

    } catch (err) {
      console.error(err);
      setError(`Failed to update quantity: ${err.message}`);
    }
  };

  if (error) {
    return (
      <div className="viewcart-section">
        <div className="error-state">
          <h2>Error</h2>
          <p>{error}</p>
          <button className="back-btn" onClick={handleBack}>
            Back to My Carts
          </button>
        </div>
      </div>
    );
  }

  if (!cart && !error) {
    return (
      <div className="viewcart-section">
        <div className="loading-state">
          <p>Loading cart details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="viewcart-section">
      <div className="viewcart-container">
        
        {/* Left Panel - Design Preview */}
        <div className="view-cart-left">
          <div className="preview-header">
            <h2>Design Preview</h2>
            {cart?.name && <p className="cart-name">{cart.name}</p>}
          </div>
          
          <div className="preview-container">
            <CanvasPreview 
              designJson={customDesign.designJson} 
              productDetails={productDetails}
            />
            
            {/* Design Position Indicators */}
            <div className="design-positions">
              <h4>Design Applied On:</h4>
              <div className="position-tags">
                {designPosition.front && <span className="tag">Front</span>}
                {designPosition.back && <span className="tag">Back</span>}
                {designPosition.left && <span className="tag">Left Sleeve</span>}
                {designPosition.right && <span className="tag">Right Sleeve</span>}
                {!designPosition.front && !designPosition.back && 
                 !designPosition.left && !designPosition.right && (
                  <span className="tag">No design applied</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Cart Items */}
        <div className="view-cart-right">
          <div className="view-header">
            <h2>Order Summary</h2>
            <button className="back-btn" onClick={handleBack}>
              ← Back to My Carts
            </button>
          </div>

          {cartItems.length > 0 ? (
            <>
              {/* Items List */}
              <div className="cart-items-list">
                <div className="list-header">
                  <span>Product Details</span>
                  <span>Total</span>
                </div>

                <div className="items-container">
                  {cartItems.map((item) => (
                    <div className="cart-item" key={item.id}>
                      <div className="item-main">
                        <div className="item-image">
                          <img
                            src={
                              cart?.imageUrl
                                ? `https://cdn.ssactivewear.com/${cart.imageUrl}`
                                : fallbackImage
                            }
                            alt={cart?.name || "Product"}
                            onError={(e) => {
                              e.target.src = fallbackImage;
                            }}
                          />
                        </div>
                        <div className="item-details">
                          <h4 className="product-title">{cart?.name || "Custom Product"}</h4>
                          <div className="item-meta">
                            <span className="size">Size: {item.size}</span>
                            {cart?.designId && (
                              <span className="design">Design ID: {cart.designId}</span>
                            )}
                          </div>
                          
                          <div className="quantity-section">
                            <div className="quantity-controls">
                              <button 
                                onClick={() => handleQuantityUpdate(item.id, 'decrease')}
                                className="quantity-btn"
                                disabled={item.quantity <= 1}
                              >
                                −
                              </button>
                              <span className="quantity-display">{item.quantity}</span>
                              <button 
                                onClick={() => handleQuantityUpdate(item.id, 'increase')}
                                className="quantity-btn"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {calculatePrintCostForItem(item.quantity) > 0 && (
                            <div className="cost-breakdown">
                              <span>Base: ${(item.productDetails?.salePrice || 0 * item.quantity).toFixed(2)}</span>
                              <span>Printing: ${calculatePrintCostForItem(item.quantity).toFixed(2)}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="item-total">
                        <div className="total-amount">
                          ${calculateItemTotal(item).toFixed(2)}
                        </div>
                        <div className="unit-price">
                          ${(calculateItemTotal(item) / item.quantity).toFixed(2)} each
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cart Summary */}
              <div className="cart-summary">
                <div className="summary-row total">
                  <span>Total ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items):</span>
                  <span className="total-price">${calculateCartTotal().toFixed(2)}</span>
                </div>
                
                <button 
                  className="checkout-btn" 
                  onClick={handleCheckout}
                  disabled={cartItems.length === 0}
                >
                  Proceed to Checkout
                </button>
              </div>
            </>
          ) : (
            <div className="empty-cart-message">
              <h3>No items in this cart</h3>
              <p>This cart doesn't contain any items yet.</p>
              <button className="back-btn" onClick={handleBack}>
                Back to My Carts
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewCartDetails;