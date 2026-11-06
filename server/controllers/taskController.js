const Project = require('../models/Project');
const Task = require('../models/Task');
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const pick = (b) => ({ title: b.title, description: b.description, status: b.status, priority: b.priority, dueDate: b.dueDate || null });
const taskNotFound = (res) => res.status(404).json({ message: 'Task not found' });
const ownedProject = (req) => Project.findOne({ _id: req.params.id, owner: req.user._id });

exports.list = async (req, res) => {
  const project = await ownedProject(req);
  if (!project) return res.status(404).json({ message: 'Project not found' });
  const { status, priority, search } = req.query;
  const filter = { project: project._id, owner: req.user._id };
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (search) filter.title = { $regex: escapeRegex(search), $options: 'i' };
  res.json(await Task.find(filter).sort('-createdAt'));
};
exports.create = async (req, res) => {
  const project = await ownedProject(req);
  if (!project) return res.status(404).json({ message: 'Project not found' });
  res.status(201).json(await Task.create({ ...pick(req.body), project: project._id, owner: req.user._id }));
};
exports.update = async (req, res) => {
  const t = await Task.findOneAndUpdate({ _id: req.params.id, owner: req.user._id }, pick(req.body), { new: true, runValidators: true });
  t ? res.json(t) : taskNotFound(res);
};
exports.updateStatus = async (req, res) => {
  const t = await Task.findOneAndUpdate({ _id: req.params.id, owner: req.user._id }, { status: req.body.status }, { new: true, runValidators: true });
  t ? res.json(t) : taskNotFound(res);
};
exports.remove = async (req, res) => {
  const t = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
  t ? res.json({ message: 'Task deleted' }) : taskNotFound(res);
};
