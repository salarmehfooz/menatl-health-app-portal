import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMoodLog } from "../redux/moodLogSlice";

const MOOD_OPTIONS = ["happy", "sad", "anxious", "angry", "excited", "tired"];

const MoodLogForm = ({ fetchError }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.moodLogs || {});

  const [mood, setMood] = useState("");
  const [notes, setNotes] = useState("");
  const [sleepHours, setSleepHours] = useState("");
  const [energyLevel, setEnergyLevel] = useState("");
  const [submitError, setSubmitError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    // Basic validation
    if (!mood || sleepHours === "" || energyLevel === "") {
      setSubmitError("Please fill in all required fields.");
      return;
    }

    if (isNaN(sleepHours) || isNaN(energyLevel)) {
      setSubmitError("Sleep Hours and Energy Level must be valid numbers.");
      return;
    }

    if (Number(energyLevel) < 1 || Number(energyLevel) > 10) {
      setSubmitError("Energy Level must be between 1 and 10.");
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(
        addMoodLog({
          mood: mood.toLowerCase(),
          notes: notes.trim(),
          sleepHours: Number(sleepHours),
          energyLevel: Number(energyLevel),
        })
      ).unwrap();

      // Reset form
      setMood("");
      setNotes("");
      setSleepHours("");
      setEnergyLevel("");
    } catch (err) {
      setSubmitError(err.message || "Failed to submit mood log.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Record a New Mood</h2>
      {(submitError || fetchError) && <div className="bg-red-50 text-red-700 rounded-lg p-4 mb-4">{submitError || fetchError}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="moodSelect" className="block text-gray-900 font-semibold mb-2">
            Select Mood
          </label>
          <select id="moodSelect" className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100" value={mood} onChange={(e) => setMood(e.target.value)} disabled={isSubmitting || loading} required>
            <option value="">Select Mood</option>
            {MOOD_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="moodNotes" className="block text-gray-900 font-semibold mb-2">
            Notes (optional)
          </label>
          <textarea id="moodNotes" className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100" placeholder="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} disabled={isSubmitting || loading} rows={3} />
        </div>
        <div className="mb-4">
          <label htmlFor="sleepHours" className="block text-gray-900 font-semibold mb-2">
            Sleep Hours
          </label>
          <input id="sleepHours" type="number" className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100" placeholder="Sleep Hours" value={sleepHours} onChange={(e) => setSleepHours(e.target.value)} disabled={isSubmitting || loading} required min="0" step="any" />
        </div>
        <div className="mb-4">
          <label htmlFor="energyLevel" className="block text-gray-900 font-semibold mb-2">
            Energy Level (1 to 10)
          </label>
          <input id="energyLevel" type="number" className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100" placeholder="Energy Level (1 to 10)" value={energyLevel} onChange={(e) => setEnergyLevel(e.target.value)} disabled={isSubmitting || loading} required min="1" max="10" step="1" />
        </div>
        <button type="submit" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400" disabled={isSubmitting || loading}>
          {isSubmitting ? "Submitting..." : "Submit Mood"}
        </button>
      </form>
    </div>
  );
};

export default MoodLogForm;
