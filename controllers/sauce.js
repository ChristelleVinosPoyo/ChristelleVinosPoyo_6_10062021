const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.getAllSauce = (req, res, next) => {
    Sauce.find() //pour retourner la liste complète des sauces
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({ error }));
  };

// exports.createSauce = (req, res, next) => {
//   const thingObject = JSON.parse(req.body.thing);
//   delete sauceObject._id;
//   const sauce = new Thing({
//     ...sauceObject,
//     imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
//   });
//   thing.save()
//     .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
//     .catch(error => res.status(400).json({ error }));
// };
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }) //pour retourner une sauce à partir de son id
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(400).json({ error }));
  };

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? // opérateur ternaire
    { 
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet modifié !'}))
      .catch(error => res.status(400).json({ error }));
};

//code d'Emilie :
// exports.modifySauce = (req, res, next) => {//condition ternaire//
//   const sauceObject = req.file ?//si req.file(fichier image) existe//
//     {
//       ...JSON.parse(req.body.sauce),
//       imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`//on modifie l'URL de l'image de manière dynamique//
//     } : { ...req.body };//si req.file n'existe pas on fait une copie de req.body//
//   Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })//on passe en premier argument l'objet qu'on souhaite modifier et en deuxième argument la nouvelle version de l'objet
//     .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
//     .catch(error => res.status(400).json({ error }));
// };

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then( sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({_id: req.params.id})
          .then(() => {res.status(200).json({
              message: 'Sauce supprimée!'
            });
          })
          .catch((error) => { res.status(400).json({ error: error});});
      });
    })
    .catch( error => { res.status(500).json({ error: error});});
};

// exports.likeSauce = (req, res, next) => {
//   console.log(req.body);
// };