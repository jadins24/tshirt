"use client";

import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import './ProfilePage.scss';

import Dashboard from './Dashboard/page';
import OrderDetails from './OrderDetails/page';
import TrackOrder from './TrackOrder/page';
import UserProfile from './UserProfile/page';
import Mydesigns from './MyDesigns/page';


import { LuLayoutDashboard } from "react-icons/lu";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { FaUserCircle, FaBoxOpen, FaShippingFast, FaPaintBrush, FaBars } from 'react-icons/fa';
import ViewOrder from './ViewDetails/page';

const ProfilePage = () => {
  const router = useRouter();
  
 const isAuthenticated = useSelector(state => state.auth?.isAuthenticated);
  console.log("Authenticated status for Dashboaed Open :", isAuthenticated);

  const user = useSelector(state => state.auth.user);
  console.log("user Id",user);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('userProfile'); 
 const [selectedOrderId, setSelectedOrderId] = useState(null);

  const activeSections = useSelector((state) => state.search.activeSection);
  console.log(activeSections);
 
  useEffect(() => {
    if (activeSections) {
      setActiveSection(activeSections);
      
    }
  }, [activeSections]);

  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);
  
  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push("/pages/login");
    }
  }, [isHydrated, isAuthenticated, router]);


  if (isAuthenticated === null) {
    return <div>Redirecting...</div>;
  }

 const toggleSidebar = () => {
  setIsSidebarOpen(!isSidebarOpen);
 };


const handleSectionChange = (section) => {
  setActiveSection(section);

  // Close sidebar on small screens
  if (window.innerWidth <= 854) {
    setIsSidebarOpen(false);
  }
};
  

  const handleNavigateOrder = (section, order = null) => {
    setActiveSection(section);
    if (order) {
      setSelectedOrderId(order);
    }
  };

  return (
   <div className="profile">
   <div className='profile-page-head'>
<div>
  <h1>My Account</h1>
</div>
   </div>
        <div className="profile-container">

            {/* Sidebar */}

            <div className={`profile-sidenav ${isSidebarOpen ? 'open' : 'closed'}`}>
                <div className="menu" onClick={toggleSidebar}>
                <IoIosCloseCircleOutline />
                </div>

                <div className="sideNav-lists">
                    {/* <div className={`sideNav-list ${activeSection === 'dashboard' ? 'active' : ''}`} 
                            onClick={() => handleSectionChange('dashboard')}>
                            <LuLayoutDashboard /><p>Dashboard </p>
                    </div> */}

                    <div className={`sideNav-list ${activeSection === 'userProfile' ? 'active' : ''}`} 
                            onClick={() => handleSectionChange('userProfile')}>
                            <FaUserCircle /><p>User Profile</p>
                    </div>
                    <div className={`sideNav-list ${activeSection === 'orderDetails' ? 'active' : ''}`} 
                            onClick={() => handleSectionChange('orderDetails')}>
                            <FaBoxOpen /><p>Order Details</p>
                    </div>
                    <div className={`sideNav-list ${activeSection === 'trackOrder' ? 'active' : ''}`} 
                            onClick={() => handleSectionChange('trackOrder')}>
                            <FaShippingFast /><p>Track Order </p>
                    </div>

                    <div className={`sideNav-list ${activeSection === 'myDesigns' ? 'active' : ''}`} 
                            onClick={() => handleSectionChange('myDesigns')}>
                            <FaPaintBrush /><p>My Designs</p>
                    </div>
                 
                </div>
            </div>
            
            {/* Content Area */}
            <div className="profile-content">
                <div className="profile-head">
                <div className="menu" onClick={toggleSidebar}>
                        <FaBars />
                    </div>
                    <div className="text">
                        <h2>Dashboard</h2>
                    </div>
                </div>
                
                <div className="main-content">

                      {activeSection === 'dashboard' && (
                      <>
                        <Dashboard />
                      </>
                        )}

                      {activeSection === "userProfile" && 
                      <UserProfile/>}

                
                      {activeSection === "orderDetails" && (
                        selectedOrderId ? (
                          <ViewDetails id={selectedOrderId}  />
                        ) : (
                          <OrderDetails onViewDetails={setSelectedOrderId} />
                        )
                      )}

                      {activeSection === "trackOrder" && (
                        <TrackOrder />
                      )}

                      {activeSection === "myDesigns" && (
                        <Mydesigns />
                      )}

                    </div>
            </div>
        </div>
    </div>
  );
};

export default ProfilePage;
