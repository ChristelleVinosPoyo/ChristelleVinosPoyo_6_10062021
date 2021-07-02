const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();
const helmet = require('helmet');
const rateLimit = require("express-rate-limit"); // pour limiter le nombres d'appels faits à l'API
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 10 minutes
  max: 100 // Le client pourra faire 100 requêtes toutes les 10 minutes
});

const sauceRoutes = require('./routes/sauce'); 
const userRoutes = require('./routes/user');

const app = express();

// connexion à MongoDB
mongoose.connect(`mongodb+srv://${process.env.MDB_USER}:${process.env.MDB_PASSWORD}@${process.env.MDB_ADRESS}?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Pour permettre à l'appli d'acceder à l'API et eviter les erreurs CORS
app.use((req, res, next) => {  //Middleware general appliqué à toutes les routes. 
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use(express.urlencoded()); // pour parlier à l'utilisation de bodyparser qui est déprécié : permet de transformer req.body en JS utilisable
app.use(express.json()); // pour parlier à l'utilisation de bodyparser qui est déprécié 
app.use(helmet());
app.use(limiter);

app.use('/images', express.static(path.join(__dirname, 'images'))); // express.static pour servir le dossier statique 'images' / path.join pour créer un chemin dynamique vers l'image souhaitée

app.use('/api/sauces', sauceRoutes);

app.use('/api/auth', userRoutes);

module.exports = app;