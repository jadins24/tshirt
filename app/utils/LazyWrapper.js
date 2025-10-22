"use client";

import React, { Suspense, lazy } from 'react';
import Loading from '../components/Loading/Loading';

// Higher-order component for lazy loading with loading fallback
export const withLazyLoading = (Component, fallback = <Loading />) => {
  const LazyComponent = lazy(() => Component);
  
  return function LazyWrapper(props) {
    return (
      <Suspense fallback={fallback}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
};

// Lazy load heavy components
export const LazyCustomDesign = withLazyLoading(
  () => import('../pages/customDesign/page')
);

export const LazyProfilePage = withLazyLoading(
  () => import('../components/ProfilePage/page')
);

export const LazyCanvasPreview = withLazyLoading(
  () => import('../utils/CanvasPreview/CanvasPreview')
);

// Lazy load icons to reduce initial bundle size
export const LazyIcon = ({ name, ...props }) => {
  const IconComponent = lazy(() => 
    import('react-icons').then(module => ({ 
      default: module[name] 
    }))
  );
  
  return (
    <Suspense fallback={<div className="icon-placeholder" />}>
      <IconComponent {...props} />
    </Suspense>
  );
};

// Lazy load fabric.js only when needed
export const LazyFabric = () => {
  const FabricComponent = lazy(() => 
    import('fabric').then(module => ({ 
      default: () => <div>Fabric.js loaded</div> 
    }))
  );
  
  return (
    <Suspense fallback={<Loading />}>
      <FabricComponent />
    </Suspense>
  );
};
