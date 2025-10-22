"use client"; 
import React, { useState } from "react";
import "./home.scss";
import { useRouter } from "next/navigation";

const collections = [
  {
    title: "Mens & Unisex",
    image: "/image/tshirt1.jpg",
    tags: ["Sleeve", "Sleeveless", "Full Sleeve", "Hooded"],
    description: "Explore our top Mens & Unisex styles with exclusive fabrics.",
  },
  {
    title: "Womens",
    image: "/image/tshirt2.jpg",
    tags: ["V Neck", "100% Cotton", "Sleeveless"],
    description: "Discover feminine fits made for comfort and style.",
  },
  {
    title: "Unisex",
    image: "/image/tshirt8.jpg",
    tags: ["Hooded", "Full Sleeve", "100% Cotton"],
    description: "Gender-neutral styles that fit everyone.",
  },
];

const CollectionGrid = () => {
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState(null);

  const handleDiscover = (type) => {
    router.push(`/pages/products?type=${encodeURIComponent(type)}`);
  };

  const handleMouseEnter = (index) => {
    setHoveredCard(index);
  };

  const handleMouseLeave = () => {
    setHoveredCard(null);
  };

  return (
    <section className="collections-section">
      <div className="collections-header">
        <h2 className="collections-title">Featured Collections</h2>
        <p className="collections-subtitle">
          Dare to mix and match! Check our collections to level up your fashion game
        </p>
      </div>
      
      <div className="collections-grid">
        {collections.map(({ title, image, tags, description }, index) => (
          <div
            key={title}
            className={`collection-card ${hoveredCard === index ? 'hovered' : ''}`}
            style={{ backgroundImage: `url(${image})` }}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="collection-overlay">
              {/* Default State - Only Title */}
              <div className="collection-default">
                <h3 className="collection-card-title">{title}</h3>
              </div>

              {/* Hover State - Full Details */}
              <div className="collection-details">
                <h3 className="collection-card-title">{title}</h3>
                <p className="collection-description">{description}</p>
                <ul className="collection-tags">
                  {tags.map((tag, i) => (
                    <li key={i} className="collection-tag">{tag}</li>
                  ))}
                </ul>
                <button 
                  className="collection-btn"
                  onClick={() => handleDiscover(title)}
                >
                  Discover
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CollectionGrid;