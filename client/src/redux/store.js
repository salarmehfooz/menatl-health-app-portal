import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import moodLogReducer from "./moodLogSlice";
import contentReducer from "./contentSlice";
import appointmentReducer from "./appointmentSlice";
import chatReducer from "./chatSlice";
import userReducer from "./userSlice";
import adminReducer from "./adminSlice"; // ✅ Add this

const store = configureStore({
  reducer: {
    auth: authReducer,
    moodLogs: moodLogReducer,
    content: contentReducer,
    appointments: appointmentReducer,
    chat: chatReducer,
    users: userReducer,
    admin: adminReducer, // ✅ Register it here
  },
});

export default store;
