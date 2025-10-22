"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '@/app/services/apicofig';

const Terms = () => {
  
  const username = '432137';
  const password = '27c5e968-e76b-49d8-9cb9-a597df32e874';

  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadTime, setLoadTime] = useState(null); 
  const productsPerPage = 100;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const start = Date.now();
      const baseCategory = "T-Shirts - Premium";
      // http://103.146.234.88:3001/api/Products/ByCategory?baseCategory=T-Shirts%20-%20Premium

      const response = await axios.get(
        `${API_URL}/Products/ByCategory?baseCategory=${baseCategory}`
      );

      const end = Date.now();
      setLoadTime(((end - start) / 1000).toFixed(2));
  
      setProducts(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };
  
  // https://api.ssactivewear.com/v2/products/?style=39https://api.ssactivewear.com/v2/products/?style=39
  //  const fetchProducts = async () => {
  //   try {
  //     const response = await axios.get('https://api.ssactivewear.com/v2/products/?style=39', {
  //       auth: {
  //         username: username,
  //         password: password,
  //       },
  //     });
  //     setProducts(response.data);
  //   } catch (error) {
  //     console.error('Error fetching products:', error);
  //   }
  // };


  // Pagination logic
  
  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = products.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(products.length / productsPerPage);

  return (
    <div style={{ padding: '20px', paddingTop: '90px' }}>
      <h1>Product List (Page {currentPage})</h1>
      {loadTime && <p style={{ color: 'gray' }}>Data fetched in {loadTime} sec</p>}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
        {currentProducts.map(product => (
          <div key={product.styleID} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '10px' }}>
            <img
              src={`https://cdn.ssactivewear.com/${product.styleImage}`}
              alt={product.title}
              style={{ width: '100%', height: '200px', objectFit: 'contain', borderRadius: '8px' }}
          
            />
            <h3>{product.title}</h3>
            <p><strong>Brand:</strong> {product.brandName}</p>
            <p><strong>Style:</strong> {product.styleName}</p>
            <div dangerouslySetInnerHTML={{ __html: product.description }} />
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>
          Prev
        </button>
        <span style={{ margin: '0 10px' }}>Page {currentPage} of {totalPages}</span>
        <button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Terms;
