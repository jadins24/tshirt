"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "./home.scss";
import { FaPaintBrush, FaTshirt, FaMagic, FaRocket } from "react-icons/fa";
import Button from "@/app/components/Button";

const QuickDesignSection = () => {
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState(null);

  const quickDesignOptions = [
    {
      id: 1,
      title: "Start from Scratch",
      description: "Create your unique design with our powerful design tool",
      icon: <FaPaintBrush />,
      color: "primary",
      action: () => router.push("/pages/customDesign"),
      features: ["Custom Graphics", "Text Editor", "Color Palette", "Layers"]
    },
    {
      id: 2,
      title: "Choose Template",
      description: "Browse our collection of professional templates",
      icon: <FaTshirt />,
      color: "secondary",
      action: () => router.push("/pages/templates"),
      features: ["1000+ Templates", "Categories", "Trending Designs", "Easy Customization"]
    },
    {
      id: 3,
      title: "AI Design Assistant",
      description: "Let AI help you create amazing designs",
      icon: <FaMagic />,
      color: "accent",
      action: () => router.push("/pages/customDesign?ai=true"),
      features: ["Smart Suggestions", "Auto Layout", "Style Transfer", "Quick Generation"]
    },
    {
      id: 4,
      title: "Express Design",
      description: "Quick design with pre-made elements",
      icon: <FaRocket />,
      color: "success",
      action: () => router.push("/pages/customDesign?express=true"),
      features: ["Pre-made Elements", "Quick Text", "Logo Upload", "Fast Preview"]
    }
  ];

  return (
    <section className="quick-design-section">
      <div className="quick-design-container">
        <div className="quick-design-header">
          <h2 className="quick-design-title">Start Designing Today</h2>
          <p className="quick-design-subtitle">
            Choose your preferred way to create amazing custom designs
          </p>
        </div>

        <div className="quick-design-grid">
          {quickDesignOptions.map((option, index) => (
            <div
              key={option.id}
              className={`quick-design-card ${hoveredCard === index ? 'hovered' : ''} ${option.color}`}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={option.action}
            >
              <div className="quick-design-card-content">
                <div className="quick-design-icon">
                  {option.icon}
                </div>
                <h3 className="quick-design-card-title">{option.title}</h3>
                <p className="quick-design-card-description">{option.description}</p>
                
                <div className="quick-design-features">
                  {option.features.map((feature, i) => (
                    <span key={i} className="quick-design-feature">
                      ✓ {feature}
                    </span>
                  ))}
                </div>

                <Button 
                  variant="primary" 
                  size="medium"
                  className="quick-design-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    option.action();
                  }}
                >
                  Get Started
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="quick-design-cta">
          <p className="quick-design-cta-text">
            Not sure where to start? 
            <Button 
              variant="link" 
              onClick={() => router.push("/pages/templates")}
              className="quick-design-link"
            >
              Browse our templates
            </Button>
          </p>
        </div>
      </div>
    </section>
  );
};

export default QuickDesignSection;
