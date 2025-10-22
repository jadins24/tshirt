"use client";

import { usePathname } from "next/navigation";
import Header from "./components/Header/page";
import Footer from "./components/Footer/Footer";


export default function ConditionalLayout({ children }) {
  const pathname = usePathname();

  const noNavFooterRoutes = ["/pages/customDesign" , "/pages/login","/pages/signin"];
  const hideNavFooter = noNavFooterRoutes.includes(pathname);

  return (
    <>
      {!hideNavFooter && <Header />}
      {children}
      {!hideNavFooter && <Footer />}
    </>
  );
}
