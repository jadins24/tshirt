"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UserProfile.scss';
import { useSelector } from 'react-redux';
import { FaEye, FaEyeSlash, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { API_URL } from '@/app/services/apicofig';

const UserProfile = () => {
  const user = useSelector((state) => state.auth?.user || null);
  const userId = user?.id || null;
  
  const [userData, setUserData] = useState(null);
  const [errors, setErrors] = useState({});
  const [editableData, setEditableData] = useState({
    name: '',
    emailId: '',
    mobileNo: '',
    password: '',
  });
  
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      const fetchUserData = async () => {
        setIsLoading(true);
        try {
          const response = await axios.get(`${API_URL}/Users/${userId}`);
          setUserData(response.data);
          setEditableData({
            name: response.data.name,
            emailId: response.data.emailId,
            mobileNo: response.data.mobileNo,
            password: response.data.password,
          });
        } catch (error) {
          console.log("Error fetching user data:", error.response?.data || error.message);
        } finally {
          setIsLoading(false);
        }
      };

      fetchUserData();
    }
  }, [userId]);

  const validateForm = () => {
    const newErrors = {};
  
    if (!editableData.name.trim()) {
      newErrors.name = "Name is required";
    }
  
    if (!editableData.emailId.trim()) {
      newErrors.emailId = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(editableData.emailId)) {
      newErrors.emailId = "Invalid email format";
    }
  
    if (!editableData.mobileNo.trim()) {
      newErrors.mobileNo = "Mobile number is required";
    } else if (!/^\d{10}$/.test(editableData.mobileNo)) {
      newErrors.mobileNo = "Mobile number must be 10 digits";
    }
  
    if (!editableData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (editableData.password.trim().length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Only allow numbers for mobileNo field
    if (name === 'mobileNo') {
      const numbersOnly = value.replace(/[^0-9]/g, '');
      setEditableData((prevData) => ({
        ...prevData,
        [name]: numbersOnly,
      }));
    } else {
      setEditableData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }

    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  const handleKeyPress = (e) => {
    // Prevent non-numeric input for mobile number
    if (e.target.name === 'mobileNo') {
      if (!/[0-9]/.test(e.key)) {
        e.preventDefault();
      }
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  const handleEdit = () => {
    setIsEditable(true);
  };

  const handleSave = async () => {
    if (!validateForm()) return;
  
    setIsLoading(true);
    const updatedUserData = {
      id: userId,
      name: editableData.name,
      emailId: editableData.emailId,
      mobileNo: editableData.mobileNo,
      password: editableData.password,
      roleId: userData.roleId,
      otp: userData.otp,
      activeStatus: userData.activeStatus,
      createdDate: userData.createdDate,
    };
  
    try {
      await axios.put(`${API_URL}/Users/${userId}`, updatedUserData);
      alert('Profile updated successfully!');
      setIsEditable(false);
      setErrors({});
    } catch (error) {
      console.log('Error updating user data:', error.response?.data || error.message);
      alert('Error updating profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditableData({
      name: userData.name,
      emailId: userData.emailId,
      mobileNo: userData.mobileNo,
      password: userData.password,
    });
    setErrors({});
    setIsEditable(false);
  };

  if (isLoading && !userData) {
    return (
      <div className="user-profiles">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="user-profiles">
      <div className="profile-header">
        <div className="header-content">
          <h2>User Profile</h2>
          <p>Manage your personal information</p>
        </div>
        {!isEditable && (
          <button onClick={handleEdit} className="edit-button">
            <FaEdit className="button-icon" />
            Edit Profile
          </button>
        )}
      </div>
  
      {userData && (
        <div className="profile-content">
          <div className="form-section">
            <div className="form-row">
              {/* Name */}
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={editableData.name}
                  onChange={handleChange}
                  className={`input-field ${errors.name ? 'error' : ''} ${!isEditable ? 'read-only' : ''}`}
                  readOnly={!isEditable}
                  maxLength={40}
                  placeholder="Enter your full name"
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>
  
              {/* Email */}
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="emailId"
                  value={editableData.emailId}
                  onChange={handleChange}
                  className={`input-field ${errors.emailId ? 'error' : ''} ${!isEditable ? 'read-only' : ''}`}
                  readOnly={!isEditable}
                  maxLength={40}
                  placeholder="Enter your email"
                />
                {errors.emailId && <span className="error-text">{errors.emailId}</span>}
              </div>
            </div>
  
            <div className="form-row">
              {/* Mobile */}
              <div className="form-group">
                <label>Mobile Number</label>
                <input
                  type="text"
                  name="mobileNo"
                  value={editableData.mobileNo}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className={`input-field ${errors.mobileNo ? 'error' : ''} ${!isEditable ? 'read-only' : ''}`}
                  readOnly={!isEditable}
                  maxLength={10}
                  placeholder="Enter 10-digit mobile number"
                />
                {errors.mobileNo && <span className="error-text">{errors.mobileNo}</span>}
              </div>
  
              {/* Password */}
              <div className="form-group password-field">
                <label>Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={passwordVisible ? 'text' : 'password'}
                    name="password"
                    value={editableData.password}
                    onChange={handleChange}
                    className={`input-field password-input ${errors.password ? 'error' : ''} ${!isEditable ? 'read-only' : ''}`}
                    readOnly={!isEditable}
                    maxLength={20}
                    placeholder="Enter your password"
                  />
                  {isEditable && (
                    <button 
                      type="button" 
                      onClick={togglePasswordVisibility} 
                      className="eye-icon"
                      tabIndex={-1}
                    >
                      {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  )}
                </div>
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>
            </div>
          </div>
  
          {isEditable && (
            <div className="action-buttons">
              <button 
                onClick={handleCancel} 
                className="cancel-button"
                disabled={isLoading}
              >
                <FaTimes className="button-icon" />
                Cancel
              </button>
              <button 
                onClick={handleSave} 
                className="save-button"
                disabled={isLoading}
              >
                <FaSave className="button-icon" />
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserProfile;