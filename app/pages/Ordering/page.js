"use client"

import React, { useState } from "react";
import { AiFillStar } from "react-icons/ai";
import Link from "next/link";
import { MdOutlineKeyboardArrowLeft,  MdOutlineKeyboardArrowRight} from "react-icons/md";
import './Ordering.scss';

const Orderingpage = () => {

  const [selectedImage, setSelectedImage] = useState("/image/ordering.jpeg");
  // const [activeIndex, setActiveIndex] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const designImages = [
    { label: "Front", src: "/image/front_medium3.png" },
    { label: "Back", src: "/image/front_medium1.png" },
    { label: "R.Sleeve", src: "/image/front_medium2.png" },
    { label: "L.Sleeve", src: "/image/front_medium4.png" },
  ];

   const [currentIndex, setCurrentIndex] = useState(0);

   const handleLeftClick = () => {
    const prevIndex = (currentIndex - 1 + designImages.length) % designImages.length;
    setCurrentIndex(prevIndex);
    setSelectedImage(designImages[prevIndex].src); 
  };
  
  const handleRightClick = () => {
    const nextIndex = (currentIndex + 1) % designImages.length;
    setCurrentIndex(nextIndex);
    setSelectedImage(designImages[nextIndex].src);
  };

  // const [selectedColor, setSelectedColor] = useState(null);

  // const colors = ["#FFC1C1","#C7D2FF","#C5FFCF", "#BBC4FF","#FFE8C9","#FF8CF0","#FFB541","#2FA1FF","#0A048E",
  //   "#D56CFF","#D9D9D9","#FFE6B3","#B3FFE6","#D1B3FF","#FFB3C2","#C2FFB3","#B3C2FF","#FFCCB3",
  //   "#B3FFCC","#CCB3FF","#FFB3D9","#D9B3FF","#D9FFB3","#FFB3E1","#E1FFB3","#B3E1FF","#FFE0B3","#B3FFE0",
  //   // "#E0B3FF","#FFB3C9","#B3FFC9","#C9FFB3","#FFB3E0","#E0FFB3","#B3E0FF","#FFB3D1","#D1B3FF","#B3FFD1",
  //   // "#B3D1FF","#FFC2B3","#FFB3C2","#B3D1FF","#FFCCB3","#B3FFCC","#FFB3CC","#CCFFB3","#B3CCFF",
  // ];

  const [selectedColor, setSelectedColor] = useState(null);

  // Color options (this can be extended with images matching each color)
  const colors = [
    { color: "#FFC1C1", imageSrc: "/image/colororder1.jpg" },
    { color: "#C7D2FF", imageSrc: "/image/colororder2.jpg" },
    { color: "#C5FFCF", imageSrc: "/image/colororder3.jpg" },
    { color: "#BBC4FF", imageSrc: "/image/colororder2.jpg" },
    { color: "#FFE8C9", imageSrc: "/image/peachcolor.jpg" },
    { color: "#FF8CF0", imageSrc: "/image/pink.jpg" },
    { color: "#FFB541", imageSrc: "/image/colororder7.jpg" },
    { color: "#2FA1FF", imageSrc: "/image/blue.jpg" },
    { color: "#0A048E", imageSrc: "/image/colororder9.jpg" },
    { color: "#D56CFF", imageSrc: "/image/colororder10.jpg" },

    { color: "#D9D9D9", imageSrc: "/image/colororder1.jpg" },
    { color: "#FFE6B3", imageSrc: "/image/peachcolor.jpg" },
    { color: "#B3FFE6", imageSrc: "/image/colororder3.jpg" },
    { color: "#D1B3FF", imageSrc: "/image/violet.jpg" },
    { color: "#FFB3C2", imageSrc: "/image/colororder1.jpg" },
    { color: "#C2FFB3", imageSrc: "/image/colororder3.jpg" },
    { color: "#B3C2FF", imageSrc: "/image/colororder2.jpg" },
    { color: "#FFCCB3", imageSrc: "/image/peachcolor.jpg" },
    { color: "#B3FFCC", imageSrc: "/image/colororder3.jpg" },
    { color: "#CCB3FF", imageSrc: "/image/violet.jpg" },

    { color: "#FFB3D9", imageSrc: "/image/colororder1.jpg" },
    { color: "#D9B3FF", imageSrc: "/image/violet.jpg" },
    { color: "#D9FFB3", imageSrc: "/image/colororder3.jpg" },
    { color: "#FFB3E1", imageSrc: "/image/colororder1.jpg" },
    { color: "#E1FFB3", imageSrc: "/image/peachcolor.jpg" },
    { color: "#B3E1FF", imageSrc: "/image/colororder2.jpg" },
    { color: "#FFE0B3", imageSrc: "/image/peachcolor.jpg" },
    { color: "#B3FFE0", imageSrc: "/image/colororder3.jpg" },
    { color: "#E0B3FF", imageSrc: "/image/violet.jpg" },
    { color: "#FFB3C9", imageSrc: "/image/colororder1.jpg" },
    
  ];

  return (
    <div className="orderingpage">
    <div className="orderingpageContainer">
      <div className="orderingpageHead">

      </div>
      <div className="orderingpageHero">
        {/* Design Options Section */}

      <div className="designTshirt">
        <div className="d">
          <div className="designPosition">
          {designImages.map(({ label, src }, index) => (
            <div
              className="smallImgDesigns"
              key={index}
              onClick={() => {
                setCurrentIndex(index); 
                setSelectedImage(src); 
              }}
              style={{ cursor: "pointer" }}
            >
              <img src={src} alt={label} width={40} height={40} />
              <p>{label}</p>
            </div>
          ))}
          </div>
        </div>

        {/* Main T-shirt Image Section with Arrows */}
        <div className="orderingImage">
          <MdOutlineKeyboardArrowLeft
            className="arrowIcon leftArrow"
            onClick={handleLeftClick}
          />
          <img src={selectedImage} alt="T-shirt" />
          <MdOutlineKeyboardArrowRight
            className="arrowIcon rightArrow"
            onClick={handleRightClick}
          />
        </div>
      </div>

        {/* Review and Rating Section */}
        <div className="orderingpageReview">
          <div className="orderingReviewContent">
            <h2>Gildan Softstyle Jersey T-shirt</h2>
            <div className="rating">
              4.5
              {[...Array(4)].map((_, i) => (
                <AiFillStar key={i} />
              ))}
            </div>
          </div>

          {/* Color Selection Section */}
        <div className="orderingpageColours">
          <h2>Colours:</h2>
          <div className="colorOptions">
            {colors.map((colorObj, index) => (
              <div
                key={index}
                className={`colorBox ${selectedColor === colorObj.color ? "selected" : ""}`}
                style={{ backgroundColor: colorObj.color }}
                onClick={() => {
                  setSelectedColor(colorObj.color);
                  setSelectedImage(colorObj.imageSrc); 
                }}
              >
                {selectedColor === colorObj.color && (
                  <span className="checkmark">✔</span>
                )}
              </div>
            ))}
          </div>
          <h2>Sizes Available in:</h2>
          <p>YS | YM | YL | XS | S | M | L | XL | 2XL | 3XL | 4XL | 5XL</p>

          <Link href="/pages/customDesign">
            <button
                className="btn"
                style={{
                  color: "white",
                  background: isHovered ? "#1a87d6" : "#2fa1ff",
                  padding: "12px 20px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  transform: isHovered ? "scale(1.01)" : "scale(1)",
                  transition: "background-color 0.3s ease, transform 0.2s ease",
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                Start Designing
              </button>
            </Link>

          </div>

        </div>
      </div>

        <div className="orderingpageContents">
          <div className="orderingpageContent">
            <h2>Product Description</h2>

            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
              eiusmod tempor incididunt ut labore dolore.adipiscing elit, sed do
              eiusmod tempor consectetur.Lorem ipsum dolor sit amet, consectetur
              adipiscing elit, sed eiusmod tempor incididunt ut labore
              dolore.adipiscing elit, sed do eiusmod tempor consectetur.
            </p>
          </div>
          <div className="orderingpageContent">
            <h2>Product Details</h2>

            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
              eiusmod tempor incididunt ut labore dolore.adipiscing elit, sed do
              eiusmod tempor consectetur.Lorem ipsum dolor sit amet, consectetur
              adipiscing elit, sed eiusmod tempor incididunt ut labore
              dolore.adipiscing elit, sed do eiusmod tempor consectetur
            </p>
          </div>
          <div className="orderingpageContent">
            <h2>Delivery Options</h2>

            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
              eiusmod tempor incididunt ut labore dolore.adipiscing elit, sed do
              eiusmod tempor consectetur.Lorem ipsum dolor sit amet, consectetur
              adipiscing elit, sed eiusmod tempor incididunt ut labore
              dolore.adipiscing elit, sed do eiusmod tempor consectetur
            </p>
          </div>
        </div>
        <div className="orderingReview">
          <div className="orderingReviewHead">
            <h2>Reviews</h2>
            <div className="rating">
              <AiFillStar />
            
            <p>
              4.8 <span>(93,456 Reviews)</span>
            </p>
            </div>
          </div>
          <div className="orderingReviewStars">
            <div className="bar-container">
              <p>5 stars</p>
              <div className="bar">
                <div className="bar-details" style={{ width: "84.05%" }}></div>
              </div>
              <p>84.05%</p>
            </div>
            <div className="bar-container">
              <p>4 stars</p>
              <div className="bar">
                <div className="bar-details" style={{ width: "14.43%" }}></div>
              </div>
              <p>14.43%</p>
            </div>
            <div className="bar-container">
              <p>3 stars</p>
              <div className="bar">
                <div className="bar-details" style={{ width: "1.60%" }}></div>
              </div>
              <p>1.60%</p>
            </div>
            <div className="bar-container">
              <p>2 stars</p>
              <div className="bar">
                <div className="bar-details" style={{ width: "0.33%" }}></div>
              </div>
              <p>0.33%</p>
            </div>
            <div className="bar-container">
              <p>1 stars</p>
              <div className="bar">
                <div className="bar-details" style={{ width: "0.44%" }}></div>
              </div>
              <p>0.44%</p>
            </div>
           </div> 
        </div>

        <div className="orderingpageTestimonial">
          <div className="orderingTestimonialHead">
            <h2>Testimonials</h2>
            <a href="/">view more Reviews</a>
          </div>
          <div className="orderTestimonialContents">
            <div className="testimonialCard">
              <h2>Peter</h2>
              <p>Nov 9, 2023</p>
              <div className="rating">
                {[...Array(5)].map((_, i) => (
                  <AiFillStar key={i} />
                ))}
              </div>
              <p>
                Lorem ipsum dolor sit amet, consecteturadipiscing elit, sed do
                eiusmod tempor Lorem ipsum dolor sit amet, consecteturadipiscing
                elit, sed do eiusmod tempor
              </p>
            </div>
            <div className="testimonialCard">
              <h2>John Petter</h2>
              <p>Nov 9, 2023</p>
              <div className="rating">
                {[...Array(5)].map((_, i) => (
                  <AiFillStar key={i} />
                ))}
              </div>
              <p>
                Lorem ipsum dolor sit amet, consecteturadipiscing elit, sed do
                eiusmod tempor Lorem ipsum dolor sit amet, consecteturadipiscing
                elit, sed do eiusmod tempor
              </p>
            </div>
            <div className="testimonialCard">
              <h2>Petter Joe</h2>
              <p>Nov 9, 2023</p>
              <div className="rating">
                {[...Array(5)].map((_, i) => (
                  <AiFillStar key={i} />
                ))}
              </div>
              <p>
                Lorem ipsum dolor sit amet, consecteturadipiscing elit, sed do
                eiusmod tempor Lorem ipsum dolor sit amet, consecteturadipiscing
                elit, sed do eiusmod tempor
              </p>
            </div>
          </div>
        </div>
      </div>
 
    </div>
  );
};

export default Orderingpage;
