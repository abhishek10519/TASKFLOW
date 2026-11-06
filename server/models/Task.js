const { Schema, model } = require('mongoose');
const schema = new Schema({
  title: { type: String, required: [true, 'Title is required'], trim: true },
  description: { type: String, trim: true, default: '' },
  status: { type: String, enum: ['todo', 'in-progress', 'done'], default: 'todo' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  dueDate: { type: Date, default: null },
  project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });
schema.index({ project: 1, status: 1, priority: 1 });
schema.index({ title: 1 });
module.exports = model('Task', schema);
