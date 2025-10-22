"use client";
import { useSelector } from "react-redux";
import "./GlobalLoader.scss"; 
import { selectIsLoading } from "@/app/redux/slice/loadingSlice";

const GlobalLoader = () => {
  const isLoading = useSelector(selectIsLoading);

  if (!isLoading) return null;

  return (
    <div className="global-loader">
      <div className="spinner"></div>
    </div>
  );
};

export default GlobalLoader;
