"use client";

import { useState, Suspense } from "react";
import { useDispatch } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { setAuthState } from "@/app/redux/slice/authSlice";
import { setLoading } from "@/app/redux/slice/loadingSlice";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { CiCircleChevLeft } from "react-icons/ci";
import Link from "next/link";
import apiClient from "@/app/services/apicofig";
import "./login.scss";

// Separate component that uses useSearchParams
const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState({ email: "", password: "", general: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newError = { email: "", password: "", general: "" };
    let isValid = true;

    if (!formData.email.trim()) {
      newError.email = "Email is required";
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      newError.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!formData.password) {
      newError.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newError.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setError(newError);
    return isValid;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear errors when user starts typing
    if (error[field] || error.general) {
      setError(prev => ({
        ...prev,
        [field]: "",
        general: ""
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    dispatch(setLoading(true));

    try {
      const response = await apiClient.post("/Users/login", {
        emailId: formData.email.trim(),
        password: formData.password
      });

      console.log("Login successful", response.data);

      const userData = response.data;

      if (!userData.activeStatus) {
        setError({ 
          general: "Your account is inactive. Please contact support." 
        });
        return;
      }

      // Dispatch authentication state
      dispatch(setAuthState({ 
        user: userData, 
        isAuthenticated: true 
      }));

      // Clear form
      setFormData({ email: "", password: "" });
      setError({});

      // Redirect user
      const redirectPath = returnTo && returnTo.startsWith("/") 
        ? returnTo 
        : "/";
      
      router.push(redirectPath);

    } catch (error) {
      console.error("Login error:", error);
      
      let errorMessage = "Invalid email or password. Please try again.";
      
      if (error.response) {
        switch (error.response.status) {
          case 401:
            errorMessage = "Invalid email or password. Please check your credentials.";
            break;
          case 404:
            errorMessage = "Account not found. Please check your email address.";
            break;
          case 500:
            errorMessage = "Server error. Please try again later.";
            break;
          default:
            errorMessage = error.response.data?.message || "Login failed. Please try again.";
        }
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection.";
      }

      setError({ 
        general: errorMessage,
        email: "",
        password: ""
      });
    } finally {
      setIsSubmitting(false);
      dispatch(setLoading(false));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleBackClick = () => {
    router.push("/");
  };

  return (
    <div className="login">
      <div className="login-container">
        <div className="login-form-section">
          <div className="login-form-wrapper">
            <button className="back-button" onClick={handleBackClick} aria-label="Go back">
              <CiCircleChevLeft />
              <span>Back</span>
            </button>

            <div className="login-header">
              <div className="logo-section">
                <img
                  src="/image/KustomteeLogo.png"
                  alt="Kustomtee Logo"
                  className="brand-logo"
                />
              </div>
              
              <div className="welcome-section">
                <h1 className="welcome-title">Welcome back</h1>
                <p className="welcome-subtitle">Sign in to your account to continue</p>
              </div>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
              {/* General Error Message */}
              {error.general && (
                <div className="error-banner">
                  <span className="error-icon">⚠</span>
                  {error.general}
                </div>
              )}

              <div className="form-fields">
                <div className="input-group">
                  <label htmlFor="email" className="input-label">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter your email"
                    className={`text-input ${error.email ? 'input-error' : ''}`}
                    maxLength={40}
                    disabled={isSubmitting}
                    autoComplete="email"
                  />
                  {error.email && <span className="field-error">{error.email}</span>}
                </div>

                <div className="input-group">
                  <label htmlFor="password" className="input-label">Password</label>
                  <div className="password-input-wrapper">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      placeholder="Enter your password"
                      className={`text-input ${error.password ? 'input-error' : ''}`}
                      maxLength={20}
                      disabled={isSubmitting}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={togglePasswordVisibility}
                      disabled={isSubmitting}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <LuEyeOff /> : <LuEye />}
                    </button>
                  </div>
                  {error.password && <span className="field-error">{error.password}</span>}
                </div>

                <div className="form-options">
                  <Link href="/forgot-password" className="forgot-password-link">
                    Forgot your password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`submit-button ${isSubmitting ? 'button-loading' : ''}`}
                >
                  {isSubmitting ? (
                    <>
                      <span className="button-spinner"></span>
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </div>

              <div className="auth-redirect">
                <div className="divider">
                  <span>New to Kustomtee?</span>
                </div>
                <Link href="/pages/signin" className="signup-link">
                  Create an account
                </Link>
              </div>
            </form>
          </div>
        </div>
        
        <div className="login-hero-section">
          <div className="hero-overlay">
            <div className="hero-content">
              <h2 className="hero-title">Create Something Amazing</h2>
              <p className="hero-description">
                Design custom t-shirts with our easy-to-use tools and premium templates
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main component with Suspense wrapper
const Login = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
};

export default Login;