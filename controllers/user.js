const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) // 10 tours d'execution de l'algorythme de hashage
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};


exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if(!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé! ' })
            }
            bcrypt.compare(req.body.password, user.password) // on compare le password de la requête au hash sauvegardé dans la base de données
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect ! ' })
                    }
                    res.status(200).json({ // si comparaison validé, on renvoie user._id et le token d'authentification (c'est ce qui est demandé par le front)
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id }, // 1er argument : ce qu'on veut encoder
                            process.env.TOKEN_KEY, // 2eme argument : clé secrète d'encodage
                            { expiresIn: '24h' } // 3ème argument : chaque token durera 24h
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};
