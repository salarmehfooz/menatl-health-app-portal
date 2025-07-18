const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// ✅ Fetch all users
export const fetchUsers = async () => {
  const res = await fetch(`http://localhost:5000/api/users`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch users");
  return await res.json();
};

// ✅ Delete a user
export const deleteUser = async (id) => {
  const res = await fetch(`http://localhost:5000/api/users/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete user");
  return await res.json();
};

// ✅ Fetch all appointments
export const fetchAllAppointments = async () => {
  const res = await fetch(`http://localhost:5000/api/appointments/admin/all `, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch appointments");
  return await res.json();
};

// ✅ Fetch all content
export const fetchAllContent = async () => {
  const res = await fetch(`http://localhost:5000/api/content`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch content");
  return await res.json();
};

// ✅ Delete content item
export const deleteContent = async (id) => {
  const res = await fetch(`http://localhost:5000/api/content/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete content");
  return await res.json();
};

// ✅ Fetch all mood logs
export const fetchAllMoodLogs = async () => {
  const res = await fetch(`http://localhost:5000/api/moodlogs/admin/all`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch mood logs");
  return await res.json();
};

// ✅ Delete mood log
export const deleteMoodLog = async (id) => {
  const res = await fetch(`http://localhost:5000/api/moodlogs/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete mood log");
  return await res.json();
};

// ✅ Fetch all therapists
export const fetchTherapists = async () => {
  const res = await fetch(`http://localhost:5000/api/users/therapists`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch therapists");
  return await res.json();
};
