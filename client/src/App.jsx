import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import UserDashboard from "./pages/user/UserDashboard";
import TherapistDashboard from "./pages/therapist/TherapistDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AppointmentBooking from "./pages/AppointmentBooking";
import UserAppointments from "./pages/UserAppointments";
import TherapistAppointments from "./pages/TherapistAppointments";
import ChatInterface from "./pages/ChatInterface";
import StartNewChat from "./pages/StartNewChat";
import MoodLog from "./pages/MoodLog";
import MoodLogForm from "./pages/MoodLogForm";
import ContentLibrary from "./pages/ContentLibrary";
import AdminUserManagement from "./pages/admin/AdminUserManagement";
import AdminContentManagement from "./pages/admin/AdminContentManagement";
import AdminAppointmentsMonitor from "./pages/admin/AdminAppointmentsMonitor";
import AdminMoodLogsReview from "./pages/admin/AdminMoodLogsReview";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/therapist/dashboard"
            element={
              <ProtectedRoute>
                <TherapistDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/appointments/book"
            element={
              <ProtectedRoute>
                <AppointmentBooking />
              </ProtectedRoute>
            }
          />

          <Route
            path="/appointments/user"
            element={
              <ProtectedRoute>
                <UserAppointments />
              </ProtectedRoute>
            }
          />

          <Route
            path="/appointments/therapist"
            element={
              <ProtectedRoute>
                <TherapistAppointments />
              </ProtectedRoute>
            }
          />

          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ChatInterface />
              </ProtectedRoute>
            }
          />

          <Route
            path="/chat/new"
            element={
              <ProtectedRoute>
                <StartNewChat />
              </ProtectedRoute>
            }
          />

          <Route
            path="/mood-log"
            element={
              <ProtectedRoute>
                <MoodLog />
              </ProtectedRoute>
            }
          />

          <Route
            path="/mood-log/new"
            element={
              <ProtectedRoute>
                <MoodLogForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="/content-library"
            element={
              <ProtectedRoute>
                <ContentLibrary />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute>
                <AdminUserManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/content"
            element={
              <ProtectedRoute>
                <AdminContentManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/appointments"
            element={
              <ProtectedRoute>
                <AdminAppointmentsMonitor />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/mood-logs"
            element={
              <ProtectedRoute>
                <AdminMoodLogsReview />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
