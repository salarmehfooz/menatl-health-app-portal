import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Helper function to parse error safely
const parseError = async (res, fallback = "Request failed") => {
  let text = await res.text();
  try {
    const json = JSON.parse(text);
    return json.message || json.error || fallback;
  } catch {
    return text || fallback;
  }
};

// Fetch prescriptions by userId
export const fetchPrescriptions = createAsyncThunk(
  "prescriptions/fetch",
  async (userId) => {
    const res = await fetch(
      `http://localhost:5000/api/prescriptions/${userId}`,
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

// Create a new prescription
export const createPrescription = createAsyncThunk(
  "prescriptions/create",
  async (data) => {
    const res = await fetch(`http://localhost:5000/api/prescriptions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error(await parseError(res, "Failed to create prescription"));
    }

    return await res.json();
  }
);

// Update prescription
export const updatePrescription = createAsyncThunk(
  "prescriptions/update",
  async (prescription) => {
    const res = await fetch(
      `http://localhost:5000/api/prescriptions/${prescription._id}`,
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

const prescriptionSlice = createSlice({
  name: "prescriptions",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPrescriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPrescriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchPrescriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(createPrescription.pending, (state) => {
        state.error = null;
      })
      .addCase(createPrescription.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(createPrescription.rejected, (state, action) => {
        state.error = action.error.message;
      })

      .addCase(updatePrescription.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.list.findIndex((p) => p._id === updated._id);
        if (index !== -1) {
          state.list[index] = updated;
        }
      })
      .addCase(updatePrescription.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export default prescriptionSlice.reducer;
