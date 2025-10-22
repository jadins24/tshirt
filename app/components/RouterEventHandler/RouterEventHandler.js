"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import { setLoading } from "@/app/redux/slice/loadingSlice";

export default function RouterEventHandler() {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const [currentPath, setCurrentPath] = useState(pathname);

  useEffect(() => {
    if (pathname !== currentPath) {
      dispatch(setLoading(true)); 
      setCurrentPath(pathname); 
      setTimeout(() => {
        dispatch(setLoading(false)); 
      }, 500); 
    }
  }, [pathname, currentPath, dispatch]);

  return null; 
}
