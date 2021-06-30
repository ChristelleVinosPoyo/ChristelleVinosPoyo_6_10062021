const jwt = require('jsonwebtoken');

// vérification du TOKEN pour valider l'authentification
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // récup du token du front : split autour de l'espace et récupération du 2ème élément du tableau généré
    const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);
    const userId = decodedToken.userId; // userId récupéré à partir du token decodé
    if (req.body.userId && req.body.userId !== userId) {
      throw 'User Id non valable';
    } else {
      next(); // pour passer au prochain middleware de la route (voir backend/routes/sauces)
    }
  } catch {
    res.status(401).json({
      error: new Error('Requête non authentifiée !')
    });
  }
};