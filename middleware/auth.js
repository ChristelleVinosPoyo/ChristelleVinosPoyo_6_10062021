// const jwt = require('jsonwebtoken'); // pour vérifier les token

// module.exports = (req, res, next) => {
//     try {
//         const token = req.headers.authorization.split(' ')[1]; // split le tableau au niveau de l'espace et récupération du 2ème élément
//         const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
//         const userId = decodedToken.userId;
//         if (req.body.userId && req.body.userId !== userId) {
//             throw 'User Id non valable !';
//         } 
//         else {
//             next();
//         }
//     } catch (error) {
//         res.status(401).json({ error: error | 'Requête non authentifiée' })
//     }
// };

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};