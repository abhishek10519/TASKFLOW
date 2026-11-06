const { Schema, model } = require('mongoose');
module.exports = model('Project', new Schema({
  title: { type: String, required: [true, 'Title is required'], trim: true },
  description: { type: String, trim: true, default: '' },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
}, { timestamps: true }));
