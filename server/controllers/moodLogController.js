const MoodLog = require('../models/moodLog.js');

exports.createMoodLog = async (req, res) => {
  const { role, userId, mood, notes, sleepHours, energyLevel } = req.body;

  if (role !== 'patient') {
    return res.status(403).json({ error: 'Only patients can create mood logs.' });
  }

  try {
    const newLog = new MoodLog({
      userId,
      mood,
      notes,
      sleepHours,
      energyLevel
    });

    const savedLog = await newLog.save();
    res.status(201).json(savedLog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getPatientMoodLogs = async (req, res) => {
  const { role } = req.query;

  if (role !== 'therapist') {
    return res.status(403).json({ error: 'Only therapists can view patient mood logs.' });
  }

  try {
    const patientId = req.params.patientId;
    const logs = await MoodLog.find({ userId: patientId }).sort({ date: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
