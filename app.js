const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();
const helmet = require('helmet');
const rateLimit = require("express-rate-limit");

const sauceRoutes = require('./routes/sauce'); 
const userRoutes = require('./routes/user');

const app = express();

//mongoose.connect('mongodb+srv://christelle:fWAg38kB2NmbRU3@cluster0.lxhqr.mongodb.net/P6_SoPekocko_DB?retryWrites=true&w=majority',
mongoose.connect(`mongodb+srv://${process.env.MDB_USER}:${process.env.MDB_PASSWORD}@cluster0.lxhqr.mongodb.net/P6_SoPekocko_DB?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use(express.urlencoded());
app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', sauceRoutes);

app.use('/api/auth', userRoutes);

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 10 minutes
  max: 100 // Le client pourra faire 100 requêtes toutes les 10 minutes
});
app.use(limiter);

module.exports = app;