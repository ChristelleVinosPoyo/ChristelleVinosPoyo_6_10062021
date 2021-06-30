const multer = require('multer');

// dictionnaires des mimes-types possibles pour les images
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
}

// configuration de multer
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        // création d'un nom unique pour chaque image
        const name = file.originalname.split(' ').join('_'); // remplacer les espaces du nom d'origine par des "_"
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension); // nom final généré
    }
});

module.exports = multer({ storage }).single('image');

