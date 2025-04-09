const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer();

// Configura credenciales de Face++ en el futuro (reemplaza estos valores con los reales)
const API_KEY = '9TSfPhvD0KUZ7ASgDqz1FaOWfodqQ4Fa';
const API_SECRET = 'RMthrKbXT6LVBvh9ob4AOf3qXlJSB_Gj';
const COMPARE_API_URL = 'https://api-us.faceplusplus.com/facepp/v3/compare';

// Objeto de clientes con sus rutas de imagen de referencia
const clientes = {
  cliente123: { referencia: path.join(__dirname, 'img_references', 'juan_img.jpeg') },
  cliente456: { referencia: path.join(__dirname, 'img_references', 'ana_img.jpeg') }
};

// Umbral de similitud
const UMBRAL = 85;

app.post('/reconocer', upload.single('imagen'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Imagen requerida' });
    }

    let mejorConfianza = 0;
    let usuarioCoincidente = null;
    let resultados = {};

    // Iterar cada cliente para comparar la imagen subida con su imagen de referencia
    for (const [userId, { referencia }] of Object.entries(clientes)) {
      const refStream = fs.createReadStream(referencia);

      const formData = new FormData();
      formData.append('api_key', API_KEY);
      formData.append('api_secret', API_SECRET);
      formData.append('image_file1', req.file.buffer, req.file.originalname);
      formData.append('image_file2', refStream);

      // Llamar a la API de Face++ o al endpoint de comparación
      const response = await axios.post(COMPARE_API_URL, formData, {
        headers: formData.getHeaders()
      });

      // Puntaje de similitud
      const confianza = response.data.confidence || 0;
      resultados[userId] = confianza;

      // Guardar el mejor puntaje
      if (confianza > mejorConfianza) {
        mejorConfianza = confianza;
        usuarioCoincidente = userId;
      }
    }

    // Validar el mayor puntaje con el umbral
    if (usuarioCoincidente && mejorConfianza >= UMBRAL) {
      // Devuelve el userId del cliente que coincida
      return res.json({
        status: 'ok',
        userId: usuarioCoincidente,
        confidence: mejorConfianza,
        resultados
      });
    } else {
      return res.status(403).json({
        status: 'fail',
        error: 'No se encontró coincidencia con el umbral requerido',
        mejoresResultados: resultados
      });
    }

  } catch (err) {
    console.error("Error en Face Service:", err.response?.data || err.message);
    return res.status(500).json({ error: 'Error en comparación facial' });
  }
});

app.listen(4000, () => console.log('Face Service en puerto 4000 (Recibe y compara imagenes)'));