"use client";
import React from "react";
import "./Button.scss";

const Button = ({
  children,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = "left",
  onClick,
  type = "button",
  className = "",
  ...props
}) => {
  const baseClasses = "btn";
  const variantClass = `btn--${variant}`;
  const sizeClass = `btn--${size}`;
  const stateClass = disabled ? "btn--disabled" : "";
  const loadingClass = loading ? "btn--loading" : "";
  const fullWidthClass = fullWidth ? "btn--full-width" : "";
  const iconClass = icon ? `btn--icon-${iconPosition}` : "";

  const allClasses = [
    baseClasses,
    variantClass,
    sizeClass,
    stateClass,
    loadingClass,
    fullWidthClass,
    iconClass,
    className
  ].filter(Boolean).join(" ");

  const handleClick = (e) => {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  const renderIcon = () => {
    if (!icon) return null;
    
    const iconElement = typeof icon === "string" ? (
      <span className="btn__icon-text">{icon}</span>
    ) : (
      <span className="btn__icon">{icon}</span>
    );

    return iconElement;
  };

  const renderContent = () => {
    if (loading) {
      return (
        <>
          <span className="btn__spinner" aria-hidden="true">
            <svg className="btn__spinner-svg" viewBox="0 0 24 24">
              <circle
                className="btn__spinner-circle"
                cx="12"
                cy="12"
                r="10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="31.416"
                strokeDashoffset="31.416"
              />
            </svg>
          </span>
          <span className="btn__loading-text">Loading...</span>
        </>
      );
    }

    if (icon && iconPosition === "left") {
      return (
        <>
          {renderIcon()}
          <span className="btn__text">{children}</span>
        </>
      );
    }

    if (icon && iconPosition === "right") {
      return (
        <>
          <span className="btn__text">{children}</span>
          {renderIcon()}
        </>
      );
    }

    return <span className="btn__text">{children}</span>;
  };

  return (
    <button
      type={type}
      className={allClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      {...props}
    >
      {renderContent()}
    </button>
  );
};

export default Button;
