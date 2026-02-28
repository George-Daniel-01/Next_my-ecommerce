"use client";
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { toggleCreateProductModal, toggleUpdateProductModal } from "./extraSlice";
const axiosInstance = axios.create({ baseURL: "http://localhost:3000/api/v1", withCredentials: true });
const adminProductSlice = createSlice({
  name: "adminProduct",
  initialState: { loading: false, products: [], totalProducts: 0 },
  reducers: {
    request(state) { state.loading = true; },
    getAllSuccess(state, action) { state.loading = false; state.products = action.payload.products; state.totalProducts = action.payload.totalProducts; },
    createSuccess(state, action) { state.loading = false; state.products = [action.payload, ...state.products]; },
    updateSuccess(state, action) { state.loading = false; state.products = state.products.map((p) => p.id === action.payload.id ? action.payload : p); },
    deleteSuccess(state, action) { state.loading = false; state.products = state.products.filter((p) => p.id !== action.payload); state.totalProducts = Math.max(0, state.totalProducts - 1); },
    failed(state) { state.loading = false; },
  },
});
export const fetchAllAdminProducts = (page) => async (dispatch) => {
  dispatch(adminProductSlice.actions.request());
  await axiosInstance.get(`/product?page=${page || 1}`).then((res) => { dispatch(adminProductSlice.actions.getAllSuccess(res.data)); }).catch(() => { dispatch(adminProductSlice.actions.failed()); });
};
export const createNewProduct = (data) => async (dispatch) => {
  dispatch(adminProductSlice.actions.request());
  await axiosInstance.post("/product/admin/create", data).then((res) => { dispatch(adminProductSlice.actions.createSuccess(res.data.product)); toast.success(res.data.message); dispatch(toggleCreateProductModal()); }).catch((e) => { dispatch(adminProductSlice.actions.failed()); toast.error(e.response?.data?.message || "Failed"); });
};
export const updateProduct = (data, id) => async (dispatch) => {
  dispatch(adminProductSlice.actions.request());
  await axiosInstance.put(`/product/admin/update/${id}`, data).then((res) => { dispatch(adminProductSlice.actions.updateSuccess(res.data.updatedProduct)); toast.success(res.data.message); dispatch(toggleUpdateProductModal()); }).catch((e) => { dispatch(adminProductSlice.actions.failed()); toast.error(e.response?.data?.message || "Failed"); });
};
export const deleteProduct = (id, page) => async (dispatch, getState) => {
  dispatch(adminProductSlice.actions.request());
  await axiosInstance.delete(`/product/admin/delete/${id}`).then((res) => { dispatch(adminProductSlice.actions.deleteSuccess(id)); toast.success(res.data.message); const state = getState(); dispatch(fetchAllAdminProducts(Math.min(page, Math.ceil(state.adminProduct.totalProducts / 10) || 1))); }).catch((e) => { dispatch(adminProductSlice.actions.failed()); toast.error(e.response?.data?.message || "Failed"); });
};
export default adminProductSlice.reducer;