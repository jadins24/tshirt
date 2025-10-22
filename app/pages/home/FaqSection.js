"use client";
import React, { useState, useEffect } from "react";
import "./home.scss";
import { TiPlus, TiMinus } from "react-icons/ti";

const FaqSection = ({ faqDatas: incomingFaqData }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [faqData, setFaqData] = useState([]);

  useEffect(() => {
    if (Array.isArray(incomingFaqData)) {
      const startIndex = incomingFaqData.length > 5 ? incomingFaqData.length - 5 : 0;
      const latestFive = incomingFaqData.slice(startIndex);
      setFaqData(latestFive);
    }
  }, [incomingFaqData]);

  const handleQuestionClick = (index) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <section className="faq-section">
      <div className="faq-container">
        <div className="faq-content">
          {/* Header Section */}
          <div className="faq-header">
            <span className="faq-badge">FAQ</span>
            <h1 className="faq-title">Answers to Your Questions</h1>
            <p className="faq-subtitle">
              Find quick answers to the most common questions about our services and products
            </p>
          </div>

          {/* FAQ Items */}
          <div className="faq-items">
            {faqData.map((faq, index) => (
              <div 
                key={faq.id} 
                className={`faq-item ${activeIndex === index ? "active" : ""}`}
              >
                <div
                  className="faq-question"
                  onClick={() => handleQuestionClick(index)}
                >
                  <div className="question-content">
                    <div className="question-number">0{index + 1}</div>
                    <h3 className="question-text">{faq.question}</h3>
                  </div>
                  <div className={`faq-icon ${activeIndex === index ? "active" : ""}`}>
                    {activeIndex === index ? (
                      <TiMinus className="icon" />
                    ) : (
                      <TiPlus className="icon" />
                    )}
                  </div>
                </div>
                
                <div className={`faq-answer ${activeIndex === index ? "show" : ""}`}>
                  <div className="answer-content">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          {/* <div className="faq-cta">
            <p>Still have questions?</p>
            <button className="cta-button">Contact Support</button>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;