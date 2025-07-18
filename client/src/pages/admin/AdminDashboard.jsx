import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Admin Dashboard</h2>
      <div className="d-grid gap-2 d-md-block">
        <button
          className="btn btn-outline-primary m-2"
          onClick={() => navigate("/admin/users")}
        >
          Manage Users
        </button>
        <button
          className="btn btn-outline-secondary m-2"
          onClick={() => navigate("/admin/appointments")}
        >
          Monitor Appointments
        </button>
        <button
          className="btn btn-outline-success m-2"
          onClick={() => navigate("/admin/content")}
        >
          Manage Content
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
