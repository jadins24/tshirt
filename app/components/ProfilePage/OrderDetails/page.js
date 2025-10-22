"use client";

export const dynamic = "force-dynamic";
export const ssr = false;

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import './OrderDetails.scss';
import { API_URL } from "@/app/services/apicofig";
import Pagination from "@/app/utils/Pagenation/Pagenation";
import { useRouter } from 'next/navigation';
import ViewDetails from "../ViewDetails/page";

const OrderDetails = ({onViewDetails}) => {
  const router = useRouter();

  const user = useSelector((state) => state.auth?.user || null);
  const userId = user?.id || null;

  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const productPerPage = 12;

 const [selectedOrderId, setSelectedOrderId] = useState(null); 

  const [statusFilter, setStatusFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [statusOptions, setStatusOptions] = useState([]);

  const fetchOrders = async () => {
      try {
        const filters = {
          userId: userId, 
          statusId: statusFilter || null,
          startDate: startDate ? new Date(startDate).toISOString() : null,
          endDate: endDate ? new Date(endDate).toISOString() : null,
        };

        // Build query parameters
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            params.append(key, value);
          }
        });

        const response = await axios.get(`${API_URL}/Order/Filter`, { params });
        setOrders(response.data || []);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

  // Initial fetch and fetch when filters change
  useEffect(() => {
    fetchOrders();
  }, [statusFilter, startDate, endDate]);

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const response = await axios.get(`${API_URL}/OrderStatus/list`);
        setStatusOptions(response.data || []);
      } catch (error) {
        console.error("Failed to fetch statuses:", error);
      }
    };

    fetchStatuses();
  }, []);

  
  const handleStatusFilterChange = (e) => setStatusFilter(e.target.value);
  const handleStartDateChange = (e) => setStartDate(e.target.value);
  const handleEndDateChange = (e) => setEndDate(e.target.value);

  const handleApplyFilters = () => {
    
    setCurrentPage(0);
    fetchOrders();
  };
  
  const handleClearFilters = () => {
 
  setStatusFilter("");
  setStartDate("");
  setEndDate("");
};

const formatStatusLabel = (statusName) => {
  if (!statusName) return "";

  return statusName
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

  const offset = currentPage * productPerPage;
  const currentOrders = orders.slice(offset, offset + productPerPage);
  const pageCount = Math.ceil(orders.length / productPerPage);

  const handleViewDetails = (id) => {
    setSelectedOrderId(id);
    console.log("Order Details Order id",id);
  };

   if (selectedOrderId) {
    return <ViewDetails id={selectedOrderId} goBack={() => setSelectedOrderId(null)} />; 
  }

  return (
    <div className="orderhistory-page">
      <div className="orderhistory-container">
        <div className="orderhistory-header">
          <div className="box-container">
            <h2 className="orderhistory-head">Your Orders</h2>
          </div>

              <div className="table-filters">
                <div className="dropdown-filters">
                
                  <select
                    value={statusFilter}
                    onChange={handleStatusFilterChange}
                    className="status-filter-dropdown"
                  >
                    <option value="">All Statuses</option>
                    {statusOptions.map((status) => (
                      <option key={status.id} value={status.id}>
                         {formatStatusLabel(status.statusName)}
                      </option>
                    ))}
                  </select>

                  <div className="dropdown-label">
                    {/* <label>Start Date</label> */}
                    <input
                      type="date"
                      value={startDate}
                      onChange={handleStartDateChange}
                    />
                  </div>

                  <div className="dropdown-label">
                  {/* <label>End Date</label> */}
                    <input
                      type="date"
                      value={endDate}
                      min={startDate}
                      onChange={handleEndDateChange}
                    />  
                  </div>

                  {/* <button onClick={handleApplyFilters} className="s-btn">Search</button> */}
                  <button onClick={handleClearFilters} className="clear-btn">Clear</button>

                </div>

              </div>
        </div>

        {/* Orders List */}
        <div className="orderhistory-list">
          {orders.length === 0 ? (
            <p className="no-orders">No orders found.</p>
          ) : (
            currentOrders.map((order) => (
             
                <div
                  className="orderhistory-card"
                   onClick={() => handleViewDetails(order.id)}
                  style={{ cursor: 'pointer' }}
                  key={order.id}
                >

                  <div className="orderhistory-info">
                    <div className="order-top-row">
                      <p className='order-product'>{order.orderNumber}</p>
                     
                     <p className={`order-status ${order.orderStatus ? order.orderStatus.toLowerCase() : 'unknown'}`}>
                      {order.orderStatus ? formatStatusLabel(order.orderStatus) : 'Unknown'}
                    </p>

                    </div>

                    <p className="order-description">Total Price: <span className="strong-text">₹{order.totalPrice}</span></p>
                    <p className="order-description">
                      Payment Status: <span className="strong-text">{formatStatusLabel(order.paymentStatus)}</span>
                    </p>
                  
                  </div>
                </div>
            
            ))
          )}
        </div>
        <Pagination
            pageCount={pageCount}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
      </div> 
      
    </div>
  );
};

export default OrderDetails;
