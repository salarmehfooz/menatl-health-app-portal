const API_BASE = "http://localhost:5000/api/moodlogs";

// Submit a mood log (user)
export const submitMoodLog = async (moodData) => {
  const res = await fetch(`${API_BASE}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(moodData),
  });

  if (!res.ok) throw new Error("Failed to submit mood log");
  return await res.json();
};

// Get logged-in user's mood logs (user)
export const getMoodLogsByUser = async () => {
  const res = await fetch(`${API_BASE}/me`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch your mood logs");
  return await res.json();
};

// Get logs for one specific patient (therapist or admin)
export const getPatientMoodLogs = async (patientId) => {
  const res = await fetch(`${API_BASE}/patient/${patientId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch patient mood logs");
  return await res.json();
};

// Get logs of all clients assigned to this therapist (therapist)
export const getTherapistClientsMoodLogs = async () => {
  const res = await fetch(`${API_BASE}/therapist-clients`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch client mood logs");
  return await res.json();
};

// Get all mood logs (admin)
export const getAllMoodLogs = async () => {
  const res = await fetch(`${API_BASE}/admin/all`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch all mood logs");
  return await res.json();
};

// Delete a mood log (therapist or admin)
export const deleteMoodLogById = async (id) => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!res.ok) throw new Error("Failed to delete mood log");
  return await res.json();
};
