const express = require('express');
const multer = require('multer');
const app = express();
const upload = multer();

app.post('/reconocer', upload.single('imagen'), (req, res) => {
  // Simulación de reconocimiento facial
  const imagen = req.file;
  if (!imagen) return res.status(400).json({ error: 'Imagen requerida' });

  // Aquí puedes integrar Face++ en el futuro
  const identificado = true; // Supongamos que hay coincidencia

  if (identificado) {
    res.json({ status: 'ok', userId: 'cliente456' });
  } else {
    res.status(403).json({ error: 'No reconocido' });
  }
});

app.listen(4000, () => console.log('Face Service en puerto 4000'));
