const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'est invalide'],
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    match: [/^[0-9+]+$/, 'ne doit contenir que des chiffres'],
  },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, required: true, default: false },
  profilePicture: { type: String, required: false, default: '/images/default-avatar.png' },
}, {
  timestamps: true,
});

// Avant de sauvegarder, on crypte le mot de passe s'il a été modifié
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

module.exports = User;