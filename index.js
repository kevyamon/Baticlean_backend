require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Importer les routes
const userRoutes = require('./routes/userRoutes.js');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes principales
app.get('/', (req, res) => {
  res.send('API BATIClean sur Replit est fonctionnelle !');
});
app.use('/api/users', userRoutes);


const PORT = process.env.PORT || 3001;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connecté avec succès.');
    app.listen(PORT, () => {
      console.log(`Serveur démarré sur le port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Erreur de connexion à MongoDB :', err.message);
  });