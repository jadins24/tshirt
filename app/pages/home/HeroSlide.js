"use client";
import React, { useState, useEffect, useCallback, memo } from "react";
import "./home.scss";
import { IoIosArrowDropright, IoIosArrowDropleft } from "react-icons/io";
import { FaPaintBrush } from "react-icons/fa";
import Link from "next/link";
import Button from "@/app/components/Button";
import Image from "next/image";

const HeroSlide = memo(({ sliders = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => 
      prev === sliders.length - 1 ? 0 : prev + 1
    );
  }, [sliders.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => 
      prev === 0 ? sliders.length - 1 : prev - 1
    );
  }, [sliders.length]);

  // Auto slide functionality
  useEffect(() => {
    if (sliders.length <= 1) return;
    
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [sliders.length, nextSlide]);

  return (
    <section className="hero-section">
      <div className="hero-section-container">
        {/* Navigation Buttons */}
        {sliders.length > 1 && (
          <>
            <Button 
              className="nav-button prev" 
              onClick={prevSlide}
              variant="ghost"
              size="large"
              icon={<IoIosArrowDropleft />}
              aria-label="Previous slide"
            />
            <Button 
              className="nav-button next" 
              onClick={nextSlide}
              variant="ghost"
              size="large"
              icon={<IoIosArrowDropright />}
              aria-label="Next slide"
            />
          </>
        )}

        {/* Slides */}
        <div
          className="hero-section-slides"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {sliders.length > 0 ? (
            sliders.map((slider, index) => (
              <div
                key={slider.id}
                className={`hero-section-slide ${index === currentIndex ? 'active' : ''}`}
              >
                {/* Text Section */}
                <div className="hero-section-slide-text">
                  <h1>{slider.heading}</h1>
                  <p>{slider.description}</p>

                  <div className="hero-section-slide-btns">
                    <Link href='/pages/customDesign'>
                      <Button variant="primary" size="large" className="hero-primary-btn">
                        <FaPaintBrush style={{ marginRight: '8px' }} />
                        Start Designing
                      </Button>
                    </Link>
                    <Link href='/pages/templates'>
                      <Button variant="outline" size="large" className="hero-secondary-btn">
                        Browse Templates
                      </Button>
                    </Link>
                    <Link href='/pages/products'>
                      <Button variant="ghost" size="large" className="hero-tertiary-btn">
                        Shop Products
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Image Section */}
                <div className="hero-section-slide-img">
                        <Image
                          src={slider.imageUrl}
                          alt={slider.heading || "Hero Slide Image"}
                          width={600}
                          height={400}
                          priority={index === currentIndex}
                          quality={85}
                        />
                </div>
              </div>
            ))
          ) : (
            <div className="hero-section-slide">
              <div className="hero-section-slide-text">
                <h1>Welcome to Our Store</h1>
                <p>Discover amazing products and custom designs</p>
                <div className="hero-section-slide-btns">
                  <Link href='/pages/customDesign'>
                    <Button variant="primary" size="large" className="hero-primary-btn">
                      <FaPaintBrush style={{ marginRight: '8px' }} />
                      Start Designing
                    </Button>
                  </Link>
                  <Link href='/pages/templates'>
                    <Button variant="outline" size="large" className="hero-secondary-btn">
                      Browse Templates
                    </Button>
                  </Link>
                  <Link href='/pages/products'>
                    <Button variant="ghost" size="large" className="hero-tertiary-btn">
                      Shop Products
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="hero-section-slide-img">
                <img
                  src="/default-hero.jpg"
                  alt="Default Hero"
                />
              </div>
            </div>
          )}
        </div>

        {/* Dots Indicator */}
        {sliders.length > 1 && (
          <div className="slide-dots">
            {sliders.map((_, index) => (
              <Button
                key={index}
                className={`dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(index)}
                variant="ghost"
                size="small"
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
});

HeroSlide.displayName = 'HeroSlide';

export default HeroSlide;