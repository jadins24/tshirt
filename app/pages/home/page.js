// app/pages/home/page.js

export const dynamic = "force-dynamic";

import { API_URL } from "@/app/services/apicofig"; // Assuming you have the API_URL setup here
import HeroSlide from "./HeroSlide";
import HowItWorks from "./HowItsWork";
import FaqSection from "./FaqSection";
import TestimoniesSection from "./TestimoniesSection";
import QuickDesignSection from "./QuickDesignSection";
import FeaturedProducts from "./FeaturedProducts";
import WhyChooseUs from "./WhyChooseUs";
import './home.scss';
import BrandBar from "./BrandBar";
import CollectionGrid from "./CollectionGrid";
import { filterActiveItems } from "@/app/utils/FilterUtils/filterUtils";

// Check if running on server or client
const isServer = typeof window === "undefined";

export default async function HomePage() {
  console.log("Using API URL:", API_URL ,isServer ); // Debugging to verify correct API URL

  try {
    // Fetch data from your API using the appropriate URL based on server or client
    const [sliders, features, howItWorks, testimonies ,brands,faqData] = await Promise.all([
      fetch(`${API_URL}/Sliders`, {
        cache: 'force-cache',
        next: { revalidate: 60 },
      }).then((res) => res.ok ? res.json() : []).then(filterActiveItems),

      fetch(`${API_URL}/Features`, {
        cache: 'force-cache',
        next: { revalidate: 60 },
      }).then((res) => res.ok ? res.json() : []).then(filterActiveItems),

      fetch(`${API_URL}/HowItsWorks`, {
        cache: 'force-cache',
        next: { revalidate: 60 },
      }).then((res) => res.ok ? res.json() : []).then(filterActiveItems),

      fetch(`${API_URL}/Testimonies`, {
        cache: 'force-cache',
        next: { revalidate: 60 },
      }).then((res) => res.ok ? res.json() : []).then(filterActiveItems),
    
      fetch(`${API_URL}/CategoryType/byCategory/1`, {
        cache: 'force-cache',
        next: { revalidate: 60 },
      }).then((res) => res.ok ? res.json() : []).then(filterActiveItems),
  
      fetch(`${API_URL}/FAQs/All`, {
        cache: 'force-cache',
        next: { revalidate: 60 },
      }).then((res) => res.ok ? res.json() : []).then(filterActiveItems),
  
    ]);

    

    return (
      <>
      {/* HeroSlide Section */}
      <HeroSlide sliders={sliders} />
      
      {/* Quick Design Section */}
      <QuickDesignSection />
      
      {/* Featured Products */}
      <FeaturedProducts />
      
      <BrandBar brands={brands} />
      <CollectionGrid />
    
      {/* Features Section */}
      {howItWorks.length > 0 &&
      <>

      <section className="features-section">
        <div className="features-section-container">
          <div className="features-section-content">
            <div className="features-section-cards">
              {features.length > 0 ? (
                features.map((feature) => (
                  <div key={feature.id} className="features-section-card1">
                    <div className="features-section-card1-img">
                      <img src={feature.imageUrl} alt={feature.heading} />
                    </div>
                    <div className="features-section-card1-text">
                      <h2>{feature.heading}</h2>
                      <p>{feature.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No features found</p>
              )}
            </div>
          </div>
        </div>
      </section>
      </>
    }
      {/* How It Works Section */}
      {howItWorks.length > 0 && <HowItWorks stepsData={howItWorks} />}
      
      {/* Why Choose Us Section */}
      <WhyChooseUs />
    
      {/* Testimonies Section */}
      {testimonies.length > 0 && <TestimoniesSection testimonies={testimonies} />}
    
      {/* FAQ Section */}
      {faqData.length > 0 && <FaqSection faqDatas={faqData} />}
    </>
    
    );
  } catch (error) {
    console.error('Error fetching data:', error);
    return <p>Error loading data</p>;
  }
}
