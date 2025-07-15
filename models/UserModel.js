const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, required: true, default: false },
  profilePicture: { type: String, required: false, default: '/images/default-avatar.png' },
}, {
  timestamps: true // Ajoute automatiquement createdAt et updatedAt
});

const User = mongoose.model('User', userSchema);

module.exports = User;