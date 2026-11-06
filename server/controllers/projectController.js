const Project = require('../models/Project');
const Task = require('../models/Task');
const mine = (req) => ({ _id: req.params.id, owner: req.user._id }); // ownership check: other users' projects => 404
const notFound = (res) => res.status(404).json({ message: 'Project not found' });

exports.list = async (req, res) => res.json(await Project.find({ owner: req.user._id }).sort('-createdAt'));
exports.getOne = async (req, res) => {
  const p = await Project.findOne(mine(req));
  p ? res.json(p) : notFound(res);
};
exports.create = async (req, res) => {
  const { title, description } = req.body;
  res.status(201).json(await Project.create({ title, description, owner: req.user._id }));
};
exports.update = async (req, res) => {
  const { title, description } = req.body;
  const p = await Project.findOneAndUpdate(mine(req), { title, description }, { new: true, runValidators: true });
  p ? res.json(p) : notFound(res);
};
exports.remove = async (req, res) => {
  const p = await Project.findOneAndDelete(mine(req));
  if (!p) return notFound(res);
  await Task.deleteMany({ project: p._id }); // cascade delete
  res.json({ message: 'Project and its tasks deleted' });
};
