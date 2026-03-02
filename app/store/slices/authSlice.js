"use client";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";
import { toggleAuthPopup } from "./popupSlice";

const axiosInstance = axios.create({
  baseURL: "/api/v1",
  withCredentials: true,
});

// Store frontend login (uses popup)
export const login = createAsyncThunk("auth/login", async (data, thunkAPI) => {
  try {
    const res = await axiosInstance.post("/auth/login", data, { headers: { "Content-Type": "application/json" } });
    toast.success(res.data.message);
    thunkAPI.dispatch(toggleAuthPopup());
    return res.data.user;
  } catch (error) {
    toast.error(error.response?.data?.message || "Login failed.");
    return thunkAPI.rejectWithValue(error.response?.data?.message);
  }
});

// Admin login (no popup, role check)
export const adminLogin = createAsyncThunk("auth/adminLogin", async (data, thunkAPI) => {
  try {
    const res = await axiosInstance.post("/auth/login", data, { headers: { "Content-Type": "application/json" } });
    if (res.data.user.role !== "Admin") {
      toast.error("Access denied. Admins only.");
      return thunkAPI.rejectWithValue("Not an admin");
    }
    toast.success(res.data.message || "Welcome Admin!");
    return res.data.user;
  } catch (error) {
    toast.error(error.response?.data?.message || "Login failed.");
    return thunkAPI.rejectWithValue(error.response?.data?.message);
  }
});

export const getUser = createAsyncThunk("auth/getUser", async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data.user;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message);
  }
});

export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get("/auth/logout");
    toast.success(res.data.message);
    return true;
  } catch (error) {
    toast.error(error.response?.data?.message || "Logout failed.");
    return thunkAPI.rejectWithValue(error.response?.data?.message);
  }
});

export const updateAdminProfile = createAsyncThunk("auth/updateProfile", async (data, thunkAPI) => {
  try {
    const res = await axiosInstance.put("/auth/profile/update", data);
    toast.success(res.data.message);
    return res.data.user;
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to update profile.");
    return thunkAPI.rejectWithValue(error.response?.data?.message);
  }
});

export const updateAdminPassword = createAsyncThunk("auth/updatePassword", async (data, thunkAPI) => {
  try {
    const res = await axiosInstance.put("/auth/password/update", data);
    toast.success(res.data.message);
    return true;
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to update password.");
    return thunkAPI.rejectWithValue(error.response?.data?.message);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    user: null,
    isAuthenticated: false,
    isLoggingIn: false,
  },
  reducers: {
    loginRequest(state) { state.loading = true; },
    loginSuccess(state, action) { state.loading = false; state.user = action.payload; state.isAuthenticated = true; },
    loginFailed(state) { state.loading = false; },
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(login.pending, (state) => { state.isLoggingIn = true; })
      .addCase(login.fulfilled, (state, action) => { state.isLoggingIn = false; state.user = action.payload; state.isAuthenticated = true; })
      .addCase(login.rejected, (state) => { state.isLoggingIn = false; })
      // adminLogin
      .addCase(adminLogin.pending, (state) => { state.loading = true; })
      .addCase(adminLogin.fulfilled, (state, action) => { state.loading = false; state.user = action.payload; state.isAuthenticated = true; })
      .addCase(adminLogin.rejected, (state) => { state.loading = false; })
      // getUser
      .addCase(getUser.pending, (state) => { state.loading = true; })
      .addCase(getUser.fulfilled, (state, action) => { state.loading = false; state.user = action.payload; state.isAuthenticated = true; })
      .addCase(getUser.rejected, (state) => { state.loading = false; state.user = null; state.isAuthenticated = false; })
      // logout
      .addCase(logout.pending, (state) => { state.loading = true; })
      .addCase(logout.fulfilled, (state) => { state.loading = false; state.user = null; state.isAuthenticated = false; })
      .addCase(logout.rejected, (state) => { state.loading = false; })
      // updateProfile
      .addCase(updateAdminProfile.pending, (state) => { state.loading = true; })
      .addCase(updateAdminProfile.fulfilled, (state, action) => { state.loading = false; state.user = action.payload; })
      .addCase(updateAdminProfile.rejected, (state) => { state.loading = false; })
      // updatePassword
      .addCase(updateAdminPassword.pending, (state) => { state.loading = true; })
      .addCase(updateAdminPassword.fulfilled, (state) => { state.loading = false; })
      .addCase(updateAdminPassword.rejected, (state) => { state.loading = false; });
  },
});

export const { loginRequest, loginSuccess, loginFailed } = authSlice.actions;
export default authSlice.reducer;
// Aliases for store frontend components
export const register = createAsyncThunk("auth/register", async (data, thunkAPI) => {
  try {
    const res = await axiosInstance.post("/auth/register", data);
    toast.success(res.data.message);
    thunkAPI.dispatch(toggleAuthPopup());
    return res.data.user;
  } catch (error) {
    toast.error(error.response?.data?.message || "Registration failed.");
    return thunkAPI.rejectWithValue(error.response?.data?.message);
  }
});

export const forgotPassword = createAsyncThunk("auth/forgotPassword", async (data, thunkAPI) => {
  try {
    const res = await axiosInstance.post("/auth/password/forgot", data);
    toast.success(res.data.message);
    return true;
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed.");
    return thunkAPI.rejectWithValue(error.response?.data?.message);
  }
});

export const resetPassword = createAsyncThunk("auth/resetPassword", async ({ token, data }, thunkAPI) => {
  try {
    const res = await axiosInstance.put(`/auth/password/reset/${token}`, data);
    toast.success(res.data.message);
    return true;
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed.");
    return thunkAPI.rejectWithValue(error.response?.data?.message);
  }
});

export const updateProfile = updateAdminProfile;
export const updatePassword = updateAdminPassword;
// Aliases for store frontend components
export const register = createAsyncThunk("auth/register", async (data, thunkAPI) => {
  try {
    const res = await axiosInstance.post("/auth/register", data);
    toast.success(res.data.message);
    thunkAPI.dispatch(toggleAuthPopup());
    return res.data.user;
  } catch (error) {
    toast.error(error.response?.data?.message || "Registration failed.");
    return thunkAPI.rejectWithValue(error.response?.data?.message);
  }
});

export const forgotPassword = createAsyncThunk("auth/forgotPassword", async (data, thunkAPI) => {
  try {
    const res = await axiosInstance.post("/auth/password/forgot", data);
    toast.success(res.data.message);
    return true;
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed.");
    return thunkAPI.rejectWithValue(error.response?.data?.message);
  }
});

export const resetPassword = createAsyncThunk("auth/resetPassword", async ({ token, data }, thunkAPI) => {
  try {
    const res = await axiosInstance.put(`/auth/password/reset/${token}`, data);
    toast.success(res.data.message);
    return true;
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed.");
    return thunkAPI.rejectWithValue(error.response?.data?.message);
  }
});

export const updateProfile = updateAdminProfile;
export const updatePassword = updateAdminPassword;