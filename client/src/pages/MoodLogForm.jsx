import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMoodLog } from "../redux/moodLogSlice";

const MoodLogForm = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    mood: "",
    notes: "",
    sleepHours: "",
    energyLevel: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Convert to number if it's a numeric field
    const newValue = name === "sleepHours" || name === "energyLevel" ? Number(value) : value;

    setForm((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      alert("You must be logged in to submit a mood log.");
      return;
    }

    const moodLogData = {
      ...form,
      userId: user.id, // Include user ID if necessary
    };

    dispatch(addMoodLog(moodLogData));

    setForm({
      mood: "",
      notes: "",
      sleepHours: "",
      energyLevel: "",
    });
  };

  return (
    <div className="container mt-4">
      <h2>Log Your Mood</h2>
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <label className="form-label">Mood</label>
          <input type="text" name="mood" className="form-control" value={form.mood} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Notes</label>
          <textarea name="notes" className="form-control" value={form.notes} onChange={handleChange} />
        </div>

        <div className="mb-3">
          <label className="form-label">Sleep Hours</label>
          <input type="number" name="sleepHours" className="form-control" value={form.sleepHours} onChange={handleChange} min="0" step="0.1" />
        </div>

        <div className="mb-3">
          <label className="form-label">Energy Level (1-10)</label>
          <input type="number" name="energyLevel" className="form-control" value={form.energyLevel} onChange={handleChange} min="1" max="10" />
        </div>

        <button type="submit" className="btn btn-primary">
          Submit Mood Log
        </button>
      </form>
    </div>
  );
};

export default MoodLogForm;
