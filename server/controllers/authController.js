const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sign = (u) => jwt.sign({ id: u._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
const out = (u) => ({ id: u._id, name: u.name, email: u.email, role: u.role });

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  if (await User.findOne({ email })) return res.status(400).json({ message: 'Email already registered' });
  const user = await User.create({ name, email, password: await bcrypt.hash(password, 10) });
  res.status(201).json({ token: sign(user), user: out(user) });
};
exports.login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email }).select('+password');
  if (!user || !(await bcrypt.compare(req.body.password, user.password)))
    return res.status(401).json({ message: 'Invalid email or password' });
  res.json({ token: sign(user), user: out(user) });
};
exports.me = (req, res) => res.json({ user: out(req.user) });
