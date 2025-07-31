import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Helper to get auth headers
const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// ─────────────────────────────────────────────
// THUNKS
// ─────────────────────────────────────────────

// 1. Fetch all assignments (admin, therapist)
export const fetchAssignments = createAsyncThunk(
  "assignments/fetchAll",
  async (_, thunkAPI) => {
    try {
      const res = await fetch("http://localhost:5000/api/assignment", {
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to fetch assignments");
      }
      return await res.json();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// 2. Assign users to therapist (admin)
export const assignUsers = createAsyncThunk(
  "assignments/assignUsers",
  async ({ therapistId, assignedUsers }, thunkAPI) => {
    try {
      const res = await fetch("http://localhost:5000/api/assignment/assign", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ therapistId, assignedUsers }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to assign users");
      }
      const data = await res.json();
      return data.assignment;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// 3. Get users assigned to a therapist
export const getAssignedUsersForTherapist = createAsyncThunk(
  "assignments/getAssignedUsersForTherapist",
  async (_, thunkAPI) => {
    try {
      const res = await fetch("http://localhost:5000/api/assignment/my-users", {
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to fetch assigned users");
      }
      const data = await res.json();
      return data.assignedUsers;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// 4. Get therapist assigned to the current user
export const getAssignedTherapistForUser = createAsyncThunk(
  "assignments/getAssignedTherapistForUser",
  async (_, thunkAPI) => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/assignment/my-therapist",
        {
          headers: getAuthHeaders(),
        }
      );
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to fetch assigned therapist");
      }
      const data = await res.json();
      return data.therapist;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// 5. Remove a user from a therapist assignment (admin)
export const removeUserFromTherapist = createAsyncThunk(
  "assignments/removeUserFromTherapist",
  async ({ therapistId, userId }, thunkAPI) => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/assignment/remove-user",
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify({ therapistId, userId }),
        }
      );
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to remove user");
      }
      const data = await res.json();
      return data.assignment;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

// ─────────────────────────────────────────────
// SLICE
// ─────────────────────────────────────────────

const assignmentSlice = createSlice({
  name: "assignments",
  initialState: {
    assignments: [],
    assignedUsers: [],
    therapist: null,
    loading: false,
    assignLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // ────── FETCH ALL ASSIGNMENTS ──────
      .addCase(fetchAssignments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignments.fulfilled, (state, action) => {
        state.loading = false;
        state.assignments = action.payload;
      })
      .addCase(fetchAssignments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ────── ASSIGN USERS TO THERAPIST ──────
      .addCase(assignUsers.pending, (state) => {
        state.assignLoading = true;
        state.error = null;
      })
      .addCase(assignUsers.fulfilled, (state, action) => {
        state.assignLoading = false;
        const updated = action.payload;

        const updatedTherapistId =
          typeof updated.therapistId === "object"
            ? updated.therapistId._id
            : updated.therapistId;

        const index = state.assignments.findIndex((a) => {
          const aTherapistId =
            typeof a.therapistId === "object"
              ? a.therapistId._id
              : a.therapistId;
          return aTherapistId === updatedTherapistId;
        });

        if (index > -1) {
          state.assignments[index] = updated;
        } else {
          state.assignments.push(updated);
        }
      })
      .addCase(assignUsers.rejected, (state, action) => {
        state.assignLoading = false;
        state.error = action.payload;
      })

      // ────── GET USERS FOR THERAPIST ──────
      .addCase(getAssignedUsersForTherapist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAssignedUsersForTherapist.fulfilled, (state, action) => {
        state.loading = false;
        state.assignedUsers = action.payload;
      })
      .addCase(getAssignedUsersForTherapist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ────── GET THERAPIST FOR USER ──────
      .addCase(getAssignedTherapistForUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAssignedTherapistForUser.fulfilled, (state, action) => {
        state.loading = false;
        state.therapist = action.payload;
      })
      .addCase(getAssignedTherapistForUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ────── REMOVE USER FROM THERAPIST ──────
      .addCase(removeUserFromTherapist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeUserFromTherapist.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;

        const index = state.assignments.findIndex(
          (a) =>
            a.therapistId._id === updated.therapistId._id ||
            a.therapistId === updated.therapistId
        );

        if (index > -1) {
          state.assignments[index] = updated;
        }
      })
      .addCase(removeUserFromTherapist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default assignmentSlice.reducer;
