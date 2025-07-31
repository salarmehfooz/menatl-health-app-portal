import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AppointmentBooking from "./pages/AppointmentBooking";
import TherapistAppointments from "./pages/TherapistAppointments";
import UserAppointments from "./pages/UserAppointments";
import MoodLogs from "./pages/MoodLog";
import MoodLogForm from "./pages/MoodLogForm";
import ContentLibrary from "./pages/ContentLibrary";
import ChatInterface from "./pages/ChatInterface";
import AdminContentManagement from "./pages/admin/AdminContentManagement";
import AdminAppointmentsMonitor from "./pages/admin/AdminAppointmentsMonitor";
import AdminMoodLogsReview from "./pages/admin/AdminMoodLogsReview";
import AdminUserManagement from "./pages/admin/AdminUserManagement";
import TherapistContentManagement from "./pages/therapist/TherapistContentManagement";
import TherapistMoodLogsReview from "./pages/therapist/TherapistMoodLogsReview";
import TherapistList from "./pages/user/TherapistList";
import StartNewChat from "./pages/StartNewChat";
import TherapistChatThreads from "./pages/therapist/TherapistChatThreads";
import UserChatThreads from "./pages/user/UserChatThreads";
import TherapistAssignmentsPage from "./pages/admin/TherapistAssignmentsPage";
import TherapistAssignmentForm from "./pages/admin/TherapistAssignmentForm";
import TherapistPrescriptionPage from "./pages/therapist/TherapistPrescriptionPage";
import UserPrescriptionPage from "./pages/user/UserPrescriptionPage";
import ContentDetail from "./pages/ContentDetail";
import TherapistDashboard from "./pages/therapist/TherapistDashboard";
import UserDashboard from "./pages/user/UserDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/appointments/book" element={<AppointmentBooking />} />
        <Route path="/therapist-list" element={<TherapistList />} />
        <Route path="/start-chat/:therapistId" element={<StartNewChat />} />
        <Route path="/therapist/appointments" element={<TherapistAppointments />} />
        <Route path="/therapist/content" element={<TherapistContentManagement />} />
        <Route path="/content/:id" element={<ContentDetail />} />
        <Route path="/therapist/moodlogview" element={<TherapistMoodLogsReview />} />
        <Route path="/therapist/chat-threads" element={<TherapistChatThreads />} />
        <Route path="/therapist-assignments" element={<TherapistAssignmentsPage />} />
        <Route path="/therapist/prescription-assign" element={<TherapistPrescriptionPage />} />
        <Route path="/assignment-form" element={<TherapistAssignmentForm />} />
        <Route path="/therapist/dashboard" element={<TherapistDashboard />} />
        <Route path="/user/dashboard" element={<UserDashboard />} />

        <Route path="/user/appointments" element={<UserAppointments />} />
        <Route path="/user/chat-threads" element={<UserChatThreads />} />
        <Route path="/user-prescription" element={<UserPrescriptionPage />} />

        <Route path="/mood-logs" element={<MoodLogs />} />
        <Route path="mood-log/new" element={<MoodLogForm />} />
        <Route path="/content-library" element={<ContentLibrary />} />
        <Route path="/chat/:threadId" element={<ChatInterface />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/content" element={<AdminContentManagement />} />
        <Route path="/admin/appointments" element={<AdminAppointmentsMonitor />} />
        <Route path="/admin/moodlogs" element={<AdminMoodLogsReview />} />
        <Route path="/admin/users" element={<AdminUserManagement />} />
      </Routes>
    </>
  );
}

export default App;
