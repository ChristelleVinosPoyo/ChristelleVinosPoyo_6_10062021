const express = require('express');
const router = express.Router();
const stuffCtrl = require('../controllers/stuff');
const auth = require('../middleware/auth');

router.post('/', auth, stuffCtrl.createSauce);

router.get('/:id', auth, stuffCtrl.getOneSauce);

router.get('/', auth, stuffCtrl.getAllSauce);

module.exports = router;