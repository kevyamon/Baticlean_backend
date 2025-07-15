const asyncHandler = require('express-async-handler');
const User = require('../models/UserModel.js');
const generateToken = require('../utils/generateToken.js');

// @description   Inscrire un nouvel utilisateur
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;
  const userExists = await User.findOne({ $or: [{ email }, { phone }] });

  if (userExists) {
    res.status(400);
    throw new Error('Un utilisateur avec cet email ou téléphone existe déjà.');
  }

  const salt = await require('bcryptjs').genSalt(10);
  const hashedPassword = await require('bcryptjs').hash(password, salt);

  const user = await User.create({
    name,
    email,
    phone,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
      profilePicture: user.profilePicture,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Données utilisateur invalides.');
  }
});

// @description   Connecter un utilisateur
const loginUser = asyncHandler(async (req, res) => {
  const { identifier, password } = req.body;
  const user = await User.findOne({ $or: [{ email: identifier }, { phone: identifier }] });

  if (user && (await require('bcryptjs').compare(password, user.password))) {
    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
        profilePicture: user.profilePicture,
        token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Identifiant ou mot de passe invalide.');
  }
});

module.exports = { registerUser, loginUser };