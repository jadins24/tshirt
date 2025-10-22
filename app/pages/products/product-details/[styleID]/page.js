"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import "./productDetails.scss";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setCartData } from "@/app/redux/slice/cartSlice";
import { API_URL } from "@/app/services/apicofig";
import { setLoading } from "@/app/redux/slice/loadingSlice";
import { IoShareSocialOutline, IoHeartOutline, IoHeart } from "react-icons/io5";
import { FaChevronLeft, FaChevronRight, FaExpand, FaCompress } from "react-icons/fa";
import { HiOutlineShoppingCart } from "react-icons/hi";
import Image from "next/image";

const ProductDetails = () => {
  const params = useParams();
  const styleID = params?.styleID;
  const dispatch = useDispatch();
  const router = useRouter();

  // Redux state
  const isAuthenticated = useSelector(state => state.auth?.isAuthenticated);
  const cartItems = useSelector(state => state.cart?.cartData || []);

  // Local state
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [productDetails, setProductDetails] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFavorited, setIsFavoritedStored] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Optimized data fetching
  useEffect(() => {
    const fetchProductData = async () => {
      if (!styleID) return;
      
      try {
        setIsLoading(true);
        setError(null);
        dispatch(setLoading(true));

        // Fetch data in parallel
        const [variantsResponse, detailsResponse] = await Promise.all([
          axios.get(`${API_URL}/Products/ProductByStyleId/${styleID}`),
          axios.get(`${API_URL}/SSActiveWearStyles/${styleID}`)
        ]);

        const variantsData = variantsResponse.data;
        const detailsData = detailsResponse.data;

        setVariants(variantsData || []);
        setProductDetails(detailsData || null);
        
        // Set initial selections
        const firstAvailable = variantsData?.find((v) => v.qty > 0) || variantsData?.[0];
        if (firstAvailable) {
          setSelectedVariant(firstAvailable);
          setSelectedColor(firstAvailable.colorCode);
          setSelectedSize(firstAvailable.sizeName);
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
        setError("Failed to load product details. Please try again.");
      } finally {
        setIsLoading(false);
        dispatch(setLoading(false));
      }
    };

    fetchProductData();
  }, [styleID, dispatch]);

  // Memoized computed values for better performance
  const uniqueColors = useMemo(() => 
    Array.from(new Map(variants.map((v) => [v.colorCode, v])).values()),
    [variants]
  );
  
  const availableSizes = useMemo(() => 
    variants
      .filter((v) => v.colorCode === selectedColor && v.qty > 0)
      .map((v) => v.sizeName),
    [variants, selectedColor]
  );

  const isInCart = useMemo(() => 
    cartItems.some(item => 
      item.styleName === selectedVariant?.styleName && 
      item.colorCode === selectedVariant?.colorCode &&
      item.sizeName === selectedVariant?.sizeName
    ),
    [cartItems, selectedVariant]
  );

  const getAllVariantImages = useCallback((variant) => {
    if (!variant) return [];
    return [
      variant.colorFrontImage,
      variant.colorBackImage,
      variant.colorSideImage,
      variant.colorDirectSideImage,
      variant.colorOnModelFrontImage,
      variant.colorOnModelBackImage,
      variant.colorOnModelSideImage,
    ]
      .filter(Boolean)
      .map((path) => `https://cdn.ssactivewear.com/${path}`);
  }, []);

  const handleColorChange = useCallback((colorCode) => {
    setSelectedColor(colorCode);
    const available = variants.filter(
      (v) => v.colorCode === colorCode && v.qty > 0
    );
    if (available.length > 0) {
      const firstAvailable = available[0];
      setSelectedVariant(firstAvailable);
      setSelectedSize(firstAvailable.sizeName);
      setCurrentImageIndex(0);
    }
  }, [variants]);

  const handleSizeChange = useCallback((sizeName) => {
    setSelectedSize(sizeName);
    const matchingVariant = variants.find(
      (variant) =>
        variant.colorCode === selectedColor &&
        variant.sizeName === sizeName &&
        variant.qty > 0
    );
    if (matchingVariant) {
      setSelectedVariant(matchingVariant);
    }
  }, [variants, selectedColor]);

  const handleQuantityChange = useCallback((newQuantity) => {
    setQuantity(Math.max(1, Math.min(selectedVariant?.qty || 1, newQuantity)));
  }, [selectedVariant?.qty]);

  const toggleFavorite = useCallback(() => {
    setIsFavoritedStored(prev => !prev);
    // TODO: Implement favorite functionality with API
  }, []);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  // Reset image index when variant changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [selectedVariant]);

  const handleStartDesigning = useCallback(() => {
    if (selectedVariant) {
      dispatch(setCartData([selectedVariant]));
      router.push("/pages/customDesign");
    }
  }, [selectedVariant, dispatch, router]);

  const handleAddToCart = useCallback(() => {
    if (!isAuthenticated) {
      router.push("/pages/login");
      return;
    }
    
    if (selectedVariant) {
      const cartItem = {
        ...selectedVariant,
        quantity,
        id: `${selectedVariant.styleName}-${selectedVariant.colorCode}-${selectedVariant.sizeName}`
      };
      
      const existingCartItems = cartItems || [];
      const updatedCartItems = [...existingCartItems, cartItem];
      dispatch(setCartData(updatedCartItems));
      
      // Show success message
      alert("Added to cart successfully!");
    }
  }, [selectedVariant, quantity, isAuthenticated, cartItems, dispatch, router]);

  const handleShare = useCallback(async () => {
    const shareUrl = window.location.href;
    const shareText = `${productDetails?.style?.title || "Check out this product!"}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareText,
          url: shareUrl,
        });
      } catch (error) {
        console.error("Sharing failed:", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert("Link copied to clipboard!");
      } catch (err) {
        alert("Failed to copy link.");
      }
    }
  }, [productDetails]);

  const nextImage = useCallback(() => {
    if (selectedVariant) {
      const images = getAllVariantImages(selectedVariant);
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  }, [selectedVariant, getAllVariantImages]);

  const prevImage = useCallback(() => {
    if (selectedVariant) {
      const images = getAllVariantImages(selectedVariant);
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  }, [selectedVariant, getAllVariantImages]);

  const allImages = useMemo(() => 
    selectedVariant ? getAllVariantImages(selectedVariant) : [],
    [selectedVariant, getAllVariantImages]
  );

  // Update main image when variant changes or currentImageIndex changes
  useEffect(() => {
    if (selectedVariant && allImages.length > 0) {
      const newMainImage = allImages[currentImageIndex] || allImages[0];
      setMainImage(newMainImage);
    }
  }, [selectedVariant, currentImageIndex, allImages]);

  // Loading state
  if (isLoading) {
    return (
      <div className="product-details">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="product-details">
        <div className="error-container">
          <h2>Error Loading Product</h2>
          <p>{error}</p>
          <button 
            className="btn-primary" 
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-details">
      {/* Hero Section */}
      <section className="product-hero">
        <div className="hero-content">
          <h1 className="hero-title">Product Details</h1>
          <nav className="breadcrumb">
            <span className="breadcrumb-item" onClick={() => router.push('/')}>Home</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item" onClick={() => router.push('/pages/products')}>Products</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item active">Product Details</span>
          </nav>
        </div>
      </section>

      {/* Main Content */}
      <div className="product-container">
        {selectedVariant && (
          <div className="product-content">
            {/* Product Images */}
            <div className="product-gallery">
              <div className="gallery-main">
                <div className="main-image-container">
                  {mainImage && (
                    <Image
                      src={mainImage}
                      alt={selectedVariant.colorName}
                      width={600}
                      height={600}
                      className="main-image"
                      quality={85}
                    />
                  )}
                  
                  {/* Image Navigation */}
                  {allImages.length > 1 && (
                    <>
                      <button className="nav-btn prev-btn" onClick={prevImage} aria-label="Previous image">
                        <FaChevronLeft />
                      </button>
                      <button className="nav-btn next-btn" onClick={nextImage} aria-label="Next image">
                        <FaChevronRight />
                      </button>
                    </>
                  )}

                  {/* Image Controls */}
                  <div className="image-controls">
                    <button 
                      className="control-btn favorite-btn" 
                      onClick={toggleFavorite}
                      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
                    >
                      {isFavorited ? <IoHeart /> : <IoHeartOutline />}
                    </button>
                    <button 
                      className="control-btn fullscreen-btn" 
                      onClick={toggleFullscreen}
                      aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                    >
                      {isFullscreen ? <FaCompress /> : <FaExpand />}
                    </button>
                  </div>

                  {/* Image Counter */}
                  {allImages.length > 1 && (
                    <div className="image-counter">
                      {currentImageIndex + 1} / {allImages.length}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="gallery-thumbnails">
                {allImages.slice(0, 6).map((imgUrl, index) => (
                  <div
                    key={index}
                    className={`thumbnail-container ${
                      currentImageIndex === index ? "active" : ""
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <Image
                      src={imgUrl}
                      alt={`View ${index + 1}`}
                      width={100}
                      height={100}
                      className="thumbnail"
                      quality={75}
                    />
                  </div>
                ))}
              </div>

              {/* Product Benefits - moved below images */}
              <div className="product-benefits">
                <h3 className="selection-title">Why Choose This Product?</h3>
                <ul className="benefits-list">
                  <li className="benefit-item">
                    <span className="benefit-icon">✓</span>
                    <span className="benefit-text">Premium Quality Materials</span>
                  </li>
                  <li className="benefit-item">
                    <span className="benefit-icon">✓</span>
                    <span className="benefit-text">Custom Design Available</span>
                  </li>
                  <li className="benefit-item">
                    <span className="benefit-icon">✓</span>
                    <span className="benefit-text">Fast Shipping & Delivery</span>
                  </li>
                  <li className="benefit-item">
                    <span className="benefit-icon">✓</span>
                    <span className="benefit-text">30-Day Return Policy</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Product Information */}
            <div className="product-info">
              <div className="product-header">
                <div className="title-section">
                  {productDetails?.style?.title && (
                    <h1 className="product-title">{productDetails.style.title}</h1>
                  )}
                  <p className="product-brand">
                    {selectedVariant.brandName} • Style {selectedVariant.styleName}
                  </p>
                </div>
                <button className="share-btn" onClick={handleShare} aria-label="Share product">
                  <IoShareSocialOutline />
                </button>
              </div>

              {productDetails?.style?.baseCategory && (
                <p className="product-category">{productDetails.style.baseCategory}</p>
              )}

              {/* Color Selection */}
              <div className="selection-group color-selection">
                <h3 className="selection-title">Select Color</h3>
                <div className="color-swatches">
                  {uniqueColors.map((variant) => (
                    <button
                      key={variant.colorCode}
                      className={`color-swatch ${
                        selectedColor === variant.colorCode ? "active" : ""
                      }`}
                      onClick={() => handleColorChange(variant.colorCode)}
                      title={variant.colorName}
                    >
                      <img
                        src={`https://cdn.ssactivewear.com/${variant.colorSwatchImage}`}
                        alt={variant.colorName}
                        className="swatch-image"
                      />
                      <span className="swatch-name">{variant.colorName}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="selection-group size-selection">
                <h3 className="selection-title">Select Size</h3>
                <div className="size-options">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      className={`size-option ${
                        selectedSize === size ? "active" : ""
                      }`}
                      onClick={() => handleSizeChange(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selection */}
              <div className="quantity-selection">
                <h3 className="selection-title">Quantity</h3>
                <div className="quantity-controls">
                  <button 
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    min="1"
                    max={selectedVariant?.qty || 1}
                    className="quantity-input"
                  />
                  <button 
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= (selectedVariant?.qty || 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
                <button
                  className="btn-primary"
                  onClick={handleStartDesigning}
                >
                  Start Designing
                </button>
                
                <button
                  className={`btn-secondary ${isInCart ? 'in-cart' : ''}`}
                  onClick={handleAddToCart}
                >
                  <HiOutlineShoppingCart />
                  {isInCart ? "In Cart" : "Add to Cart"}
                </button>
              </div>

              {/* Product Features */}
              <div className="product-features">
                <div className="feature-item">
                  <span className="feature-label">Color:</span>
                  <span className="feature-value">{selectedVariant.colorName}</span>
                </div>
                <div className="feature-item">
                  <span className="feature-label">Size:</span>
                  <span className="feature-value">{selectedVariant.sizeName}</span>
                </div>
                <div className="feature-item">
                  <span className="feature-label">Brand:</span>
                  <span className="feature-value">{selectedVariant.brandName}</span>
                </div>
                <div className="feature-item">
                  <span className="feature-label">Style:</span>
                  <span className="feature-value">{selectedVariant.styleName}</span>
                </div>
                {selectedVariant.qty > 0 && (
                  <div className="feature-item">
                    <span className="feature-label">Availability:</span>
                    <span className="feature-value in-stock">
                      <span className="stock-indicator"></span>
                      In Stock ({selectedVariant.qty} available)
                    </span>
                  </div>
                )}
                {selectedVariant.qty === 0 && (
                  <div className="feature-item">
                    <span className="feature-label">Availability:</span>
                    <span className="feature-value out-of-stock">
                      <span className="stock-indicator out"></span>
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* Product Details Section */}
        {productDetails && (
          <section className="product-details-section">
            <div className="details-container">
              <h2 className="section-title">Product Details</h2>
              
              {/* Description */}
              {productDetails.style?.description && (
                <div className="description-section">
                  <h3 className="subsection-title">Description</h3>
                  <div
                    className="product-description"
                    dangerouslySetInnerHTML={{
                      __html: productDetails.style.description,
                    }}
                  />
                </div>
              )}

              {/* Categories */}
              {productDetails.matchedCategories?.length > 0 && (
                <div className="categories-section">
                  <h3 className="subsection-title">Categories</h3>
                  <div className="categories-list">
                    {productDetails.matchedCategories.map((cat) => (
                      <span key={cat.categoryID} className="category-tag">
                        {cat.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;