const WaterRequest = require('../model/water');
const mongoose = require('mongoose');
const { createLog } = require('./logController');

const createWater = async (req, res) => {
  try {
    const { name, email, phone, address, issueType, description } = req.body;
    const submittedBy = req.user?.id;
    const doc = new WaterRequest({ name, email, phone, address, issueType, description, submittedBy });
    await doc.save();

    createLog({ action: 'create', entityType: 'water', entityId: doc._id, message: `Water request created for ${name}`, createdBy: submittedBy });

    return res.status(201).json({ message: 'Request received', request: doc });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const listMine = async (req, res) => {
  try {
    const userId = req.user.id;
    const items = await WaterRequest.find({ submittedBy: userId }).sort({ createdAt: -1 });
    return res.status(200).json(items);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const listWater = async (req, res) => {
  try {
    const items = await WaterRequest.find().sort({ createdAt: -1 });
    return res.status(200).json(items);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const updateWater = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });
    const updates = req.body;
    const doc = await WaterRequest.findByIdAndUpdate(id, updates, { new: true });
    if (!doc) return res.status(404).json({ message: 'Not found' });

    createLog({ action: 'update', entityType: 'water', entityId: doc._id, message: `Water request updated (${JSON.stringify(updates)})`, createdBy: req.user?.id });

    return res.status(200).json({ message: 'Updated', request: doc });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const deleteWater = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });
    const doc = await WaterRequest.findByIdAndDelete(id);
    if (!doc) return res.status(404).json({ message: 'Not found' });

    createLog({ action: 'delete', entityType: 'water', entityId: doc._id, message: `Water request deleted for ${doc.name}`, createdBy: req.user?.id });

    return res.status(200).json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createWater, listWater, listMine, updateWater, deleteWater };