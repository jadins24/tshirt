"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "./home.scss";
import { FaPlay, FaCheckCircle, FaUsers, FaAward, FaClock, FaShieldAlt } from "react-icons/fa";
import Button from "@/app/components/Button";

const WhyChooseUs = () => {
  const router = useRouter();
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: <FaCheckCircle />,
      title: "Premium Quality",
      description: "100% cotton materials with professional printing techniques",
      stats: "50,000+ Happy Customers"
    },
    {
      icon: <FaClock />,
      title: "Fast Turnaround",
      description: "Quick production and shipping to get your orders fast",
      stats: "3-5 Business Days"
    },
    {
      icon: <FaShieldAlt />,
      title: "Quality Guarantee",
      description: "30-day satisfaction guarantee on all our products",
      stats: "100% Satisfaction"
    },
    {
      icon: <FaUsers />,
      title: "Expert Support",
      description: "Dedicated customer support team to help with your designs",
      stats: "24/7 Support"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Small Business Owner",
      content: "The quality is amazing! My customers love the custom designs.",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Event Organizer",
      content: "Fast delivery and excellent quality. Perfect for our events.",
      rating: 5
    },
    {
      name: "Emily Davis",
      role: "Designer",
      content: "The design tool is intuitive and the results are professional.",
      rating: 5
    }
  ];

  return (
    <section className="why-choose-us-section">
      <div className="why-choose-us-container">
        <div className="why-choose-us-header">
          <h2 className="why-choose-us-title">Why Choose KustomTee?</h2>
          <p className="why-choose-us-subtitle">
            We're committed to delivering the best custom apparel experience
          </p>
        </div>

        <div className="why-choose-us-content">
          <div className="features-grid">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`feature-card ${activeFeature === index ? 'active' : ''}`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
                <div className="feature-stats">{feature.stats}</div>
              </div>
            ))}
          </div>

          <div className="testimonials-section">
            <h3 className="testimonials-title">What Our Customers Say</h3>
            <div className="testimonials-grid">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="testimonial-card">
                  <div className="testimonial-rating">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <FaAward key={i} className="star-icon" />
                    ))}
                  </div>
                  <p className="testimonial-content">"{testimonial.content}"</p>
                  <div className="testimonial-author">
                    <strong>{testimonial.name}</strong>
                    <span>{testimonial.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="why-choose-us-cta">
          <div className="cta-content">
            <h3 className="cta-title">Ready to Create Something Amazing?</h3>
            <p className="cta-subtitle">
              Join thousands of satisfied customers and start designing today
            </p>
            <div className="cta-buttons">
              <Button 
                variant="primary" 
                size="large"
                onClick={() => router.push("/pages/customDesign")}
                className="cta-primary-btn"
              >
                Start Designing
              </Button>
              <Button 
                variant="outline" 
                size="large"
                onClick={() => router.push("/pages/templates")}
                className="cta-secondary-btn"
              >
                Browse Templates
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
