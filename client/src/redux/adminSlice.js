import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchUsers, deleteUser, fetchAllContent, deleteContent, fetchAllAppointments, fetchAllMoodLogs, deleteMoodLog, fetchTherapists } from "../api/adminAPI";

// ✅ Define all thunks once
const fetchUsersThunk = createAsyncThunk("admin/fetchUsers", fetchUsers);
const deleteUserThunk = createAsyncThunk("admin/deleteUser", deleteUser);
const fetchContentThunk = createAsyncThunk("admin/fetchContent", fetchAllContent);
const deleteContentThunk = createAsyncThunk("admin/deleteContent", deleteContent);
const fetchAppointmentsThunk = createAsyncThunk("admin/fetchAppointments", fetchAllAppointments);
const fetchMoodLogsThunk = createAsyncThunk("admin/fetchMoodLogs", fetchAllMoodLogs);
const deleteMoodLogThunk = createAsyncThunk("admin/deleteMoodLog", deleteMoodLog);
const fetchTherapistsThunk = createAsyncThunk("admin/fetchTherapists", fetchTherapists);

// ✅ Create slice
const adminSlice = createSlice({
  name: "admin",
  initialState: {
    users: [],
    content: [],
    appointments: [],
    moodLogs: [],
    therapists: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Users
      .addCase(fetchUsersThunk.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(deleteUserThunk.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u.id !== action.payload.id);
      })

      // Content
      .addCase(fetchContentThunk.fulfilled, (state, action) => {
        state.content = action.payload;
      })
      .addCase(deleteContentThunk.fulfilled, (state, action) => {
        state.content = state.content.filter((c) => c.id !== action.payload.id);
      })

      // Appointments
      .addCase(fetchAppointmentsThunk.fulfilled, (state, action) => {
        state.appointments = action.payload;
      })

      // Mood Logs
      .addCase(fetchMoodLogsThunk.fulfilled, (state, action) => {
        state.moodLogs = action.payload;
      })
      .addCase(deleteMoodLogThunk.fulfilled, (state, action) => {
        state.moodLogs = state.moodLogs.filter((m) => m.id !== action.payload.id);
      })

      // Therapists
      .addCase(fetchTherapistsThunk.fulfilled, (state, action) => {
        state.therapists = action.payload;
      })

      // Generic loading/error
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/fulfilled"),
        (state) => {
          state.loading = false;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        }
      );
  },
});

export default adminSlice.reducer;

// ✅ Single export block for all thunks
export { fetchUsersThunk, deleteUserThunk, fetchContentThunk, deleteContentThunk, fetchAppointmentsThunk, fetchMoodLogsThunk, deleteMoodLogThunk, fetchTherapistsThunk };
