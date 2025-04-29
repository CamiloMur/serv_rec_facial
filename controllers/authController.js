const { reconocerImagen } = require('../services/faceService');
const axios = require('axios');

exports.autenticarUsuario = async (req, res) => {
  try {
    const imagen = req.file;
    if (!imagen) {
      return res.status(400).json({ error: 'No se envió imagen.' });
    }

    // 1. Llamar directamente a la función que compara la imagen
    const resultado = await reconocerImagen(imagen);

    const { userId } = resultado;
    if (!userId) {
      return res.status(401).json({ error: 'Usuario no reconocido.' });
    }

    // 2. Llamar al backend bancario para autorización
    const bancoResponse = await axios.post("http://localhost:3000/autorizar", { userId });

    // 3. Devolver la respuesta al cliente
    res.json({
      status: "success",
      data: bancoResponse.data,
      mensaje: "Usuario autenticado correctamente"
    });

  } catch (error) {
    console.error("❌ Error autenticando usuario:", error.message, error?.response?.data || '');
    if (error.response) {
      return res.status(error.response.status).json({ error: error.response.data });
    }
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
