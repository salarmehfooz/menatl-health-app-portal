import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  submitMoodLog,
  getMoodLogsByUser,
  getAllMoodLogs,
  getTherapistClientsMoodLogs,
  deleteMoodLogById,
} from "../api/moodAPI";

// Thunks
export const addMoodLog = createAsyncThunk(
  "moodLogs/add",
  async (moodData) => await submitMoodLog(moodData)
);

export const fetchUserMoodLogs = createAsyncThunk(
  "moodLogs/user",
  async () => await getMoodLogsByUser()
);

export const fetchAllMoodLogs = createAsyncThunk(
  "moodLogs/all",
  async () => await getAllMoodLogs()
);

export const fetchTherapistClientMoodLogs = createAsyncThunk(
  "moodLogs/therapistClients",
  async () => await getTherapistClientsMoodLogs()
);

export const deleteMoodLog = createAsyncThunk("moodLogs/delete", async (id) => {
  await deleteMoodLogById(id);
  return id;
});

// Slice
const moodLogSlice = createSlice({
  name: "moodLogs",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addMoodLog.pending, (state) => {
        state.loading = true;
      })
      .addCase(addMoodLog.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload.moodLog);
      })
      .addCase(fetchUserMoodLogs.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(fetchAllMoodLogs.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(fetchTherapistClientMoodLogs.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(deleteMoodLog.fulfilled, (state, action) => {
        state.list = state.list.filter((log) => log._id !== action.payload);
      })
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.error.message;
        }
      );
  },
});

export default moodLogSlice.reducer;
