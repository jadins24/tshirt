"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from 'next/navigation';
import { setAuthState } from "@/app/redux/slice/authSlice";
import { setLoading } from "@/app/redux/slice/loadingSlice";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { CiCircleChevLeft } from "react-icons/ci";
import Link from "next/link"; 
import "./signin.scss";
import { API_URL } from "@/app/services/apicofig";

const SignIn = () => {
  const [formData, setFormData] = useState({
    name: "",
    emailId: "",
    mobileNo: "",
    password: "",
    confirmPassword: ""
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [error, setError] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const validateInputs = () => {
    const newErrors = {};

    // Required field validation
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.emailId.trim()) newErrors.emailId = "Email is required";
    if (!formData.mobileNo.trim()) newErrors.mobileNo = "Mobile number is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password";

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.emailId && !emailRegex.test(formData.emailId)) {
      newErrors.emailId = "Please enter a valid email address";
    }

    // Mobile validation
    const mobileRegex = /^[0-9]{10}$/;
    if (formData.mobileNo && !mobileRegex.test(formData.mobileNo)) {
      newErrors.mobileNo = "Mobile number must be exactly 10 digits";
    }

    // Password validation
    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Confirm password validation
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    
    if (!validateInputs() || isSubmitting) return;

    setIsSubmitting(true);
    dispatch(setLoading(true));

    try {
      const response = await fetch(`${API_URL}/Users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          emailId: formData.emailId.trim(),
          mobileNo: formData.mobileNo.trim(),
          roleId: 3,
          otp: "1234",
          password: formData.password,
          activeStatus: true,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        dispatch(setAuthState({ user: data, isAuthenticated: true }));
        
        // Clear form
        setFormData({
          name: "",
          emailId: "",
          mobileNo: "",
          password: "",
          confirmPassword: ""
        });

        // Redirect logic
        const referrer = document.referrer;
        const disallowedPaths = ["/login", "/signin"];

        if (referrer) {
          const refPath = new URL(referrer).pathname;
          if (disallowedPaths.includes(refPath)) {
            router.push("/");
          } else {
            router.back();
          }
        } else {
          router.push("/");
        }

      } else if (response.status === 400) {
        const errorMessage = await response.text();
        if (errorMessage.includes("Email already in use")) {
          setError({ emailId: "Email already in use. Please use a different email." });
        } else {
          setError({ general: errorMessage });
        }
      } else {
        setError({ general: "Something went wrong. Please try again." });
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError({ general: "Network error. Please try again later." });
    } finally {
      setIsSubmitting(false);
      dispatch(setLoading(false));
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (error[field] || error.general) {
      setError(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        delete newErrors.general;
        return newErrors;
      });
    }
  };

  const handleBackClick = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <div className="signin">
      <div className="signin-container">
        <div className="signin-form-container">
          <div className="signin-form-content">
            <button className="back-arrow" onClick={handleBackClick}>
              <CiCircleChevLeft />
            </button>

            <div className="logo-container">
              <img
                src="/image/KustomteeLogo.png"
                alt="KustomteeLogo" 
                className="logo"
              />
            </div>
            
            <h1 className="signin-title">Create an Account</h1>
            <p className="signin-subtitle">Join us and start creating amazing designs</p>

            <form className="form" onSubmit={handleSignIn}>
              <div className="signin-form">
                {/* General Error Message */}
                {error.general && (
                  <div className="error-general">
                    {error.general}
                  </div>
                )}

                <div className="form-row">
                  <div className="form-group">
                    <label className="label">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Enter your full name"
                      className={`form-input ${error.name ? 'error' : ''}`}
                      maxLength={40}
                      disabled={isSubmitting}
                    />
                    {error.name && <span className="error-message">{error.name}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="label">Email Address</label>
                    <input
                      type="email"
                      value={formData.emailId}
                      onChange={(e) => handleInputChange("emailId", e.target.value)}
                      placeholder="Enter your email"
                      className={`form-input ${error.emailId ? 'error' : ''}`}
                      maxLength={40}
                      disabled={isSubmitting}
                    />
                    {error.emailId && <span className="error-message">{error.emailId}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="label">Mobile Number</label>
                    <input
                      type="tel"
                      value={formData.mobileNo}
                      onChange={(e) => handleInputChange("mobileNo", e.target.value)}
                      placeholder="Enter 10-digit mobile number"
                      className={`form-input ${error.mobileNo ? 'error' : ''}`}
                      maxLength={10}
                      disabled={isSubmitting}
                    />
                    {error.mobileNo && <span className="error-message">{error.mobileNo}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="label">Password</label>
                    <div className="password-container">
                      <input
                        type={passwordVisible ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        placeholder="Create a password"
                        className={`form-input ${error.password ? 'error' : ''}`}
                        maxLength={20}
                        disabled={isSubmitting}
                      />
                      <button
                        type="button"
                        className="eye-toggle"
                        onClick={() => setPasswordVisible(!passwordVisible)}
                        tabIndex={-1}
                      >
                        {passwordVisible ? <IoMdEye /> : <IoMdEyeOff />}
                      </button>
                    </div>
                    {error.password && <span className="error-message">{error.password}</span>}
                  </div>

                  <div className="form-group">
                    <label className="label">Confirm Password</label>
                    <div className="password-container">
                      <input
                        type={confirmPasswordVisible ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        placeholder="Confirm your password"
                        className={`form-input ${error.confirmPassword ? 'error' : ''}`}
                        maxLength={20}
                        disabled={isSubmitting}
                      />
                      <button
                        type="button"
                        className="eye-toggle"
                        onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                        tabIndex={-1}
                      >
                        {confirmPasswordVisible ? <IoMdEye /> : <IoMdEyeOff />}
                      </button>
                    </div>
                    {error.confirmPassword && <span className="error-message">{error.confirmPassword}</span>}
                  </div>
                </div>

                <button
                  type="submit"
                  className={`submit-button ${isSubmitting ? 'loading' : ''}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating Account..." : "Create Account"}
                </button>

                <div className="signin-links">
                  <p className="divider">or</p>
                  <p className="login-redirect">
                    Already have an account?{" "}
                    <Link href="/pages/login" className="login-link">
                      Log In
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
        
        <div className="signin-image-container">
          {/* Background image handled in SCSS */}
        </div>
      </div>
    </div>
  );
};

export default SignIn;