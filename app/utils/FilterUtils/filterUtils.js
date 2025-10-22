// src/utils/filterUtils.js
import store from "@/app/redux/store";

export const filterActiveItems = (items) => {
  // const state = store.getState();
  //const user = state.auth?.user;
  //console.log("User Data :", user);

  // Always filter out items with activeStatus: false
  return Array.isArray(items)
    ? items.filter(item => item?.activeStatus !== false)
    : [];
};
