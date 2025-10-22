"use client";
import React, { useState, useEffect } from "react";
import "./home.scss";
import { LuArrowLeft, LuArrowRight } from "react-icons/lu";
import { FaStar, FaQuoteLeft } from "react-icons/fa";

const TestimoniesSection = ({ testimonies }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Set client-side flag
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Auto slide every 5 seconds
  useEffect(() => {
    if (!isClient) return;
    
    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, isClient]);

  const handleNext = () => {
    if (isTransitioning || !isClient) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonies.length);
  };

  const handlePrev = () => {
    if (isTransitioning || !isClient) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonies.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    if (isTransitioning || !isClient) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
  };

  const handleTransitionEnd = () => {
    setIsTransitioning(false);
  };

  // Generate consistent ratings based on testimonial index (not random)
  const getRating = (index) => {
    // Consistent ratings: 5 stars for even indices, 4 stars for odd indices
    return index % 2 === 0 ? 5 : 4;
  };

  // Don't render until client-side to avoid hydration mismatch
  if (!isClient) {
    return (
      <section className="testimonies-section">
        <div className="testimonies-container">
          <div className="testimonies-header">
            <div className="testimonies-head">
              <span className="testimonies-badge">Testimonials</span>
              <h2 className="testimonies-title">What Our Customers Are Saying</h2>
              <p className="testimonies-subtitle">
                Discover why thousands of customers trust us for their custom design needs
              </p>
            </div>
          </div>
          <div className="testimonies-slider-container">
            <div className="testimonies-slider">
              {/* Loading placeholder */}
              <div className="testimonial-item">
                <div className="testimonial-content">
                  <p>Loading testimonials...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="testimonies-section">
      <div className="testimonies-container">
        {/* Header Section */}
        <div className="testimonies-header">
          <div className="testimonies-head">
            <span className="testimonies-badge">Testimonials</span>
            <h2 className="testimonies-title">What Our Customers Are Saying</h2>
            <p className="testimonies-subtitle">
              Discover why thousands of customers trust us for their custom design needs
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="testimonies-controls">
            <button 
              className="testimonies-btn prev-btn" 
              onClick={handlePrev}
              aria-label="Previous testimonial"
            >
              <LuArrowLeft />
            </button>
            <button 
              className="testimonies-btn next-btn" 
              onClick={handleNext}
              aria-label="Next testimonial"
            >
              <LuArrowRight />
            </button>
          </div>
        </div>

        {/* Testimonials Slider */}
        <div className="testimonies-slider-container">
          <div
            className="testimonies-slider"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
              transition: isTransitioning ? "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)" : "none",
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {testimonies.map((testimonial, index) => (
              <div key={testimonial.id || index} className="testimonial-item">
                {/* Quote Icon */}
                <div className="testimonial-quote-icon">
                  <FaQuoteLeft />
                </div>

                {/* Rating Stars - Only render when client-side */}
                <div className="testimonial-rating">
                  {[...Array(5)].map((_, starIndex) => (
                    <FaStar
                      key={starIndex}
                      className={`star ${
                        starIndex < getRating(index) ? "filled" : "empty"
                      }`}
                    />
                  ))}
                </div>

                {/* Testimonial Text */}
                <div className="testimonial-content">
                  <p className="testimonial-text">{testimonial.description}</p>
                </div>

                {/* Customer Info */}
                <div className="testimonial-author">
                  <div className="author-avatar">
                    <img
                      src={testimonial.imageUrl || "/default-avatar.jpg"}
                      alt={testimonial.name}
                      className="author-image"
                    />
                  </div>
                  <div className="author-info">
                    <h4 className="author-name">{testimonial.name}</h4>
                    <p className="author-role">Happy Customer</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Dots */}
        <div className="testimonies-dots">
          {testimonies.map((_, index) => (
            <button
              key={index}
              className={`testimonies-dot ${currentIndex === index ? "active" : ""}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to testimonial ${index + 1}`}
            >
              <span className="dot-progress"></span>
            </button>
          ))}
        </div>

        {/* Stats Section */}
        <div className="testimonies-stats">
          <div className="stat-item">
            <div className="stat-number">500+</div>
            <div className="stat-label">Happy Customers</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">4.9/5</div>
            <div className="stat-label">Average Rating</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">98%</div>
            <div className="stat-label">Recommend Us</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimoniesSection;