const asyncHandler = require('express-async-handler');
const User = require('../models/UserModel.js');
const generateToken = require('../utils/generateToken.js');

// Formatage des données renvoyées au frontend
const formatUserData = (user, token) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  isAdmin: user.isAdmin,
  profilePicture: user.profilePicture,
  token: token || generateToken(user._id),
});

// Inscription
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;
  const userExists = await User.findOne({ $or: [{ email }, { phone }] });
  if (userExists) {
    res.status(400);
    throw new Error('Un utilisateur avec cet email ou téléphone existe déjà.');
  }
  const user = await User.create({ name, email, phone, password });
  if (user) {
    res.status(201).json(formatUserData(user));
  } else {
    res.status(400); throw new Error('Données utilisateur invalides.');
  }
});

// Connexion
const loginUser = asyncHandler(async (req, res) => {
  const { identifier, password } = req.body;
  const user = await User.findOne({ $or: [{ email: identifier }, { phone: identifier }] });
  if (user && (await require('bcryptjs').compare(password, user.password))) {
    res.json(formatUserData(user));
  } else {
    res.status(401); throw new Error('Identifiant ou mot de passe invalide.');
  }
});

// Mise à jour du profil
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.phone = req.body.phone || user.phone;
        user.profilePicture = req.body.profilePicture || user.profilePicture;
        if (req.body.password) {
            user.password = req.body.password;
        }
        const updatedUser = await user.save();
        res.json(formatUserData(updatedUser));
    } else {
        res.status(404); throw new Error('Utilisateur non trouvé.');
    }
});

module.exports = { registerUser, loginUser, updateUserProfile };