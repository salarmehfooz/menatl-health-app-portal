import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, registerUser, fetchUserProfile } from "../api/authAPI";

export const login = createAsyncThunk("auth/login", async (credentials) => {
  return await loginUser(credentials);
});

export const register = createAsyncThunk("auth/register", async (userData) => {
  return await registerUser(userData);
});

export const getProfile = createAsyncThunk("auth/profile", async () => {
  return await fetchUserProfile();
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    token: localStorage.getItem("token") || null,
    isAuthenticated: !!localStorage.getItem("token"),
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false; // ✅ important
      localStorage.removeItem("token");
      localStorage.removeItem("user"); // optionally clear saved user too
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true; // ✅ important
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.isAuthenticated = false; // ✅ optional, for safety
      })

      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true; // ✅ important
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })

      .addCase(getProfile.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true; // ✅ ensure profile fetch reflects auth
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
