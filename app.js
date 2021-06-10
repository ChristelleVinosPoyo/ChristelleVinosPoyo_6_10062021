const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Sauce = require('./models/Sauce');

const app = express();

mongoose.connect('mongodb+srv://christelle:fWAg38kB2NmbRU3@cluster0.lxhqr.mongodb.net/P6_SoPekocko_DB?retryWrites=true&w=majority',
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

app.use(bodyParser.json());

app.post('/api/sauces', (req, res, next) => {
    delete req.body._id; //supprimer l'Id généré par le front car un id sera automatiquement généré par mongoDB
    const sauce = new Sauce({
      ...req.body
    });
    sauce.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré!' }))
    .catch(error => res.status(400).json({ error }));
})

app.use('/api/sauces', (req, res, next) => {
    const stuff = [
      {
        _id: 'oeihfzeoi',
        userId: 'Mon premier objet',
        name: 'Les infos de mon premier objet',
        manufacturer: 'Les infos de mon premier objet',
        description: 'Les infos de mon premier objet',
        mainPepper: 'Les infos de mon premier objet',
        imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
        heat: 4900,
        likes: 4900,
        dislikes: 4900,
        usersLiked: 'qsomihvqios',
        usersDisliked: 'qsomihvqios',
      },
      {
        _id: 'oeihfzeoi',
        userId: 'Mon premier objet',
        name: 'Les infos de mon premier objet',
        manufacturer: 'Les infos de mon deuxième objet',
        description: 'Les infos de mon deuxième objet',
        mainPepper: 'Les infos de mon premier objet',
        imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
        heat: 4900,
        likes: 4900,
        dislikes: 4900,
        usersLiked: 'qsomihvqios',
        usersDisliked: 'qsomihvqios',
      },
    ];
    res.status(200).json(stuff);
  });

module.exports = app;