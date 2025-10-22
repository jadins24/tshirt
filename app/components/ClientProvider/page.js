"use client";

import { Provider } from "react-redux";
import GlobalLoader from "../GlobalLoader/page";
import store from "@/app/redux/store";
import AuthInitializer from "../AuthInitializer/page";
import RouterEventHandler from "../RouterEventHandler/RouterEventHandler";

export default function ClientProvider({ children }) {
  return (
    <Provider store={store}>
     <AuthInitializer />
     {/* <RouterEventHandler /> */}
      <GlobalLoader />
      {children}
    </Provider>
  );
}
