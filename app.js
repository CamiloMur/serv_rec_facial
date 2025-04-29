// app.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

// const rutas
const authRoutes = require('./routes/auth');
const autorizarRoutes = require('./routes/autorizar');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Rutas
app.use('/auth', authRoutes);
app.use('/autorizar', autorizarRoutes);

// Ruta raíz simple para prueba
app.get('/', (req, res) => {
  res.send('API REST de Reconocimiento Facial en funcionamiento 🚀');
});

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({ mensaje: 'Error interno del servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
