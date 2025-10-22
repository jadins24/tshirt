"use client";
import { FaFacebook, FaYoutube, FaPhoneAlt, FaMapMarkerAlt, FaEnvelope, FaArrowUp, FaPaintBrush, FaRocket } from "react-icons/fa";
import { RiInstagramFill, RiWhatsappFill } from "react-icons/ri";
import { FaSquareXTwitter } from "react-icons/fa6";
import { MdOutlineMailOutline } from "react-icons/md";
import Link from "next/link";
import Image from "next/image";
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Button from "@/app/components/Button";
import { useState, useEffect } from 'react';
import "./Footer.scss";

const Footer = () => {
    const isAuthenticated = useSelector(state => state.auth?.isAuthenticated);
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const [currentYear, setCurrentYear] = useState(2025); // Default year to prevent hydration mismatch
    
    useEffect(() => {
        setIsClient(true);
        setCurrentYear(new Date().getFullYear());
    }, []);

    const handleDashboardClick = () => {
        if (isAuthenticated) {
            router.push("/components/ProfilePage");
        } else {
            router.push("/pages/login");
        }
    };

    const scrollToTop = () => {
        if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <footer className="footer">
            {/* Enhanced CTA Banner */}
            <div className="footer-cta">
                <div className="footer-cta-background">
                    <div className="cta-particles"></div>
                </div>
                <div className="footer-cta-content">
                    <div className="cta-text">
                        <div className="cta-badge">
                            <FaRocket className="badge-icon" />
                            Ready to Create?
                        </div>
                        <h2>Get Started with Custom T-Shirts</h2>
                        <p>Design your unique apparel today with our easy-to-use tools and premium quality materials</p>
                    </div>
                    <div className="cta-buttons">
                        <Link href="/pages/customDesign">
                            <Button variant="primary" size="large" className="cta-btn-primary">
                                <FaPaintBrush style={{ marginRight: '8px' }} />
                                Design Now
                            </Button>
                        </Link>
                        <Link href="/pages/templates">
                            <Button variant="outline" size="large" className="cta-btn-secondary">
                                Explore Templates
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Footer Content */}
            <div className="footer-main">
                <div className="footer-background">
                    <div className="footer-pattern"></div>
                </div>
                <div className="footer-container">
                    {/* Company Info */}
                    <div className="footer-section company-info">
                        <div className="footer-logo">
                            <Image 
                                width={120}
                                height={40}
                                src="/image/KustomteeLogo.png" 
                                alt="Kustomtee" 
                                onClick={() => router.push("/")}
                                style={{ cursor: 'pointer' }}
                            />
                        </div>
                        <p className="company-description">
                            KustomTee lets you create custom T-shirts with ease. From one shirt to bulk orders, 
                            we deliver quality, affordability, and quick service. Your design, your way!
                        </p>
                        <div className="social-links">
                            <a href="#" className="social-link facebook" aria-label="Facebook">
                                <FaFacebook />
                            </a>
                            <a href="#" className="social-link instagram" aria-label="Instagram">
                                <RiInstagramFill />
                            </a>
                            <a href="#" className="social-link youtube" aria-label="YouTube">
                                <FaYoutube />
                            </a>
                            <a href="#" className="social-link twitter" aria-label="Twitter">
                                <FaSquareXTwitter />
                            </a>
                            <a href="#" className="social-link whatsapp" aria-label="WhatsApp">
                                <RiWhatsappFill />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-section">
                        <h3 className="footer-title">Quick Links</h3>
                        <ul className="footer-links">
                            <li>
                                <Link href="/" className="footer-link">
                                    <span className="link-icon">🏠</span>
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/pages/about" className="footer-link">
                                    <span className="link-icon">ℹ️</span>
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link href="/pages/templates" className="footer-link">
                                    <span className="link-icon">🎨</span>
                                    Templates
                                </Link>
                            </li>
                            <li>
                                <Link href="/pages/help" className="footer-link">
                                    <span className="link-icon">❓</span>
                                    Help
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Other Links */}
                    <div className="footer-section">
                        <h3 className="footer-title">Other Links</h3>
                        <ul className="footer-links">
                            <li>
                                <Link href="/pages/termsconditions" className="footer-link">
                                    <span className="link-icon">📋</span>
                                    Terms & Conditions
                                </Link>
                            </li>
                            <li>
                                <Link href="/pages/privacypolicy" className="footer-link">
                                    <span className="link-icon">🔒</span>
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/pages/faq" className="footer-link">
                                    <span className="link-icon">❓</span>
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Button 
                                    onClick={handleDashboardClick}
                                    variant="ghost"
                                    size="small"
                                    className="footer-link footer-button"
                                >
                                    <span className="link-icon">📊</span>
                                    Dashboard
                                </Button>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="footer-section contact-info">
                        <h3 className="footer-title">Contact Us</h3>
                        <div className="contact-list">
                            <div className="contact-item">
                                <div className="contact-icon location">
                                    <FaMapMarkerAlt />
                                </div>
                                <div className="contact-details">
                                    <span className="contact-title">Our Location</span>
                                    <span className="contact-detail">123 Design Street, Creative City</span>
                                    <span className="contact-sub-detail">Innovation State, 12345</span>
                                </div>
                            </div>
                            <div className="contact-item">
                                <div className="contact-icon phone">
                                    <FaPhoneAlt />
                                </div>
                                <div className="contact-details">
                                    <span className="contact-title">Our Phone</span>
                                    <span className="contact-detail">+1 (555) 123-4567</span>
                                    <span className="contact-sub-detail">+1 (555) 987-6543</span>
                                </div>
                            </div>
                            <div className="contact-item">
                                <div className="contact-icon email">
                                    <FaEnvelope />
                                </div>
                                <div className="contact-details">
                                    <span className="contact-title">Our Email</span>
                                    <span className="contact-detail">hello@kustomtee.com</span>
                                    <span className="contact-sub-detail">support@kustomtee.com</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="footer-bottom">
                <div className="footer-container">
                    <div className="footer-bottom-content">
                        <div className="copyright">
                            <p>&copy; {currentYear} KustomTee. All rights reserved.</p>
                        </div>
                        <div className="footer-bottom-links">
                            <Link href="/pages/termsconditions">Terms</Link>
                            <Link href="/pages/privacypolicy">Privacy</Link>
                            <Link href="/pages/help">Support</Link>
                        </div>
                        {isClient && (
                            <button className="scroll-to-top" onClick={scrollToTop} aria-label="Scroll to top">
                                <FaArrowUp />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;