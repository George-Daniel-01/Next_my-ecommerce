import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/app/store/slices/authSlice";
import popupReducer from "@/app/store/slices/popupSlice";
import cartReducer from "@/app/store/slices/cartSlice";
import productReducer from "@/app/store/slices/productSlice";
import orderReducer from "@/app/store/slices/orderSlice";
import extraReducer from "@/app/store/slices/extraSlice";
import adminReducer from "@/app/store/slices/adminSlice";
import adminProductReducer from "@/app/store/slices/adminProductSlice";
import adminOrderReducer from "@/app/store/slices/adminOrderSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    popup: popupReducer,
    cart: cartReducer,
    product: productReducer,
    order: orderReducer,
    extra: extraReducer,
    admin: adminReducer,
    adminProduct: adminProductReducer,
    adminOrder: adminOrderReducer,
  },
});