const StudyPlan = require('../models/StudyPlan');

async function create(req, res) {
  try {
    const { subject, examDate, dailyStudyHours } = req.body;
    if (!subject || !examDate || dailyStudyHours == null) {
      return res.status(400).json({ message: 'Subject, exam date, and daily study hours are required.' });
    }
    const hours = Number(dailyStudyHours);
    if (Number.isNaN(hours) || hours < 0.5 || hours > 24) {
      return res.status(400).json({ message: 'Daily study hours must be between 0.5 and 24.' });
    }
    const plan = await StudyPlan.create({
      userId: req.user._id,
      subject,
      examDate: new Date(examDate),
      dailyStudyHours: hours,
    });
    res.status(201).json(plan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not create study plan.' });
  }
}

async function list(req, res) {
  const plans = await StudyPlan.find({ userId: req.user._id }).sort({ examDate: 1 });
  res.json(plans);
}

async function update(req, res) {
  const { subject, examDate, dailyStudyHours } = req.body;
  const updates = {};
  if (subject != null) updates.subject = subject;
  if (examDate != null) updates.examDate = new Date(examDate);
  if (dailyStudyHours != null) {
    const hours = Number(dailyStudyHours);
    if (Number.isNaN(hours) || hours < 0.5 || hours > 24) {
      return res.status(400).json({ message: 'Daily study hours must be between 0.5 and 24.' });
    }
    updates.dailyStudyHours = hours;
  }
  const plan = await StudyPlan.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    updates,
    { new: true }
  );
  if (!plan) return res.status(404).json({ message: 'Study plan not found.' });
  res.json(plan);
}

async function remove(req, res) {
  const plan = await StudyPlan.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!plan) return res.status(404).json({ message: 'Study plan not found.' });
  res.json({ message: 'Deleted.' });
}

module.exports = { create, list, update, remove };
