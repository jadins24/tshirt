"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import "./cart.scss";
import { API_URL } from "@/app/services/apicofig";
import { FiShoppingBag, FiEdit, FiEye, FiArrowLeft, FiTrash2 } from "react-icons/fi";
import Pagination from "@/app/utils/Pagenation/Pagenation";
import { setLoading } from "@/app/redux/slice/loadingSlice";

const Cart = () => {
  const dispatch = useDispatch();

  const fallbackImage =
    "http://103.146.234.88:3001/uploads/tshirt1_20250522_104343014.jpg";

  const router = useRouter();

  const user = useSelector((state) => state.auth?.user || null);
  const userId = user?.id || null;
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [carts, setCarts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const cartsPerPage = 12;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/pages/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!userId) return;

    const fetchCarts = async () => {
      try {
        dispatch(setLoading(true));
        const res = await fetch(`${API_URL}/Carts/ByUser/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch carts");
        const data = await res.json();
        setCarts(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Failed to fetch carts.");
      } finally {
        dispatch(setLoading(false));
      }
    };

    const fetchCartItems = async () => {
      try {
        dispatch(setLoading(true));
        const res = await fetch(`${API_URL}/CartItems/ByUser/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch cart items");
        const data = await res.json();
        setCartItems(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Failed to fetch cart items.");
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchCarts();
    fetchCartItems();
  }, [userId]);

  const handleDelete = async (itemId) => {
    try {
      const response = await fetch(`${API_URL}/CartItems/${itemId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete item.");
      }

      setCartItems((prevItems) =>
        prevItems.filter((item) => item.id !== itemId)
      );
      alert("Item successfully removed from cart!");
    } catch (err) {
      setError("Error deleting item from cart.");
    }
  };

  const handleCancel = () => {
    router.push("/");
  };

  const handleEdit = (cartId, designId) => {
    router.push(`/pages/customDesign?designId=${designId}&cartId=${cartId}`);
  };

  const handleView = (cartId) => {
    router.push(`/pages/cart/view/${cartId}`);
  };

  // Group cart items by cartId
  const groupedItems = cartItems.reduce((acc, item) => {
    if (!acc[item.cartId]) {
      acc[item.cartId] = [];
    }
    acc[item.cartId].push(item);
    return acc;
  }, {});

  if (error) return <p className="error-message">{error}</p>;

  const offset = currentPage * cartsPerPage;
  const currentCarts = carts.slice(offset, offset + cartsPerPage);
  const pageCount = Math.ceil(carts.length / cartsPerPage);

  // Function to get cart display ID
  const getCartDisplayId = (cartId) => {
    const idString = cartId?.toString() || '';
    return idString.slice(-6) || '000000';
  };

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <div className="header-content">
            <h1 className="cart-title">
              <FiShoppingBag className="title-icon" />
              My Design Carts
            </h1>
            <p className="cart-subtitle">
              Manage your saved designs and continue customizing
            </p>
          </div>
          {carts.length > 0 && (
            <div className="cart-stats">
              <span className="stat-badge">{carts.length} {carts.length === 1 ? 'cart' : 'carts'}</span>
            </div>
          )}
        </div>

        {carts.length > 0 ? (
          <>
            <div className="carts-grid">
              {currentCarts.map((cart) => (
                <div className="cart-card" key={cart.id}>
                  <div className="card-header">
                    <div className="cart-badge">Cart #{getCartDisplayId(cart.id)}</div>
                    <div className="cart-date">
                      {new Date(cart.createdAt || Date.now()).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="card-image">
                    <img
                      src={
                        cart.imageUrl
                          ? `https://cdn.ssactivewear.com/${cart.imageUrl}`
                          : fallbackImage
                      }
                      alt={cart.name || "Design Preview"}
                      className="product-image"
                      onError={(e) => {
                        e.target.src = fallbackImage;
                      }}
                    />
                    <div className="image-overlay"></div>
                  </div>

                  <div className="card-content">
                    <h3 className="product-title">{cart.name || "Custom Design"}</h3>
                    
                    <div className="selection-section">
                      <h4 className="section-title">Selected Items</h4>
                      <div className="sizes-container">
                        {groupedItems[cart.id] && groupedItems[cart.id].length > 0 ? (
                          <div className="sizes-grid">
                            {groupedItems[cart.id].map((item) => (
                              <div className="size-item" key={item.id}>
                                <span className="size-label">{item.size}</span>
                                <span className="quantity">Qty: {item.quantity}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="empty-items">
                            <span>No items in this cart</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="card-actions">
                      <button
                        className="btn btn-secondary"
                        onClick={() => handleView(cart.id)}
                      >
                        <FiEye className="btn-icon" />
                        View
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleEdit(cart.id, cart.designId)}
                      >
                        <FiEdit className="btn-icon" />
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="action-section">
              <button className="btn btn-ghost" onClick={handleCancel}>
                <FiArrowLeft className="btn-icon" />
                Continue Shopping
              </button>
            </div>

            {pageCount > 1 && (
              <div className="pagination-section">
                <Pagination
                  pageCount={pageCount}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                />
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-state-content">
              <div className="empty-icon">
                <FiShoppingBag />
              </div>
              <h3>No Carts Yet</h3>
              <p>Start creating amazing designs and they'll appear here</p>
              <button 
                className="btn btn-primary" 
                onClick={() => router.push("/pages/templates")}
              >
                Explore Templates
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;