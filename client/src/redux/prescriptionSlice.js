import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Helper to safely parse errors
const parseError = async (res, fallback = "Request failed") => {
  let text = await res.text();
  try {
    const json = JSON.parse(text);
    return json.message || json.error || fallback;
  } catch {
    return text || fallback;
  }
};

// Async thunk: Fetch prescriptions by userId
export const fetchPrescriptions = createAsyncThunk(
  "prescriptions/fetch",
  async (userId) => {
    const res = await fetch(
      `https://mental-health-app-portal.onrender.com/api/prescriptions/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error(await parseError(res, "Failed to fetch prescriptions"));
    }

    return await res.json();
  }
);

// Async thunk: Create a new prescription
export const createPrescription = createAsyncThunk(
  "prescriptions/create",
  async (data) => {
    const res = await fetch(
      `https://mental-health-app-portal.onrender.com/api/prescriptions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      }
    );

    if (!res.ok) {
      throw new Error(await parseError(res, "Failed to create prescription"));
    }

    return await res.json();
  }
);

// Async thunk: Update an existing prescription
export const updatePrescription = createAsyncThunk(
  "prescriptions/update",
  async (prescription) => {
    const res = await fetch(
      `https://mental-health-app-portal.onrender.com/api/prescriptions/${prescription._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(prescription),
      }
    );

    if (!res.ok) {
      throw new Error(await parseError(res, "Failed to update prescription"));
    }

    return await res.json();
  }
);

// Slice definition
const prescriptionSlice = createSlice({
  name: "prescriptions",
  initialState: {
    byUser: {}, // Stores prescriptions keyed by userId
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchPrescriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPrescriptions.fulfilled, (state, action) => {
        state.loading = false;
        const userId = action.meta.arg;
        state.byUser[userId] = action.payload;
      })
      .addCase(fetchPrescriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // CREATE
      .addCase(createPrescription.pending, (state) => {
        state.error = null;
      })
      .addCase(createPrescription.fulfilled, (state, action) => {
        const newPrescription = action.payload;
        const userId = newPrescription.userId;

        if (!state.byUser[userId]) {
          state.byUser[userId] = [];
        }

        state.byUser[userId].unshift(newPrescription);
      })
      .addCase(createPrescription.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // UPDATE
      .addCase(updatePrescription.fulfilled, (state, action) => {
        const updated = action.payload;
        const userId = updated.userId;

        const index = state.byUser[userId]?.findIndex(
          (p) => p._id === updated._id
        );

        if (index !== undefined && index !== -1) {
          state.byUser[userId][index] = updated;
        }
      })
      .addCase(updatePrescription.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default prescriptionSlice.reducer;
