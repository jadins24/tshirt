"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { BsCheck2 } from 'react-icons/bs';
import { FaArrowRightLong } from 'react-icons/fa6';
import './TrackOrder.scss';
import { API_URL } from '@/app/services/apicofig';
import { FaBoxOpen, FaPrint, FaBox, FaTruck, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { IoSearch } from 'react-icons/io5';


const TrackOrder = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [orderStatus, setOrderStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const orderSteps = ['order_placed', 'printing', 'packed', 'shipped',  'delivered','cancelled'];

    const stepIcons = {
    order_placed: <FaBoxOpen />,
    printing: <FaPrint />,
    packed: <FaBox />,
    shipped: <FaTruck />,
    delivered: <FaCheckCircle />,
    cancelled: <FaTimesCircle />,
  };


  const handleSearch = async () => {
    if (!orderNumber.trim()) {
      setError('Please enter an order number.');
      setOrderStatus('');
      return;
    }

    setLoading(true);
    setError('');
    setOrderStatus('');

    try {
      const response = await axios.get(`${API_URL}/Order/ByOrderNo/${orderNumber}`);
      const data = response.data;

      if (data.length > 0) {
        setOrderStatus(data[0].orderStatus.toLowerCase());
      } else {
        setError('Order not found.');
      }
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('Something went wrong while fetching the order.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setOrderNumber('');
    setOrderStatus('');
    setError('');
  };

  // Index of current status to show progress
  const currentStepIndex = orderSteps.indexOf(orderStatus);
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };


  return (
    <div className="order-tracking">
      <div className="order-tracking-container">
        <div>
          <h2 className="order-title">Track Your Order</h2>

        </div>
        <div className={`track-order-input `}>
          <div>
              <IoSearch />
              <input
                 type="text"
            placeholder="Enter Order Number"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            </div>
            <div>
              {orderNumber && (
                <button className="clear-btn" onClick={handleCancel}>
                  Clear
                </button>
              )}
              <button onClick={handleSearch} className="search-btn">Search</button>

            </div>
            </div>


      </div>
   
      <div className="order-status-container">

        {loading && <p className="loading-text">Loading...</p>}
        {error && <p className="error-text">{error}</p>}

        {orderStatus && (
          <>
            <div className="order-status">
              <p className="order-id">{orderNumber}</p> 
              <p className={`current-status status-${orderStatus}`}>
                Status: {orderStatus.replace('_', ' ')}
              </p>
            </div>

            <div className="progress-bar-container">
              <div className="progress-bar">
                {orderSteps.map((step, index) => (
                  <React.Fragment key={step}>
                    <div className="bar-container">
                     <div
                        title={step.replace('_', ' ')}
                        className={`step-circle ${
                          index < currentStepIndex ? 'completed' : index === currentStepIndex ? 'current' : ''
                        } ${step === 'cancelled' ? 'cancelled' : ''}`}
                      >
                        {stepIcons[step]}
                      </div>

                      <div className="step-label">{step.replace('_', ' ')}</div>
                    </div>
                    {index < orderSteps.length - 1 && (
                      <div className={`line ${index < currentStepIndex ? 'fill' : ''}`}></div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
            
           
          </>
        )}

        </div>
    </div>
  );
};

export default TrackOrder;
