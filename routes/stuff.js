const express = require('express');
const router = express.Router();
const stuffCtrl = require('../controllers/stuff'); // changer stuff
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.post('/', auth, multer, stuffCtrl.createSauce);

router.get('/:id', auth, stuffCtrl.getOneSauce);

router.get('/', auth, stuffCtrl.getAllSauce);

module.exports = router;