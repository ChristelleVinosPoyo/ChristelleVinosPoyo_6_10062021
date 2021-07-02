const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.signup = (req, res, next) => {
    // utilisation de bcrypt pour hasher le mot de passe envoyé dans la req
    bcrypt.hash(req.body.password, 10) // 10 tours d'execution de l'algorythme de hashage
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            // sauvegarder dans mongoDB
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};


exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            // Si l'adresse mail n'est pas dans la BD user
            if(!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé! ' })
            }
            // comparaison du password de la req au hash sauvegardé dans la base de données
            bcrypt.compare(req.body.password, user.password) 
                .then(valid => {
                    // si la comparaison n'est pas correcte, alors le mdp est incorrect
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect ! ' })
                    }
                    // si la comparaison est validée
                    res.status(200).json({ 
                        userId: user._id,
                        token: jwt.sign( // le token sécurise l'échange des données : il valide le droit de l'utilisateur à accéder aux ressources
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
