import { WiDirectionRight } from "react-icons/wi";
import { SiTicktick } from "react-icons/si";
import { FaRocket, FaUsers, FaAward, FaHeart, FaPaintBrush, FaShieldAlt, FaClock, FaStar } from "react-icons/fa";
import Link from "next/link";
import "./about.scss";
import { API_URL } from "@/app/services/apicofig";
import { filterActiveItems } from "@/app/utils/FilterUtils/filterUtils";
import Button from "@/app/components/Button";

export default async function About() {
  const endpoints = [
    "aboutUsTops",
    "aboutUsSectionTwoes",
    "aboutUsSectionThrees",
    "aboutUsSectionFours",
    "aboutUsSectionFives",
  ];
  
  const [
    aboutUsTops,
    aboutUsSectionTwoes,
    aboutUsSectionThrees,
    aboutUsSectionFours,
    aboutUsSectionFives,
  ] = await Promise.all(
    endpoints.map((endpoint) =>
      fetch(`${API_URL}/${endpoint}`, {
        cache: "force-cache",
        next: { revalidate: 60 },
      })
        .then((res) => (res.ok ? res.json() : []))
        .then(filterActiveItems)
        .catch(() => [])
    )
  );

  const stats = [
    { icon: "👥", number: "50K+", label: "Happy Customers" },
    { icon: "🎨", number: "100K+", label: "Designs Created" },
    { icon: "⭐", number: "99%", label: "Satisfaction Rate" },
    { icon: "🚀", number: "24/7", label: "Support Available" }
  ];

  const features = [
    {
      icon: "🛡️",
      title: "Quality Guarantee",
      description: "100% satisfaction guarantee on all our products with premium materials and professional printing."
    },
    {
      icon: "⏰",
      title: "Fast Turnaround",
      description: "Quick production and shipping to get your custom designs delivered on time."
    },
    {
      icon: "🎨",
      title: "Custom Design Tool",
      description: "Powerful design tools to bring your creative vision to life with ease."
    },
    {
      icon: "❤️",
      title: "Customer First",
      description: "Dedicated support team committed to making your experience exceptional."
    }
  ];

  return (
    <div className="aboutPage">
      <div className="aboutContainer">
        {/* Enhanced Hero Section */}
        <section className="about-hero">
          <div className="hero-background">
            <div className="hero-particles"></div>
          </div>
          <div className="hero-content">
            {aboutUsTops.length > 0 ? (
              aboutUsTops.map((item) => (
                <div className="hero-main" key={item.id}>
                  <div className="hero-text">
                    <div className="hero-badge">
                      <FaStar className="badge-icon" />
                      About KustomTee
                    </div>
                    <h1 className="hero-title">{item.heading || "Crafting Your Story Through Custom Apparel"}</h1>
                    <p className="hero-description">
                      We are passionate about creating custom apparel that helps you express your unique style and story. 
                      From concept to creation, we bring your vision to life with premium quality and exceptional service.
                    </p>
                    <div className="hero-actions">
                      <Link href="/pages/customDesign">
                        <Button variant="primary" size="large" className="hero-btn">
                          <FaPaintBrush style={{ marginRight: '8px' }} />
                          Start Designing
                        </Button>
                      </Link>
                      <Link href="/pages/products">
                        <Button variant="outline" size="large" className="hero-btn">
                          Learn More
                        </Button>
                      </Link>
                    </div>
                  </div>
                  <div className="hero-image">
                    <div className="image-container">
                      <img
                        src={item.imageUrl || "/image/banner-products-sa.jpg"}
                        alt={item.heading || "About Us Image"}
                        className="hero-img"
                      />
                      <div className="image-overlay"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="hero-main">
                <div className="hero-text">
                  <div className="hero-badge">
                    <FaStar className="badge-icon" />
                    About KustomTee
                  </div>
                  <h1 className="hero-title">Crafting Your Story Through Custom Apparel</h1>
                  <p className="hero-description">
                    We are passionate about creating custom apparel that helps you express your unique style and story. 
                    From concept to creation, we bring your vision to life with premium quality and exceptional service.
                  </p>
                  <div className="hero-actions">
                    <Link href="/pages/customDesign">
                      <Button variant="primary" size="large" className="hero-btn">
                        <FaPaintBrush style={{ marginRight: '8px' }} />
                        Start Designing
                      </Button>
                    </Link>
                    <Link href="/pages/products">
                      <Button variant="outline" size="large" className="hero-btn">
                        Learn More
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="hero-image">
                  <div className="image-container">
                    <img
                      src="/image/banner-products-sa.jpg"
                      alt="About Us Image"
                      className="hero-img"
                    />
                    <div className="image-overlay"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <div className="stats-container">
            <div className="stats-grid">
              {stats.map((stat, index) => (
                <div key={index} className="stat-card">
                  <div className="stat-icon">{stat.icon}</div>
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Mission Section */}
        <section className="mission-section">
          <div className="mission-background">
            <div className="mission-pattern"></div>
          </div>
          <div className="mission-container">
            <div className="mission-content">
              <div className="mission-header">
                <h2 className="mission-title">Who We Are</h2>
                <div className="mission-subtitle">Passionate creators dedicated to your vision</div>
              </div>
              <div className="mission-text">
                <p className="mission-paragraph">
                  We are KustomTee, a team of creative enthusiasts and printing experts dedicated to helping people express themselves through custom apparel. Founded with a vision to make personalized T-shirts more accessible, KustomTee combines innovative technology with a passion for quality to deliver products that exceed expectations.
                </p>
                <p className="mission-paragraph">
                  We believe that every T-shirt tells a story, and we're here to help you share yours. Whether it's a small personal project or a large-scale order for your business, we provide a seamless experience from design to delivery.
                </p>
                <div className="mission-highlights">
                  <div className="highlight-item">
                    <FaAward className="highlight-icon" />
                    <span>Premium Quality Materials</span>
                  </div>
                  <div className="highlight-item">
                    <FaRocket className="highlight-icon" />
                    <span>Fast & Reliable Service</span>
                  </div>
                  <div className="highlight-item">
                    <FaHeart className="highlight-icon" />
                    <span>Customer-First Approach</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Features Section */}
        <section className="features-section">
          <div className="features-container">
            <div className="features-header">
              <h2 className="features-title">Why Choose KustomTee</h2>
              <p className="features-subtitle">Experience the difference with our premium services</p>
            </div>
            <div className="features-grid">
              {features.map((feature, index) => (
                <div key={index} className="feature-card">
                  <div className="feature-icon">{feature.icon}</div>
                  <div className="feature-content">
                    <h3 className="feature-title">{feature.title}</h3>
                    <p className="feature-description">{feature.description}</p>
                  </div>
                  <div className="feature-decoration"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Process Section */}
        <section className="process-section">
          <div className="process-container">
            <div className="process-content">
              <div className="process-text">
                <div className="process-badge">
                  <FaRocket className="badge-icon" />
                  Our Process
                </div>
                <h2 className="process-title">From Idea to Reality</h2>
                <p className="process-description">
                  Our streamlined process ensures your custom designs are brought to life with precision and care, 
                  delivering exceptional results every time.
                </p>
                <div className="process-steps">
                  <div className="process-step">
                    <div className="step-number">01</div>
                    <div className="step-content">
                      <h4>Design</h4>
                      <p>Create your vision using our powerful design tools or upload your own artwork.</p>
                    </div>
                  </div>
                  <div className="process-step">
                    <div className="step-number">02</div>
                    <div className="step-content">
                      <h4>Review</h4>
                      <p>Preview your design and make adjustments until it's perfect.</p>
                    </div>
                  </div>
                  <div className="process-step">
                    <div className="step-number">03</div>
                    <div className="step-content">
                      <h4>Print</h4>
                      <p>We print your design using premium materials and professional techniques.</p>
                    </div>
                  </div>
                  <div className="process-step">
                    <div className="step-number">04</div>
                    <div className="step-content">
                      <h4>Deliver</h4>
                      <p>Fast shipping gets your custom apparel to you quickly and safely.</p>
                    </div>
                  </div>
                </div>
                <Link href="/pages/customDesign">
                  <Button variant="primary" size="large" className="process-cta">
                    Start Your Project
                    <WiDirectionRight className="cta-icon" />
                  </Button>
                </Link>
              </div>
              <div className="process-visual">
                <div className="process-image-container">
                  <img
                    src="/image/banner-products-sa.jpg"
                    alt="Our Process"
                    className="process-image"
                  />
                  <div className="process-overlay">
                    <div className="overlay-content">
                      <FaPaintBrush className="overlay-icon" />
                      <span>Create Amazing Designs</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Team Section */}
        <section className="team-section">
          <div className="team-container">
            <div className="team-header">
              <h2 className="team-title">Customize T-Shirts, Hoodies and More for Your Team!</h2>
              <p className="team-subtitle">Perfect apparel solutions for teams and groups</p>
            </div>
            <div className="team-grid">
              {aboutUsSectionFives.length > 0 ? (
                aboutUsSectionFives
                  .filter(item => item.activeStatus)
                  .map((item) => (
                    <div key={item.id} className="team-card">
                      <div className="team-image">
                        <img
                          src={item.imageUrl || "/image/banner-products-sa.jpg"}
                          alt={item.heading || "Team Image"}
                          className="team-img"
                        />
                        <div className="team-overlay">
                          <FaUsers className="team-icon" />
                        </div>
                      </div>
                      <div className="team-content">
                        <h3 className="team-name">{item.heading}</h3>
                        <p className="team-description">{item.description}</p>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="team-card">
                  <div className="team-image">
                    <img
                      src="/image/banner-products-sa.jpg"
                      alt="Team Solutions"
                      className="team-img"
                    />
                    <div className="team-overlay">
                      <FaUsers className="team-icon" />
                    </div>
                  </div>
                  <div className="team-content">
                    <h3 className="team-name">Team Solutions</h3>
                    <p className="team-description">Custom apparel solutions for businesses, sports teams, and organizations.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Enhanced CTA Section */}
        <section className="cta-section">
          <div className="cta-background">
            <div className="cta-particles"></div>
          </div>
          <div className="cta-container">
            <div className="cta-content">
              <h2 className="cta-title">Ready to Create Something Amazing?</h2>
              <p className="cta-description">
                Join thousands of satisfied customers who have brought their ideas to life with KustomTee. 
                Start your custom design journey today!
              </p>
              <div className="cta-buttons">
                <Link href="/pages/customDesign">
                  <Button variant="primary" size="large" className="cta-btn">
                    <FaPaintBrush style={{ marginRight: '8px' }} />
                    Start Designing
                  </Button>
                </Link>
                <Link href="/pages/products">
                  <Button variant="outline" size="large" className="cta-btn">
                    Browse Products
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}