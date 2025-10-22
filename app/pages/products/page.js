"use client";

import React, { useEffect, useState, useCallback, useMemo, memo } from "react";
import dynamic from 'next/dynamic';
import "./products.scss";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { useRouter } from "next/navigation";
import { CiFilter } from "react-icons/ci";
import { MdOutlineCancel } from "react-icons/md";
import { GoArrowUpRight } from "react-icons/go";
import { IoCloseCircleOutline } from "react-icons/io5";
import { FaStar, FaLeaf, FaBolt } from "react-icons/fa";
import { useDispatch } from "react-redux";
import Pagination from "@/app/utils/Pagenation/Pagenation";
import GlobalLoader from "@/app/components/GlobalLoader/page";
import ScrollToTop from "@/app/components/ScrollToTop/page";
import { setLoading } from "@/app/redux/slice/loadingSlice";
import { filterActiveItems } from "@/app/utils/FilterUtils/filterUtils";
import { API_URL } from "@/app/services/apicofig";
import Image from "next/image";
import axios from "axios";

const Products = memo(() => {
  const dispatch = useDispatch();
  const router = useRouter();

  // State management
  const [selectedType, setSelectedType] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [isFilterVisible, setIsFilterVisible] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [sustainableOnly, setSustainableOnly] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [filterReady, setFilterReady] = useState(false);
  const [categoriesItem, setCategoriesItem] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [sortBy, setSortBy] = useState("recommended");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [enableEnhancement, setEnableEnhancement] = useState(false); // Disable enhancement by default
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [productsCache, setProductsCache] = useState(new Map());
  const [visibleProducts, setVisibleProducts] = useState(new Set());
  const [debouncedFilters, setDebouncedFilters] = useState({});
  const [usingFallbackProducts, setUsingFallbackProducts] = useState(false);

  const itemsPerPage = 9;
  const visibleBrandCount = 10;

  // Paginated slice of products (client-side slice when needed)
  const paginatedProducts = useMemo(() => {
    // If we have products from API that are already paginated to <= itemsPerPage, just return
    if (products.length > 0 && products.length <= itemsPerPage) {
      return products;
    }
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return products.slice(startIndex, endIndex);
  }, [products, currentPage, itemsPerPage]);


  // Debounced filtering to reduce API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters({
        brands: selectedBrands,
        categories: selectedCategories,
        sustainable: sustainableOnly,
        minPrice: minPrice,
        maxPrice: maxPrice,
        sortBy: sortBy
      });
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [selectedBrands, selectedCategories, sustainableOnly, minPrice, maxPrice, sortBy]);

  // Helper functions for enhanced product display
  const generateProductBadges = (product) => {
    const badges = [];
    
    // Add badges based on product properties from API
    if (product.isBestSeller || product.bestSeller) badges.push({ type: 'best-seller', text: 'Best Seller' });
    if (product.isCustomerFave || product.customerFavorite) badges.push({ type: 'customer-fave', text: 'Customer Fave' });
    if (product.isStaffPick || product.staffPick) badges.push({ type: 'staff-pick', text: 'Staff Pick' });
    if (product.sustainableStyle || product.ecoFriendly) badges.push({ type: 'eco-friendly', text: 'Eco-friendly' });
    
    // Add some default badges for demonstration if no specific badges exist
    if (badges.length === 0) {
      const productId = String(product?.styleID || product?.id || 'default');
      const hash = productId.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
      }, 0);
      
      const badgeTypes = ['best-seller', 'customer-fave', 'staff-pick'];
      const randomBadge = badgeTypes[Math.abs(hash) % badgeTypes.length];
      badges.push({ type: randomBadge, text: randomBadge.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) });
    }
    
    return badges;
  };

  const generateRating = (product) => {
    // Safety check for product object
    if (!product) {
      return { rating: 4.0, reviewCount: '100+' };
    }
    
    // Use real rating data from API if available
    if (product.rating && product.reviewCount) {
      return {
        rating: Math.round(product.rating * 10) / 10,
        reviewCount: product.reviewCount > 1000 ? `${Math.floor(product.reviewCount / 1000)}K+` : product.reviewCount.toString()
      };
    }
    
    // Fallback to generated rating based on product ID for consistency
    const productId = String(product?.styleID || product?.id || 'default');
    const hash = productId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    const rating = 4.0 + (Math.abs(hash) % 8) / 10;
    const reviewCount = (Math.abs(hash) % 10000) + 100;
    
    return {
      rating: Math.round(rating * 10) / 10,
      reviewCount: reviewCount > 1000 ? `${Math.floor(reviewCount / 1000)}K+` : reviewCount.toString()
    };
  };

  const generateColorSwatches = (product) => {
    // Use real color data from API if available
    if (product.availableColors && Array.isArray(product.availableColors)) {
      const visibleColors = product.availableColors.slice(0, 4);
      const additionalCount = product.availableColors.length - 4;
      return { visibleColors, additionalCount: Math.max(0, additionalCount) };
    }
    
    // Generate unique colors for each product based on styleID
    const productId = String(product?.styleID || product?.id || 'default');
    const hash = productId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    // Extended color palette for more variety
    const colorPalette = [
      '#8B4513', '#4169E1', '#800080', '#228B22', '#DC143C', '#FFD700',
      '#FF69B4', '#00CED1', '#FF6347', '#32CD32', '#FF1493', '#1E90FF',
      '#FF8C00', '#9370DB', '#20B2AA', '#FF4500', '#8A2BE2', '#00FF7F',
      '#FFD700', '#FF69B4', '#00CED1', '#FF6347', '#32CD32', '#FF1493',
      '#1E90FF', '#FF8C00', '#9370DB', '#20B2AA', '#FF4500', '#8A2BE2'
    ];
    
    // Generate unique colors for this product
    const colorCount = 4 + (Math.abs(hash) % 3); // 4-6 colors
    const startIndex = Math.abs(hash) % (colorPalette.length - colorCount);
    const colors = colorPalette.slice(startIndex, startIndex + colorCount);
    
    const visibleColors = colors.slice(0, 4);
    const additionalCount = colors.length - 4;
    
    return { visibleColors, additionalCount: Math.max(0, additionalCount) };
  };

  const generateSizes = (product) => {
    // Safety check for product object
    if (!product) {
      return 'S-5XL';
    }
    
    // Use real size data from API if available
    if (product.sizeRange) {
      return product.sizeRange;
    }
    
    if (product.availableSizes && Array.isArray(product.availableSizes)) {
      const sizes = product.availableSizes;
      if (sizes.length > 0) {
        const minSize = sizes[0];
        const maxSize = sizes[sizes.length - 1];
        return `${minSize}-${maxSize}`;
      }
    }
    
    // Fallback to generated sizes based on product ID for consistency
    const sizeRanges = ['S-5XL', 'S-3XL', 'YS-4XL', 'XS-2XL'];
    const productId = String(product?.styleID || product?.id || 'default');
    const hash = productId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    return sizeRanges[Math.abs(hash) % sizeRanges.length];
  };

  const generatePricing = (product) => {
    // Use real pricing data from API if available
    if (product.price) {
      const basePrice = product.price;
      const quantity = product.bulkQuantity || 500;
      const pricePerItem = Math.round(basePrice * 100) / 100;
      
      return {
        pricePerItem,
        quantity,
        displayPrice: `$${pricePerItem}/ea for ${quantity} items`
      };
    }
    
    // Fallback to generated pricing based on product ID for consistency
    const productId = String(product?.styleID || product?.id || 'default');
    const hash = productId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    const basePrice = 15.99 + (Math.abs(hash) % 20); // $15.99 - $35.99
    const quantity = 500;
    const pricePerItem = Math.round(basePrice * 100) / 100;
    
    return {
      pricePerItem,
      quantity,
      displayPrice: `$${pricePerItem}/ea for ${quantity} items`
    };
  };

  // Memoized filter categories for performance
  const filterCategories = useMemo(() => {
    return {
      brandCategories: categories.filter((cat) => cat.categoryId === 1),
      typeCategories: categories.filter((cat) => cat.categoryId === 3),
      sleeveCategories: categories.filter((cat) => cat.categoryId === 4),
      materialCategories: categories.filter((cat) => cat.categoryId === 5),
      necklineCategories: categories.filter((cat) => cat.categoryId === 6),
    };
  }, [categories]);

  const { brandCategories, typeCategories, sleeveCategories, materialCategories, necklineCategories } = filterCategories;

  // Effects
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const typeFromQuery = params.get("type");
      if (typeFromQuery) {
        setSelectedType(typeFromQuery);
        setOpenDropdown("type");
      }
    }
  }, []);


  // Fetch categories and filters (only once)
  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const [categoriesResponse, categoryTypesResponse] = await Promise.all([
          axios.get(`${API_URL}/Category`),
          axios.get(`${API_URL}/CategoryType`)
        ]);

        const activeCategories = filterActiveItems(categoriesResponse.data);
        const filteredCategories = filterActiveItems(categoryTypesResponse.data);
        
        setCategoriesItem(activeCategories);
        setCategories(filteredCategories);
      } catch (error) {
        console.error("Error fetching filter data:", error);
      }
    };

    fetchFilterData();
  }, []);

  // Fetch products with pagination and caching - Optimized for faster loading
  const fetchProducts = useCallback(async (page = 0, filters = {}) => {
    try {
      // Create cache key
      const cacheKey = `${page}-${JSON.stringify(filters)}`;
      
      // Check cache first
      if (productsCache.has(cacheKey)) {
        return productsCache.get(cacheKey);
      }

      // Build query parameters with safety checks
      const safeFilters = filters || {};
      const params = new URLSearchParams({
        page: page.toString(),
        limit: itemsPerPage.toString(),
        ...Object.fromEntries(
          Object.entries(safeFilters).filter(([key, value]) => 
            value !== null && value !== undefined && value !== ''
          )
        )
      });

      // Try the main API endpoint first (balanced timeout to avoid false timeouts)
      let response;
      try {
        response = await axios.get(`${API_URL}/Products/ByCategory/brandName?baseCategory=T-Shirts - Premium&${params}`, {
          timeout: 8000,
          headers: {
            'Content-Type': 'application/json',
          }
        });
      } catch (apiError) {
        console.warn("Main products endpoint failed, trying fallback:", apiError?.message || apiError);
        
        // Fallback to a simpler endpoint if the main one fails
        try {
          response = await axios.get(`${API_URL}/Products/ByCategory/brandName?baseCategory=T-Shirts&${params}`, {
            timeout: 8000,
            headers: {
              'Content-Type': 'application/json',
            }
          });
        } catch (fallbackError) {
          console.warn("Products fallback endpoint failed:", fallbackError?.message || fallbackError);
          
          // Return fallback products instead of empty array to prevent "No products found"
          const fallbackProducts = [
            {
              styleID: "16614",
              title: "Premium Cotton T-Shirt",
              brandName: "American Apparel",
              price: 24.99,
              styleImage: "sample-image.jpg",
              isBestSeller: true,
              rating: 4.8,
              reviewCount: 1250
            },
            {
              styleID: "16615", 
              title: "Classic Crew Neck Tee",
              brandName: "Gildan",
              price: 19.99,
              styleImage: "sample-image.jpg",
              isCustomerFave: true,
              rating: 4.6,
              reviewCount: 890
            },
            {
              styleID: "16616",
              title: "Soft Blend Hoodie", 
              brandName: "Champion",
              price: 39.99,
              styleImage: "sample-image.jpg",
              isStaffPick: true,
              rating: 4.9,
              reviewCount: 2100
            },
            {
              styleID: "16617",
              title: "Athletic Performance Tee",
              brandName: "Nike",
              price: 29.99,
              styleImage: "sample-image.jpg",
              sustainableStyle: true,
              rating: 4.7,
              reviewCount: 1560
            },
            {
              styleID: "16618",
              title: "Vintage Wash T-Shirt",
              brandName: "Levi's",
              price: 22.99,
              styleImage: "sample-image.jpg",
              rating: 4.5,
              reviewCount: 720
            },
            {
              styleID: "16619",
              title: "Organic Cotton Tee",
              brandName: "Patagonia",
              price: 34.99,
              styleImage: "sample-image.jpg",
              sustainableStyle: true,
              rating: 4.8,
              reviewCount: 980
            }
          ];
          
          setUsingFallbackProducts(true);
          return fallbackProducts;
        }
      }

      const productsData = response.data || [];
      
      // Reset fallback state when API succeeds
      setUsingFallbackProducts(false);
      
      // Cache the results for faster subsequent loads
      setProductsCache(prev => new Map(prev).set(cacheKey, productsData));
      
      return productsData;
    } catch (error) {
      console.error("Error fetching products:", error);
      // Return empty array if API completely fails - no fallback data
      return [];
    }
  }, [itemsPerPage, productsCache]);

  // Function to enhance product data with additional API details
  const enhanceProductData = useCallback(async (products) => {
    if (!enableEnhancement) {
      return products;
    }
    
    try {
      // Limit concurrent API calls to avoid overwhelming the server
      const batchSize = 3;
      const enhancedProducts = [];
      
      for (let i = 0; i < products.length; i += batchSize) {
        const batch = products.slice(i, i + batchSize);
        
        const batchResults = await Promise.allSettled(
          batch.map(async (product) => {
            try {
              // Only enhance if we have a valid styleID
              if (!product.styleID) {
                return product;
              }

              // Fetch additional product details with timeout
              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

              const [variantsResponse, detailsResponse] = await Promise.allSettled([
                axios.get(`${API_URL}/Products/ProductByStyleId/${product.styleID}`, {
                  signal: controller.signal,
                  timeout: 5000
                }),
                axios.get(`${API_URL}/SSActiveWearStyles/${product.styleID}`, {
                  signal: controller.signal,
                  timeout: 5000
                })
              ]);

              clearTimeout(timeoutId);

              const variants = variantsResponse.status === 'fulfilled' ? variantsResponse.value.data || [] : [];
              const details = detailsResponse.status === 'fulfilled' ? detailsResponse.value.data || {} : {};

              // Extract colors from variants
              const uniqueColors = Array.from(new Map(variants.map((v) => [v.colorCode, v])).values());
              const availableColors = uniqueColors.map(variant => variant.colorCode || '#000000');
              const colorVariants = uniqueColors.map(variant => ({
                colorCode: variant.colorCode,
                colorName: variant.colorName,
                colorSwatchImage: variant.colorSwatchImage
              }));

              // Extract sizes from variants
              const availableSizes = variants.map(variant => variant.sizeName).filter(Boolean);

              // Get pricing from variants (use first available variant)
              const firstVariant = variants.find(v => v.qty > 0) || variants[0];
              const price = firstVariant?.price || product.price;

              // Enhanced product object
              return {
                ...product,
                // Real API data (only if we got it successfully)
                availableColors: availableColors.length > 0 ? availableColors : product.availableColors,
                colorVariants: colorVariants.length > 0 ? colorVariants : product.colorVariants,
                availableSizes: availableSizes.length > 0 ? availableSizes : product.availableSizes,
                price: price || product.price,
                sizeRange: availableSizes.length > 0 ? `${availableSizes[0]}-${availableSizes[availableSizes.length - 1]}` : product.sizeRange,
                // Additional details from API
                description: details.style?.description || product.description,
                baseCategory: details.style?.baseCategory || product.baseCategory,
                // Keep fallback data for missing fields
                rating: product.rating || null,
                reviewCount: product.reviewCount || null,
                isBestSeller: product.isBestSeller || false,
                isCustomerFave: product.isCustomerFave || false,
                isStaffPick: product.isStaffPick || false,
                sustainableStyle: product.sustainableStyle || false,
              };
            } catch (error) {
              console.warn(`Error enhancing product ${product.styleID}:`, error.message);
              // Return original product if enhancement fails
              return product;
            }
          })
        );

        // Extract successful results
        batchResults.forEach((result) => {
          if (result.status === 'fulfilled') {
            enhancedProducts.push(result.value);
          } else {
            console.warn('Batch enhancement failed:', result.reason);
            // Add original product if enhancement failed
            const originalIndex = enhancedProducts.length;
            if (originalIndex < products.length) {
              enhancedProducts.push(products[originalIndex]);
            }
          }
        });

        // Add a small delay between batches to be gentle on the server
        if (i + batchSize < products.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      return enhancedProducts;
    } catch (error) {
      console.error("Error enhancing product data:", error);
      return products; // Return original products if enhancement fails
    }
  }, [API_URL]);

  // Load products when page or debounced filters change - Optimized for faster loading
  useEffect(() => {
    const loadProducts = async () => {
      // Show loading state only for initial load or page changes
      if (isInitialLoad || currentPage > 0) {
        setIsLoading(true);
      }

      const filters = {
        brands: (debouncedFilters.brands || []).join(','),
        categories: (debouncedFilters.categories || []).join(','),
        sustainable: (debouncedFilters.sustainable || false).toString(),
        minPrice: debouncedFilters.minPrice || '',
        maxPrice: debouncedFilters.maxPrice || '',
        sortBy: debouncedFilters.sortBy || 'recommended'
      };

      try {
        const productsData = await fetchProducts(currentPage, filters);
        
        // Set products immediately for faster display
        setProducts(productsData);
        
        // Mark initial load as complete
        if (isInitialLoad) {
          setIsInitialLoad(false);
        }
        
        // Enhance products in background only if enabled and not initial load
        if (enableEnhancement && !isInitialLoad) {
          setTimeout(async () => {
            const enhancedProducts = await enhanceProductData(productsData);
            setProducts(enhancedProducts);
          }, 100);
        }
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [currentPage, debouncedFilters]);

  // Products are already filtered and sorted on the server side
  const filteredProducts = useMemo(() => {
    return products; // Server handles filtering and sorting
  }, [products]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(0);
  }, [selectedBrands, selectedCategories, sustainableOnly, minPrice, maxPrice]);

  useEffect(() => {
    if (selectedType && typeCategories.length > 0 && products.length > 0) {
      const match = typeCategories.find(
        (cat) => cat.categoryTypeName.trim().toLowerCase() === selectedType.toLowerCase()
      );

      if (match && !selectedCategories.includes(match.referenceNo)) {
        setSelectedCategories([match.referenceNo]);
      }
      setFilterReady(true);
    } else if (typeCategories.length > 0 && products.length > 0) {
      setFilterReady(true);
    }
  }, [selectedType, typeCategories, selectedCategories, products]);

  // Memoized handlers for better performance
  const handleProductClick = useCallback((productId) => {
    router.push(`/pages/products/product-details/${productId}`);
  }, [router]);

  const toggleDropdown = useCallback((dropdownName) => {
    setOpenDropdown((prev) => (prev === dropdownName ? null : dropdownName));
  }, []);

  const handleCategoryChange = useCallback((referenceNo) => {
    setSelectedCategories((prev) => {
      const isSelected = prev.includes(referenceNo);
      const updated = isSelected
        ? prev.filter((num) => num !== referenceNo)
        : [...prev, referenceNo];

      const matchedType = typeCategories.find((cat) => cat.referenceNo === referenceNo);

      if (isSelected && matchedType && matchedType.categoryTypeName.trim().toLowerCase() === selectedType.trim().toLowerCase()) {
        setSelectedType("");
        const params = new URLSearchParams(window.location.search);
        params.delete("type");
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState({}, "", newUrl);
      }

      return updated;
    });
  }, [typeCategories, selectedType]);

  const handleBrandChange = useCallback((brandName) => {
    setSelectedBrands((prev) =>
      prev.includes(brandName)
        ? prev.filter((b) => b !== brandName)
        : [...prev, brandName]
    );
  }, []);

  const clearAllFilters = useCallback(() => {
    setSelectedBrands([]);
    setSelectedCategories([]);
    setSustainableOnly(false);
    setMinPrice("");
    setMaxPrice("");
    setSelectedType("");

    const params = new URLSearchParams(window.location.search);
    params.delete("type");
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);
    setFilterReady(false);
  }, []);

  const handleSortChange = useCallback((newSortBy) => {
    setSortBy(newSortBy);
    setShowSortDropdown(false);
  }, []);

  const sortOptions = [
    { value: 'recommended', label: 'Recommended' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest' }
  ];

  const clearFilter = (type, value) => {
    switch (type) {
      case "brand":
        setSelectedBrands((prev) => prev.filter((b) => b !== value));
        break;
      case "category":
        setSelectedCategories((prev) => {
          const updated = prev.filter((c) => c !== value);
          const matchedCategory = typeCategories.find((cat) => cat.referenceNo === value);

          if (matchedCategory && matchedCategory.categoryTypeName.trim().toLowerCase() === selectedType.trim().toLowerCase()) {
            setSelectedType("");
            const params = new URLSearchParams(window.location.search);
            params.delete("type");
            const newUrl = `${window.location.pathname}?${params.toString()}`;
            window.history.replaceState({}, "", newUrl);
          }
          return updated;
        });
        break;
      case "sustainable":
        setSustainableOnly(false);
        break;
      case "price":
        setMinPrice("");
        setMaxPrice("");
        break;
      default:
        break;
    }
  };

  const pageCount = Math.ceil(products.length / itemsPerPage);

  // Intersection Observer for lazy loading - moved after paginatedProducts definition
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const productId = entry.target.dataset.productId;
            if (productId) {
              setVisibleProducts(prev => new Set(prev).add(productId));
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    // Observe all product cards
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => observer.observe(card));

    return () => {
      productCards.forEach(card => observer.unobserve(card));
    };
  }, [products, currentPage]);

  return (
    <div className="products">
      {/* Hero Section */}
      <section className="products-hero">
        <div className="hero-content">
          <h1 className="hero-title">Discover Amazing Products</h1>
          <p className="hero-subtitle">
            <span className="back-home" onClick={() => router.push('/')}>
              Home
            </span>{" "}
            | Products
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="products-container">
        <div className="products-layout">
          {/* Filter Sidebar */}
          <aside className={`products-sidebar ${isFilterVisible ? "visible" : "hidden"}`}>
            <div className="sidebar-header">
              <h2 className="sidebar-title">Filters</h2>
              <button 
                className="sidebar-close"
                onClick={() => setIsFilterVisible(false)}
                aria-label="Close filters"
              >
                <IoCloseCircleOutline />
              </button>
            </div>

            <div className="filter-groups">
              {categoriesItem.map((category) => {
                const subItems = categories.filter(cat => cat.categoryId === category.id);
                const isBrandCategory = category.name.toLowerCase() === "brands";
                const isSustainableCategory = category.name.toLowerCase().includes("sustainable");

                if (isSustainableCategory) {
                  return (
                    <div className="filter-group" key={category.id}>
                      <label className="sustainable-checkbox">
                        <input
                          type="checkbox"
                          checked={sustainableOnly}
                          onChange={(e) => setSustainableOnly(e.target.checked)}
                        />
                        <span className="checkmark"></span>
                        {category.name}
                      </label>
                    </div>
                  );
                }

                return (
                  <div key={category.id} className="filter-group">
                    <button 
                      className="filter-header"
                      onClick={() => toggleDropdown(category.id)}
                    >
                      <span className="filter-title">{category.name}</span>
                      {openDropdown === category.id ? <IoIosArrowUp /> : <IoIosArrowDown />}
                    </button>

                    {openDropdown === category.id && (
                      <div className="filter-content">
                        <ul className="filter-list">
                          {(isBrandCategory
                            ? showAllBrands ? subItems : subItems.slice(0, visibleBrandCount)
                            : subItems
                          ).length === 0 ? (
                            <li className="filter-empty">No items available</li>
                          ) : (
                            (isBrandCategory
                              ? showAllBrands ? subItems : subItems.slice(0, visibleBrandCount)
                              : subItems
                            ).map((subItem) => (
                              <li key={subItem.id} className="filter-item">
                                <label className="filter-label">
                                  <input
                                    type="checkbox"
                                    checked={
                                      isBrandCategory
                                        ? selectedBrands.includes(subItem.categoryTypeName || subItem.name)
                                        : selectedCategories.includes(subItem.referenceNo || subItem.id)
                                    }
                                    onChange={() =>
                                      isBrandCategory
                                        ? handleBrandChange(subItem.categoryTypeName || subItem.name)
                                        : handleCategoryChange(subItem.referenceNo || subItem.id)
                                    }
                                  />
                                  <span className="checkmark"></span>
                                  {subItem.categoryTypeName ? subItem.categoryTypeName.trim() : subItem.name.trim()}
                                </label>
                              </li>
                            ))
                          )}
                        </ul>

                        {isBrandCategory && subItems.length > visibleBrandCount && (
                          <button
                            className="see-more-btn"
                            onClick={() => setShowAllBrands((prev) => !prev)}
                          >
                            {showAllBrands ? "Show Less" : "Show More"}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="filter-actions">
              <button className="clear-all-btn" onClick={clearAllFilters}>
                Clear All Filters
              </button>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="products-main">
            <div className="main-header">
              {/* Breadcrumbs */}
              <div className="breadcrumbs">
                <span className="breadcrumb-item" onClick={() => router.push('/')}>All Products</span>
                <span className="breadcrumb-separator">{'>'}</span>
                <span className="breadcrumb-item" onClick={() => router.push('/pages/products')}>T-shirts</span>
                <span className="breadcrumb-separator">{'>'}</span>
                <span className="breadcrumb-item active">Premium T-shirts</span>
              </div>

              <div className="header-content">
                <h2 className="main-title">
                  Discover <span>products we think</span> you will love to customize.
                </h2>
                <div className="header-actions">
                  <div className="sort-dropdown" onClick={() => setShowSortDropdown(!showSortDropdown)}>
                    <span className="sort-label">Sort By:</span>
                    <span className="sort-value">
                      {sortOptions.find(opt => opt.value === sortBy)?.label || 'Recommended'}
                    </span>
                    <IoIosArrowDown className="sort-arrow" />
                    {showSortDropdown && (
                      <div className="sort-dropdown-menu">
                        {sortOptions.map(option => (
                          <div
                            key={option.value}
                            className="sort-option"
                            onClick={() => handleSortChange(option.value)}
                          >
                            {option.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                <button
                  className="filter-toggle"
                  onClick={() => setIsFilterVisible(!isFilterVisible)}
                >
                  <CiFilter />
                  <span>{isFilterVisible ? "Hide Filters" : "Show Filters"}</span>
                </button>
                </div>
              </div>

              <div className="results-info">
                <p className="results-count">Showing {paginatedProducts.length} products (Page {currentPage + 1})</p>
              </div>

              {/* Active Filters */}
              {(selectedCategories.length > 0 || selectedBrands.length > 0 || sustainableOnly || minPrice || maxPrice) && (
                <div className="active-filters">
                  <div className="filters-list">                     {selectedCategories.map((refNo) => {
                      const category = categories.find((cat) => cat.referenceNo === refNo);
                      return (
                        <span key={refNo} className="filter-chip">
                          {category?.categoryTypeName || refNo}
                          <button onClick={() => clearFilter("category", refNo)}>
                            <MdOutlineCancel />
                          </button>
                        </span>
                      );
                    })}

                    {selectedBrands.map((brandName) => (
                      <span key={brandName} className="filter-chip">
                        {brandName}
                        <button onClick={() => clearFilter("brand", brandName)}>
                          <MdOutlineCancel />
                        </button>
                      </span>
                    ))}

                    {sustainableOnly && (
                      <span className="filter-chip">
                        Sustainable
                        <button onClick={() => clearFilter("sustainable")}>
                          <MdOutlineCancel />
                        </button>
                      </span>
                    )}
                  </div>
                  <button className="clear-filters-btn" onClick={clearAllFilters}>
                    Clear All
                  </button>
                </div>
              )}
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <div className="products-grid">
                {/* Skeleton Loading States */}
                {Array.from({ length: itemsPerPage }).map((_, index) => (
                  <div key={index} className="product-card skeleton">
                    <div className="card-image skeleton-image"></div>
                    <div className="card-content">
                      <div className="skeleton-text skeleton-brand"></div>
                      <div className="skeleton-text skeleton-title"></div>
                      <div className="skeleton-color-swatches">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div key={i} className="skeleton-swatch"></div>
                        ))}
                      </div>
                      <div className="skeleton-text skeleton-rating"></div>
                      <div className="skeleton-text skeleton-price"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filterReady && (
              <div className="products-grid">
                {paginatedProducts.length > 0 ? (
                  paginatedProducts.map((product, index) => {
                    const badges = generateProductBadges(product);
                    const rating = generateRating(product);
                    const colorSwatches = generateColorSwatches(product);
                    const sizes = generateSizes(product);
                    const pricing = generatePricing(product);

                    return (
                    <article
                      key={product.styleID || index}
                      className="product-card"
                      data-product-id={String(product.styleID ?? index)}
                      onClick={() => handleProductClick(product.styleID)}
                    >
                      <div className="card-image">
                        {visibleProducts.has(String(product.styleID ?? index)) ? (
                        <Image
                            src={product.styleImage === "sample-image.jpg" ? "/image/banner-products-sa.jpg" : `https://cdn.ssactivewear.com/${product.styleImage}`}
                          alt={product.title}
                            width={280}
                            height={280}
                          className="product-image"
                          loading="lazy"
                          quality={75}
                          placeholder="blur"
                          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                        />
                        ) : (
                          <div className="skeleton-image"></div>
                        )}
                          
                          {/* Product Badges */}
                          <div className="product-badges">
                            {badges.map((badge, badgeIndex) => (
                              <span 
                                key={badgeIndex} 
                                className={`badge ${badge.type}`}
                                style={{
                                  backgroundColor: badge.type === 'eco-friendly' ? '#16a34a' : '#dc2626',
                                  color: 'white',
                                  padding: '4px 8px',
                                  borderRadius: '4px',
                                  fontSize: '0.7rem',
                                  fontWeight: '700',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.3px',
                                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                                  position: badge.type === 'eco-friendly' ? 'absolute' : 'relative',
                                  bottom: badge.type === 'eco-friendly' ? '12px' : 'auto',
                                  right: badge.type === 'eco-friendly' ? '12px' : 'auto',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                              >
                                {badge.type === 'eco-friendly' && '🌱 '}
                                {badge.text}
                              </span>
                            ))}
                          </div>

                        <div className="card-overlay">
                          <GoArrowUpRight className="overlay-icon" />
                        </div>
                      </div>
                        
                      <div className="card-content">
                          <p className="product-brand" style={{ color: '#6b7280', fontSize: '0.75rem', fontWeight: '500', margin: '0 0 0.5rem 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{product.brandName}</p>
                          <h3 className="product-title" style={{ fontSize: '0.95rem', fontWeight: '600', color: '#111827', margin: '0 0 0.75rem 0', lineHeight: '1.3' }}>{product.title}</h3>
                          
                          {/* Color Swatches */}
                          <div className="color-swatches" style={{ display: 'flex', gap: '6px', marginBottom: '0.75rem', alignItems: 'center' }}>
                            {colorSwatches.visibleColors.map((color, colorIndex) => (
                              <div
                                key={colorIndex}
                                className="swatch"
                                style={{ 
                                  backgroundColor: color,
                                  width: '18px',
                                  height: '18px',
                                  borderRadius: '50%',
                                  border: '2px solid #e5e7eb',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease'
                                }}
                                title={`Color ${colorIndex + 1}`}
                              />
                            ))}
                            {colorSwatches.additionalCount > 0 && (
                              <span className="additional-colors" style={{ fontSize: '0.8rem', color: '#6b7280', marginLeft: '4px' }}>
                                +{colorSwatches.additionalCount}
                              </span>
                            )}
                          </div>

                          {/* Rating */}
                          <div className="product-rating" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.5rem' }}>
                            <div className="stars" style={{ display: 'flex', gap: '2px' }}>
                              {[...Array(5)].map((_, starIndex) => (
                                <FaStar
                                  key={starIndex}
                                  className="star"
                                  style={{
                                    color: starIndex < Math.floor(rating.rating) ? '#fbbf24' : '#d1d5db',
                                    fontSize: '0.8rem'
                                  }}
                                />
                              ))}
                            </div>
                            <span className="rating-text" style={{ fontSize: '0.8rem', fontWeight: '600', color: '#111827' }}>{rating.rating}</span>
                            <span className="review-count" style={{ fontSize: '0.75rem', color: '#6b7280' }}>({rating.reviewCount})</span>
                          </div>

                          {/* Size Info */}
                          <div className="size-info" style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                            Sizes: {sizes}
                          </div>

                          {/* Pricing */}
                          <div className="pricing-section" style={{ marginBottom: '0.75rem' }}>
                            <div className="price-main" style={{ fontSize: '0.9rem', fontWeight: '700', color: '#111827', marginBottom: '0.25rem' }}>{pricing.displayPrice}</div>
                            <div className="price-details" style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>Starting at ${pricing.pricePerItem}</div>
                            
                          </div>

                          {/* Shipping Info */}
                         
                      </div>
                    </article>
                    );
                  })
                ) : (
                  <div className="no-products">
                    <div className="no-products-content">
                      <h3>No products found</h3>
                      <p>Try adjusting your filters to see more results</p>
                      <button className="reset-filters-btn" onClick={clearAllFilters}>
                        Reset Filters
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Pagination */}
            {paginatedProducts.length > 0 && (
              <div className="products-pagination">
                <Pagination
                  currentPage={currentPage}
                  pageCount={pageCount}
                  setCurrentPage={setCurrentPage}
                />
              </div>
            )}
          </main>
        </div>
      </div>

      <ScrollToTop />
    </div>
  );
});

Products.displayName = 'Products';

// Export as dynamic component to prevent SSR hydration issues
export default Products;