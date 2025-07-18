import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  bookUserAppointment,
  fetchUserAppointments,
  fetchTherapistAppointments,
  updateTherapistAppointment,
  fetchAllAppointmentsAdmin, // ✅ new API for admin
} from "../api/appointmentAPI";

// Book appointment (User)
export const bookAppointment = createAsyncThunk("appointments/book", async (appointmentData) => {
  return await bookUserAppointment(appointmentData);
});

// Get appointments for User
export const getUserAppointments = createAsyncThunk("appointments/user", async (userId) => {
  return await fetchUserAppointments(userId);
});

// Get appointments for Therapist
export const getTherapistAppointments = createAsyncThunk("appointments/therapist", async (therapistId) => {
  return await fetchTherapistAppointments(therapistId);
});

// Therapist/Admin updates an appointment
export const updateAppointment = createAsyncThunk("appointments/update", async ({ id, updatedData }) => {
  return await updateTherapistAppointment(id, updatedData);
});

// ✅ Admin fetches all appointments
export const getAllAppointmentsAdmin = createAsyncThunk("appointments/admin", async () => {
  return await fetchAllAppointmentsAdmin();
});

const appointmentSlice = createSlice({
  name: "appointments",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(bookAppointment.pending, (state) => {
        state.loading = true;
      })
      .addCase(bookAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload.appointment);
      })
      .addCase(getUserAppointments.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(getTherapistAppointments.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(updateAppointment.fulfilled, (state, action) => {
        const idx = state.list.findIndex((a) => a._id === action.payload.updated._id);
        if (idx !== -1) state.list[idx] = action.payload.updated;
      })
      // ✅ Admin handler
      .addCase(getAllAppointmentsAdmin.fulfilled, (state, action) => {
        state.list = action.payload;
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

export default appointmentSlice.reducer;
