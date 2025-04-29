const express = require('express');
const router = express.Router();
const backendController = require('../controllers/backendController');

// POST /autorizar
router.post('/', backendController.autorizarUsuario);

module.exports = router;
