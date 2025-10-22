import React from 'react';
import './home.scss';

const BrandBar = ({ brands }) => {
  console.log(brands);
  
  // Filter brands
  const filteredBrands = brands.filter((brand) => brand.referenceNo !== 0);
  
  // Duplicate the brands array 2 times for slower, more spaced out movement
  const sliderBrands = [...filteredBrands, ...filteredBrands, ...filteredBrands];
  
  return (
    <div className="brand-bar">
      <div className="brand-bar__container">
        <div className="brand-bar__slider">
          {sliderBrands.map((brand, index) => (
            <div key={`${brand.referenceNo}-${index}`} className="brand-bar__item">
              <img
                src={`https://cdn.ssactivewear.com/Images/Brand/${brand.referenceNo}_fm.png`}
                alt={brand.categoryTypeName}
                className="brand-bar__logo"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandBar;