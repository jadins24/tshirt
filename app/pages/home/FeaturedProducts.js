"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./home.scss";
import { FaStar, FaHeart, FaShoppingCart, FaEye } from "react-icons/fa";
import { API_URL } from "@/app/services/apicofig";
import Image from "next/image";
import Button from "@/app/components/Button";

const FeaturedProducts = () => {
  const router = useRouter();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredProduct, setHoveredProduct] = useState(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/Products/ByCategory/brandName?baseCategory=T-Shirts - Premium&limit=6`, {
          cache: 'force-cache',
          next: { revalidate: 300 }
        });
        
        if (response.ok) {
          const products = await response.json();
          setFeaturedProducts(products.slice(0, 6));
        }
      } catch (error) {
        console.error("Error fetching featured products:", error);
        // Fallback products if API fails
        setFeaturedProducts([
          {
            styleID: "16614",
            title: "Premium Cotton T-Shirt",
            brandName: "American Apparel",
            price: 24.99,
            styleImage: "sample-image.jpg",
            isBestSeller: true,
            rating: 4.8,
            reviewCount: 1250
          },
          {
            styleID: "16615",
            title: "Classic Crew Neck Tee",
            brandName: "Gildan",
            price: 19.99,
            styleImage: "sample-image.jpg",
            isCustomerFave: true,
            rating: 4.6,
            reviewCount: 890
          },
          {
            styleID: "16616",
            title: "Soft Blend Hoodie",
            brandName: "Champion",
            price: 39.99,
            styleImage: "sample-image.jpg",
            isStaffPick: true,
            rating: 4.9,
            reviewCount: 2100
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const handleProductClick = (styleID) => {
    router.push(`/pages/products/product-details/${styleID}`);
  };

  const generateRating = (product) => {
    if (product.rating && product.reviewCount) {
      return { rating: product.rating, reviewCount: product.reviewCount };
    }
    
    const productId = String(product?.styleID || 'default');
    const hash = productId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    const rating = 4.0 + (Math.abs(hash) % 8) / 10;
    const reviewCount = (Math.abs(hash) % 10000) + 100;
    
    return {
      rating: Math.round(rating * 10) / 10,
      reviewCount: reviewCount > 1000 ? `${Math.floor(reviewCount / 1000)}K+` : reviewCount.toString()
    };
  };

  const generateBadges = (product) => {
    const badges = [];
    if (product.isBestSeller) badges.push({ type: 'best-seller', text: 'Best Seller' });
    if (product.isCustomerFave) badges.push({ type: 'customer-fave', text: 'Customer Fave' });
    if (product.isStaffPick) badges.push({ type: 'staff-pick', text: 'Staff Pick' });
    return badges;
  };

  if (loading) {
    return (
      <section className="featured-products-section">
        <div className="featured-products-container">
          <div className="featured-products-header">
            <h2 className="featured-products-title">Featured Products</h2>
            <p className="featured-products-subtitle">Discover our most popular designs</p>
          </div>
          <div className="featured-products-grid">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="featured-product-card skeleton">
                <div className="skeleton-image"></div>
                <div className="skeleton-content">
                  <div className="skeleton-text skeleton-title"></div>
                  <div className="skeleton-text skeleton-brand"></div>
                  <div className="skeleton-text skeleton-price"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="featured-products-section">
      <div className="featured-products-container">
        <div className="featured-products-header">
          <h2 className="featured-products-title">Featured Products</h2>
          <p className="featured-products-subtitle">
            Discover our most popular designs and best-selling products
          </p>
          <Button 
            variant="outline" 
            size="medium"
            onClick={() => router.push("/pages/products")}
            className="view-all-btn"
          >
            View All Products
          </Button>
        </div>

        <div className="featured-products-grid">
          {featuredProducts.map((product, index) => {
            const rating = generateRating(product);
            const badges = generateBadges(product);
            
            return (
              <div
                key={product.styleID || index}
                className={`featured-product-card ${hoveredProduct === index ? 'hovered' : ''}`}
                onMouseEnter={() => setHoveredProduct(index)}
                onMouseLeave={() => setHoveredProduct(null)}
                onClick={() => handleProductClick(product.styleID)}
              >
                <div className="featured-product-image">
                  <Image
                    src={product.styleImage === "sample-image.jpg" ? "/image/banner-products-sa.jpg" : `https://cdn.ssactivewear.com/${product.styleImage}`}
                    alt={product.title}
                    width={300}
                    height={300}
                    className="product-image"
                    quality={75}
                  />
                  
                  {/* Product Badges */}
                  <div className="featured-product-badges">
                    {badges.map((badge, badgeIndex) => (
                      <span 
                        key={badgeIndex} 
                        className={`featured-product-badge ${badge.type}`}
                      >
                        {badge.text}
                      </span>
                    ))}
                  </div>

                  {/* Quick Actions */}
                  <div className="featured-product-actions">
                    <button 
                      className="action-btn wishlist-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add to wishlist functionality
                      }}
                      title="Add to Wishlist"
                    >
                      <FaHeart />
                    </button>
                    <button 
                      className="action-btn quick-view-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProductClick(product.styleID);
                      }}
                      title="Quick View"
                    >
                      <FaEye />
                    </button>
                    <button 
                      className="action-btn add-cart-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add to cart functionality
                      }}
                      title="Add to Cart"
                    >
                      <FaShoppingCart />
                    </button>
                  </div>
                </div>

                <div className="featured-product-content">
                  <div className="featured-product-brand">{product.brandName}</div>
                  <h3 className="featured-product-title">{product.title}</h3>
                  
                  <div className="featured-product-rating">
                    <div className="stars">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FaStar 
                          key={i} 
                          className={`star ${i < Math.floor(rating.rating) ? 'filled' : ''}`}
                        />
                      ))}
                    </div>
                    <span className="rating-text">
                      {rating.rating} ({rating.reviewCount})
                    </span>
                  </div>

                  <div className="featured-product-price">
                    <span className="current-price">${product.price}</span>
                    <span className="original-price">${(product.price * 1.2).toFixed(2)}</span>
                  </div>

                  <Button 
                    variant="primary" 
                    size="small"
                    className="featured-product-cta"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/pages/products/product-details/${product.styleID}`);
                    }}
                  >
                    Customize Now
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="featured-products-footer">
          <Button 
            variant="primary" 
            size="large"
            onClick={() => router.push("/pages/products")}
            className="explore-all-btn"
          >
            Explore All Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
