"use client";
import React, { useEffect, useState, memo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IoIosMenu } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { CiShoppingCart } from "react-icons/ci";
import "./Header.scss";
import Link from "next/link";
import { logout } from "@/app/redux/slice/authSlice";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { 
  selectIsAuthenticated, 
  selectUserDisplayName, 
  selectUserInitials,
  selectCartItemCount,
  selectUser
} from "@/app/redux/selectors";

const Header = memo(() => {
  const [isMounted, setIsMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // Use optimized selectors
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userName = useSelector(selectUserDisplayName);
  const userInitials = useSelector(selectUserInitials);
  const cartItemCount = useSelector(selectCartItemCount);
  const user = useSelector(selectUser);
  
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleMenu = useCallback(() => setIsMenuOpen(prev => !prev), []);

  const openPage = useCallback((link) => {
    setIsMenuOpen(false);
    router.push(link);
  }, [router]);

  // Function to check if a navigation link is active
  const isActiveLink = useCallback((href) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  }, [pathname]);

  const handleLogout = useCallback(() => {
    dispatch(logout());
    setIsProfileDropdownOpen(false);
    router.push("/");
  }, [dispatch, router]);

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 20);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileDropdownOpen && !event.target.closest('.header__profile')) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isProfileDropdownOpen]);

  return (
    <>
      <header className={`header ${isScrolled ? "header--scrolled" : ""}`}>
        <div className="header__container">
          {/* Logo */}
          <div className="header__logo">
            <Image 
              width={100}
              height={35}
              src="/image/KustomteeLogo.png" 
              alt="Kustomtee" 
              onClick={() => router.push("/")}
              style={{ cursor: 'pointer' }}
            />
          </div>

          {/* Navigation */}
          <nav className={`header__nav ${isMenuOpen ? "header__nav--active" : ""}`}>
            <div className="header__nav-items">
              <Link 
                href="/" 
                className={`header__nav-link ${isActiveLink("/") ? "header__nav-link--active" : ""}`} 
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/pages/templates" 
                className={`header__nav-link ${isActiveLink("/pages/templates") ? "header__nav-link--active" : ""}`} 
                onClick={() => setIsMenuOpen(false)}
              >
                Templates
              </Link>
              <Link 
                href="/pages/products" 
                className={`header__nav-link ${isActiveLink("/pages/products") ? "header__nav-link--active" : ""}`} 
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link 
                href="/pages/about" 
                className={`header__nav-link ${isActiveLink("/pages/about") ? "header__nav-link--active" : ""}`} 
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
            </div>
          </nav>

          {/* Actions */}
          <div className="header__actions">
            {/* Cart */}
            <Link href="/pages/cart" className="header__action-btn header__cart-btn">
              <CiShoppingCart />
              {cartItemCount > 0 && (
                <span className="header__cart-badge">{cartItemCount}</span>
              )}
            </Link>

            {/* Auth Section - User Profile or Login Button */}
            {isAuthenticated ? (
              <div className="header__profile">
                <button 
                  className="header__user-profile-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsProfileDropdownOpen(!isProfileDropdownOpen);
                  }}
                >
                  <div className="header__user-avatar">
                    {userInitials}
                  </div>
                  <span className="header__user-name">
                    {userName}
                  </span>
                  <CgProfile className="header__profile-icon" />
                </button>
                
                {isProfileDropdownOpen && (
                  <div className="header__dropdown">
                    <div className="header__dropdown-user-info">
                      <div className="header__dropdown-avatar">
                        {userInitials}
                      </div>
                      <div className="header__dropdown-user-details">
                        <span className="header__dropdown-user-name">{userName}</span>
                        <span className="header__dropdown-user-email">
                          {user?.emailId || user?.email}
                        </span>
                      </div>
                    </div>
                    
                    <div className="header__dropdown-divider"></div>
                    
                    <Link 
                      href="/components/ProfilePage" 
                      className="header__dropdown-item"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      My Profile
                    </Link>
                   
                  
                    
                    <div className="header__dropdown-divider"></div>
                    
                    <button 
                      className="header__dropdown-item header__dropdown-item--logout"
                      onClick={handleLogout}
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/pages/login" className="header__login-btn">
                Login
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              className="header__menu-toggle"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <IoClose /> : <IoIosMenu />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="mobile-overlay" 
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
});

Header.displayName = 'Header';

export default Header;