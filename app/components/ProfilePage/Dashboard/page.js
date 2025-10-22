"use client";

import React, { useEffect, useState } from 'react';
import { FaClipboardList, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import './Dashboard.scss';
import axios from "axios";
import { useSelector } from "react-redux";
import { API_URL } from '@/app/services/apicofig';

const Dashboard = () => {

  const user = useSelector((state) => state.auth?.user || null);
   const userId = user?.id || null;

  const [stats, setStats] = useState({
    totalOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);

      try {
           const response = await axios.get(`${API_URL}/Dashboard/UserOrderStats`,{
          params: { userId: userId, period: 'year' },
        });
        const data = response.data;
        setStats({
          totalOrders: data.totalOrders,
          deliveredOrders: data.deliveredOrders,
          cancelledOrders: data.cancelledOrders,
        });
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div>Loading dashboard stats...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="cards-grid-container">
          <div className="stats-cards-column">
            {/* Total Orders */}
            <div className="stats-card">
              <div className="card-top">
                <div className="icon-container">
                  <FaClipboardList />
                </div>
                <h4 className="card-title">Total Orders</h4>
              </div>
              <p className="count">{stats.totalOrders}</p>
            </div>

            {/* Delivered Orders */}
            <div className="stats-card">
              <div className="card-top">
                <div className="icon-container">
                  <FaCheckCircle />
                </div>
                <h4 className="card-title">Delivered Orders</h4>
              </div>
              <p className="count">{stats.deliveredOrders}</p>
            </div>

            {/* Cancelled Orders */}
            <div className="stats-card">
              <div className="card-top">
                <div className="icon-container">
                  <FaTimesCircle />
                </div>
                <h4 className="card-title">Cancelled Orders</h4>
              </div>
              <p className="count">{stats.cancelledOrders}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
