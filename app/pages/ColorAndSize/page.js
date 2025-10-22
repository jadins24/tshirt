"use client";
import React, { useState } from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { FaRegHeart } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
// import Image from "next/image";
import Link from "next/link";
import './color.scss';


const ColorSize = () => {
  const [openFilter, setOpenFilter] = useState("shirt");
  const [selectedFilters, setSelectedFilters] = useState({}); 

  const toggleFilter = (filterName) => {
    setOpenFilter((prev) => (prev === filterName ? null : filterName));
  };

  const handleCheckboxChange = (filterCategory, filterValue) => {
    setSelectedFilters((prevFilters) => {
      const currentCategoryFilters = prevFilters[filterCategory] || [];
      const isValueSelected = currentCategoryFilters.includes(filterValue);
  
      return {
        ...prevFilters,
        [filterCategory]: isValueSelected
          ? currentCategoryFilters.filter((val) => val !== filterValue)
          : [...currentCategoryFilters, filterValue],
      };
    });
  };

  const isChecked = (filterCategory, filterValue) =>
    selectedFilters[filterCategory]?.includes(filterValue) || false;

  const handleRemoveAll = () => {
    setSelectedFilters({});
  };


  const collections = [
    {
      id: 1,
      image: "/image/front_medium4.png",
      title: "Short Sleeve T-shirts",
      rating: "4.5",
      ratingInfo: "(4213)",
      size: "YS-5XL - Also in Women's",
      price: "$399",
      discount: "$499",
      buy: "Add to Cart",
    },
    {
      id: 2,
      image: "/image/front_medium3.png",
      title: "Short Sleeve T-shirts",
      rating: "4.5",
      ratingInfo: "(4213)",
      size: "YS-5XL - Also in Women's",
      price: "$399",
      discount: "$499",
      buy: "Add to Cart",
    },
    {
      id: 3,
      image: "/image/front_medium1.png",
      title: "Short Sleeve T-shirts",
      rating: "4.5",
      ratingInfo: "(4213)",
      size: "YS-5XL - Also in Women's",
      price: "$399",
      discount: "$499",
      buy: "Add to Cart",
    },
    {
      id: 4,
      image: "/image/front_medium4.png",
      title: "Short Sleeve T-shirts",
      rating: "4.5",
      ratingInfo: "(4213)",
      size: "YS-5XL - Also in Women's",
      price: "$399",
      discount: "$499",
      buy: "Add to Cart",
    },
    {
      id: 5,
      image: "/image/front_medium3.png",
      title: "Short Sleeve T-shirts",
      rating: "4.5",
      ratingInfo: "(4213)",
      size: "YS-5XL - Also in Women's",
      price: "$399",
      discount: "$499",
      buy: "Add to Cart",
    },
    {
      id: 6,
      image: "/image/front_medium1.png",
      title: "Short Sleeve T-shirts",
      rating: "4.5",
      ratingInfo: "(4213)",
      size: "YS-5XL - Also in Women's",
      price: "$399",
      discount: "$499",
      buy: "Add to Cart",
    },
   
  ];

  const colors = [
    "#FFC1C1",
    "#C7D2FF",
    "#C5FFCF",
    "#BBC4FF",
    "#FFE8C9",
    "#FF8CF0",
    "#FFB541",
    "#2FA1FF",
    "#0A048E",
    "#D56CFF",
    "#D9D9D9",
  ];

  return (
    <div className="category-section">
    <div className="categories">
      <div className="categoriesContainer">
    
        <div className="categoriesContent">
          <div className="categoriesFilter">
            {/* T-Shirt Filters */}
            <div className="categoriesFilterGroup">
              <label
                className="categoriesFilterName"
                onClick={() => toggleFilter("shirt")}
                htmlFor="shirt"
              >
                T-shirts{" "}
                <span>
                  {openFilter === "shirt" ? (
                    <IoIosArrowUp />
                  ) : (
                    <IoIosArrowDown />
                  )}
                </span>
              </label>
              {openFilter === "shirt" && (
                <div className="categoriesCustomSelect">
                  <ul className="categoriesDropdown">
                    {["Short Sleeve T-Shirts","Long Sleeve T-Shirts","Performance T-Shirts",
                    "Soft Tri-Blend T-Shirts","Sleeveless","Tie-Dye T-Shirts","Women T-Shirts","Kids T-Shirts"].map((filter) => (
                      <li key={filter}>
                        <label>
                          <input
                            type="checkbox"
                            checked={isChecked("shirt", filter)}
                            onChange={() => handleCheckboxChange("shirt", filter)}
                          />
                          {filter}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Colors Filters */}
            <div className="categoriesFilterGroup colorsFilterGroup">
              <label
                className="categoriesFilterName"
                onClick={() => toggleFilter("colors")}
                htmlFor="colors"
              >
                Colors{" "}
                <span>
                  {openFilter === "colors" ? (
                    <IoIosArrowUp />
                  ) : (
                    <IoIosArrowDown />
                  )}
                </span>
              </label>
              {openFilter === "colors" && (
                <div className="colorsCustomSelect">
                  <ul className="categoriesDropdown colorsDropdown">
                    {["#FFC1C1","#C7D2FF","#C5FFCF", "#BBC4FF","#FFE8C9","#FF8CF0","#FFB541","#2FA1FF"
                      ,"#D56CFF","#D9D9D9","#B3FFC9","#FFE6B3","#B3FFE6","#D1B3FF","#FFB3C2","#C2FFB3"
                    ].map((filter) => (
                      <li key={filter} className="colorOption">
                        <label className="colorCheckboxLabel">
                          <input
                            type="checkbox"
                            checked={isChecked("colors", filter)}
                            onChange={() => handleCheckboxChange("colors", filter)}
                            className="colorCheckboxInput"
                          />
                          <span
                            className="colorSwatch"
                            style={{
                              backgroundColor: filter.toLowerCase(),
                            }}
                          ></span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sizes Filters */}
            <div className="categoriesFilterGroup">
              <label
                className="categoriesFilterName"
                onClick={() => toggleFilter("sizes")}
                htmlFor="sizes"
              >
                Sizes{" "}
                <span>
                  {openFilter === "sizes" ? (
                    <IoIosArrowUp />
                  ) : (
                    <IoIosArrowDown />
                  )}
                </span>
              </label>
              {openFilter === "sizes" && (
                <div className="categoriesCustomSelect">
                  <ul className="categoriesDropdown">
                    {["S","M","L","XL","2XL"].map((filter) => (
                      <li key={filter}>
                        <label>
                          <input
                            type="checkbox"
                            checked={isChecked("sizes", filter)}
                            onChange={() => handleCheckboxChange("sizes", filter)}
                          />
                          {filter}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Price Filters */}
            <div className="categoriesFilterGroup">
              <label
                className="categoriesFilterName"
                onClick={() => toggleFilter("price")}
                htmlFor="price"
              >
                Price{" "}
                <span>
                  {openFilter === "price" ? (
                    <IoIosArrowUp />
                  ) : (
                    <IoIosArrowDown />
                  )}
                </span>
              </label>
              {openFilter === "price" && (
                <div className="categoriesCustomSelect">
                  <ul className="categoriesDropdown">
                    {["Under $100", "$100 - $200", "$200 - $300", "Above $400"].map((filter) => (
                      <li key={filter}>
                        <label>
                          <input
                            type="checkbox"
                            checked={isChecked("price", filter)}
                            onChange={() => handleCheckboxChange("price", filter)}
                          />
                          {filter}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Neckline Filters */}
            <div className="categoriesFilterGroup">
              <label
                className="categoriesFilterName"
                onClick={() => toggleFilter("neckline")}
                htmlFor="neckline"
              >
                Neckline{" "}
                <span>
                  {openFilter === "neckline" ? (
                    <IoIosArrowUp />
                  ) : (
                    <IoIosArrowDown />
                  )}
                </span>
              </label>
              {openFilter === "neckline" && (
                <div className="categoriesCustomSelect">
                  <ul className="categoriesDropdown">
                    {["Round Neck", "Collared", "V-Neck", "Crew Neck"].map((filter) => (
                      <li key={filter}>
                        <label>
                          <input
                            type="checkbox"
                            checked={isChecked("neckline", filter)}
                            onChange={() => handleCheckboxChange("neckline", filter)}
                          />
                          {filter}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Brands Filters */}
            <div className="categoriesFilterGroup">
              <label
                className="categoriesFilterName"
                onClick={() => toggleFilter("brands")}
                htmlFor="brands"
              >
                Brands{" "}
                <span>
                  {openFilter === "brands" ? (
                    <IoIosArrowUp />
                  ) : (
                    <IoIosArrowDown />
                  )}
                </span>
              </label>
              {openFilter === "brands" && (
                <div className="categoriesCustomSelect">
                  <ul className="categoriesDropdown">
                    {["Adidas","Allmade","Badger","Alternative Apparel","America Apparel"].map((filter) => (
                      <li key={filter}>
                        <label>
                          <input
                            type="checkbox"
                            checked={isChecked("brands", filter)}
                            onChange={() => handleCheckboxChange("brands", filter)}
                          />
                          {filter}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Material Filters */}
            <div className="categoriesFilterGroup">
              <label
                className="categoriesFilterName"
                onClick={() => toggleFilter("material")}
                htmlFor="material"
              >
                Material{" "}
                <span>
                  {openFilter === "material" ? (
                    <IoIosArrowUp />
                  ) : (
                    <IoIosArrowDown />
                  )}
                </span>
              </label>
              {openFilter === "material" && (
                <div className="categoriesCustomSelect">
                  <ul className="categoriesDropdown">
                    {["Cotton", "Polyester", "Linen", "Wool","Material"].map((filter) => (
                      <li key={filter}>
                        <label>
                          <input
                            type="checkbox"
                            checked={isChecked("material", filter)}
                            onChange={() => handleCheckboxChange("material", filter)}
                          />
                          {filter}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Type Filters */}
            <div className="categoriesFilterGroup">
              <label
                className="categoriesFilterName"
                onClick={() => toggleFilter("type")}
                htmlFor="type"
              >
                Type{" "}
                <span>
                  {openFilter === "type" ? (
                    <IoIosArrowUp />
                  ) : (
                    <IoIosArrowDown />
                  )}
                </span>
              </label>
              {openFilter === "type" && (
                <div className="categoriesCustomSelect">
                  <ul className="categoriesDropdown">
                    {["Casual", "Formal", "Sports", "Slim Fit"].map((filter) => (
                      <li key={filter}>
                        <label>
                          <input
                            type="checkbox"
                            checked={isChecked("type", filter)}
                            onChange={() => handleCheckboxChange("type", filter)}
                          />
                          {filter}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="categoriesCards">
        <h2>Tshirts</h2>

          {Object.values(selectedFilters).flat().length > 0 && (
          <div className="selectedFilters">
            <button
              className="removeAllBtn"
              style={{
                color: "white",
                background: "#2fa1ff",
                padding: "5px 20px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={handleRemoveAll}
            >
              Remove All
            </button>

            {/* Display selected filters */}
            {Object.keys(selectedFilters).map((category) =>
              selectedFilters[category].map((filter) => (
                <div key={filter} className="selectedBadge">
                  {filter}
                  <button
                    className="removeFilterBtn"
                    onClick={() => handleCheckboxChange(category, filter)}
                  >
                    x
                  </button>
                </div>
              ))
            )}
          </div>
        )}

            <div className="categoriesCardsContent">
              {collections.map((e) => (
                <div key={e.id} className="categoriesCardItem">
                  <Link href="/pages/Ordering">
                    <img
                      src={e.image}
                      alt={e.title}
                      width={300}
                      height={200}
                      className="categoriesCardImage"
                    />
                    <div className="categoriesSliderContent">
                      <div className="categoriesCardInfo">
                        <p>{e.title}</p>
                      </div>
                      <div className="categoriesCardIcon">
                        <FaRegHeart />
                      </div>
                    </div>

                    <div className="categoriesColorsList">
                      {colors.map((color, index) => (
                        <div
                          key={index}
                          className="categoriesColorsBox"
                          style={{ backgroundColor: color }}
                        ></div>
                      ))}
                      <div className="categoriesColorValue">
                        <p>+120colors</p>
                      </div>
                    </div>

                    <div className="categoriesCardRating">
                      <div className="categoriesRating">{e.rating}</div>
                      <div className="categoriesStars">
                        {[...Array(5)].map((_, index) => (
                          <FaStar
                            key={index}
                            color={
                              index < Math.round(parseFloat(e.rating))
                                ? "#FFD700"
                                : "#e4e5e9"
                            }
                          />
                        ))}
                      </div>
                      <div className="categoriesRatingInfo">{e.ratingInfo}</div>
                    </div>

                    <div className="categoriesShirtSize">
                      <div className="categoriesSize">{e.size}</div>
                    </div>

                    <div className="categoriesCardAmount">
                      <div className="categoriesPrice">{e.price}</div>
                      <div className="categoriesDiscount">{e.discount}</div>
                    </div>
                    <div className="categoriesAddCart">{e.buy}</div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    
      </div>
    </div>
  );
};

export default ColorSize;
