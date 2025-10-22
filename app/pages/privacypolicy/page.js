import React from 'react';
import './privacypolicy.scss';

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy">
      <div className="privacy-wrapper">
        <header className="policy-header">
          <h2> Privacy Policy</h2>
          <p>Your privacy matters. This policy explains what we do with your data.</p>
        </header>

        <div className="policy-container">

          <div className="policy-section">
            <div className='policy-card'>
              <h4> Information We Collect</h4>
              <ul>
                <li><strong>Personal:</strong> Name, email, phone, address, payment details</li>
                <li><strong>Non-Personal:</strong> Browser, device, IP, pages visited</li>
              </ul>
            </div>

            <div className='policy-card'>
              <h4> How We Use It</h4>
              <ul>
                <li>Order processing and delivery</li>
                <li>Improving customer experience</li>
                <li>Promotional updates (with consent)</li>
              </ul>
            </div>


            <div className='policy-card'>
              <h4> Sharing Information</h4>
              <p>We never sell your data. We may share it with:</p>
              <ul>
                <li>Payment processors and shipping partners</li>
                <li>Authorities when legally required</li>
              </ul>
            </div>
            
            <div className='policy-card'>
              <h4> Data Security</h4>
              <p>We use SSL encryption and secure servers to protect your data.</p>
            </div>


            <div className='policy-card'>
              <h4> Cookies</h4>
              <p>We use cookies to enhance the experience. You can disable them in settings.</p>
            </div>

            <div className='policy-card'>
              <h4>  Your Choices</h4>
              <p>Update or delete your info via your account or contact us directly.</p>
            </div>

            <div className='policy-card'>
              <h4>  Changes</h4>
              <p>We may update this policy from time to time. Please check this page regularly for updates.</p>
            </div>
          </div>

          <footer className="policy-footer">
            <h4> Contact Us</h4>
            <p>Have questions? Email us at <strong>KustomTee@gmail.com</strong></p>
          
          </footer>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
