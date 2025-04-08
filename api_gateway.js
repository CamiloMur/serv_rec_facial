const express = require('express');
const multer = require('multer');
const axios = require('axios');
const validarToken = require('./utils/tokenValidator');

const app = express();
const upload = multer();

app.post('/auth', validarToken, upload.single('imagen'), async (req, res) => {
  try {
    const imagen = req.file;
    if (!imagen) return res.status(400).json({ error: 'Imagen requerida' });

    // Llama al servicio de reconocimiento facial
    const faceRes = await axios.post('http://localhost:4000/reconocer', {
      imagen: imagen.buffer.toString('base64')
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    const { userId } = faceRes.data;

    // Luego llama al backend bancario
    const bancoRes = await axios.post('http://localhost:5000/autorizar', { userId });
    res.json(bancoRes.data);

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error en autenticación' });
  }
});

app.listen(3000, () => console.log('API Gateway en puerto 3000'));
