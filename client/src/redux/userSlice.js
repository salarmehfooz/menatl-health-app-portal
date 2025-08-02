import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Fetch current user profile
export const fetchUserProfile = createAsyncThunk(
  "user/fetchProfile",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        "https://mental-health-app-portal.onrender.com/api/users/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch user profile");
      }

      return await res.json();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// Fetch all therapists
export const fetchTherapists = createAsyncThunk(
  "user/fetchTherapists",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        "https://mental-health-app-portal.onrender.com/api/users/therapists",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch therapists");
      }

      return await res.json();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    therapists: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearUser: (state) => {
      state.user = null;
      state.therapists = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // User Profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Therapists
      .addCase(fetchTherapists.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTherapists.fulfilled, (state, action) => {
        state.loading = false;
        state.therapists = action.payload;
      })
      .addCase(fetchTherapists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;
