const express = require('express');
const router = express.Router();
const upload = require('multer')();
const validarToken = require('../middlewares/validarToken');
const authController = require('../controllers/authController');

// POST /auth - ruta para reconocimiento facial y autorización
router.post('/', validarToken, upload.single('imagen'), authController.autenticarUsuario);

module.exports = router;
