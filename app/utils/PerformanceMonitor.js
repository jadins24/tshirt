"use client";

import { useEffect } from 'react';

// Performance monitoring utilities
export const PerformanceMonitor = () => {
  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      // Monitor Core Web Vitals
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log(`${entry-key}: ${entry.value}`);
          
          // Log performance metrics
          if (entry.entryType === 'navigation') {
            console.log('Page Load Performance:', {
              domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
              loadComplete: entry.loadEventEnd - entry.loadEventStart,
              totalTime: entry.loadEventEnd - entry.navigationStart
            });
          }
        }
      });

      observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] });

      // Monitor resource loading
      const resourceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 1000) { // Log resources taking more than 1 second
            console.warn('Slow resource:', {
              name: entry.name,
              duration: entry.duration,
              size: entry.transferSize
            });
          }
        }
      });

      resourceObserver.observe({ entryTypes: ['resource'] });

      return () => {
        observer.disconnect();
        resourceObserver.disconnect();
      };
    }
  }, []);

  return null;
};

// Hook to measure component render time
export const useRenderTime = (componentName) => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const start = performance.now();
      
      return () => {
        const end = performance.now();
        console.log(`${componentName} render time: ${end - start}ms`);
      };
    }
  });
};

// Hook to measure API call performance
export const useApiPerformance = () => {
  const measureApiCall = async (apiCall, endpoint) => {
    const start = performance.now();
    
    try {
      const result = await apiCall();
      const end = performance.now();
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`API call ${endpoint}: ${end - start}ms`);
      }
      
      return result;
    } catch (error) {
      const end = performance.now();
      console.error(`API call ${endpoint} failed after ${end - start}ms:`, error);
      throw error;
    }
  };

  return { measureApiCall };
};

// Function to preload critical resources
export const preloadCriticalResources = () => {
  if (typeof window !== 'undefined') {
    // Preload critical fonts
    const fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Acme&family=Unbounded&family=Anton&family=Rubik:wght@200..900&display=swap';
    fontLink.as = 'style';
    document.head.appendChild(fontLink);

    // Preload critical images
    const criticalImages = [
      '/image/KustomteeLogo.png',
      // Add other critical images here
    ];

    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = src;
      link.as = 'image';
      document.head.appendChild(link);
    });
  }
};
