const BASE_URL =
  "https://mental-health-app-portal.onrender.com/api/appointments";

// Book an appointment (user)
export const bookUserAppointment = async (data) => {
  const token = localStorage.getItem("token");
  const res = await fetch(
    "https://mental-health-app-portal.onrender.com/api/appointments",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );

  if (!res.ok) throw new Error("Failed to book appointment");
  return await res.json();
};

// Fetch appointments for a specific user
export const fetchUserAppointments = async (userId) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/me/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch user appointments");
  return await res.json();
};

// Fetch appointments for a specific therapist
export const fetchTherapistAppointments = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(
    "https://mental-health-app-portal.onrender.com/appointments/therapist",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) throw new Error("Failed to fetch therapist appointments");
  return await res.json();
};

// Update an appointment (therapist or admin)
export const updateTherapistAppointment = async (id, updatedData) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updatedData),
  });

  if (!res.ok) throw new Error("Failed to update appointment");
  return await res.json();
};

// ✅ Fetch all appointments (admin)
export const fetchAllAppointmentsAdmin = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/admin/all`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch all appointments (admin)");
  return await res.json();
};
