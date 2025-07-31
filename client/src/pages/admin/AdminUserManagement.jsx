import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsersThunk, deleteUserThunk } from "../../redux/adminSlice";
import { useNavigate } from "react-router-dom";
import { Users, Eye, Trash2 } from "lucide-react";

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
    alert(`Name: ${user.username}\nEmail: ${user.email}\nRole: ${user.role}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg mr-4">
            <Users className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
            <p className="text-gray-600 mt-1">View and manage user accounts.</p>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        {loading ? (
          <div className="bg-blue-50 text-blue-700 rounded-lg p-4 text-center">Loading users...</div>
        ) : (
          <table className="w-full border border-gray-200 rounded-lg shadow-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left text-gray-900 font-semibold">Name</th>
                <th className="p-4 text-left text-gray-900 font-semibold">Email</th>
                <th className="p-4 text-left text-gray-900 font-semibold">Role</th>
                <th className="p-4 text-left text-gray-900 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="p-4">{u.username}</td>
                  <td className="p-4">{u.email}</td>
                  <td className="p-4">{u.role}</td>
                  <td className="p-4 flex space-x-2">
                    <button onClick={() => viewDetails(u)} className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </button>
                    <button onClick={() => handleDelete(u._id)} className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-600">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminUserManagement;
