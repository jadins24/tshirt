"use client";

import React, { useState, useEffect } from "react";
import "./faq.scss";
import { TiPlus, TiMinus } from "react-icons/ti";
import { fetchAllFAQs } from "@/app/services/apicofig";


const faq = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [faqData, setFaqData] = useState([]);

  useEffect(() => {
    const getFAQs = async () => {
      const data = await fetchAllFAQs();
      
      const startIndex = data.length > 5 ? data.length - 5 : 0;
      const latestFive = data.slice(startIndex);

      setFaqData(latestFive);
    };

    getFAQs();
  }, []);

  const handleQuestionClick = (index) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <section className="faq-section">
      <div className="faq-container">
        <div className="faq-row">
          <div className="faq-head">
            <p>Faq</p>
            <h1>Answer to your questions</h1>
          </div>
          <div className="faq-all">
            {faqData.map((faq, index) => (
              <div key={faq.id} className="faq">
                <div
                  className="faq-question"
                  onClick={() => handleQuestionClick(index)}
                >
                  <h2>{faq.question}</h2>
                  <div className={`faq-icon ${activeIndex === index ? "rotate" : ""}`}>
                    {activeIndex === index ? <TiMinus /> : <TiPlus />}
                  </div>
                </div>
                {activeIndex === index && (
                  <div className="faq-answer show">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default faq;
