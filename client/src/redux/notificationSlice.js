import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Fetch notifications thunk (existing)
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (_, thunkAPI) => {
    try {
      const userId = JSON.parse(localStorage.getItem("user"))?.id;

      const response = await fetch(
        `https://mental-health-app-portal.onrender.com/api/notifications/${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return thunkAPI.rejectWithValue(errorData);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Clear notifications on server thunk
export const clearNotificationsOnServer = createAsyncThunk(
  "notifications/clearNotificationsOnServer",
  async (_, thunkAPI) => {
    try {
      const response = await fetch(
        `https://mental-health-app-portal.onrender.com/api/notifications/clear`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        return thunkAPI.rejectWithValue(errorData);
      }
      return await response.json();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// New: Mark notification as read on server thunk
export const markNotificationAsReadOnServer = createAsyncThunk(
  "notifications/markNotificationAsReadOnServer",
  async (notificationId, thunkAPI) => {
    try {
      const response = await fetch(
        `https://mental-health-app-portal.onrender.com/api/notifications/${notificationId}/read`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return thunkAPI.rejectWithValue(errorData);
      }

      // Assuming the API returns the updated notification
      const updatedNotification = await response.json();
      return updatedNotification;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Optional: optimistic local update (can remove if you rely only on server response)
    markAsRead: (state, action) => {
      const id = action.payload;
      const notification = state.list.find((n) => n._id === id);
      if (notification) {
        notification.read = true;
      }
    },
    clearNotifications: (state) => {
      state.list = [];
    },
    addNotification: (state, action) => {
      state.list.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch notifications";
      })

      .addCase(clearNotificationsOnServer.fulfilled, (state) => {
        state.list = [];
      })
      .addCase(clearNotificationsOnServer.rejected, (state, action) => {
        state.error = action.payload || "Failed to clear notifications";
      })

      .addCase(markNotificationAsReadOnServer.fulfilled, (state, action) => {
        const updatedNotification = action.payload;
        const index = state.list.findIndex(
          (n) => n._id === updatedNotification._id
        );
        if (index !== -1) {
          state.list[index] = updatedNotification;
        }
      })
      .addCase(markNotificationAsReadOnServer.rejected, (state, action) => {
        state.error = action.payload || "Failed to mark notification as read";
      });
  },
});

export const { markAsRead, clearNotifications, addNotification } =
  notificationsSlice.actions;

export default notificationsSlice.reducer;
