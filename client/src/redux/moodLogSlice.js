import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { submitMoodLog, getMoodLogsByUser, getAllMoodLogs, getTherapistClientsMoodLogs, deleteMoodLogById } from "../api/moodAPI";

// Thunks
export const addMoodLog = createAsyncThunk("moodLogs/add", async (moodData) => {
  const savedLog = await submitMoodLog(moodData);
  return savedLog; // make sure you return the created mood log object
});

export const fetchUserMoodLogs = createAsyncThunk("moodLogs/user", async () => {
  const logs = await getMoodLogsByUser();
  return logs; // array of mood logs for the user
});

export const fetchTherapistClientMoodLogs = createAsyncThunk("moodLogs/therapistClients", async () => {
  const logs = await getTherapistClientsMoodLogs();
  return logs; // array of mood logs from assigned clients
});

export const fetchAllMoodLogs = createAsyncThunk("moodLogs/admin", async () => {
  const logs = await getAllMoodLogs();
  return logs; // array of all mood logs for admin
});

export const deleteMoodLog = createAsyncThunk("moodLogs/delete", async (id) => {
  await deleteMoodLogById(id);
  return id; // return id to remove from state
});

// Slice
const moodLogSlice = createSlice({
  name: "moodLogs",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetMoodLogs: (state) => {
      state.list = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add Mood Log
      .addCase(addMoodLog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMoodLog.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload); // add newly created mood log
      })

      // Fetch User Mood Logs
      .addCase(fetchUserMoodLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserMoodLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload; // replace with fetched logs
      })

      // Fetch Therapist Clients Mood Logs
      .addCase(fetchTherapistClientMoodLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTherapistClientMoodLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload; // replace with fetched logs
      })

      // Fetch All Mood Logs (Admin)
      .addCase(fetchAllMoodLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllMoodLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload; // replace with all logs
      })

      // Delete Mood Log
      .addCase(deleteMoodLog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMoodLog.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the deleted mood log by _id
        state.list = state.list.filter((log) => log.id !== action.payload);
      })

      // Handle errors on all rejected cases
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.error?.message || "Something went wrong.";
        }
      );
  },
});

export const { resetMoodLogs } = moodLogSlice.actions;
export default moodLogSlice.reducer;
