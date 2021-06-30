const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.getAllSauce = (req, res, next) => {
    Sauce.find() //pour retourner la liste complète des sauces
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({ error }));
  };

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id; // supp id généré par le front. MongoDB génère automatiquement un id
  const sauce = new Sauce({
    ...sauceObject, // opérateur spread pour copier rea.body.sauce
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save() // enregistement de sauce dans la base de données MongoDB
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

exports.likeSauce = (req, res, next) => {
  const user = req.body.userId;
  const like = req.body.like;
  const sauceId = req.params.id
  Sauce.findOne({ _id: sauceId })
    .then(
      sauce => {
        if (like === 1 && !sauce.usersLiked.includes(user)){
          Sauce.updateOne({ _id: sauceId }, { $push:{usersLiked: user}, $inc:{likes: +1}} )
          .then(() => 
          res.status(200).json({ message: 'like ajouté !'}))
          .catch(error => res.status(400).json({ error }));
        }
        if (like === -1 && !sauce.usersDisliked.includes(user)){
          Sauce.updateOne({ _id: sauceId }, { $push:{usersDisliked: user}, $inc:{dislikes: +1}} )
          .then(() => 
          res.status(200).json({ message: 'dislike ajouté !'}))
          .catch(error => res.status(400).json({ error }));
        }
        if (like === 0){
          if (sauce.usersLiked.includes(user)){
            Sauce.updateOne({ _id: sauceId }, { $pull:{usersLiked: user}, $inc:{likes: -1}} )
            .then(() => 
            res.status(200).json({ message: 'like supprimé !'}))
            .catch(error => res.status(400).json({ error }));
          }
          else if (sauce.usersDisliked.includes(user)){
            Sauce.updateOne({ _id: sauceId }, { $pull:{usersDisliked: user}, $inc:{dislikes: -1}} )
            .then(() => 
            res.status(200).json({ message: 'dislike supprimé !'}))
            .catch(error => res.status(400).json({ error }));
          }
        }
      }
    )
    .catch(error => res.status(400).json({ error }));


};