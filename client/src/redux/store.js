import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import moodLogReducer from "./moodLogSlice";
import contentReducer from "./contentSlice";
import appointmentReducer from "./appointmentSlice";
import chatReducer from "./chatSlice";
import userReducer from "./userSlice";
import adminReducer from "./adminSlice";
import assignmentReducer from "./assignmentSlice";
import prescriptionReducer from "./prescriptionSlice";
import notificationReducer from "./notificationSlice";
import chatBotReducer from "./chatBotSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    moodLogs: moodLogReducer,
    content: contentReducer,
    appointments: appointmentReducer,
    chat: chatReducer,
    users: userReducer,
    admin: adminReducer,
    assignments: assignmentReducer,
    prescriptions: prescriptionReducer,
    notifications: notificationReducer,
    chatBot: chatBotReducer,
  },
});

export default store;
