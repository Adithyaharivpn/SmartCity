const Grievance = require('../model/grievance');
const mongoose = require('mongoose');
const { createLog } = require('./logController');

const createGrievance = async (req, res) => {
  try {
    const { name, email, subject, description } = req.body;
    const submittedBy = req.user?.id;
    const doc = new Grievance({ name, email, subject, description, submittedBy });
    await doc.save();

    createLog({ action: 'create', entityType: 'grievance', entityId: doc._id, message: `Grievance created: ${subject}`, createdBy: submittedBy });

    return res.status(201).json({ message: 'Grievance submitted', grievance: doc });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const listMine = async (req, res) => {
  try {
    const userId = req.user.id;
    const items = await Grievance.find({ submittedBy: userId }).sort({ createdAt: -1 });
    return res.status(200).json(items);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const listGrievances = async (req, res) => {
  try {
    const items = await Grievance.find().sort({ createdAt: -1 });
    return res.status(200).json(items);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const updateGrievance = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });
    const updates = req.body;
    const doc = await Grievance.findByIdAndUpdate(id, updates, { new: true });
    if (!doc) return res.status(404).json({ message: 'Not found' });

    createLog({ action: 'update', entityType: 'grievance', entityId: doc._id, message: `Grievance updated (${JSON.stringify(updates)})`, createdBy: req.user?.id });

    return res.status(200).json({ message: 'Updated', grievance: doc });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const deleteGrievance = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });
    const doc = await Grievance.findByIdAndDelete(id);
    if (!doc) return res.status(404).json({ message: 'Not found' });

    createLog({ action: 'delete', entityType: 'grievance', entityId: doc._id, message: `Grievance deleted: ${doc.subject}`, createdBy: req.user?.id });

    return res.status(200).json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createGrievance, listGrievances, listMine, updateGrievance, deleteGrievance };