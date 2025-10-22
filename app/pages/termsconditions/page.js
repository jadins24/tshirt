import React from 'react';
import './termsconditions.scss';

const TermsAndConditions = () => {
  return (
    <div className="terms-and-conditions">
      <div className="terms-wrapper">
        <header className="terms-header">
          <h2> Terms and Conditions</h2>
          <p>By accessing or using our website, you agree to comply with the following terms.</p>
        </header>

        <div className="terms-container">
          <div className="terms-section">

            <div className="terms-card">
              <h4> Use of Website</h4>
              <p>You agree to use this site only for lawful purposes. You must not use it in any way that breaches applicable laws or regulations.</p>
            </div>

            <div className="terms-card">
              <h4> Products and Orders</h4>
              <ul>
                <li>All orders are subject to availability and price confirmation.</li>
                <li>We may cancel orders due to stock, errors, or suspicious activity.</li>
              </ul>
            </div>

            <div className="terms-card">
              <h4> Pricing and Payments</h4>
              <p>Prices are in your local currency and include taxes. We accept secure payments through trusted third-party gateways.</p>
            </div>

            <div className="terms-card">
              <h4> Shipping and Delivery</h4>
              <p>Delivery times vary by location. We aren't liable for courier delays or external issues.</p>
            </div>

            <div className="terms-card">
              <h4> Returns and Refunds</h4>
              <ul>
                <li>Returns/exchanges allowed within 7 days of delivery.</li>
                <li>Items must be unused, original, and tagged.</li>
                <li>Refunds go to your original payment method after inspection.</li>
              </ul>
            </div>

            <div className="terms-card">
              <h4> Intellectual Property</h4>
              <p>All content (text, designs, images) belongs to our store. You may not reuse it without permission.</p>
            </div>

            <div className="terms-card">
              <h4> Limitation of Liability</h4>
              <p>We aren't responsible for any indirect or incidental damages from using our website or products.</p>
            </div>

            <div className="terms-card">
              <h4> Changes to Terms</h4>
              <p>We may update these terms at any time. Please check back regularly for updates.</p>
            </div>

            <div className="terms-card">
              <h4> Contact Us</h4>
              <p>Have questions? Reach us at <strong>KustomTee@gmail.com</strong></p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
