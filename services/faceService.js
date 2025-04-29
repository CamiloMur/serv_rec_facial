const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const API_KEY = 'M2e5KHnc4v8MPQeNe8y7ihR1odrKbrTl';
const API_SECRET = 'tUstVtQCBBpy31KQYVjAtorMn2Cpx0pR';
const COMPARE_API_URL = 'https://api-us.faceplusplus.com/facepp/v3/compare';

// Rutas de imágenes de referencia
const clientes = {
  cliente123: { referencia: path.join(__dirname, '../img_references', 'juan_img.jpeg') },
  cliente456: { referencia: path.join(__dirname, '../img_references', 'ana_img.jpeg') }
};

const UMBRAL = 85; // Umbral mínimo de coincidencia

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  async function reconocerImagen(imagen) {
    let mejorConfianza = 0;
    let usuarioCoincidente = null;
    let resultados = {};
  
    for (const [userId, { referencia }] of Object.entries(clientes)) {
      console.log(`Comparando contra referencia de ${userId}...`);
  
      const refStream = fs.createReadStream(referencia);
  
      const formData = new FormData();
      formData.append('api_key', API_KEY);
      formData.append('api_secret', API_SECRET);
      formData.append('image_file1', imagen.buffer, imagen.originalname);
      formData.append('image_file2', refStream);
  
      try {
        const response = await axios.post(COMPARE_API_URL, formData, {
          headers: formData.getHeaders()
        });
  
        const confianza = response.data.confidence || 0;
        resultados[userId] = confianza;
  
        if (confianza > mejorConfianza) {
          mejorConfianza = confianza;
          usuarioCoincidente = userId;
        }
  
      } catch (error) {
        console.error(`Error comparando con ${userId}:`, error?.response?.data || error.message);
        continue;
      }
  
      // 🔥 Agregamos espera de 1 segundo (1000ms)
      await delay(1000);
    }
  
    if (usuarioCoincidente && mejorConfianza >= UMBRAL) {
      return {
        userId: usuarioCoincidente,
        confidence: mejorConfianza,
        resultados
      };
    } else {
      throw new Error('No se encontró coincidencia con el umbral requerido');
    }
  }
  

module.exports = {
  reconocerImagen
};
