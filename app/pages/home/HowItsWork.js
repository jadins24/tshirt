"use client";
import React, { useState, useEffect } from "react";
import "./home.scss";

const HowItWorks = ({ stepsData }) => {
  const [activeStep, setActiveStep] = useState(
    stepsData.find((step) => step.activeStatus)?.id || 0
  );

  useEffect(() => {
    const sortedSteps = stepsData.sort((a, b) => a.displayOrder - b.displayOrder);

    const interval = setInterval(() => {
      setActiveStep((prevStep) => {
        const currentIndex = sortedSteps.findIndex((step) => step.id === prevStep);
        const nextIndex = (currentIndex + 1) % sortedSteps.length;
        return sortedSteps[nextIndex].id;
      });
    }, 4000); // Increased to 4 seconds for better user experience

    return () => clearInterval(interval);
  }, [stepsData]);

  const sortedSteps = stepsData.sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <section className="how-section">
      <div className="how-section-container">
        <div className="how-section-header">
          <h1 className="how-section-title">How It Works</h1>
          <p className="how-section-subtitle">Simple steps to get your custom designs</p>
        </div>
        
        <div className="how-section-content">
          {/* Steps Navigation */}
          <div className="steps-navigation">
            <div className="steps-track">
              {sortedSteps.map((step, index) => (
                <div
                  key={step.id}
                  className={`step-item ${activeStep === step.id ? "active" : ""}`}
                  onClick={() => setActiveStep(step.id)}
                >
                  <div className="step-indicator">
                    <div className="step-number">{index + 1}</div>
                    <div className="step-progress">
                      <div className="progress-bar"></div>
                    </div>
                  </div>
                  <div className="step-content">
                    <h3 className="step-title">{step.heading}</h3>
                    <p className="step-description">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Display */}
          <div className="visual-display">
            <div className="image-container">
              {sortedSteps.map((step) => (
                <div
                  key={step.id}
                  className={`step-image ${activeStep === step.id ? "active" : ""}`}
                >
                  <img 
                    src={step.imageUrl} 
                    alt={step.heading} 
                    className="step-visual"
                  />
                  <div className="image-overlay">
                    <span className="step-badge">Step {sortedSteps.findIndex(s => s.id === step.id) + 1}</span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Navigation Dots */}
            <div className="step-dots">
              {sortedSteps.map((step, index) => (
                <button
                  key={step.id}
                  className={`step-dot ${activeStep === step.id ? "active" : ""}`}
                  onClick={() => setActiveStep(step.id)}
                  aria-label={`Go to step ${index + 1}`}
                >
                  <span>{index + 1}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;