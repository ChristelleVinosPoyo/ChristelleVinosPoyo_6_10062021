const Sauce = require('../models/Sauce');

exports.createSauce = (req, res, next) => {
    delete req.body._id; //supprimer l'Id généré par le front car un id sera automatiquement généré par mongoDB
    console.log(req.body.sauce);
    const sauce = new Sauce({
      ...req.body
    });
    sauce.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré!' }))
    .catch(error => res.status(401).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }) //pour retourner une sauce à partir de son id
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(400).json({ error }));
  };

exports.getAllSauce = (req, res, next) => {
    Sauce.find() //pour retourner la liste complète des sauces
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({ error }));
  };