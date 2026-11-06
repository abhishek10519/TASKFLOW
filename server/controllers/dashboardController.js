const Project = require('../models/Project');
const Task = require('../models/Task');

exports.stats = async (req, res) => {
  const owner = req.user._id;
  // last 7 days (UTC), oldest first, used for the "completed per day" chart
  const days = [...Array(7)].map((_, i) => {
    const d = new Date(); d.setUTCHours(0, 0, 0, 0); d.setUTCDate(d.getUTCDate() - (6 - i));
    return d;
  });
  const [totalProjects, totalTasks, grouped, overdue, doneByDay, upcoming] = await Promise.all([
    Project.countDocuments({ owner }),
    Task.countDocuments({ owner }),
    Task.aggregate([{ $match: { owner } }, { $group: { _id: '$status', count: { $sum: 1 } } }]),
    Task.countDocuments({ owner, status: { $ne: 'done' }, dueDate: { $lt: new Date() } }),
    Task.aggregate([
      { $match: { owner, status: 'done', updatedAt: { $gte: days[0] } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$updatedAt' } }, count: { $sum: 1 } } },
    ]),
    Task.find({ owner, status: { $ne: 'done' }, dueDate: { $ne: null } }).sort('dueDate').limit(5).select('title priority dueDate project'),
  ]);
  const byStatus = { todo: 0, 'in-progress': 0, done: 0 };
  grouped.forEach((g) => (byStatus[g._id] = g.count));
  const counts = Object.fromEntries(doneByDay.map((d) => [d._id, d.count]));
  const weekly = days.map((d) => {
    const key = d.toISOString().slice(0, 10);
    return { date: key, day: 'SMTWTFS'[d.getUTCDay()], count: counts[key] || 0 };
  });
  res.json({ totalProjects, totalTasks, byStatus, overdue, weekly, upcoming });
};
