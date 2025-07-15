const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  images: { type: [String], required: true, default: [] },
  likes: { type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] },
}, {
  timestamps: true
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;