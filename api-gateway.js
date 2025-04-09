const express = require('express');
const multer = require('multer');
const axios = require('axios');
const validarToken = require('./utils/tokenValidator');
const FormData = require('form-data');
const cors = require('cors');

const app = express();
const upload = multer();

app.use(cors());

// Resto de tu código, por ejemplo:
// app.use(express.json());

app.post('/auth', validarToken, upload.single('imagen'), async (req, res) => {
  try {
    const imagen = req.file;
    if (!imagen) return res.status(400).json({ error: 'Imagen requerida' });

    // Crear form-data para reenviar la imagen como archivo
    const formData = new FormData();
    formData.append("imagen", imagen.buffer, imagen.originalname);

    const faceRes = await axios.post("http://localhost:4000/reconocer", formData, {
      headers: formData.getHeaders()
    });

    const { userId } = faceRes.data;

    const bancoRes = await axios.post("http://localhost:5000/autorizar", { userId });
    res.json(bancoRes.data);

  } catch (err) {
    console.error("❌ Error detallado:", err.response?.data || err.message);
    res.status(500).json({ error: 'Error en autenticación' });
  }
});

app.listen(3000, () => console.log('API Gateway en puerto 3000'));
