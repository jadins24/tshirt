"use client";

export const dynamic = "force-dynamic";
import React, { useState, useEffect, useRef, Suspense, lazy } from "react";
import { IoColorPaletteOutline } from "react-icons/io5";
import { FiShoppingCart } from "react-icons/fi";
import {
  IoMoveOutline,
  IoCloseOutline,
  IoDuplicateOutline,
  IoImagesOutline,
  IoEyeOutline,
  IoEyeOffOutline,
  IoLayersOutline,
  IoChevronUpOutline,
  IoChevronDownOutline,
} from "react-icons/io5";
import { MdTextFields } from "react-icons/md";
import "./customDesign.scss";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setCartData } from "@/app/redux/slice/cartSlice";
import { API_URL } from "@/app/services/apicofig";
import axios from "axios";
import Loading from "@/app/components/Loading/Loading";

// Lazy load heavy components
const Templates = lazy(() => import("./Templates/page"));
const AddCartSection = lazy(() => import("./AddCartSection"));

// Lazy load Fabric.js only when needed
const loadFabric = () => import("fabric").then(module => module.fabric);

const OptimizedCustomDesign = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [fabric, setFabric] = useState(null);
  const [isFabricLoaded, setIsFabricLoaded] = useState(false);
  const canvasRef = useRef(null);
  const canvas = useRef(null);

  // Load Fabric.js dynamically
  useEffect(() => {
    loadFabric()
      .then((fabricModule) => {
        setFabric(fabricModule);
        setIsFabricLoaded(true);
      })
      .catch((error) => {
        console.error("Failed to load Fabric.js:", error);
      });
  }, []);

  // Initialize canvas only after Fabric.js is loaded
  useEffect(() => {
    if (isFabricLoaded && fabric && canvasRef.current) {
      canvas.current = new fabric.Canvas(canvasRef.current, {
        width: 400,
        height: 400,
        backgroundColor: "#ffffff",
      });
    }
  }, [isFabricLoaded, fabric]);

  // Rest of the component logic would go here...
  // For now, just showing the structure

  if (!isFabricLoaded) {
    return <Loading />;
  }

  return (
    <div className="custom-design-page">
      <div className="design-header">
        <h1>Custom Design</h1>
      </div>
      
      <div className="design-workspace">
        <canvas ref={canvasRef} />
      </div>

      <Suspense fallback={<Loading />}>
        <Templates />
      </Suspense>

      <Suspense fallback={<Loading />}>
        <AddCartSection />
      </Suspense>
    </div>
  );
};

export default OptimizedCustomDesign;
