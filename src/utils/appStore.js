import { configureStore } from "@reduxjs/toolkit";
import dataReducer from "./dataSlice";
const appStore = configureStore({
  reducer: {
    data: dataReducer,
  },
});
export default appStore;
