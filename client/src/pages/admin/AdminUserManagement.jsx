import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsersThunk, deleteUserThunk } from "../../redux/adminSlice";
import { useNavigate } from "react-router-dom";

const AdminUserManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, loading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchUsersThunk());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUserThunk(id));
    }
  };

  const viewDetails = (user) => {
    alert(`Name: ${user.name}\nEmail: ${user.email}\nRole: ${user.role}`);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Manage Users</h2>
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table className="table table-bordered table-hover shadow-sm">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th colSpan="2" className="text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  <button className="btn btn-info btn-sm" onClick={() => viewDetails(u)}>
                    View
                  </button>
                </td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminUserManagement;
